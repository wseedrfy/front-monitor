export declare class Router {
    private lastHref;
    constructor();
    private init;
    /**
     * 监听history路由变化
     */
    private initHistory;
    /**
     * 监听hash路由变化
     */
    private initHash;
    /**
     * 记录路由变化
     */
    private recordRouteChange;
}
export declare const router: Router;
