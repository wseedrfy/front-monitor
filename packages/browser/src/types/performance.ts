// Chrome Performance Memory API 类型定义
interface PerformanceMemory {
  jsHeapSizeLimit: number;    // JS堆内存大小限制
  totalJSHeapSize: number;    // 当前JS堆内存总大小
  usedJSHeapSize: number;     // 当前JS堆内存使用量
}

// 扩展Performance接口
declare global {
  interface Performance {
    memory?: PerformanceMemory;
  }
}

export {}; 