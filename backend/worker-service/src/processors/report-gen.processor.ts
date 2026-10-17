import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_REPORT_GEN } from '../common/constants/queues.constants';
import { BaseJobData, JobExecutionResult } from '../common/interfaces/job.interface';
import { BaseProcessor } from './base.processor';

@Processor(QUEUE_REPORT_GEN, { concurrency: 5 })
export class ReportGenProcessor extends BaseProcessor {
  constructor() {
    super(ReportGenProcessor.name);
  }

  async process(job: Job<BaseJobData>): Promise<JobExecutionResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const jobData = job.data;
    const subtype = job.name;

    this.baseLogger.log(
      `Worker [${this.workerId}] picking up job ${job.id} on queue [${QUEUE_REPORT_GEN}] (${subtype})`,
    );

    if (subtype === 'report.daily') {
      await this.executeStep(
        job,
        1,
        4,
        'Scanning daily transaction ledger and settlement records...',
        20,
        600,
        logs,
      );
      await this.executeStep(
        job,
        2,
        4,
        'Reconciling cross-account balances and credit card clearings...',
        50,
        750,
        logs,
      );
      await this.executeStep(
        job,
        3,
        4,
        'Compiling executive daily summary digest and audit trails...',
        80,
        600,
        logs,
      );
      await this.executeStep(
        job,
        4,
        4,
        'Daily report generated and archived to storage bucket.',
        100,
        400,
        logs,
      );
    } else {
      // Default: report.monthly (or monthly variant)
      await this.executeStep(
        job,
        1,
        5,
        'Querying financial data & transaction ledgers for period...',
        15,
        700,
        logs,
      );
      await this.executeStep(
        job,
        2,
        5,
        'Aggregating revenue metrics, operating margins, and customer cohorts...',
        35,
        800,
        logs,
      );
      await this.executeStep(
        job,
        3,
        5,
        'Rendering interactive charts and vector graph visualizations...',
        60,
        900,
        logs,
      );
      await this.executeStep(
        job,
        4,
        5,
        'Compiling multi-page PDF & spreadsheet summaries...',
        85,
        700,
        logs,
      );
      await this.executeStep(
        job,
        5,
        5,
        'Monthly report signed and published to S3 storage bucket.',
        100,
        500,
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
        reportType: subtype,
        period: (jobData.payload as Record<string, unknown>)?.reportMonth || 'current',
        fileFormat: 'PDF/XLSX',
        artifactUrl: `https://storage.internal.pipeline/reports/${job.id}.pdf`,
        fileSizeBytes: 3842100,
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
