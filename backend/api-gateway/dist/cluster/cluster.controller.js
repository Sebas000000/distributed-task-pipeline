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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cluster_service_1 = require("./cluster.service");
const cluster_metrics_dto_1 = require("./dto/cluster-metrics.dto");
let ClusterController = class ClusterController {
    constructor(clusterService) {
        this.clusterService = clusterService;
    }
    async getMetrics() {
        return this.clusterService.getClusterMetrics();
    }
};
exports.ClusterController = ClusterController;
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve cluster telemetry, throughput, queue depths, and failure rate',
        description: 'Aggregates live counts of waiting, active, completed, failed, and delayed jobs across all cluster queues alongside throughput operations/sec and system health.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Cluster metrics returned successfully',
        type: cluster_metrics_dto_1.ClusterMetricsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClusterController.prototype, "getMetrics", null);
exports.ClusterController = ClusterController = __decorate([
    (0, swagger_1.ApiTags)('Cluster Telemetry & Health'),
    (0, common_1.Controller)('cluster'),
    __metadata("design:paramtypes", [cluster_service_1.ClusterService])
], ClusterController);
//# sourceMappingURL=cluster.controller.js.map