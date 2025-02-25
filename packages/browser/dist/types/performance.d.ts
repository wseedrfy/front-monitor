interface PerformanceMemory {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}
declare global {
    interface Performance {
        memory?: PerformanceMemory;
    }
}
export {};
