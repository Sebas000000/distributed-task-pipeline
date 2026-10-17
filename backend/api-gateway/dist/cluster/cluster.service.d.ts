import { Queue } from 'bullmq';
import { ClusterMetricsDto } from './dto/cluster-metrics.dto';
export declare class ClusterService {
    private readonly reportGenQueue;
    private readonly dataIngestQueue;
    private readonly webhooksQueue;
    private readonly logger;
    private lastCompletedCount;
    private lastSampleTime;
    private smoothedThroughput;
    constructor(reportGenQueue: Queue, dataIngestQueue: Queue, webhooksQueue: Queue);
    getClusterMetrics(): Promise<ClusterMetricsDto>;
}
