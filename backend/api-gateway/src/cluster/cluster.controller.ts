import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClusterService } from './cluster.service';
import { ClusterMetricsDto } from './dto/cluster-metrics.dto';

@ApiTags('Cluster Telemetry & Health')
@Controller('cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Get('metrics')
  @ApiOperation({
    summary: 'Retrieve cluster telemetry, throughput, queue depths, and failure rate',
    description:
      'Aggregates live counts of waiting, active, completed, failed, and delayed jobs across all cluster queues alongside throughput operations/sec and system health.',
  })
  @ApiOkResponse({
    description: 'Cluster metrics returned successfully',
    type: ClusterMetricsDto,
  })
  async getMetrics(): Promise<ClusterMetricsDto> {
    return this.clusterService.getClusterMetrics();
  }
}
