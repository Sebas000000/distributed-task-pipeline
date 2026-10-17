"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
class BaseProcessor extends bullmq_1.WorkerHost {
    constructor(loggerName) {
        super();
        this.workerId = process.env.WORKER_ID || `worker-${process.pid || '01'}`;
        this.baseLogger = new common_1.Logger(loggerName);
    }
    getFormattedTimestamp() {
        const d = new Date();
        const pad = (n, s = 2) => String(n).padStart(s, '0');
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());
        const ms = pad(d.getMilliseconds(), 3);
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }
    async executeStep(job, stepIndex, totalSteps, actionDescription, targetProgress, delayMs, logs) {
        const timestamp = this.getFormattedTimestamp();
        const logLine = `[${timestamp}] [${this.workerId}] [${job.name}] Step ${stepIndex}/${totalSteps} (${targetProgress}%): ${actionDescription}`;
        logs.push(logLine);
        this.baseLogger.log(`Job ${job.id} -> ${logLine}`);
        await job.log(logLine);
        await job.updateProgress(targetProgress);
        if (delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        return logLine;
    }
}
exports.BaseProcessor = BaseProcessor;
//# sourceMappingURL=base.processor.js.map