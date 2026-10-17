import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ACTIVE_QUEUES, QueueName } from '../../common/constants/queues.constants';

export class DispatchJobDto {
  @ApiProperty({
    description: 'Target queue name to dispatch the job to',
    enum: ACTIVE_QUEUES,
    example: 'report-gen',
  })
  @IsEnum(ACTIVE_QUEUES, {
    message: `queueName must be one of: ${ACTIVE_QUEUES.join(', ')}`,
  })
  @IsNotEmpty()
  queueName: QueueName;

  @ApiProperty({
    description: 'Specific task handler or event subtype to execute',
    example: 'report.monthly',
  })
  @IsString()
  @IsNotEmpty()
  payloadType: string;

  @ApiProperty({
    description: 'Arbitrary JSON payload containing task input parameters',
    example: {
      reportMonth: '2026-10',
      currency: 'USD',
      recipients: ['cfo@company.com', 'analytics@company.com'],
      includeCharts: true,
    },
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Priority of the job (1 = highest priority, 100 = lowest priority)',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  priority?: number;
}
