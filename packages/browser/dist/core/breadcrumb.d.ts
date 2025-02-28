import { InitOptions } from '../types';

export declare enum BreadcrumbTypes {
    ROUTE = "Route",
    CLICK = "Click",
    XHR = "Xhr",
    ERROR = "Error",
    CUSTOM = "Custom",
    PERFORMANCE = "Performance"
}
export interface BreadcrumbData {
    type: BreadcrumbTypes;
    message: string;
    time?: number;
    data?: any;
}
export declare class Breadcrumb {
    private maxBreadcrumbs;
    private stack;
    private beforePushBreadcrumb;
    constructor();
    /**
     * 添加用户行为
     */
    push(data: BreadcrumbData): void;
    private immediatePush;
    private shift;
    getStack(): BreadcrumbData[];
    bindOptions(options?: InitOptions): void;
    /**
     * 获取用户行为轨迹
     */
    getBreadcrumbs(): BreadcrumbData[];
}
export declare const breadcrumb: Breadcrumb;
