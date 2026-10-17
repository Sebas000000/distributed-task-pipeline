import { ApiProperty } from '@nestjs/swagger';

export class QueueMetricBreakdownDto {
  @ApiProperty({ example: 'report-gen' })
  queueName: string;

  @ApiProperty({ example: 4 })
  waiting: number;

  @ApiProperty({ example: 2 })
  active: number;

  @ApiProperty({ example: 145 })
  completed: number;

  @ApiProperty({ example: 3 })
  failed: number;

  @ApiProperty({ example: 0 })
  delayed: number;

  @ApiProperty({ example: false })
  paused: boolean;
}

export class ClusterSummaryDto {
  @ApiProperty({ example: 3 })
  totalQueues: number;

  @ApiProperty({ example: 5 })
  activeJobs: number;

  @ApiProperty({ example: 12 })
  waitingJobs: number;

  @ApiProperty({ example: 540 })
  completedJobs: number;

  @ApiProperty({ example: 8 })
  failedJobs: number;

  @ApiProperty({ example: 0 })
  delayedJobs: number;

  @ApiProperty({ example: 565 })
  totalTracked: number;

  @ApiProperty({ example: 1.46, description: 'Failure rate percentage across historical runs' })
  failureRatePercentage: number;

  @ApiProperty({
    example: 18.4,
    description: 'Estimated operations processed per second across active workers',
  })
  throughputOpsPerSec: number;
}

export class ClusterMetricsDto {
  @ApiProperty({ example: '2026-10-17T18:15:30.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'healthy', enum: ['healthy', 'degraded'] })
  clusterStatus: string;

  @ApiProperty({ type: ClusterSummaryDto })
  summary: ClusterSummaryDto;

  @ApiProperty({ type: [QueueMetricBreakdownDto] })
  queues: QueueMetricBreakdownDto[];
}
