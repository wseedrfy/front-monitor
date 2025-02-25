import { ErrorTypes, Severity } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { transportData } from './transport';
import { getLocationHref, getTimestamp } from '../utils';

interface ResourceTiming {
  name: string;
  initiatorType: string;
  duration: number;
  startTime: number;
  responseEnd: number;
  transferSize?: number;
  encodedBodySize?: number;
  decodedBodySize?: number;
}

export class PageLoadMonitor {
  constructor() {
    this.init();
  }

  private init(): void {
    this.initPageLoad();
    this.initResourceLoad();
  }

  /**
   * 监控页面加载性能
   */
  private initPageLoad(): void {
    window.addEventListener('load', () => {
      // 等待所有资源加载完成
      setTimeout(() => {
        const timing = performance.timing;
        const pageLoadData = {
          // DNS解析时间
          dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
          // TCP连接时间
          tcpTime: timing.connectEnd - timing.connectStart,
          // 白屏时间
          whiteScreenTime: timing.domInteractive - timing.navigationStart,
          // DOM解析时间
          domParseTime: timing.domComplete - timing.domInteractive,
          // DOM完成时间
          domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
          // 页面完全加载时间
          loadTime: timing.loadEventEnd - timing.navigationStart,
          // 页面大小
          pageSize: this.getPageSize()
        };

        // 记录用户行为
        breadcrumb.push({
          type: BreadcrumbTypes.PERFORMANCE,
          message: 'Page Load Performance',
          data: pageLoadData
        });

        // 上报页面加载数据
        transportData.send({
          type: ErrorTypes.PERFORMANCE,
          time: getTimestamp(),
          message: 'Page Load Performance Metrics',
          url: getLocationHref(),
          level: Severity.Low,
          data: pageLoadData
        });
      }, 0);
    });
  }

  /**
   * 监控资源加载性能
   */
  private initResourceLoad(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      const resourceData = entries.map(entry => this.formatResourceTiming(entry));

      // 记录用户行为
      breadcrumb.push({
        type: BreadcrumbTypes.PERFORMANCE,
        message: 'Resource Load Performance',
        data: resourceData
      });

      // 上报资源加载数据
      transportData.send({
        type: ErrorTypes.PERFORMANCE,
        time: getTimestamp(),
        message: 'Resource Load Performance Metrics',
        url: getLocationHref(),
        level: Severity.Low,
        data: {
          resources: resourceData
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * 格式化资源加载数据
   */
  private formatResourceTiming(entry: PerformanceResourceTiming): ResourceTiming {
    return {
      name: entry.name,
      initiatorType: entry.initiatorType,
      duration: entry.duration,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize
    };
  }

  /**
   * 获取页面大小
   */
  private getPageSize(): number {
    const resources = performance.getEntriesByType('resource');
    return resources.reduce((total, resource: any) => {
      return total + (resource.transferSize || 0);
    }, 0);
  }
}

export const pageLoadMonitor = new PageLoadMonitor(); 