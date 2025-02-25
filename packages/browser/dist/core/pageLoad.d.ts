export declare class PageLoadMonitor {
    constructor();
    private init;
    /**
     * 监控页面加载性能
     */
    private initPageLoad;
    /**
     * 监控资源加载性能
     */
    private initResourceLoad;
    /**
     * 格式化资源加载数据
     */
    private formatResourceTiming;
    /**
     * 获取页面大小
     */
    private getPageSize;
}
export declare const pageLoadMonitor: PageLoadMonitor;
