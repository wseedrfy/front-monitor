import { LogLevel, LogItem, LoggerOptions } from '../types/logger';
import { getTimestamp } from './index';

export class Logger {
  private enabled: boolean = false;
  private prefix: string = '[Monitor]';
  private maxCache: number = 100;
  private logs: LogItem[] = [];
  private module: string = 'core';

  constructor(module: string, options?: LoggerOptions) {
    this.enabled = options?.debug || false;
    this.maxCache = options?.maxCache || 100;
    this.module = module;
  }

  /**
   * 启用日志
   */
  enable(enabled: boolean = true) {
    this.enabled = enabled;
  }

  /**
   * 设置日志前缀
   */
  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * 添加日志
   */
  private addLog(level: LogLevel, message: string, data?: any) {
    const logItem: LogItem = {
      level,
      module: this.module,
      message,
      timestamp: getTimestamp(),
      data
    };

    // 添加到缓存
    this.logs.push(logItem);

    // 超出最大缓存数则移除最早的日志
    if (this.logs.length > this.maxCache) {
      this.logs.shift();
    }

    return logItem;
  }

  /**
   * 普通日志
   */
  log(...args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');
    
    const logItem = this.addLog(LogLevel.Info, message);
    
    if (this.enabled) {
      console.log(`${this.prefix}[${this.module}]`, message);
    }
    
    return logItem;
  }

  /**
   * 调试日志
   */
  debug(...args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');
    
    const logItem = this.addLog(LogLevel.Debug, message);
    
    if (this.enabled) {
      console.debug(this.prefix, message);
    }
    
    return logItem;
  }

  /**
   * 警告日志
   */
  warn(...args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');
    
    const logItem = this.addLog(LogLevel.Warn, message);
    
    if (this.enabled) {
      console.warn(this.prefix, message);
    }
    
    return logItem;
  }

  /**
   * 错误日志
   */
  error(...args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');
    
    const logItem = this.addLog(LogLevel.Error, message);
    
    if (this.enabled) {
      console.error(this.prefix, message);
    }
    
    return logItem;
  }

  /**
   * 获取所有日志
   */
  getLogs(): LogItem[] {
    return this.logs;
  }

  /**
   * 获取指定级别的日志
   */
  getLogsByLevel(level: LogLevel): LogItem[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * 导出日志
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// 为每个模块创建logger实例
export const loggers = {
  core: new Logger('core'),
  error: new Logger('error'),
  performance: new Logger('performance'),
  network: new Logger('network'),
  behavior: new Logger('behavior'),
  transport: new Logger('transport')
}; 