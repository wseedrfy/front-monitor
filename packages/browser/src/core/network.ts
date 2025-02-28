import { ErrorTypes, Severity } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { transportData } from './transport';
import { getLocationHref, getTimestamp } from '../utils';
import { loggers } from '../utils/logger';

const logger = loggers.network;

interface NetworkStatus {
  online: boolean;
  effectiveType?: string;  // 网络类型 4g/3g/2g
  downlink?: number;       // 下行速度
  rtt?: number;           // 往返时间
  saveData?: boolean;     // 是否开启省流量模式
}

export class NetworkMonitor {
  private lastStatus: NetworkStatus;

  constructor() {
    logger.debug('网络监控初始化...');
    this.lastStatus = {
      online: navigator.onLine
    };
    this.init();
  }

  private init(): void {
    logger.debug('开始监听网络状态...');
    this.initOnlineStatus();
    this.initConnectionInfo();
    logger.debug('网络监控初始化完成');
  }

  /**
   * 监控在线状态
   */
  private initOnlineStatus(): void {
    logger.debug('监听在线状态变化');
    window.addEventListener('online', () => {
      logger.debug('网络已连接');
      this.handleNetworkChange({ online: true });
    });

    window.addEventListener('offline', () => {
      logger.debug('网络已断开');
      this.handleNetworkChange({ online: false });
    });
  }

  /**
   * 监控网络信息
   */
  private initConnectionInfo(): void {
    // 获取网络信息API
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (!connection) {
      logger.debug('浏览器不支持网络信息API');
      return;
    }

    logger.debug('当前网络状态:', {
      type: connection.effectiveType,
      downlink: connection.downlink + 'Mbps',
      rtt: connection.rtt + 'ms',
      saveData: connection.saveData ? '开启' : '关闭'
    });

    // 初始化网络状态
    this.handleNetworkChange({
      online: navigator.onLine,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });

    // 监听网络变化
    connection.addEventListener('change', () => {
      logger.debug('网络状态变化:', {
        type: connection.effectiveType,
        downlink: connection.downlink + 'Mbps',
        rtt: connection.rtt + 'ms'
      });
      
      this.handleNetworkChange({
        online: navigator.onLine,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });
    });
  }

  /**
   * 处理网络状态变化
   */
  private handleNetworkChange(status: NetworkStatus): void {
    // 检查状态是否有变化
    if (this.isStatusChanged(status)) {
      logger.debug('网络状态发生变化:', {
        from: this.lastStatus,
        to: status
      });
      
      // 记录用户行为
      breadcrumb.push({
        type: BreadcrumbTypes.PERFORMANCE,
        message: 'Network Status Changed',
        data: status
      });

      // 上报网络状态
      transportData.send({
        type: ErrorTypes.PERFORMANCE,
        time: getTimestamp(),
        message: 'Network Status Changed',
        url: getLocationHref(),
        level: status.online ? Severity.Low : Severity.High,
        data: {
          from: this.lastStatus,
          to: status
        }
      });

      // 更新状态
      this.lastStatus = { ...status };
    }
  }

  /**
   * 检查网络状态是否发生变化
   */
  private isStatusChanged(newStatus: NetworkStatus): boolean {
    return Object.keys(newStatus).some(key => {
      return newStatus[key as keyof NetworkStatus] !== 
             this.lastStatus[key as keyof NetworkStatus];
    });
  }

  /**
   * 获取当前网络状态
   */
  public getNetworkStatus(): NetworkStatus {
    return { ...this.lastStatus };
  }
}

export const networkMonitor = new NetworkMonitor(); 