interface NetworkStatus {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
}
export declare class NetworkMonitor {
    private lastStatus;
    constructor();
    private init;
    /**
     * 监控在线状态
     */
    private initOnlineStatus;
    /**
     * 监控网络信息
     */
    private initConnectionInfo;
    /**
     * 处理网络状态变化
     */
    private handleNetworkChange;
    /**
     * 检查网络状态是否发生变化
     */
    private isStatusChanged;
    /**
     * 获取当前网络状态
     */
    getNetworkStatus(): NetworkStatus;
}
export declare const networkMonitor: NetworkMonitor;
export {};
