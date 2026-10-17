export const QUEUE_REPORT_GEN = 'report-gen';
export const QUEUE_DATA_INGEST = 'data-ingest';
export const QUEUE_WEBHOOKS = 'webhooks';

export const ACTIVE_QUEUES = [
  QUEUE_REPORT_GEN,
  QUEUE_DATA_INGEST,
  QUEUE_WEBHOOKS,
] as const;

export type QueueName = (typeof ACTIVE_QUEUES)[number];

export const JOB_PAYLOAD_TYPES = {
  [QUEUE_REPORT_GEN]: ['report.monthly', 'report.daily'],
  [QUEUE_DATA_INGEST]: ['events.batch', 'csv.import'],
  [QUEUE_WEBHOOKS]: ['webhook.deliver'],
} as const;

export type JobStatusFilter = 'all' | 'waiting' | 'active' | 'completed' | 'failed';
