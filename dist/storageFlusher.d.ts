import { Redis } from '@upstash/redis';
import { SupabaseClient } from '@supabase/supabase-js';
export declare function flushLogsToStorage(redisClient: Redis, supabaseClient: SupabaseClient, queueKey: string, bucketName: string): Promise<void>;
