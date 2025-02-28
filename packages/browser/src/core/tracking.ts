import { transportData } from './transport';
import { getLocationHref, getTimestamp } from '../utils';
import { ErrorTypes } from '../types';

interface TrackingData {
    eventType: string; // 事件类型，例如 'click', 'navigation', 'page_view'
    timestamp: number; // 事件发生的时间戳
    url: string;       // 当前页面的URL
    userId?: string;  // 用户ID（如果有的话）
    additionalData?: any; // 其他附加数据
  }

class Tracking {
  constructor() {
    this.init();
  }

  private init(): void {
    this.initPageView();
    this.initClickTracking();
  }

  /**
   * 监听页面加载
   */
  private initPageView(): void {
    window.addEventListener('load', () => {
      this.trackEvent({
        eventType: 'page_view',
        timestamp: getTimestamp(),
        url: getLocationHref()
      });
    });
  }

  /**
   * 监听点击事件
   */
  private initClickTracking(): void {
    window.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const trackingData: TrackingData = {
        eventType: 'click',
        timestamp: getTimestamp(),
        url: getLocationHref(),
        additionalData: {
          element: target.tagName.toLowerCase(),
          id: target.id,
          className: target.className,
          text: target.textContent?.trim()
        }
      };

      this.trackEvent(trackingData);
    });
  }

  /**
   * 上报埋点事件
   */
  private trackEvent(data: TrackingData): void {
    // 记录用户行为
    console.log('Tracking Event:', data);

    // 上报埋点数据
    transportData.send({
      type: ErrorTypes.TRACKING_EVENT,
      time: data.timestamp,
      message: data.eventType,
      url: data.url,
      data: data.additionalData
    });
  }
}

export const tracking = new Tracking(); 