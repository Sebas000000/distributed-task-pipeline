import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  QUEUE_DATA_INGEST,
  QUEUE_REPORT_GEN,
  QUEUE_WEBHOOKS,
} from '../common/constants/queues.constants';
import {
  ClusterMetricsDto,
  QueueMetricBreakdownDto,
} from './dto/cluster-metrics.dto';

@Injectable()
export class ClusterService {
  private readonly logger = new Logger(ClusterService.name);
  private lastCompletedCount = 0;
  private lastSampleTime = Date.now();
  private smoothedThroughput = 0;

  constructor(
    @InjectQueue(QUEUE_REPORT_GEN) private readonly reportGenQueue: Queue,
    @InjectQueue(QUEUE_DATA_INGEST) private readonly dataIngestQueue: Queue,
    @InjectQueue(QUEUE_WEBHOOKS) private readonly webhooksQueue: Queue,
  ) {}

  async getClusterMetrics(): Promise<ClusterMetricsDto> {
    const queueList: { name: string; queue: Queue }[] = [
      { name: QUEUE_REPORT_GEN, queue: this.reportGenQueue },
      { name: QUEUE_DATA_INGEST, queue: this.dataIngestQueue },
      { name: QUEUE_WEBHOOKS, queue: this.webhooksQueue },
    ];

    const breakdowns: QueueMetricBreakdownDto[] = [];
    let totalActive = 0;
    let totalWaiting = 0;
    let totalCompleted = 0;
    let totalFailed = 0;
    let totalDelayed = 0;

    for (const item of queueList) {
      try {
        const counts = await item.queue.getJobCounts(
          'waiting',
          'active',
          'completed',
          'failed',
          'delayed',
          'paused',
        );

        const isPaused = await item.queue.isPaused();

        breakdowns.push({
          queueName: item.name,
          waiting: counts.waiting ?? 0,
          active: counts.active ?? 0,
          completed: counts.completed ?? 0,
          failed: counts.failed ?? 0,
          delayed: counts.delayed ?? 0,
          paused: isPaused,
        });

        totalActive += counts.active ?? 0;
        totalWaiting += counts.waiting ?? 0;
        totalCompleted += counts.completed ?? 0;
        totalFailed += counts.failed ?? 0;
        totalDelayed += counts.delayed ?? 0;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Could not fetch metrics for queue ${item.name}: ${msg}`);
        breakdowns.push({
          queueName: item.name,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          paused: false,
        });
      }
    }

    // Calculate throughput (ops/sec)
    const now = Date.now();
    const elapsedSec = (now - this.lastSampleTime) / 1000;
    if (elapsedSec >= 1) {
      const deltaCompleted = Math.max(0, totalCompleted - this.lastCompletedCount);
      const instantThroughput = deltaCompleted / elapsedSec;
      // Exponential moving average for smooth display
      this.smoothedThroughput = Number(
        (this.smoothedThroughput * 0.7 + instantThroughput * 0.3).toFixed(2),
      );
      this.lastCompletedCount = totalCompleted;
      this.lastSampleTime = now;
    }

    // If active jobs are currently running, estimate minimum active processing rate
    const currentThroughput =
      totalActive > 0 && this.smoothedThroughput === 0
        ? Number((totalActive * 0.85).toFixed(2))
        : this.smoothedThroughput;

    const totalProcessed = totalCompleted + totalFailed;
    const failureRatePercentage =
      totalProcessed > 0
        ? Number(((totalFailed / totalProcessed) * 100).toFixed(2))
        : 0;

    const totalTracked =
      totalActive + totalWaiting + totalCompleted + totalFailed + totalDelayed;

    const isDegraded = failureRatePercentage > 20;

    return {
      timestamp: new Date().toISOString(),
      clusterStatus: isDegraded ? 'degraded' : 'healthy',
      summary: {
        totalQueues: queueList.length,
        activeJobs: totalActive,
        waitingJobs: totalWaiting,
        completedJobs: totalCompleted,
        failedJobs: totalFailed,
        delayedJobs: totalDelayed,
        totalTracked,
        failureRatePercentage,
        throughputOpsPerSec: currentThroughput,
      },
      queues: breakdowns,
    };
  }
}
