// 基础配置类型
export interface InitOptions {
  // 基础配置
  dsn?: string;                // 上报接口地址
  apikey?: string;             // 项目标识
  debug?: boolean;             // 是否开启调试日志
  
  // 数据上报配置
  enabled?: boolean;           // 是否启用数据上报(总开关)
  useImgUpload?: boolean;      // 是否使用图片上报(默认XHR)
  
  // 各类型数据上报开关
  enabledError?: boolean;      // 是否上报错误
  enabledPerformance?: boolean;// 是否上报性能数据
  enabledBehavior?: boolean;   // 是否上报用户行为
  enabledNetwork?: boolean;    // 是否上报网络请求
  
  // 用户行为配置
  maxBreadcrumbs?: number;     // 用户行为栈最大长度
  
  // 数据处理hooks
  beforeDataReport?: (data: ReportDataType) => Promise<ReportDataType | null> | ReportDataType | null;
  beforePushBreadcrumb?: (breadcrumb: any, data: any) => any;
}

// 监控的事件类型
export enum EventTypes {
  ERROR = 'error',                    // JS错误
  UNHANDLEDREJECTION = 'unhandledrejection', // Promise错误
  RESOURCE = 'resource',              // 资源加载错误
  XHR = 'xhr',                       // xhr请求错误
  FETCH = 'fetch',                   // fetch请求错误
  CLICK = 'click',                   // 点击事件
  HISTORY = 'history',               // 路由变化
  HASHCHANGE = 'hashchange',         // hash变化
  PERFORMANCE = 'performance'         // 性能指标
}

export enum ErrorTypes {
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR', // JS错误
  RESOURCE_ERROR = 'RESOURCE_ERROR',     // 资源加载错误
  PROMISE_ERROR = 'PROMISE_ERROR',       // Promise错误
  FETCH_ERROR = 'FETCH_ERROR',          // 接口请求错误
  VUE_ERROR = 'VUE_ERROR',             // Vue错误
  REACT_ERROR = 'REACT_ERROR',          // React错误
  LOG_ERROR = 'LOG_ERROR',              // 自定义错误
  PERFORMANCE = 'PERFORMANCE',  // 添加性能指标类型
  ROUTE_ERROR = 'ROUTE_ERROR',  // 添加路由错误类型
  BEHAVIOR = 'BEHAVIOR',  // 添加用户行为类型
  CONSOLE_ERROR = 'CONSOLE_ERROR',    // 控制台错误
  WINDOW_ERROR = 'WINDOW_ERROR',      // 全局错误
  MEMORY_ERROR = 'MEMORY_ERROR',      // 内存错误
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR', // WebSocket错误
  TRACKING_EVENT = 'TRACKING_EVENT', // 新增埋点事件类型
}

export enum Severity {
  Critical = 'critical',   // 严重
  High = 'high',          // 高
  Normal = 'normal',      // 中
  Low = 'low'            // 低
}

export namespace Severity {
  export function fromString(level: string): Severity {
    switch (level.toLowerCase()) {
      case 'critical':
        return Severity.Critical;
      case 'high':
        return Severity.High;
      case 'normal':
        return Severity.Normal;
      case 'low':
        return Severity.Low;
      default:
        return Severity.Normal;
    }
  }
}

// 性能指标数据类型
export interface PerformanceMetrics {
  // 基础性能指标
  DNS?: number;       // DNS查询时间
  TCP?: number;       // TCP连接时间
  TTFB?: number;      // 首字节时间
  DOMParse?: number;  // DOM解析时间
  domLoad?: number;   // DOM加载完成时间
  loadTime?: number;  // 页面完全加载时间
  
  // Web Vitals指标
  FP?: number;        // First Paint
  FCP?: number;       // First Contentful Paint
  LCP?: number;       // Largest Contentful Paint
  FID?: number;       // First Input Delay
  CLS?: number;       // Cumulative Layout Shift
  
  // 资源加载性能
  resourceList?: PerformanceResourceTiming[];
}

// 上报的错误数据格式
export interface ReportDataType {
  type: ErrorTypes;              // 错误类型
  message: string;              // 错误信息
  url: string;                  // 错误发生的url
  name?: string;               // 错误名称
  stack?: string;              // 错误堆栈
  time?: number;               // 错误发生的时间戳
  errorId?: number;            // 错误id
  level?: Severity;            // 错误等级
  customTag?: string;          // 自定义标签
  metrics?: PerformanceMetrics; // 性能指标数据
  componentStack?: string;      // React错误堆栈
  componentName?: string;       // Vue组件名称
  propsData?: Record<string, any>; // Vue组件props数据
  vueVersion?: string;         // Vue版本号
  data?: any;                  // 附加数据
  // 以下是请求错误的特殊字段
  request?: {
    httpType?: string;         // 请求类型(xhr/fetch)
    traceId?: string;         // 请求ID
    method?: string;          // 请求方法
    url?: string;            // 请求地址
    data?: any;             // 请求参数
  };
  response?: {
    status?: number;        // 响应状态
    data?: any;           // 响应数据
  };
  behavior?: {           // 用户行为数据
    type: string;
    message: string;
    data: any;
    time: number;
  };
}

// 添加性能条目类型
export interface PerformanceEntryHandler {
  getEntries(): any[];
  getEntriesByType(type: string): any[];
  getEntriesByName(name: string): any[];
}

// 性能观察者类型
export interface IPerformanceObserver {
  observe(options: { entryTypes: string[] }): void;
  disconnect(): void;
  takeRecords(): any[];
}

// 重新导出logger相关类型
export * from './logger';