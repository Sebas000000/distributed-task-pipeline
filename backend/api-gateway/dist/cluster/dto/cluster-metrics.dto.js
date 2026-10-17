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
exports.ClusterMetricsDto = exports.ClusterSummaryDto = exports.QueueMetricBreakdownDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class QueueMetricBreakdownDto {
}
exports.QueueMetricBreakdownDto = QueueMetricBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'report-gen' }),
    __metadata("design:type", String)
], QueueMetricBreakdownDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], QueueMetricBreakdownDto.prototype, "waiting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], QueueMetricBreakdownDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 145 }),
    __metadata("design:type", Number)
], QueueMetricBreakdownDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], QueueMetricBreakdownDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], QueueMetricBreakdownDto.prototype, "delayed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], QueueMetricBreakdownDto.prototype, "paused", void 0);
class ClusterSummaryDto {
}
exports.ClusterSummaryDto = ClusterSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "totalQueues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "activeJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "waitingJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 540 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "completedJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "failedJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "delayedJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 565 }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "totalTracked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.46, description: 'Failure rate percentage across historical runs' }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "failureRatePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 18.4,
        description: 'Estimated operations processed per second across active workers',
    }),
    __metadata("design:type", Number)
], ClusterSummaryDto.prototype, "throughputOpsPerSec", void 0);
class ClusterMetricsDto {
}
exports.ClusterMetricsDto = ClusterMetricsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-17T18:15:30.000Z' }),
    __metadata("design:type", String)
], ClusterMetricsDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'healthy', enum: ['healthy', 'degraded'] }),
    __metadata("design:type", String)
], ClusterMetricsDto.prototype, "clusterStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClusterSummaryDto }),
    __metadata("design:type", ClusterSummaryDto)
], ClusterMetricsDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [QueueMetricBreakdownDto] }),
    __metadata("design:type", Array)
], ClusterMetricsDto.prototype, "queues", void 0);
//# sourceMappingURL=cluster-metrics.dto.js.map