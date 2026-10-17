import { QueueName } from '../../common/constants/queues.constants';
export declare class DispatchJobDto {
    queueName: QueueName;
    payloadType: string;
    payload: Record<string, unknown>;
    priority?: number;
}
