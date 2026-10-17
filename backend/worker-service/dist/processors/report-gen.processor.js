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
var ReportGenProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const queues_constants_1 = require("../common/constants/queues.constants");
const base_processor_1 = require("./base.processor");
let ReportGenProcessor = ReportGenProcessor_1 = class ReportGenProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super(ReportGenProcessor_1.name);
    }
    async process(job) {
        const startTime = Date.now();
        const logs = [];
        const jobData = job.data;
        const subtype = job.name;
        this.baseLogger.log(`Worker [${this.workerId}] picking up job ${job.id} on queue [${queues_constants_1.QUEUE_REPORT_GEN}] (${subtype})`);
        if (subtype === 'report.daily') {
            await this.executeStep(job, 1, 4, 'Scanning daily transaction ledger and settlement records...', 20, 600, logs);
            await this.executeStep(job, 2, 4, 'Reconciling cross-account balances and credit card clearings...', 50, 750, logs);
            await this.executeStep(job, 3, 4, 'Compiling executive daily summary digest and audit trails...', 80, 600, logs);
            await this.executeStep(job, 4, 4, 'Daily report generated and archived to storage bucket.', 100, 400, logs);
        }
        else {
            await this.executeStep(job, 1, 5, 'Querying financial data & transaction ledgers for period...', 15, 700, logs);
            await this.executeStep(job, 2, 5, 'Aggregating revenue metrics, operating margins, and customer cohorts...', 35, 800, logs);
            await this.executeStep(job, 3, 5, 'Rendering interactive charts and vector graph visualizations...', 60, 900, logs);
            await this.executeStep(job, 4, 5, 'Compiling multi-page PDF & spreadsheet summaries...', 85, 700, logs);
            await this.executeStep(job, 5, 5, 'Monthly report signed and published to S3 storage bucket.', 100, 500, logs);
        }
        const latency = Date.now() - startTime;
        const completedAt = new Date().toISOString();
        return {
            assignedWorker: this.workerId,
            latency,
            logs,
            output: {
                reportType: subtype,
                period: jobData.payload?.reportMonth || 'current',
                fileFormat: 'PDF/XLSX',
                artifactUrl: `https://storage.internal.pipeline/reports/${job.id}.pdf`,
                fileSizeBytes: 3842100,
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
        this.baseLogger.error(`Job ${job.id} [${job.name}] FAILED on ${this.workerId}: ${error.message}`, error.stack);
    }
};
exports.ReportGenProcessor = ReportGenProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], ReportGenProcessor.prototype, "onActive", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Object]),
    __metadata("design:returntype", void 0)
], ReportGenProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], ReportGenProcessor.prototype, "onFailed", null);
exports.ReportGenProcessor = ReportGenProcessor = ReportGenProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queues_constants_1.QUEUE_REPORT_GEN, { concurrency: 5 }),
    __metadata("design:paramtypes", [])
], ReportGenProcessor);
//# sourceMappingURL=report-gen.processor.js.map