export declare const QUEUE_REPORT_GEN = "report-gen";
export declare const QUEUE_DATA_INGEST = "data-ingest";
export declare const QUEUE_WEBHOOKS = "webhooks";
export declare const ACTIVE_QUEUES: readonly ["report-gen", "data-ingest", "webhooks"];
export type QueueName = (typeof ACTIVE_QUEUES)[number];
