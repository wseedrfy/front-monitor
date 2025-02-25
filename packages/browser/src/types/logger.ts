export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

export interface LogItem {
  level: LogLevel;
  message: string;
  timestamp: number;
  module: string;
  data?: any;
}

export interface LoggerOptions {
  maxCache?: number;  // 最大缓存日志数
  debug?: boolean;    // 是否开启调试模式
} 