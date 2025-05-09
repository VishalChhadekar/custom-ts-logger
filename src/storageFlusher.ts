import { Redis } from '@upstash/redis';
import { SupabaseClient } from '@supabase/supabase-js';
import { LogEvent } from './types';

export async function flushLogsToStorage(
    redisClient: Redis,
    supabaseClient: SupabaseClient,
    queueKey: string,
    bucketName: string
) {
    try {
        const logs = await redisClient.lrange(queueKey, 0, -1);
        if (logs.length === 0) return;

        const groupedLogs: Record<string, LogEvent[]> = {};
        logs.forEach((log) => {
            try {
                const parsedLog = typeof log === 'string' ? JSON.parse(log) : log; // Check if already parsed
                const date = parsedLog.timestamp.split('T')[0];
                if (!groupedLogs[date]) {
                    groupedLogs[date] = [];
                }
                groupedLogs[date].push(parsedLog);
            } catch (error) {
                console.error('Failed to parse log entry:', error, log); // Log the invalid entry
            }
        });

        await Promise.all(
            Object.entries(groupedLogs).map(async ([date, logs]) => {
                try {
                    const { data: existingLogs } = await supabaseClient.storage
                        .from(bucketName)
                        .download(`logs/${date}.json`);

                    let mergedLogs = logs;
                    if (existingLogs) {
                        const existingLogsText = await existingLogs.text();
                        const existingLogsJson: LogEvent[] = JSON.parse(existingLogsText);
                        mergedLogs = [...existingLogsJson, ...logs];
                    }

                    await supabaseClient.storage
                        .from(bucketName)
                        .upload(`logs/${date}.json`, JSON.stringify(mergedLogs, null, 2), {
                            contentType: 'application/json',
                            upsert: true,
                        });
                } catch (error) {
                    console.error(`Error processing logs for ${date}:`, error);
                }
            })
        );

        await redisClient.del(queueKey);
    } catch (error) {
        console.error('Failed to flush logs to storage:', error);
    }
}