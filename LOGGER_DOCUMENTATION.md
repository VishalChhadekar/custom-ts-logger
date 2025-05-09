# Logger Implementation Documentation

This document provides a comprehensive overview of the logging approach implemented in this project using the `custom-ts-logger` package. It includes details on the usage of `logEventAsync` and `flushLogsToStorage`, their implications on API response times, and best practices for integrating logging into your application.

## Overview of the Logger

The `custom-ts-logger` package is a reusable, framework-agnostic logging utility written in TypeScript. It provides two main functionalities:

1. **`logEventAsync`**: Logs events to a Redis queue asynchronously (fire-and-forget).
2. **`flushLogsToStorage`**: Flushes logs from Redis to a storage system (e.g., Supabase Storage) grouped by date.

### Features
- **Framework-agnostic**: No hardcoded credentials or configurations.
- **Asynchronous logging**: Minimal impact on application performance.
- **Configurable**: Accepts Redis and Supabase clients, queue keys, and bucket names as parameters.
- **TypeScript support**: Includes type definitions for log events and levels.

## Implementation Details

### Environment Variables
The following environment variables are required for the logger to function:

- `UPSTASH_REDIS_URL`: The URL for the Redis instance.
- `UPSTASH_REDIS_TOKEN`: The token for authenticating with Redis.
- `SUPABASE_URL`: The URL for the Supabase instance.
- `SUPABASE_ANON_KEY`: The anonymous key for Supabase.
- `BUCKET_NAME`: The name of the Supabase storage bucket.

### Initialization

#### Redis Client
```typescript
const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
});
```

#### Supabase Client
```typescript
const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);
```

### Logging an Event
The `logEventAsync` function is used to log events to a Redis queue. It is asynchronous and does not block the main thread, ensuring minimal impact on API response times.

#### Example
```typescript
logEventAsync(
    {
        level: 'info',
        message: 'GET /api/welcome called',
        timestamp: new Date().toISOString(),
        metadata: { environment: 'production', version: '1.0.0', endpoint: '/api/welcome', method: 'GET' },
    },
    redisClient,
    'logs-queue'
);
```

### Flushing Logs to Storage
The `flushLogsToStorage` function is used to move logs from Redis to Supabase storage. This operation involves reading from Redis and writing to Supabase, which can be I/O-intensive.

#### Example
```typescript
await flushLogsToStorage(redisClient, supabaseClient, 'logs-queue', process.env.BUCKET_NAME!);
```

### Implications on API Response Times

#### `logEventAsync`
- **Impact**: Minimal, as it is asynchronous and does not block the main thread.
- **Use Case**: Suitable for logging events in API routes without significantly affecting response times.

#### `flushLogsToStorage`
- **Impact**: Can be significant if called in every API route, as it involves I/O operations.
- **Use Case**: Best suited for scheduled tasks or background workers to avoid impacting API response times.

## Best Practices

1. **Centralized Logging**:
   - Use `logEventAsync` in routes where logging is necessary, but avoid overusing it in every route unless required.

2. **Background Processing**:
   - Use `flushLogsToStorage` in a scheduled task or background worker to periodically process logs without affecting API response times.

3. **Monitoring**:
   - Monitor the performance of your Redis and Supabase clients to ensure they do not become bottlenecks.

4. **Error Handling**:
   - Wrap calls to `flushLogsToStorage` in a try-catch block to handle errors gracefully.

#### Example
```typescript
try {
    await flushLogsToStorage(redisClient, supabaseClient, 'logs-queue', process.env.BUCKET_NAME!);
} catch (error) {
    console.error('Error in flushLogsToStorage:', error);
}
```

5. **Inspecting Redis Queue**:
   - Before flushing logs, inspect the Redis queue to ensure the data is valid:
   ```typescript
   const queueData = await redisClient.lrange('logs-queue', 0, -1);
   console.log('Redis Queue Data:', queueData);
   ```

## Conclusion
This logging approach provides a robust and scalable solution for capturing and storing logs in a distributed system. By following the best practices outlined in this document, you can ensure efficient logging with minimal impact on your application's performance.
