import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  const workerId = process.env.WORKER_ID || `worker-${process.pid || '01'}`;

  logger.log(`=======================================================`);
  logger.log(`⚙️  Initializing Worker Service Node: [${workerId}]`);
  logger.log(`📡 Connecting to Redis and binding consumer queues...`);
  logger.log(`=======================================================`);

  const app = await NestFactory.createApplicationContext(WorkerModule);

  logger.log(`✅ Worker [${workerId}] successfully initialized and listening on:`);
  logger.log(`   - Queue: report-gen (report.monthly, report.daily)`);
  logger.log(`   - Queue: data-ingest (events.batch, csv.import)`);
  logger.log(`   - Queue: webhooks (webhook.deliver)`);

  const shutdown = async (signal: string) => {
    logger.log(`Received ${signal}. Gracefully stopping worker consumers...`);
    await app.close();
    logger.log(`Worker [${workerId}] shut down cleanly.`);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err: unknown) => {
  const logger = new Logger('WorkerBootstrap');
  const errorMsg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error(`Fatal error in Worker Service startup: ${errorMsg}`, stack);
  process.exit(1);
});
