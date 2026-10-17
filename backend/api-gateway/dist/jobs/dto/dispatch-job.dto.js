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
exports.DispatchJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const queues_constants_1 = require("../../common/constants/queues.constants");
class DispatchJobDto {
}
exports.DispatchJobDto = DispatchJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target queue name to dispatch the job to',
        enum: queues_constants_1.ACTIVE_QUEUES,
        example: 'report-gen',
    }),
    (0, class_validator_1.IsEnum)(queues_constants_1.ACTIVE_QUEUES, {
        message: `queueName must be one of: ${queues_constants_1.ACTIVE_QUEUES.join(', ')}`,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DispatchJobDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific task handler or event subtype to execute',
        example: 'report.monthly',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DispatchJobDto.prototype, "payloadType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Arbitrary JSON payload containing task input parameters',
        example: {
            reportMonth: '2026-10',
            currency: 'USD',
            recipients: ['cfo@company.com', 'analytics@company.com'],
            includeCharts: true,
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], DispatchJobDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority of the job (1 = highest priority, 100 = lowest priority)',
        default: 10,
        minimum: 1,
        maximum: 100,
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], DispatchJobDto.prototype, "priority", void 0);
//# sourceMappingURL=dispatch-job.dto.js.map