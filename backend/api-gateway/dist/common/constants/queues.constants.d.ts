export declare const QUEUE_REPORT_GEN = "report-gen";
export declare const QUEUE_DATA_INGEST = "data-ingest";
export declare const QUEUE_WEBHOOKS = "webhooks";
export declare const ACTIVE_QUEUES: readonly ["report-gen", "data-ingest", "webhooks"];
export type QueueName = (typeof ACTIVE_QUEUES)[number];
export declare const JOB_PAYLOAD_TYPES: {
    readonly "report-gen": readonly ["report.monthly", "report.daily"];
    readonly "data-ingest": readonly ["events.batch", "csv.import"];
    readonly webhooks: readonly ["webhook.deliver"];
};
export type JobStatusFilter = 'all' | 'waiting' | 'active' | 'completed' | 'failed';
