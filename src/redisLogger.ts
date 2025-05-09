import { Redis } from '@upstash/redis';
import { LogEvent } from './types';

export function logEventAsync(event: LogEvent, redisClient: Redis, queueKey: string) {
    const logEntry = {
        level: event.level,
        message: event.message,
        timestamp: event.timestamp || new Date().toISOString(),
        metadata: event.metadata || {},
    };
    redisClient.rpush(queueKey, JSON.stringify(logEntry)).catch((error) => {
        console.error('Failed to log event:', error);
    });
}