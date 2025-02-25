import { InitOptions } from '../types';
import { getTimestamp, nativeTryCatch } from '../utils';

export enum BreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'Click',
  XHR = 'Xhr',
  ERROR = 'Error',
  CUSTOM = 'Custom',
  PERFORMANCE = 'Performance'
}

export interface BreadcrumbData {
  type: BreadcrumbTypes;
  message: string;
  time?: number;
  data?: any;
}

export class Breadcrumb {
  private maxBreadcrumbs: number = 10;
  private stack: BreadcrumbData[] = [];
  private beforePushBreadcrumb: ((breadcrumb: Breadcrumb, data: BreadcrumbData) => BreadcrumbData | null) | null = null;

  constructor() {}

  /**
   * 添加用户行为
   */
  push(data: BreadcrumbData): void {
    if (typeof this.beforePushBreadcrumb === 'function') {
      const result = this.beforePushBreadcrumb(this, data);
      if (!result) return;
      this.immediatePush(result);
      return;
    }
    this.immediatePush(data);
  }

  private immediatePush(data: BreadcrumbData): void {
    data.time = data.time || getTimestamp();
    
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
    this.stack.sort((a, b) => a.time! - b.time!);
  }

  private shift(): boolean {
    return this.stack.shift() !== undefined;
  }

  getStack(): BreadcrumbData[] {
    return this.stack;
  }

  bindOptions(options: InitOptions = {}): void {
    const { maxBreadcrumbs, beforePushBreadcrumb } = options;
    
    if (typeof maxBreadcrumbs === 'number') {
      this.maxBreadcrumbs = maxBreadcrumbs;
    }
    
    if (typeof beforePushBreadcrumb === 'function') {
      this.beforePushBreadcrumb = beforePushBreadcrumb;
    }
  }
}

export const breadcrumb = new Breadcrumb(); 