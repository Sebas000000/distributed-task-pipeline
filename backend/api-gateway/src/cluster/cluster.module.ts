import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  QUEUE_DATA_INGEST,
  QUEUE_REPORT_GEN,
  QUEUE_WEBHOOKS,
} from '../common/constants/queues.constants';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_REPORT_GEN },
      { name: QUEUE_DATA_INGEST },
      { name: QUEUE_WEBHOOKS },
    ),
  ],
  controllers: [ClusterController],
  providers: [ClusterService],
  exports: [ClusterService],
})
export class ClusterModule {}
