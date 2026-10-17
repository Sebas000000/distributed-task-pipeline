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
var ClusterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const queues_constants_1 = require("../common/constants/queues.constants");
let ClusterService = ClusterService_1 = class ClusterService {
    constructor(reportGenQueue, dataIngestQueue, webhooksQueue) {
        this.reportGenQueue = reportGenQueue;
        this.dataIngestQueue = dataIngestQueue;
        this.webhooksQueue = webhooksQueue;
        this.logger = new common_1.Logger(ClusterService_1.name);
        this.lastCompletedCount = 0;
        this.lastSampleTime = Date.now();
        this.smoothedThroughput = 0;
    }
    async getClusterMetrics() {
        const queueList = [
            { name: queues_constants_1.QUEUE_REPORT_GEN, queue: this.reportGenQueue },
            { name: queues_constants_1.QUEUE_DATA_INGEST, queue: this.dataIngestQueue },
            { name: queues_constants_1.QUEUE_WEBHOOKS, queue: this.webhooksQueue },
        ];
        const breakdowns = [];
        let totalActive = 0;
        let totalWaiting = 0;
        let totalCompleted = 0;
        let totalFailed = 0;
        let totalDelayed = 0;
        for (const item of queueList) {
            try {
                const counts = await item.queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused');
                const isPaused = await item.queue.isPaused();
                breakdowns.push({
                    queueName: item.name,
                    waiting: counts.waiting ?? 0,
                    active: counts.active ?? 0,
                    completed: counts.completed ?? 0,
                    failed: counts.failed ?? 0,
                    delayed: counts.delayed ?? 0,
                    paused: isPaused,
                });
                totalActive += counts.active ?? 0;
                totalWaiting += counts.waiting ?? 0;
                totalCompleted += counts.completed ?? 0;
                totalFailed += counts.failed ?? 0;
                totalDelayed += counts.delayed ?? 0;
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                this.logger.warn(`Could not fetch metrics for queue ${item.name}: ${msg}`);
                breakdowns.push({
                    queueName: item.name,
                    waiting: 0,
                    active: 0,
                    completed: 0,
                    failed: 0,
                    delayed: 0,
                    paused: false,
                });
            }
        }
        const now = Date.now();
        const elapsedSec = (now - this.lastSampleTime) / 1000;
        if (elapsedSec >= 1) {
            const deltaCompleted = Math.max(0, totalCompleted - this.lastCompletedCount);
            const instantThroughput = deltaCompleted / elapsedSec;
            this.smoothedThroughput = Number((this.smoothedThroughput * 0.7 + instantThroughput * 0.3).toFixed(2));
            this.lastCompletedCount = totalCompleted;
            this.lastSampleTime = now;
        }
        const currentThroughput = totalActive > 0 && this.smoothedThroughput === 0
            ? Number((totalActive * 0.85).toFixed(2))
            : this.smoothedThroughput;
        const totalProcessed = totalCompleted + totalFailed;
        const failureRatePercentage = totalProcessed > 0
            ? Number(((totalFailed / totalProcessed) * 100).toFixed(2))
            : 0;
        const totalTracked = totalActive + totalWaiting + totalCompleted + totalFailed + totalDelayed;
        const isDegraded = failureRatePercentage > 20;
        return {
            timestamp: new Date().toISOString(),
            clusterStatus: isDegraded ? 'degraded' : 'healthy',
            summary: {
                totalQueues: queueList.length,
                activeJobs: totalActive,
                waitingJobs: totalWaiting,
                completedJobs: totalCompleted,
                failedJobs: totalFailed,
                delayedJobs: totalDelayed,
                totalTracked,
                failureRatePercentage,
                throughputOpsPerSec: currentThroughput,
            },
            queues: breakdowns,
        };
    }
};
exports.ClusterService = ClusterService;
exports.ClusterService = ClusterService = ClusterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_REPORT_GEN)),
    __param(1, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_DATA_INGEST)),
    __param(2, (0, bullmq_1.InjectQueue)(queues_constants_1.QUEUE_WEBHOOKS)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], ClusterService);
//# sourceMappingURL=cluster.service.js.map