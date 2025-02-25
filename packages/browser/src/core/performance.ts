import { 
  EventTypes, 
  ErrorTypes, 
  PerformanceMetrics,
  ReportDataType
} from '../types';
import { getTimestamp } from '../utils';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { transportData } from './transport';
import { loggers } from '../utils/logger';

const logger = loggers.performance;

// 扩展性能条目类型
interface PerformanceEntryWithStart extends PerformanceEntry {
  processingStart?: number;
  startTime: number;
}

// 布局偏移条目类型
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export class Performance {
  private metrics: PerformanceMetrics = {};
  private isCollecting = false;

  constructor() {
    logger.debug('性能监控初始化...');
    this.init();
  }

  private init(): void {
    if (!window.performance) {
      logger.warn('浏览器不支持performance API');
      return;
    }

    // 监听页面加载完成
    window.addEventListener('load', () => {
      logger.debug('页面加载完成，等待收集性能指标...');
      // 延长等待时间到5秒
      setTimeout(() => {
        this.getPerformanceMetrics();
      }, 5000);
    });

    // 监听各项性能指标
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
  }

  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            logger.debug('FCP指标:', this.metrics.FCP);
            observer.disconnect();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      logger.debug('开始监听FCP...');
    } catch (e) {
      logger.warn('FCP不支持:', e);
    }
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        logger.debug('LCP指标:', this.metrics.LCP);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      logger.debug('开始监听LCP...');
    } catch (e) {
      logger.warn('LCP不支持:', e);
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0] as PerformanceEntryWithStart;
        if (firstInput && firstInput.processingStart) {
          this.metrics.FID = firstInput.processingStart - firstInput.startTime;
          logger.debug('FID指标:', this.metrics.FID);
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      logger.debug('开始监听FID...');
    } catch (e) {
      logger.warn('FID不支持:', e);
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
            logger.debug('CLS指标:', this.metrics.CLS);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      logger.debug('开始监听CLS...');
    } catch (e) {
      logger.warn('CLS不支持:', e);
    }
  }

  private getPerformanceMetrics(): void {
    if (this.isCollecting) {
      logger.debug('性能指标正在收集中...');
      return;
    }

    this.isCollecting = true;
    logger.debug('开始收集性能指标...');

    try {
      // 使用Navigation Timing API Level 2
      const entries = window.performance?.getEntriesByType?.('navigation');
      const navigationEntry = entries?.[0] as PerformanceNavigationTiming;
      
      if (!navigationEntry) {
        logger.warn('Navigation Timing API不支持');
        return;
      }

      // 计算基础性能指标
      const metrics: PerformanceMetrics = {
        ...this.metrics,
        // DNS查询时间
        DNS: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        // TCP连接时间
        TCP: navigationEntry.connectEnd - navigationEntry.connectStart,
        // 首字节时间 (TTFB)
        TTFB: navigationEntry.responseStart,
        // DOM解析时间
        DOMParse: navigationEntry.domComplete - navigationEntry.domInteractive,
        // DOM加载完成时间
        domLoad: navigationEntry.domContentLoadedEventEnd,
        // 页面完全加载时间
        loadTime: navigationEntry.loadEventEnd
      };

      this.metrics = metrics;

      logger.debug('基础性能指标:', {
        DNS: metrics.DNS + 'ms',
        TCP: metrics.TCP + 'ms',
        TTFB: metrics.TTFB + 'ms',
        DOMParse: metrics.DOMParse + 'ms',
        domLoad: metrics.domLoad + 'ms',
        loadTime: metrics.loadTime + 'ms'
      });

      // 获取资源加载情况
      const resources = window.performance?.getEntriesByType?.('resource') || [];
      this.metrics.resourceList = resources as PerformanceResourceTiming[];
      logger.debug('资源加载数量:', this.metrics.resourceList.length);

      // 记录到用户行为栈
      breadcrumb.push({
        type: BreadcrumbTypes.PERFORMANCE,
        message: 'Performance Metrics Collected',
        data: this.metrics
      });

      // 上报数据
      transportData.send({
        type: ErrorTypes.PERFORMANCE,
        time: getTimestamp(),
        name: 'performance',
        message: 'Performance Metrics',
        url: window.location.href,
        metrics: this.metrics
      });

    } catch (e) {
      logger.error('收集性能指标失败:', e);
    } finally {
      this.isCollecting = false;
    }
  }
}

export const performance = new Performance(); 