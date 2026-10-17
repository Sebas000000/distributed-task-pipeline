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
exports.GetJobsQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const queues_constants_1 = require("../../common/constants/queues.constants");
const VALID_STATUSES = [
    'all',
    'active',
    'waiting',
    'completed',
    'failed',
];
class GetJobsQueryDto {
    constructor() {
        this.status = 'all';
        this.queueName = 'all';
        this.page = 1;
        this.limit = 10;
    }
}
exports.GetJobsQueryDto = GetJobsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter jobs by execution status',
        enum: VALID_STATUSES,
        default: 'all',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(VALID_STATUSES),
    __metadata("design:type", String)
], GetJobsQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter jobs by target queue name',
        enum: ['all', ...queues_constants_1.ACTIVE_QUEUES],
        default: 'all',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['all', ...queues_constants_1.ACTIVE_QUEUES]),
    __metadata("design:type", String)
], GetJobsQueryDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetJobsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of records per page',
        default: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetJobsQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=get-jobs-query.dto.js.map