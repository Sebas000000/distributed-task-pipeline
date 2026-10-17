export declare class QueueMetricBreakdownDto {
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
}
export declare class ClusterSummaryDto {
    totalQueues: number;
    activeJobs: number;
    waitingJobs: number;
    completedJobs: number;
    failedJobs: number;
    delayedJobs: number;
    totalTracked: number;
    failureRatePercentage: number;
    throughputOpsPerSec: number;
}
export declare class ClusterMetricsDto {
    timestamp: string;
    clusterStatus: string;
    summary: ClusterSummaryDto;
    queues: QueueMetricBreakdownDto[];
}
