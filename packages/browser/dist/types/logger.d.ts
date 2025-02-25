export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
export interface LogItem {
    level: LogLevel;
    message: string;
    timestamp: number;
    module: string;
    data?: any;
}
export interface LoggerOptions {
    maxCache?: number;
    debug?: boolean;
}
