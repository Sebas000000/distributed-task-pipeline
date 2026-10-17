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
exports.JobDetailResponseDto = exports.PaginatedJobsResponseDto = exports.PaginationMetaDto = exports.JobSummaryDto = exports.DispatchJobResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DispatchJobResponseDto {
}
exports.DispatchJobResponseDto = DispatchJobResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 202 }),
    __metadata("design:type", Number)
], DispatchJobResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Job successfully enqueued for asynchronous processing' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#job-9a8f2c' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'report-gen' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'report.monthly' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "payloadType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'waiting' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-17T18:15:00.000Z' }),
    __metadata("design:type", String)
], DispatchJobResponseDto.prototype, "enqueuedAt", void 0);
class JobSummaryDto {
}
exports.JobSummaryDto = JobSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#job-9a8f2c' }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'report-gen' }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'report.monthly' }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "payloadType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed', enum: ['waiting', 'active', 'completed', 'failed', 'delayed', 'unknown'] }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], JobSummaryDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'worker-01', nullable: true }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "assignedWorker", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1420, nullable: true }),
    __metadata("design:type", Number)
], JobSummaryDto.prototype, "latency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-17T18:15:00.000Z' }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-10-17T18:15:01.000Z', nullable: true }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "processedOn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-10-17T18:15:02.420Z', nullable: true }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "finishedOn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null, nullable: true }),
    __metadata("design:type", String)
], JobSummaryDto.prototype, "failedReason", void 0);
class PaginationMetaDto {
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
class PaginatedJobsResponseDto {
}
exports.PaginatedJobsResponseDto = PaginatedJobsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [JobSummaryDto] }),
    __metadata("design:type", Array)
], PaginatedJobsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedJobsResponseDto.prototype, "meta", void 0);
class JobDetailResponseDto extends JobSummaryDto {
}
exports.JobDetailResponseDto = JobDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            reportMonth: '2026-10',
            currency: 'USD',
            recipients: ['cfo@company.com'],
        },
    }),
    __metadata("design:type", Object)
], JobDetailResponseDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: [
            '[18:15:01.100] [worker-01] [report.monthly] Step 1/4: Querying financial ledger...',
            '[18:15:01.650] [worker-01] [report.monthly] Step 2/4: Aggregating balances and KPIs (progress 25%)...',
            '[18:15:02.000] [worker-01] [report.monthly] Step 3/4: Generating charts & executive graphs (progress 50%)...',
            '[18:15:02.400] [worker-01] [report.monthly] Step 4/4: Report rendered and delivered to S3 (progress 100%).',
        ],
    }),
    __metadata("design:type", Array)
], JobDetailResponseDto.prototype, "logs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            reportId: 'REP-202610-8472',
            s3Url: 'https://s3.amazonaws.com/reports/financial-2026-10.pdf',
            rowCount: 14200,
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], JobDetailResponseDto.prototype, "returnvalue", void 0);
//# sourceMappingURL=job-response.dto.js.map