import { LogLevel, LogItem, LoggerOptions } from '../types/logger';

export declare class Logger {
    private enabled;
    private prefix;
    private maxCache;
    private logs;
    private module;
    constructor(module: string, options?: LoggerOptions);
    /**
     * 启用日志
     */
    enable(enabled?: boolean): void;
    /**
     * 设置日志前缀
     */
    setPrefix(prefix: string): void;
    /**
     * 添加日志
     */
    private addLog;
    /**
     * 普通日志
     */
    log(...args: any[]): LogItem;
    /**
     * 调试日志
     */
    debug(...args: any[]): LogItem;
    /**
     * 警告日志
     */
    warn(...args: any[]): LogItem;
    /**
     * 错误日志
     */
    error(...args: any[]): LogItem;
    /**
     * 获取所有日志
     */
    getLogs(): LogItem[];
    /**
     * 获取指定级别的日志
     */
    getLogsByLevel(level: LogLevel): LogItem[];
    /**
     * 清除日志
     */
    clearLogs(): void;
    /**
     * 导出日志
     */
    exportLogs(): string;
}
export declare const loggers: {
    core: Logger;
    error: Logger;
    performance: Logger;
    network: Logger;
    behavior: Logger;
    transport: Logger;
};
