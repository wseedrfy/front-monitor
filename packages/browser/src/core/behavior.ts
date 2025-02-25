import { EventTypes, ErrorTypes } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { getLocationHref, getTimestamp } from '../utils';
import { transportData } from './transport';

interface BehaviorRecord {
  type: string;
  message: string;
  data: any;
  time: number;
}

export class Behavior {
  private lastClick: number = 0;
  private clickThrottle: number = 300; // 点击事件节流时间(ms)

  constructor() {
    this.init();
  }

  private init(): void {
    this.initClick();
    this.initScroll();
    this.initVisibility();
  }

  /**
   * 监听点击事件
   */
  private initClick(): void {
    window.addEventListener('click', (event: MouseEvent) => {
      const now = getTimestamp();
      // 节流处理
      if (now - this.lastClick < this.clickThrottle) return;
      this.lastClick = now;

      const target = event.target as HTMLElement;
      if (!target) return;

      // 获取点击元素的相关信息
      const behavior: BehaviorRecord = {
        type: 'click',
        message: this.getElementInfo(target),
        data: {
          x: event.x,
          y: event.y,
          path: this.getElementPath(target)
        },
        time: now
      };

      this.recordBehavior(behavior);
    }, true);
  }

  /**
   * 监听滚动事件
   */
  private initScroll(): void {
    let scrollTimeout: number | null = null;
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;

      scrollTimeout = window.setTimeout(() => {
        const behavior: BehaviorRecord = {
          type: 'scroll',
          message: 'Page scrolled',
          data: {
            scrollX: window.scrollX,
            scrollY: window.scrollY
          },
          time: getTimestamp()
        };

        this.recordBehavior(behavior);
        scrollTimeout = null;
      }, 500);
    }, true);
  }

  /**
   * 监听页面可见性变化
   */
  private initVisibility(): void {
    document.addEventListener('visibilitychange', () => {
      const behavior: BehaviorRecord = {
        type: 'visibility',
        message: `Page ${document.hidden ? 'hidden' : 'visible'}`,
        data: {
          hidden: document.hidden,
          visibilityState: document.visibilityState
        },
        time: getTimestamp()
      };

      this.recordBehavior(behavior);
    });
  }

  /**
   * 获取元素的相关信息
   */
  private getElementInfo(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.replace(/\s+/g, '.')}` : '';
    const text = element.textContent ? element.textContent.slice(0, 20) : '';
    
    return `${tagName}${id}${className}${text ? `: "${text}"` : ''}`;
  }

  /**
   * 获取元素的路径
   */
  private getElementPath(element: HTMLElement): string[] {
    const path: string[] = [];
    let current: HTMLElement | null = element;
    
    while (current && current !== document.documentElement) {
      path.push(this.getElementInfo(current));
      current = current.parentElement;
    }
    
    return path;
  }

  /**
   * 记录用户行为
   */
  private recordBehavior(behavior: BehaviorRecord): void {
    // 记录用户行为
    breadcrumb.push({
      type: BreadcrumbTypes.CLICK,
      message: behavior.message,
      data: behavior
    });

    // 上报用户行为
    transportData.send({
      type: ErrorTypes.BEHAVIOR,
      time: behavior.time,
      message: behavior.message,
      url: getLocationHref(),
      name: `user-${behavior.type}`,
      behavior: behavior
    });
  }
}

export const behavior = new Behavior(); 