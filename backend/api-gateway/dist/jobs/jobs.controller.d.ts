import { DispatchJobDto } from './dto/dispatch-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { DispatchJobResponseDto, JobDetailResponseDto, PaginatedJobsResponseDto } from './dto/job-response.dto';
import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    dispatch(dto: DispatchJobDto): Promise<DispatchJobResponseDto>;
    getJobs(query: GetJobsQueryDto): Promise<PaginatedJobsResponseDto>;
    getJobById(id: string): Promise<JobDetailResponseDto>;
}
