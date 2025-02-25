import { ErrorTypes, Severity } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { transportData } from './transport';
import { getLocationHref, getTimestamp } from '../utils';
import { loggers } from '../utils/logger';
const logger = loggers.error;

export class ErrorMonitor {
  private isReporting = false; // 添加标志位防止递归

  constructor() {
    logger.debug('初始化错误监控...');
    this.init();
  }

  private init(): void {
    logger.debug('开始监听console.error');
    this.initConsoleError();
    
    logger.debug('开始监听window错误');
    this.initWindowError();
    
    logger.debug('开始监听内存使用');
    this.initMemoryWarning();
    
    logger.debug('开始监听WebSocket错误');
    this.initWebSocketError();
    
    logger.debug('错误监控初始化完成');
  }

  /**
   * 监控console.error
   */
  private initConsoleError(): void {
    logger.debug('开始监听console.error...');
    if (!window.console || !window.console.error) return;

    const originalError = window.console.error;
    window.console.error = (...args: any[]) => {
      if (!this.isReporting) {
        this.isReporting = true;
        const errorMessage = args.join(' ');
        logger.debug('捕获到console.error:', errorMessage);
        this.reportError(ErrorTypes.CONSOLE_ERROR, errorMessage);
        this.isReporting = false;
      }
      originalError.apply(window.console, args);
    };
  }

  /**
   * 监控window全局错误
   */
  private initWindowError(): void {
    logger.debug('开始监听window错误...');
    window.addEventListener('error', (event: ErrorEvent) => {
      logger.debug('捕获到window错误:', event.error);
      // 过滤资源加载错误
      if (event.error && event.error.stack && event.error.message) {
        this.reportError(ErrorTypes.WINDOW_ERROR, event.error.message, event.error);
      }
    }, true);
  }

  /**
   * 监控内存使用情况
   */
  private initMemoryWarning(): void {
    logger.debug('开始监听内存使用...');
    // 检查是否支持内存监控 (仅Chrome支持)
    const performance = window.performance as Performance;
    if (!performance || !performance.memory) return;

    const checkMemory = () => {
      const memory = performance.memory;
      if (!memory) return;

      const ratio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      if (ratio > 0.9) {
        logger.warn('内存使用过高:', {
          used: memory.usedJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          ratio
        });
        
        this.reportError(ErrorTypes.MEMORY_ERROR, 'Memory usage is too high', undefined, {
          usedJSHeapSize: memory.usedJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usageRatio: ratio
        });
      }
    };

    // 每30秒检查一次内存使用情况
    setInterval(checkMemory, 30000);
  }

  /**
   * 监控WebSocket错误
   */
  private initWebSocketError(): void {
    logger.debug('开始监听WebSocket错误...');
    const originalWebSocket = window.WebSocket;

    window.WebSocket = ((url: string | URL, protocols?: string | string[]) => {
      const ws = new originalWebSocket(url, protocols);
      logger.debug('创建新的WebSocket连接:', url.toString());

      ws.addEventListener('error', () => {
        logger.error('WebSocket连接错误:', url.toString());
        this.reportError(ErrorTypes.WEBSOCKET_ERROR, 'WebSocket connection error', undefined, {
          url: url.toString(),
          protocols
        });
      });

      return ws;
    }) as any;
  }

  /**
   * 上报错误
   */
  private reportError(type: ErrorTypes, message: string, error?: Error, data?: any): void {
    if (this.isReporting) {
      logger.debug('防止递归上报');
      return;
    }

    this.isReporting = true;
    try {
      logger.debug('准备上报错误:', {
        type,
        message,
        error,
        data
      });

      // 记录用户行为
      breadcrumb.push({
        type: BreadcrumbTypes.ERROR,
        message,
        data: {
          type,
          message,
          stack: error?.stack,
          level: Severity.High,
          time: getTimestamp(),
          url: getLocationHref(),
          ...data
        }
      });

      // 上报错误
      transportData.send({
        type,
        message,
        stack: error?.stack,
        level: Severity.High,
        time: getTimestamp(),
        url: getLocationHref(),
        data
      });

      logger.debug('错误上报完成');
    } catch (e) {
      logger.error('错误上报失败:', e);
    } finally {
      this.isReporting = false;
    }
  }
}

export const errorMonitor = new ErrorMonitor(); 