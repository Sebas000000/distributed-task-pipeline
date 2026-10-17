export declare class DispatchJobResponseDto {
    statusCode: number;
    message: string;
    jobId: string;
    queueName: string;
    payloadType: string;
    status: string;
    enqueuedAt: string;
}
export declare class JobSummaryDto {
    jobId: string;
    queueName: string;
    payloadType: string;
    status: string;
    progress: number;
    assignedWorker: string | null;
    latency: number | null;
    createdAt: string;
    processedOn: string | null;
    finishedOn: string | null;
    failedReason: string | null;
}
export declare class PaginationMetaDto {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class PaginatedJobsResponseDto {
    data: JobSummaryDto[];
    meta: PaginationMetaDto;
}
export declare class JobDetailResponseDto extends JobSummaryDto {
    payload: Record<string, unknown>;
    logs: string[];
    returnvalue?: unknown;
}
