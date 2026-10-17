import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  QUEUE_DATA_INGEST,
  QUEUE_REPORT_GEN,
  QUEUE_WEBHOOKS,
} from '../common/constants/queues.constants';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_REPORT_GEN },
      { name: QUEUE_DATA_INGEST },
      { name: QUEUE_WEBHOOKS },
    ),
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService, BullModule],
})
export class JobsModule {}
