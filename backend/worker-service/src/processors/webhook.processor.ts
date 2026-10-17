import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as crypto from 'crypto';
import { QUEUE_WEBHOOKS } from '../common/constants/queues.constants';
import { BaseJobData, JobExecutionResult } from '../common/interfaces/job.interface';
import { BaseProcessor } from './base.processor';

@Processor(QUEUE_WEBHOOKS, { concurrency: 5 })
export class WebhookProcessor extends BaseProcessor {
  constructor() {
    super(WebhookProcessor.name);
  }

  async process(job: Job<BaseJobData>): Promise<JobExecutionResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const payload = (job.data?.payload as Record<string, unknown>) || {};
    const targetUrl = (payload.targetUrl as string) || 'https://api.subscriber.com/webhooks/incoming';

    this.baseLogger.log(
      `Worker [${this.workerId}] processing webhook delivery for job ${job.id} (Attempt ${job.attemptsMade + 1})`,
    );

    await this.executeStep(
      job,
      1,
      4,
      `Resolving subscriber DNS and performing TLS handshake with ${targetUrl}...`,
      25,
      450,
      logs,
    );

    // Compute HMAC-SHA256 signature
    const secret = (payload.secret as string) || 'whsec_pipeline_default_secret_key';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    await this.executeStep(
      job,
      2,
      4,
      `Payload signed with HMAC-SHA256 (Signature: sha256=${signature.slice(0, 16)}...)...`,
      50,
      400,
      logs,
    );

    await this.executeStep(
      job,
      3,
      4,
      `Dispatching HTTP POST with headers { X-Webhook-Signature, X-Retry-Count: ${job.attemptsMade} }...`,
      75,
      600,
      logs,
    );

    // Simulate failure policy if requested in payload
    if (payload.shouldFail === true) {
      const failReason = `Remote subscriber at ${targetUrl} responded with HTTP 503 Service Unavailable (Attempt ${job.attemptsMade + 1})`;
      await this.executeStep(job, 3, 4, `[ALERT] ${failReason}`, 75, 100, logs);
      throw new Error(failReason);
    }

    await this.executeStep(
      job,
      4,
      4,
      `HTTP 200 OK received from ${targetUrl}. Delivery acknowledged.`,
      100,
      300,
      logs,
    );

    const latency = Date.now() - startTime;
    const completedAt = new Date().toISOString();

    return {
      assignedWorker: this.workerId,
      latency,
      logs,
      output: {
        destination: targetUrl,
        httpStatus: 200,
        signature: `sha256=${signature.slice(0, 16)}...`,
        deliveryLatencyMs: latency,
        attemptNumber: job.attemptsMade + 1,
      },
      completedAt,
    };
  }

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.baseLogger.log(`Job ${job.id} [${job.name}] is now ACTIVE on ${this.workerId}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: JobExecutionResult): void {
    this.baseLogger.log(
      `Job ${job.id} [${job.name}] COMPLETED in ${result.latency}ms on ${result.assignedWorker}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error): void {
    this.baseLogger.error(
      `Job ${job.id} [${job.name}] FAILED on ${this.workerId} (Attempt ${job.attemptsMade}): ${error.message}`,
    );
  }
}
