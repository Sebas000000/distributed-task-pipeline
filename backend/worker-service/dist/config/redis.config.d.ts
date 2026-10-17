export interface RedisConnectionOptions {
    host: string;
    port: number;
    password?: string;
}
export declare const getRedisConnectionOptions: () => RedisConnectionOptions;
