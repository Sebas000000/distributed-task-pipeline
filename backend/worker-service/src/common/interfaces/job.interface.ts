import { QueueName } from '../constants/queues.constants';

export interface BaseJobData<T = Record<string, unknown>> {
  jobId: string;
  queueName: QueueName;
  payloadType: string;
  payload: T;
  enqueuedAt: string;
  assignedWorker?: string;
}

export interface JobExecutionResult {
  assignedWorker: string;
  latency: number;
  logs: string[];
  output?: Record<string, unknown>;
  completedAt: string;
}
