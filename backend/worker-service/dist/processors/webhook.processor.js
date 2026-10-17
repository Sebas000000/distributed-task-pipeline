"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const crypto = require("crypto");
const queues_constants_1 = require("../common/constants/queues.constants");
const base_processor_1 = require("./base.processor");
let WebhookProcessor = WebhookProcessor_1 = class WebhookProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super(WebhookProcessor_1.name);
    }
    async process(job) {
        const startTime = Date.now();
        const logs = [];
        const payload = job.data?.payload || {};
        const targetUrl = payload.targetUrl || 'https://api.subscriber.com/webhooks/incoming';
        this.baseLogger.log(`Worker [${this.workerId}] processing webhook delivery for job ${job.id} (Attempt ${job.attemptsMade + 1})`);
        await this.executeStep(job, 1, 4, `Resolving subscriber DNS and performing TLS handshake with ${targetUrl}...`, 25, 450, logs);
        const secret = payload.secret || 'whsec_pipeline_default_secret_key';
        const signature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        await this.executeStep(job, 2, 4, `Payload signed with HMAC-SHA256 (Signature: sha256=${signature.slice(0, 16)}...)...`, 50, 400, logs);
        await this.executeStep(job, 3, 4, `Dispatching HTTP POST with headers { X-Webhook-Signature, X-Retry-Count: ${job.attemptsMade} }...`, 75, 600, logs);
        if (payload.shouldFail === true) {
            const failReason = `Remote subscriber at ${targetUrl} responded with HTTP 503 Service Unavailable (Attempt ${job.attemptsMade + 1})`;
            await this.executeStep(job, 3, 4, `[ALERT] ${failReason}`, 75, 100, logs);
            throw new Error(failReason);
        }
        await this.executeStep(job, 4, 4, `HTTP 200 OK received from ${targetUrl}. Delivery acknowledged.`, 100, 300, logs);
        const latency = Date.now() - startTime;
        const completedAt = new Date().toISOString();
        return {
            assignedWorker: this.workerId,
            latency,
            logs,
            output: {
                destination: targetUrl,
                httpStatus: 200,
                signature: `sha256=${signature.slice(0, 16)}...`,
                deliveryLatencyMs: latency,
                attemptNumber: job.attemptsMade + 1,
            },
            completedAt,
        };
    }
    onActive(job) {
        this.baseLogger.log(`Job ${job.id} [${job.name}] is now ACTIVE on ${this.workerId}`);
    }
    onCompleted(job, result) {
        this.baseLogger.log(`Job ${job.id} [${job.name}] COMPLETED in ${result.latency}ms on ${result.assignedWorker}`);
    }
    onFailed(job, error) {
        this.baseLogger.error(`Job ${job.id} [${job.name}] FAILED on ${this.workerId} (Attempt ${job.attemptsMade}): ${error.message}`);
    }
};
exports.WebhookProcessor = WebhookProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], WebhookProcessor.prototype, "onActive", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Object]),
    __metadata("design:returntype", void 0)
], WebhookProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], WebhookProcessor.prototype, "onFailed", null);
exports.WebhookProcessor = WebhookProcessor = WebhookProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queues_constants_1.QUEUE_WEBHOOKS, { concurrency: 5 }),
    __metadata("design:paramtypes", [])
], WebhookProcessor);
//# sourceMappingURL=webhook.processor.js.map