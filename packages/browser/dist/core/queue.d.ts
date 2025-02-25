export declare class Queue {
    private stack;
    private isProcessing;
    constructor();
    /**
     * 添加函数到队列中
     */
    addFn(fn: Function): void;
    /**
     * 处理队列中的函数
     */
    private processStack;
    /**
     * 清空队列
     */
    clear(): void;
}
