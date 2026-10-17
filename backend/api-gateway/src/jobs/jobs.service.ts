import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import {
  ACTIVE_QUEUES,
  QUEUE_DATA_INGEST,
  QUEUE_REPORT_GEN,
  QUEUE_WEBHOOKS,
  QueueName,
} from '../common/constants/queues.constants';
import { BaseJobData } from '../common/interfaces/job.interface';
import { generateJobId } from '../common/utils/job-id.util';
import { DispatchJobDto } from './dto/dispatch-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import {
  DispatchJobResponseDto,
  JobDetailResponseDto,
  JobSummaryDto,
  PaginatedJobsResponseDto,
} from './dto/job-response.dto';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);
  private readonly queues = new Map<string, Queue>();

  constructor(
    @InjectQueue(QUEUE_REPORT_GEN) private readonly reportGenQueue: Queue,
    @InjectQueue(QUEUE_DATA_INGEST) private readonly dataIngestQueue: Queue,
    @InjectQueue(QUEUE_WEBHOOKS) private readonly webhooksQueue: Queue,
  ) {}

  onModuleInit(): void {
    this.queues.set(QUEUE_REPORT_GEN, this.reportGenQueue);
    this.queues.set(QUEUE_DATA_INGEST, this.dataIngestQueue);
    this.queues.set(QUEUE_WEBHOOKS, this.webhooksQueue);
    this.logger.log(`Initialized JobsService with ${this.queues.size} active queues`);
  }

  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName);
  }

  getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  async dispatch(dto: DispatchJobDto): Promise<DispatchJobResponseDto> {
    const queue = this.queues.get(dto.queueName);
    if (!queue) {
      throw new InternalServerErrorException(
        `Target queue ${dto.queueName} is not registered in the cluster`,
      );
    }

    const jobId = generateJobId();
    const enqueuedAt = new Date().toISOString();

    const jobData: BaseJobData = {
      jobId,
      queueName: dto.queueName,
      payloadType: dto.payloadType,
      payload: dto.payload,
      enqueuedAt,
    };

    const isWebhook = dto.queueName === QUEUE_WEBHOOKS;

    await queue.add(dto.payloadType, jobData, {
      jobId,
      priority: dto.priority ?? 10,
      attempts: isWebhook ? 3 : 1,
      backoff: isWebhook
        ? {
            type: 'exponential',
            delay: 1500,
          }
        : undefined,
      removeOnComplete: {
        count: 2000,
      },
      removeOnFail: {
        count: 2000,
      },
    });

    this.logger.log(
      `Dispatched job ${jobId} to queue [${dto.queueName}] with handler [${dto.payloadType}]`,
    );

    return {
      statusCode: 202,
      message: 'Job successfully enqueued for asynchronous processing',
      jobId,
      queueName: dto.queueName,
      payloadType: dto.payloadType,
      status: 'waiting',
      enqueuedAt,
    };
  }

  async getJobs(query: GetJobsQueryDto): Promise<PaginatedJobsResponseDto> {
    const { status = 'all', queueName = 'all', page = 1, limit = 10 } = query;

    const targetQueues =
      queueName === 'all'
        ? this.getAllQueues()
        : [this.queues.get(queueName)].filter((q): q is Queue => Boolean(q));

    type JobType = 'active' | 'waiting' | 'completed' | 'failed' | 'delayed' | 'paused';
    let jobTypes: JobType[];

    if (status === 'all') {
      jobTypes = ['active', 'waiting', 'completed', 'failed', 'delayed'];
    } else {
      jobTypes = [status as JobType];
    }

    const allJobSummaries: JobSummaryDto[] = [];

    for (const queue of targetQueues) {
      const jobs = await queue.getJobs(jobTypes, 0, 500);

      for (const job of jobs) {
        if (!job) continue;
        const summary = await this.mapToJobSummary(job, queue.name);
        allJobSummaries.push(summary);
      }
    }

    // Sort by createdAt descending (newest first)
    allJobSummaries.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = allJobSummaries.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedData = allJobSummaries.slice(offset, offset + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getJobById(id: string): Promise<JobDetailResponseDto> {
    // Normalise ID if missing hash prefix
    const searchId = id.startsWith('#') ? id : `#${id}`;

    for (const queue of this.getAllQueues()) {
      let job: Job | undefined = await queue.getJob(id);
      if (!job && searchId !== id) {
        job = await queue.getJob(searchId);
      }

      if (job) {
        const state = await job.getState();
        const logsResult = await queue.getJobLogs(job.id as string, 0, 200);

        let executionLogs = logsResult?.logs || [];
        if (
          executionLogs.length === 0 &&
          job.returnvalue &&
          Array.isArray(job.returnvalue.logs)
        ) {
          executionLogs = job.returnvalue.logs;
        }

        const rawData = job.data as BaseJobData;
        const assignedWorker =
          job.returnvalue?.assignedWorker || rawData?.assignedWorker || null;

        const latency =
          job.returnvalue?.latency ??
          (job.finishedOn && job.processedOn
            ? job.finishedOn - job.processedOn
            : null);

        return {
          jobId: String(job.id),
          queueName: queue.name,
          payloadType: job.name,
          payload: (rawData?.payload as Record<string, unknown>) || {},
          status: state,
          progress: typeof job.progress === 'number' ? job.progress : 0,
          assignedWorker,
          latency,
          logs: executionLogs,
          createdAt: new Date(job.timestamp).toISOString(),
          processedOn: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
          finishedOn: job.finishedOn
            ? new Date(job.finishedOn).toISOString()
            : null,
          failedReason: job.failedReason || null,
          returnvalue: job.returnvalue || null,
        };
      }
    }

    throw new NotFoundException(
      `Job with identifier "${id}" was not found in any cluster queue`,
    );
  }

  private async mapToJobSummary(job: Job, queueName: string): Promise<JobSummaryDto> {
    const state = await job.getState();
    const rawData = job.data as BaseJobData;

    const assignedWorker =
      job.returnvalue?.assignedWorker || rawData?.assignedWorker || null;

    const latency =
      job.returnvalue?.latency ??
      (job.finishedOn && job.processedOn
        ? job.finishedOn - job.processedOn
        : null);

    return {
      jobId: String(job.id),
      queueName,
      payloadType: job.name,
      status: state,
      progress: typeof job.progress === 'number' ? job.progress : 0,
      assignedWorker,
      latency,
      createdAt: new Date(job.timestamp).toISOString(),
      processedOn: job.processedOn ? new Date(job.processedOn).toISOString() : null,
      finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      failedReason: job.failedReason || null,
    };
  }
}
