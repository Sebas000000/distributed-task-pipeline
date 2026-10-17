export type JobStatus =
  | 'all'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'unknown';

export type QueueName = 'report-gen' | 'data-ingest' | 'webhooks';

export interface JobItem {
  jobId: string;
  queueName: QueueName;
  payloadType: string;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';
  progress: number;
  assignedWorker: string | null;
  latency: number | null;
  createdAt: string;
  processedOn: string | null;
  finishedOn: string | null;
  failedReason: string | null;
}

export interface JobDetail extends JobItem {
  payload: Record<string, unknown>;
  logs: string[];
  returnvalue?: Record<string, unknown> | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedJobsResponse {
  data: JobItem[];
  meta: PaginationMeta;
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

export interface ClusterSummary {
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

export interface ClusterMetrics {
  timestamp: string;
  clusterStatus: 'healthy' | 'degraded';
  summary: ClusterSummary;
  queues: QueueMetricBreakdown[];
}

export interface DispatchJobDto {
  queueName: QueueName;
  payloadType: string;
  payload: Record<string, unknown>;
  priority?: number;
}

export interface DispatchJobResponse {
  statusCode: number;
  message: string;
  jobId: string;
  queueName: string;
  payloadType: string;
  status: string;
  enqueuedAt: string;
}
