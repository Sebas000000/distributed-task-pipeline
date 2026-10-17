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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const queues_constants_1 = require("../common/constants/queues.constants");
const job_id_util_1 = require("../common/utils/job-id.util");
let JobsService = JobsService_1 = class JobsService {
    constructor(reportGenQueue, dataIngestQueue, webhooksQueue) {
        this.reportGenQueue = reportGenQueue;
        this.dataIngestQueue = dataIngestQueue;
        this.webhooksQueue = webhooksQueue;
        this.logger = new common_1.Logger(JobsService_1.name);
        this.queues = new Map();
    }
    onModuleInit() {
        this.queues.set(queues_constants_1.QUEUE_REPORT_GEN, this.reportGenQueue);
        this.queues.set(queues_constants_1.QUEUE_DATA_INGEST, this.dataIngestQueue);
        this.queues.set(queues_constants_1.QUEUE_WEBHOOKS, this.webhooksQueue);
        this.logger.log(`Initialized JobsService with ${this.queues.size} active queues`);
    }
    getQueue(queueName) {
        return this.queues.get(queueName);
    }
    getAllQueues() {
        return Array.from(this.queues.values());
    }
    async dispatch(dto) {
        const queue = this.queues.get(dto.queueName);
        if (!queue) {
            throw new common_1.InternalServerErrorException(`Target queue ${dto.queueName} is not registered in the cluster`);
        }
        const jobId = (0, job_id_util_1.generateJobId)();
        const enqueuedAt = new Date().toISOString();
        const jobData = {
            jobId,
            queueName: dto.queueName,
            payloadType: dto.payloadType,
            payload: dto.payload,
            enqueuedAt,
        };
        const isWebhook = dto.queueName === queues_constants_1.QUEUE_WEBHOOKS;
        await queue.add(dto.payloadType, jobData, {
            jobId,
            priority: dto.priority ?? 10,
            attempts: isWebhook ? 3 : 1,
            backoff: isWebhook
                ? {
                    type: 'exponential',
                    delay: 1500,
                }
                : undefined,
            removeOnComplete: {
                count: 2000,
            },
            removeOnFail: {
                count: 2000,
            },
        });
        this.logger.log(`Dispatched job ${jobId} to queue [${dto.queueName}] with handler [${dto.payloadType}]`);
        return {
            statusCode: 202,
            message: 'Job successfully enqueued for asynchronous processing',
            jobId,
            queueName: dto.queueName,
            payloadType: dto.payloadType,
            status: 'waiting',
            enqueuedAt,
        };
    }
    async getJobs(query) {
        const { status = 'all', queueName = 'all', page = 1, limit = 10 } = query;
        const targetQueues = queueName === 'all'
            ? this.getAllQueues()
            : [this.queues.get(queueName)].filter((q) => Boolean(q));
        let jobTypes;
        if (status === 'all') {
            jobTypes = ['active', 'waiting', 'completed', 'failed', 'delayed'];
        }
        else {
            jobTypes = [status];
        }
        const allJobSummaries = [];
        for (const queue of targetQueues) {
            const jobs = await queue.getJobs(jobTypes, 0, 500);
            for (const job of jobs) {
                if (!job)
                    continue;
                const summary = await this.mapToJobSummary(job, queue.name);
                allJobSummaries.push(summary);
            }
        }
        allJobSummaries.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        const total = allJobSummaries.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const offset = (page - 1) * limit;
        const paginatedData = allJobSummaries.slice(offset, offset + limit);
        return {
            data: paginatedData,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
    async getJobById(id) {
        const searchId = id.startsWith('#') ? id : `#${id}`;
        for (const queue of this.getAllQueues()) {
            let job = await queue.getJob(id);
            if (!job && searchId !== id) {
                job = await queue.getJob(searchId);
            }
            if (job) {
                const state = await job.getState();
                const logsResult = await queue.getJobLogs(job.id, 0, 200);
                let executionLogs = logsResult?.logs || [];
                if (executionLogs.length === 0 &&
                    job.returnvalue &&
                    Array.isArray(job.returnvalue.logs)) {
                    executionLogs = job.returnvalue.logs;
                }
                const rawData = job.data;
                const assignedWorker = job.returnvalue?.assignedWorker || rawData?.assignedWorker || null;
                const latency = job.returnvalue?.latency ??
                    (job.finishedOn && job.processedOn
                        ? job.finishedOn - job.processedOn
                        : null);
                return {
                    jobId: String(job.id),
                    queueName: queue.name,
                    payloadType: job.name,
                    payload: rawData?.payload || {},
                    status: state,
                    progress: typeof job.progress === 'number' ? job.progress : 0,
                    assignedWorker,
                    latency,
                    logs: executionLogs,
                    createdAt: new Date(job.timestamp).toISOString(),
                    processedOn: job.processedOn
                        ? new Date(job.processedOn).toISOString()
                        : null,
                    finishedOn: job.finishedOn
                        ? new Date(job.finishedOn).toISOString()
                        : null,
                    failedReason: job.failedReason || null,
                    returnvalue: job.returnvalue || null,
                };
            }
        }
        throw new common_1.NotFoundException(`Job with identifier "${id}" was not found in any cluster queue`);
    }
    async mapToJobSummary(job, queueName) {
        const state = await job.getState();
        const rawData = job.data;
        const assignedWorker = job.returnvalue?.assignedWorker || rawData?.assignedWorker || null;
        const latency = job.returnvalue?.latency ??
            (job.finishedOn && job.processedOn
                ? job.finishedOn - job.processedOn
                : null);
        return {
            jobId: String(job.id),
            queueName,
            payloadType: job.name,
            status: state,
            progress: typeof job.progress === 'number' ? job.progress : 0,
            assignedWorker,
            latency,
            createdAt: new Date(job.timestamp).toISOString(),
            processedOn: job.processedOn ? new Date(job.processedOn).toISOString() : null,
            finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
            failedReason: job.failedReason || null,
        };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_REPORT_GEN)),
    __param(1, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_DATA_INGEST)),
    __param(2, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_WEBHOOKS)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], JobsService);
//# sourceMappingURL=jobs.service.js.map