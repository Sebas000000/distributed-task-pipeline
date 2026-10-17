import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DispatchJobDto } from './dto/dispatch-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import {
  DispatchJobResponseDto,
  JobDetailResponseDto,
  PaginatedJobsResponseDto,
} from './dto/job-response.dto';
import { JobsService } from './jobs.service';

@ApiTags('Jobs Execution & Dispatch')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('dispatch')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Dispatch an asynchronous background task to Redis queues',
    description:
      'Validates incoming task payload against schema, enqueues the job with BullMQ, and immediately returns HTTP 202 Accepted alongside a unique trackable jobId.',
  })
  @ApiAcceptedResponse({
    description: 'Job enqueued successfully',
    type: DispatchJobResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input payload, unrecognized queue name, or validation error',
  })
  async dispatch(@Body() dto: DispatchJobDto): Promise<DispatchJobResponseDto> {
    return this.jobsService.dispatch(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List cluster jobs with filtering and pagination',
    description:
      'Fetches cluster-wide or queue-specific jobs filtered by status (active, waiting, completed, failed) with pagination metadata.',
  })
  @ApiOkResponse({
    description: 'Paginated list of jobs returned successfully',
    type: PaginatedJobsResponseDto,
  })
  async getJobs(@Query() query: GetJobsQueryDto): Promise<PaginatedJobsResponseDto> {
    return this.jobsService.getJobs(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve detailed state, logs, and telemetry of a specific job',
    description:
      'Returns raw input payload, step-by-step worker logs, real-time progress percentage (0-100), latency metrics, and assigned worker identity.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique job identifier (e.g. #job-9a8f2c or 9a8f2c)',
    example: '#job-9a8f2c',
  })
  @ApiOkResponse({
    description: 'Job details retrieved successfully',
    type: JobDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Job not found in any registered cluster queue',
  })
  async getJobById(@Param('id') id: string): Promise<JobDetailResponseDto> {
    return this.jobsService.getJobById(id);
  }
}
