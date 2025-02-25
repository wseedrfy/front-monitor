import { InitOptions, ReportDataType } from '../types';
import { Queue } from './queue';
import { nativeTryCatch } from '../utils';
import { loggers } from '../utils/logger';

const logger = loggers.transport;

class TransportData {
  private queue: Queue;
  private beforeDataReport: ((data: ReportDataType) => Promise<ReportDataType | null> | ReportDataType | null) | null = null;
  private dsn = '';
  private apikey = '';
  private useImgUpload = false;
  
  // 新增配置项
  private enabled = true;
  private enabledError = true;
  private enabledPerformance = true;
  private enabledBehavior = true;
  private enabledNetwork = true;

  constructor() {
    this.queue = new Queue();
  }

  /**
   * 图片上报
   */
  private imgRequest(data: ReportDataType, url: string): void {
    const requestFn = () => {
      const img = new Image();
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
      
      img.onload = img.onerror = () => {
        // 不需要手动设置为null，让垃圾回收自己处理
        img.onload = img.onerror = null;
      }
    };
    this.queue.addFn(requestFn);
  }

  /**
   * xhr请求上报
   */
  private async xhrPost(data: ReportDataType, url: string) {
    const requestFn = (): void => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(JSON.stringify(data));
    };
    this.queue.addFn(requestFn);
  }

  /**
   * 发送数据到服务端
   */
  async send(data: ReportDataType) {
    if (!this.enabled) {
      logger.debug(`[${data.type}] 数据上报已全局禁用`);
      return;
    }

    if (
      (data.type.includes('ERROR') && !this.enabledError) ||
      (data.type === 'PERFORMANCE' && !this.enabledPerformance) ||
      (data.type === 'BEHAVIOR' && !this.enabledBehavior) ||
      (data.type.includes('NETWORK') && !this.enabledNetwork)
    ) {
      logger.debug(`[${data.type}] 该类型的数据上报已禁用`);
      return;
    }

    if (!this.dsn) {
      logger.error('缺少上报地址(dsn)配置');
      return;
    }

    logger.debug(`准备上报 ${data.type} 数据:`, data);

    // 上报前的hook
    if (typeof this.beforeDataReport === 'function') {
      const result = await this.beforeDataReport(data);
      if (!result) {
        logger.debug('数据被beforeDataReport过滤');
        return;
      }
      data = result;
    }

    if (this.useImgUpload) {
      logger.debug('使用图片上报');
      return this.imgRequest(data, this.dsn);
    }
    
    logger.debug('使用XHR上报');
    return this.xhrPost(data, this.dsn);
  }

  bindOptions(options: InitOptions = {}): void {
    const { 
      dsn, 
      beforeDataReport, 
      apikey, 
      useImgUpload,
      enabled,
      enabledError,
      enabledPerformance,
      enabledBehavior,
      enabledNetwork
    } = options;
    
    if (typeof dsn === 'string') {
      this.dsn = dsn;
    }
    
    if (typeof apikey === 'string') {
      this.apikey = apikey;
    }

    if (typeof useImgUpload === 'boolean') {
      this.useImgUpload = useImgUpload;
    }
    
    if (typeof beforeDataReport === 'function') {
      this.beforeDataReport = beforeDataReport;
    }

    // 绑定新增配置项
    if (typeof enabled === 'boolean') {
      this.enabled = enabled;
    }

    if (typeof enabledError === 'boolean') {
      this.enabledError = enabledError;
    }

    if (typeof enabledPerformance === 'boolean') {
      this.enabledPerformance = enabledPerformance;
    }

    if (typeof enabledBehavior === 'boolean') {
      this.enabledBehavior = enabledBehavior;
    }

    if (typeof enabledNetwork === 'boolean') {
      this.enabledNetwork = enabledNetwork;
    }
  }
}

export const transportData = new TransportData(); 