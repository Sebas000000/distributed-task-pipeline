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
export interface JobDetailResponse {
    jobId: string;
    queueName: string;
    payloadType: string;
    payload: Record<string, unknown>;
    status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';
    progress: number;
    assignedWorker: string | null;
    latency: number | null;
    logs: string[];
    createdAt: string;
    processedOn: string | null;
    finishedOn: string | null;
    failedReason: string | null;
    returnvalue?: unknown;
}
export interface QueueMetricBreakdown {
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
}
export interface ClusterMetricsResponse {
    timestamp: string;
    clusterStatus: 'healthy' | 'degraded';
    summary: {
        totalQueues: number;
        activeJobs: number;
        waitingJobs: number;
        completedJobs: number;
        failedJobs: number;
        delayedJobs: number;
        totalTracked: number;
        failureRatePercentage: number;
        throughputOpsPerSec: number;
    };
    queues: QueueMetricBreakdown[];
}
