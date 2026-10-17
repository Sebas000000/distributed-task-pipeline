import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ACTIVE_QUEUES, JobStatusFilter } from '../../common/constants/queues.constants';

const VALID_STATUSES: JobStatusFilter[] = [
  'all',
  'active',
  'waiting',
  'completed',
  'failed',
];

export class GetJobsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter jobs by execution status',
    enum: VALID_STATUSES,
    default: 'all',
  })
  @IsOptional()
  @IsIn(VALID_STATUSES)
  status?: JobStatusFilter = 'all';

  @ApiPropertyOptional({
    description: 'Filter jobs by target queue name',
    enum: ['all', ...ACTIVE_QUEUES],
    default: 'all',
  })
  @IsOptional()
  @IsIn(['all', ...ACTIVE_QUEUES])
  queueName?: string = 'all';

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
