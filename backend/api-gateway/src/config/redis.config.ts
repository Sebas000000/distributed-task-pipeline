export interface RedisConnectionOptions {
  host: string;
  port: number;
  password?: string;
}

export const getRedisConnectionOptions = (): RedisConnectionOptions => {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  };
};
