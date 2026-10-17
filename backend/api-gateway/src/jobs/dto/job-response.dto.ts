import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DispatchJobResponseDto {
  @ApiProperty({ example: 202 })
  statusCode: number;

  @ApiProperty({ example: 'Job successfully enqueued for asynchronous processing' })
  message: string;

  @ApiProperty({ example: '#job-9a8f2c' })
  jobId: string;

  @ApiProperty({ example: 'report-gen' })
  queueName: string;

  @ApiProperty({ example: 'report.monthly' })
  payloadType: string;

  @ApiProperty({ example: 'waiting' })
  status: string;

  @ApiProperty({ example: '2026-10-17T18:15:00.000Z' })
  enqueuedAt: string;
}

export class JobSummaryDto {
  @ApiProperty({ example: '#job-9a8f2c' })
  jobId: string;

  @ApiProperty({ example: 'report-gen' })
  queueName: string;

  @ApiProperty({ example: 'report.monthly' })
  payloadType: string;

  @ApiProperty({ example: 'completed', enum: ['waiting', 'active', 'completed', 'failed', 'delayed', 'unknown'] })
  status: string;

  @ApiProperty({ example: 100 })
  progress: number;

  @ApiPropertyOptional({ example: 'worker-01', nullable: true })
  assignedWorker: string | null;

  @ApiPropertyOptional({ example: 1420, nullable: true })
  latency: number | null;

  @ApiProperty({ example: '2026-10-17T18:15:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-10-17T18:15:01.000Z', nullable: true })
  processedOn: string | null;

  @ApiPropertyOptional({ example: '2026-10-17T18:15:02.420Z', nullable: true })
  finishedOn: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  failedReason: string | null;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedJobsResponseDto {
  @ApiProperty({ type: [JobSummaryDto] })
  data: JobSummaryDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class JobDetailResponseDto extends JobSummaryDto {
  @ApiProperty({
    example: {
      reportMonth: '2026-10',
      currency: 'USD',
      recipients: ['cfo@company.com'],
    },
  })
  payload: Record<string, unknown>;

  @ApiProperty({
    type: [String],
    example: [
      '[18:15:01.100] [worker-01] [report.monthly] Step 1/4: Querying financial ledger...',
      '[18:15:01.650] [worker-01] [report.monthly] Step 2/4: Aggregating balances and KPIs (progress 25%)...',
      '[18:15:02.000] [worker-01] [report.monthly] Step 3/4: Generating charts & executive graphs (progress 50%)...',
      '[18:15:02.400] [worker-01] [report.monthly] Step 4/4: Report rendered and delivered to S3 (progress 100%).',
    ],
  })
  logs: string[];

  @ApiPropertyOptional({
    example: {
      reportId: 'REP-202610-8472',
      s3Url: 'https://s3.amazonaws.com/reports/financial-2026-10.pdf',
      rowCount: 14200,
    },
    nullable: true,
  })
  returnvalue?: unknown;
}
