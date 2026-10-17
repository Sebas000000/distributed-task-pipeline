import { Logger } from '@nestjs/common';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export abstract class BaseProcessor extends WorkerHost {
  protected readonly workerId: string;
  protected readonly baseLogger: Logger;

  constructor(loggerName: string) {
    super();
    this.workerId = process.env.WORKER_ID || `worker-${process.pid || '01'}`;
    this.baseLogger = new Logger(loggerName);
  }

  protected getFormattedTimestamp(): string {
    const d = new Date();
    const pad = (n: number, s = 2) => String(n).padStart(s, '0');
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    const ms = pad(d.getMilliseconds(), 3);
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  protected async executeStep(
    job: Job,
    stepIndex: number,
    totalSteps: number,
    actionDescription: string,
    targetProgress: number,
    delayMs: number,
    logs: string[],
  ): Promise<string> {
    const timestamp = this.getFormattedTimestamp();
    const logLine = `[${timestamp}] [${this.workerId}] [${job.name}] Step ${stepIndex}/${totalSteps} (${targetProgress}%): ${actionDescription}`;

    logs.push(logLine);
    this.baseLogger.log(`Job ${job.id} -> ${logLine}`);

    // Persist to BullMQ's internal Redis log list
    await job.log(logLine);

    // Update BullMQ job progress percentage
    await job.updateProgress(targetProgress);

    // Simulate real computational / IO workload
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return logLine;
  }
}
