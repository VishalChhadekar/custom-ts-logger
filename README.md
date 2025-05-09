# Logger Package

A reusable, framework-agnostic logging utility written in TypeScript. This package provides two main functionalities:

1. **logEventAsync**: Logs events to a Redis queue asynchronously (fire-and-forget).
2. **flushLogsToStorage**: Flushes logs from Redis to a storage system (e.g., Supabase Storage) grouped by date.

## Features
- Framework-agnostic: No hardcoded credentials or configurations.
- Asynchronous logging: Minimal impact on application performance.
- Configurable: Accepts Redis and Supabase clients, queue keys, and bucket names as parameters.
- TypeScript support: Includes type definitions for log events and levels.

## Installation
Install the package using npm:

```bash
npm install custom-ts-logger
```

## Usage

### 1. Import the Package
```typescript
import { logEventAsync, flushLogsToStorage } from 'your-logger-package';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
```

### 2. Initialize Clients
```typescript
const redisClient = new Redis({ url: 'your-redis-url', token: 'your-redis-token' });
const supabaseClient = createClient('your-supabase-url', 'your-supabase-anon-key');
```

### 3. Log Events
Log events asynchronously (fire-and-forget):
```typescript
logEventAsync({
  level: 'info',
  message: 'Application started',
  metadata: { environment: 'production', version: '1.0.0' },
}, redisClient, 'logs-queue');
```

### 4. Flush Logs to Storage
Flush logs from Redis to Supabase Storage:
```typescript
await flushLogsToStorage(redisClient, supabaseClient, 'logs-queue', 'logs-bucket');
```

## API Reference

### logEventAsync
Logs an event to a Redis queue.

**Parameters:**
- `event` (LogEvent): The log event to record.
  - `level` (LogLevel): The severity level of the log (`info`, `warn`, `error`).
  - `message` (string): The log message.
  - `timestamp` (string, optional): The timestamp of the event. Defaults to the current time.
  - `metadata` (Record<string, any>, optional): Additional metadata for the log.
- `redisClient` (Redis): The Redis client instance.
- `queueKey` (string): The Redis queue key.

**Returns:**
- `void`

### flushLogsToStorage
Flushes logs from Redis to a storage system, grouped by date.

**Parameters:**
- `redisClient` (Redis): The Redis client instance.
- `supabaseClient` (SupabaseClient): The Supabase client instance.
- `queueKey` (string): The Redis queue key.
- `bucketName` (string): The name of the storage bucket.

**Returns:**
- `Promise<void>`

## Types

### LogLevel
```typescript
type LogLevel = 'info' | 'warn' | 'error';
```

### LogEvent
```typescript
interface LogEvent {
  level: LogLevel;
  message: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}
```

## Example

```typescript
import { logEventAsync, flushLogsToStorage } from 'your-logger-package';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';

const redisClient = new Redis({ url: 'your-redis-url', token: 'your-redis-token' });
const supabaseClient = createClient('your-supabase-url', 'your-supabase-anon-key');

// Log an event asynchronously
logEventAsync({
  level: 'info',
  message: 'Application started',
  metadata: { environment: 'production', version: '1.0.0' },
}, redisClient, 'logs-queue');

// Flush logs to storage
await flushLogsToStorage(redisClient, supabaseClient, 'logs-queue', 'logs-bucket');
```

## License
This package is licensed under the MIT License.
