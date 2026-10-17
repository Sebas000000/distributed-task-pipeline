"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const queues_constants_1 = require("./common/constants/queues.constants");
const report_gen_processor_1 = require("./processors/report-gen.processor");
const data_ingest_processor_1 = require("./processors/data-ingest.processor");
const webhook_processor_1 = require("./processors/webhook.processor");
let WorkerModule = class WorkerModule {
};
exports.WorkerModule = WorkerModule;
exports.WorkerModule = WorkerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD') || undefined,
                        maxRetriesPerRequest: null,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_REPORT_GEN }, { name: queues_constants_1.QUEUE_DATA_INGEST }, { name: queues_constants_1.QUEUE_WEBHOOKS }),
        ],
        providers: [report_gen_processor_1.ReportGenProcessor, data_ingest_processor_1.DataIngestProcessor, webhook_processor_1.WebhookProcessor],
    })
], WorkerModule);
//# sourceMappingURL=worker.module.js.map