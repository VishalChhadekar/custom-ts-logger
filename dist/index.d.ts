export { logEventAsync } from './redisLogger';
export { flushLogsToStorage } from './storageFlusher';
export { LogEvent, LogLevel } from './types';
/**
 * Example usage:
 *
 * import { logEventAsync, flushLogsToStorage } from 'your-logger-package';
 * import { Redis } from '@upstash/redis';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const redisClient = new Redis({ url: 'your-redis-url', token: 'your-redis-token' });
 * const supabaseClient = createClient('your-supabase-url', 'your-supabase-anon-key');
 *
 * // Log an event asynchronously (fire-and-forget)
 * logEventAsync({ level: 'info', message: 'Application started' }, redisClient, 'logs-queue');
 *
 * // Flush logs to storage
 * await flushLogsToStorage(redisClient, supabaseClient, 'logs-queue', 'logs-bucket');
 */ 
