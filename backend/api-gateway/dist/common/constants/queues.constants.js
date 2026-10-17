"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_PAYLOAD_TYPES = exports.ACTIVE_QUEUES = exports.QUEUE_WEBHOOKS = exports.QUEUE_DATA_INGEST = exports.QUEUE_REPORT_GEN = void 0;
exports.QUEUE_REPORT_GEN = 'report-gen';
exports.QUEUE_DATA_INGEST = 'data-ingest';
exports.QUEUE_WEBHOOKS = 'webhooks';
exports.ACTIVE_QUEUES = [
    exports.QUEUE_REPORT_GEN,
    exports.QUEUE_DATA_INGEST,
    exports.QUEUE_WEBHOOKS,
];
exports.JOB_PAYLOAD_TYPES = {
    [exports.QUEUE_REPORT_GEN]: ['report.monthly', 'report.daily'],
    [exports.QUEUE_DATA_INGEST]: ['events.batch', 'csv.import'],
    [exports.QUEUE_WEBHOOKS]: ['webhook.deliver'],
};
//# sourceMappingURL=queues.constants.js.map