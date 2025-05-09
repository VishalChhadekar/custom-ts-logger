"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushLogsToStorage = flushLogsToStorage;
function flushLogsToStorage(redisClient, supabaseClient, queueKey, bucketName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logs = yield redisClient.lrange(queueKey, 0, -1);
            if (logs.length === 0)
                return;
            const groupedLogs = {};
            logs.forEach((log) => {
                try {
                    const parsedLog = typeof log === 'string' ? JSON.parse(log) : log; // Check if already parsed
                    const date = parsedLog.timestamp.split('T')[0];
                    if (!groupedLogs[date]) {
                        groupedLogs[date] = [];
                    }
                    groupedLogs[date].push(parsedLog);
                }
                catch (error) {
                    console.error('Failed to parse log entry:', error, log); // Log the invalid entry
                }
            });
            yield Promise.all(Object.entries(groupedLogs).map((_a) => __awaiter(this, [_a], void 0, function* ([date, logs]) {
                try {
                    const { data: existingLogs } = yield supabaseClient.storage
                        .from(bucketName)
                        .download(`logs/${date}.json`);
                    let mergedLogs = logs;
                    if (existingLogs) {
                        const existingLogsText = yield existingLogs.text();
                        const existingLogsJson = JSON.parse(existingLogsText);
                        mergedLogs = [...existingLogsJson, ...logs];
                    }
                    yield supabaseClient.storage
                        .from(bucketName)
                        .upload(`logs/${date}.json`, JSON.stringify(mergedLogs, null, 2), {
                        contentType: 'application/json',
                        upsert: true,
                    });
                }
                catch (error) {
                    console.error(`Error processing logs for ${date}:`, error);
                }
            })));
            yield redisClient.del(queueKey);
        }
        catch (error) {
            console.error('Failed to flush logs to storage:', error);
        }
    });
}
