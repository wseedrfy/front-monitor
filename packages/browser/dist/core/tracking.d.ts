declare class Tracking {
    constructor();
    private init;
    /**
     * 监听页面加载
     */
    private initPageView;
    /**
     * 监听点击事件
     */
    private initClickTracking;
    /**
     * 上报埋点事件
     */
    private trackEvent;
}
export declare const tracking: Tracking;
export {};
