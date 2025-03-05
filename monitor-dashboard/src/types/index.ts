// 错误类型
export enum ErrorTypes {
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  PROMISE_ERROR = 'PROMISE_ERROR',
  FETCH_ERROR = 'FETCH_ERROR',
  VUE_ERROR = 'VUE_ERROR',
  REACT_ERROR = 'REACT_ERROR',
  LOG_ERROR = 'LOG_ERROR',
  PERFORMANCE = 'PERFORMANCE',
  ROUTE_ERROR = 'ROUTE_ERROR',
  BEHAVIOR = 'BEHAVIOR',
  CONSOLE_ERROR = 'CONSOLE_ERROR',
  WINDOW_ERROR = 'WINDOW_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR',
  TRACKING_EVENT = 'TRACKING_EVENT'
}

// 错误等级
export enum Severity {
  Critical = 'critical',
  High = 'high',
  Normal = 'normal',
  Low = 'low'
}

// 性能指标数据
export interface PerformanceMetrics {
  DNS?: number;
  TCP?: number;
  TTFB?: number;
  DOMParse?: number;
  domLoad?: number;
  loadTime?: number;
  FP?: number;
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  resourceList?: PerformanceResourceTiming[];
}

// 日志数据
export interface LogItem {
  id: number;
  type: string;
  message: string;
  url: string;
  time: number;
  data: any;
  created_at: string;
}

// 统计数据
export interface Statistics {
  totalErrors: number;
  errorsByType: Record<ErrorTypes, number>;
  errorsByLevel: Record<Severity, number>;
  averagePerformance: PerformanceMetrics;
} 