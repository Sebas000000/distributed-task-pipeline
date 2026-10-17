import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import {
  QUEUE_DATA_INGEST,
  QUEUE_REPORT_GEN,
  QUEUE_WEBHOOKS,
} from './common/constants/queues.constants';
import { ReportGenProcessor } from './processors/report-gen.processor';
import { DataIngestProcessor } from './processors/data-ingest.processor';
import { WebhookProcessor } from './processors/webhook.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
          maxRetriesPerRequest: null,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_REPORT_GEN },
      { name: QUEUE_DATA_INGEST },
      { name: QUEUE_WEBHOOKS },
    ),
  ],
  providers: [ReportGenProcessor, DataIngestProcessor, WebhookProcessor],
})
export class WorkerModule {}
