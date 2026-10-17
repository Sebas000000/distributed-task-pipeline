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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dispatch_job_dto_1 = require("./dto/dispatch-job.dto");
const get_jobs_query_dto_1 = require("./dto/get-jobs-query.dto");
const job_response_dto_1 = require("./dto/job-response.dto");
const jobs_service_1 = require("./jobs.service");
let JobsController = class JobsController {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async dispatch(dto) {
        return this.jobsService.dispatch(dto);
    }
    async getJobs(query) {
        return this.jobsService.getJobs(query);
    }
    async getJobById(id) {
        return this.jobsService.getJobById(id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)('dispatch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Dispatch an asynchronous background task to Redis queues',
        description: 'Validates incoming task payload against schema, enqueues the job with BullMQ, and immediately returns HTTP 202 Accepted alongside a unique trackable jobId.',
    }),
    (0, swagger_1.ApiAcceptedResponse)({
        description: 'Job enqueued successfully',
        type: job_response_dto_1.DispatchJobResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input payload, unrecognized queue name, or validation error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dispatch_job_dto_1.DispatchJobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "dispatch", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List cluster jobs with filtering and pagination',
        description: 'Fetches cluster-wide or queue-specific jobs filtered by status (active, waiting, completed, failed) with pagination metadata.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of jobs returned successfully',
        type: job_response_dto_1.PaginatedJobsResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_jobs_query_dto_1.GetJobsQueryDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve detailed state, logs, and telemetry of a specific job',
        description: 'Returns raw input payload, step-by-step worker logs, real-time progress percentage (0-100), latency metrics, and assigned worker identity.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique job identifier (e.g. #job-9a8f2c or 9a8f2c)',
        example: '#job-9a8f2c',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Job details retrieved successfully',
        type: job_response_dto_1.JobDetailResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Job not found in any registered cluster queue',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobById", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('Jobs Execution & Dispatch'),
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map