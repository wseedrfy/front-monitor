import { InitOptions, ReportDataType } from '../types';

declare class TransportData {
    private queue;
    private beforeDataReport;
    private dsn;
    private apikey;
    private useImgUpload;
    private enabled;
    private enabledError;
    private enabledPerformance;
    private enabledBehavior;
    private enabledNetwork;
    constructor();
    /**
     * 图片上报
     */
    private imgRequest;
    /**
     * xhr请求上报
     */
    private xhrPost;
    /**
     * 发送数据到服务端
     */
    send(data: ReportDataType): Promise<void>;
    bindOptions(options?: InitOptions): void;
}
export declare const transportData: TransportData;
export {};
