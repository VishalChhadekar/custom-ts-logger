import { Redis } from '@upstash/redis';
import { LogEvent } from './types';
export declare function logEventAsync(event: LogEvent, redisClient: Redis, queueKey: string): void;
