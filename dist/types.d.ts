export type LogLevel = 'info' | 'warn' | 'error';
export interface LogEvent {
    level: LogLevel;
    message: string;
    timestamp?: string;
    metadata?: Record<string, any>;
}
