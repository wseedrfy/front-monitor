export declare class Behavior {
    private lastClick;
    private clickThrottle;
    constructor();
    private init;
    /**
     * 监听点击事件
     */
    private initClick;
    /**
     * 监听滚动事件
     */
    private initScroll;
    /**
     * 监听页面可见性变化
     */
    private initVisibility;
    /**
     * 获取元素的相关信息
     */
    private getElementInfo;
    /**
     * 获取元素的路径
     */
    private getElementPath;
    /**
     * 记录用户行为
     */
    private recordBehavior;
}
export declare const behavior: Behavior;
