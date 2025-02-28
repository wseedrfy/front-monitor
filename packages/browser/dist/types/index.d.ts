export interface InitOptions {
    dsn?: string;
    apikey?: string;
    debug?: boolean;
    enabled?: boolean;
    useImgUpload?: boolean;
    enabledError?: boolean;
    enabledPerformance?: boolean;
    enabledBehavior?: boolean;
    enabledNetwork?: boolean;
    maxBreadcrumbs?: number;
    beforeDataReport?: (data: ReportDataType) => Promise<ReportDataType | null> | ReportDataType | null;
    beforePushBreadcrumb?: (breadcrumb: any, data: any) => any;
}
export declare enum EventTypes {
    ERROR = "error",// JS错误
    UNHANDLEDREJECTION = "unhandledrejection",// Promise错误
    RESOURCE = "resource",// 资源加载错误
    XHR = "xhr",// xhr请求错误
    FETCH = "fetch",// fetch请求错误
    CLICK = "click",// 点击事件
    HISTORY = "history",// 路由变化
    HASHCHANGE = "hashchange",// hash变化
    PERFORMANCE = "performance"
}
export declare enum ErrorTypes {
    JAVASCRIPT_ERROR = "JAVASCRIPT_ERROR",// JS错误
    RESOURCE_ERROR = "RESOURCE_ERROR",// 资源加载错误
    PROMISE_ERROR = "PROMISE_ERROR",// Promise错误
    FETCH_ERROR = "FETCH_ERROR",// 接口请求错误
    VUE_ERROR = "VUE_ERROR",// Vue错误
    REACT_ERROR = "REACT_ERROR",// React错误
    LOG_ERROR = "LOG_ERROR",// 自定义错误
    PERFORMANCE = "PERFORMANCE",// 添加性能指标类型
    ROUTE_ERROR = "ROUTE_ERROR",// 添加路由错误类型
    BEHAVIOR = "BEHAVIOR",// 添加用户行为类型
    CONSOLE_ERROR = "CONSOLE_ERROR",// 控制台错误
    WINDOW_ERROR = "WINDOW_ERROR",// 全局错误
    MEMORY_ERROR = "MEMORY_ERROR",// 内存错误
    WEBSOCKET_ERROR = "WEBSOCKET_ERROR",// WebSocket错误
    TRACKING_EVENT = "TRACKING_EVENT"
}
export declare enum Severity {
    Critical = "critical",// 严重
    High = "high",// 高
    Normal = "normal",// 中
    Low = "low"
}
export declare namespace Severity {
    function fromString(level: string): Severity;
}
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
export interface ReportDataType {
    type: ErrorTypes;
    message: string;
    url: string;
    name?: string;
    stack?: string;
    time?: number;
    errorId?: number;
    level?: Severity;
    customTag?: string;
    metrics?: PerformanceMetrics;
    componentStack?: string;
    componentName?: string;
    propsData?: Record<string, any>;
    vueVersion?: string;
    data?: any;
    request?: {
        httpType?: string;
        traceId?: string;
        method?: string;
        url?: string;
        data?: any;
    };
    response?: {
        status?: number;
        data?: any;
    };
    behavior?: {
        type: string;
        message: string;
        data: any;
        time: number;
    };
}
export interface PerformanceEntryHandler {
    getEntries(): any[];
    getEntriesByType(type: string): any[];
    getEntriesByName(name: string): any[];
}
export interface IPerformanceObserver {
    observe(options: {
        entryTypes: string[];
    }): void;
    disconnect(): void;
    takeRecords(): any[];
}
export * from './logger';
