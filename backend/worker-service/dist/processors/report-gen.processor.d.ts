import { Job } from 'bullmq';
import { BaseJobData, JobExecutionResult } from '../common/interfaces/job.interface';
import { BaseProcessor } from './base.processor';
export declare class ReportGenProcessor extends BaseProcessor {
    constructor();
    process(job: Job<BaseJobData>): Promise<JobExecutionResult>;
    onActive(job: Job): void;
    onCompleted(job: Job, result: JobExecutionResult): void;
    onFailed(job: Job, error: Error): void;
}
