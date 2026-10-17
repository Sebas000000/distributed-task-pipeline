"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnectionOptions = void 0;
const getRedisConnectionOptions = () => {
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
    };
};
exports.getRedisConnectionOptions = getRedisConnectionOptions;
//# sourceMappingURL=redis.config.js.map