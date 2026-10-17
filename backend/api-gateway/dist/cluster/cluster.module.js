"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const queues_constants_1 = require("../common/constants/queues.constants");
const cluster_controller_1 = require("./cluster.controller");
const cluster_service_1 = require("./cluster.service");
let ClusterModule = class ClusterModule {
};
exports.ClusterModule = ClusterModule;
exports.ClusterModule = ClusterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_REPORT_GEN }, { name: queues_constants_1.QUEUE_DATA_INGEST }, { name: queues_constants_1.QUEUE_WEBHOOKS }),
        ],
        controllers: [cluster_controller_1.ClusterController],
        providers: [cluster_service_1.ClusterService],
        exports: [cluster_service_1.ClusterService],
    })
], ClusterModule);
//# sourceMappingURL=cluster.module.js.map