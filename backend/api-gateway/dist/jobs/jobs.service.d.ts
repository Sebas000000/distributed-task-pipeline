import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DispatchJobDto } from './dto/dispatch-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { DispatchJobResponseDto, JobDetailResponseDto, PaginatedJobsResponseDto } from './dto/job-response.dto';
export declare class JobsService implements OnModuleInit {
    private readonly reportGenQueue;
    private readonly dataIngestQueue;
    private readonly webhooksQueue;
    private readonly logger;
    private readonly queues;
    constructor(reportGenQueue: Queue, dataIngestQueue: Queue, webhooksQueue: Queue);
    onModuleInit(): void;
    getQueue(queueName: string): Queue | undefined;
    getAllQueues(): Queue[];
    dispatch(dto: DispatchJobDto): Promise<DispatchJobResponseDto>;
    getJobs(query: GetJobsQueryDto): Promise<PaginatedJobsResponseDto>;
    getJobById(id: string): Promise<JobDetailResponseDto>;
    private mapToJobSummary;
}
