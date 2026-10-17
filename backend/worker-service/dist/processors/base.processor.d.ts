import { Logger } from '@nestjs/common';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare abstract class BaseProcessor extends WorkerHost {
    protected readonly workerId: string;
    protected readonly baseLogger: Logger;
    constructor(loggerName: string);
    protected getFormattedTimestamp(): string;
    protected executeStep(job: Job, stepIndex: number, totalSteps: number, actionDescription: string, targetProgress: number, delayMs: number, logs: string[]): Promise<string>;
}
