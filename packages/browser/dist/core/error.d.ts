export declare class ErrorMonitor {
    private isReporting;
    constructor();
    private init;
    /**
     * 监控console.error
     */
    private initConsoleError;
    /**
     * 监控window全局错误
     */
    private initWindowError;
    /**
     * 监控内存使用情况
     */
    private initMemoryWarning;
    /**
     * 监控WebSocket错误
     */
    private initWebSocketError;
    /**
     * 上报错误
     */
    private reportError;
}
export declare const errorMonitor: ErrorMonitor;
