import { JobStatusFilter } from '../../common/constants/queues.constants';
export declare class GetJobsQueryDto {
    status?: JobStatusFilter;
    queueName?: string;
    page?: number;
    limit?: number;
}
