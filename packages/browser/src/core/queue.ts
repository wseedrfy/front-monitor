export class Queue {
  private stack: Function[] = [];
  private isProcessing = false;

  constructor() {}

  /**
   * 添加函数到队列中
   */
  addFn(fn: Function): void {
    if (typeof fn !== 'function') return;
    if (this.stack.indexOf(fn) !== -1) return;
    this.stack.push(fn);
    if (!this.isProcessing) {
      this.processStack();
    }
  }

  /**
   * 处理队列中的函数
   */
  private processStack(): void {
    if (this.stack.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const fn = this.stack.shift();
    if (fn) {
      try {
        fn();
      } catch (e) {
        console.error(`Queue process error: ${e}`);
      }
    }
    
    // 使用setTimeout确保不会阻塞主线程
    setTimeout(() => {
      this.processStack();
    }, 0);
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.stack = [];
    this.isProcessing = false;
  }
} 