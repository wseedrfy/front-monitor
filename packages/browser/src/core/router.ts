import { ErrorTypes, Severity } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { getLocationHref, getTimestamp } from '../utils';
import { transportData } from './transport';

interface RouteRecord {
  from: string;
  to: string;
  time: number;
}

interface HistoryState {
  data: any;
  title: string;
  url?: string | URL | null;
}

export class Router {
  private lastHref: string;

  constructor() {
    this.lastHref = getLocationHref();
    this.init();
  }

  private init(): void {
    this.initHistory();
    this.initHash();
  }

  /**
   * 监听history路由变化
   */
  private initHistory(): void {
    if (!window.history) return;

    // 重写pushState
    const originalPushState = window.history.pushState;
    const self = this; // 保存this引用

    window.history.pushState = function(
      data: any,
      unused: string,
      url?: string | URL | null
    ): void {
      if (url) {
        const from = getLocationHref();
        originalPushState.call(this, data, unused, url);
        const to = url.toString();
        self.recordRouteChange(from, to);
      } else {
        originalPushState.call(this, data, unused);
      }
    };

    // 重写replaceState
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(
      data: any,
      unused: string,
      url?: string | URL | null
    ): void {
      if (url) {
        const from = getLocationHref();
        originalReplaceState.call(this, data, unused, url);
        const to = url.toString();
        self.recordRouteChange(from, to);
      } else {
        originalReplaceState.call(this, data, unused);
      }
    };

    // 监听popstate
    window.addEventListener('popstate', () => {
      const to = getLocationHref();
      const from = this.lastHref;
      this.recordRouteChange(from, to);
    });
  }

  /**
   * 监听hash路由变化
   */
  private initHash(): void {
    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      const { oldURL, newURL } = e;
      this.recordRouteChange(oldURL, newURL);
    });
  }

  /**
   * 记录路由变化
   */
  private recordRouteChange(from: string, to: string): void {
    const routeRecord: RouteRecord = {
      from,
      to,
      time: getTimestamp()
    };

    // 更新lastHref
    this.lastHref = to;

    // 记录用户行为
    breadcrumb.push({
      type: BreadcrumbTypes.ROUTE,
      message: `Route changed from ${from} to ${to}`,
      data: routeRecord
    });

    // 上报路由变化
    transportData.send({
      type: ErrorTypes.ROUTE_ERROR,
      time: getTimestamp(),
      message: `Route changed from ${from} to ${to}`,
      url: to,
      name: 'route-change'
    });
  }
}

export const router = new Router(); 