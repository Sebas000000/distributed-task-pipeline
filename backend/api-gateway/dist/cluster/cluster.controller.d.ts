import { ClusterService } from './cluster.service';
import { ClusterMetricsDto } from './dto/cluster-metrics.dto';
export declare class ClusterController {
    private readonly clusterService;
    constructor(clusterService: ClusterService);
    getMetrics(): Promise<ClusterMetricsDto>;
}
