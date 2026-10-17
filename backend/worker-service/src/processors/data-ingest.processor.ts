import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_DATA_INGEST } from '../common/constants/queues.constants';
import { BaseJobData, JobExecutionResult } from '../common/interfaces/job.interface';
import { BaseProcessor } from './base.processor';

@Processor(QUEUE_DATA_INGEST, { concurrency: 5 })
export class DataIngestProcessor extends BaseProcessor {
  constructor() {
    super(DataIngestProcessor.name);
  }

  async process(job: Job<BaseJobData>): Promise<JobExecutionResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const jobData = job.data;
    const subtype = job.name;

    this.baseLogger.log(
      `Worker [${this.workerId}] picking up job ${job.id} on queue [${QUEUE_DATA_INGEST}] (${subtype})`,
    );

    if (subtype === 'csv.import') {
      await this.executeStep(
        job,
        1,
        4,
        'Streaming raw CSV records from inbound queue/storage...',
        25,
        500,
        logs,
      );
      await this.executeStep(
        job,
        2,
        4,
        'Parsing CSV columns, validating data types, and checking nullability...',
        50,
        700,
        logs,
      );
      await this.executeStep(
        job,
        3,
        4,
        'Resolving foreign key relationships and schema entity mappings...',
        75,
        600,
        logs,
      );
      await this.executeStep(
        job,
        4,
        4,
        'Transactional batch upsert executed. 12,500 records committed.',
        100,
        400,
        logs,
      );
    } else {
      // Default: events.batch
      await this.executeStep(
        job,
        1,
        4,
        'Receiving and deserializing high-velocity event payload...',
        20,
        400,
        logs,
      );
      await this.executeStep(
        job,
        2,
        4,
        'Validating JSON schemas against EventRegistry v2 contracts...',
        50,
        550,
        logs,
      );
      await this.executeStep(
        job,
        3,
        4,
        'Deduplicating event keys and indexing partitioned telemetry streams...',
        80,
        650,
        logs,
      );
      await this.executeStep(
        job,
        4,
        4,
        'Bulk stream ingestion complete. Distributed partitions synced.',
        100,
        350,
        logs,
      );
    }

    const latency = Date.now() - startTime;
    const completedAt = new Date().toISOString();

    return {
      assignedWorker: this.workerId,
      latency,
      logs,
      output: {
        ingestionType: subtype,
        recordsProcessed:
          subtype === 'csv.import'
            ? ((jobData.payload as Record<string, unknown>)?.estimatedRows as number) || 12500
            : ((jobData.payload as Record<string, unknown>)?.eventCount as number) || 500,
        status: 'COMMITTED',
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
      `Job ${job.id} [${job.name}] FAILED on ${this.workerId}: ${error.message}`,
      error.stack,
    );
  }
}
