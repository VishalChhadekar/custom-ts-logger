"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushLogsToStorage = exports.logEventAsync = void 0;
// Exporting main functions and types from the logger package
var redisLogger_1 = require("./redisLogger");
Object.defineProperty(exports, "logEventAsync", { enumerable: true, get: function () { return redisLogger_1.logEventAsync; } });
var storageFlusher_1 = require("./storageFlusher");
Object.defineProperty(exports, "flushLogsToStorage", { enumerable: true, get: function () { return storageFlusher_1.flushLogsToStorage; } });
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
