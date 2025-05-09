"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEventAsync = logEventAsync;
function logEventAsync(event, redisClient, queueKey) {
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
