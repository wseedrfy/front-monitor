import { EventTypes, ErrorTypes } from '../types';
import { getFlag, setFlag, nativeTryCatch, getTimestamp, getLocationHref } from '../utils/index';
import { BreadcrumbTypes } from './breadcrumb';
import { breadcrumb } from './breadcrumb';
import { Severity } from '../types';
import { transportData } from './transport';

// 存储重写事件的处理函数
const handlers: { [key in EventTypes]?: Function[] } = {};

// 定义请求数据类型
interface RequestData {
  type: 'xhr' | 'fetch';
  method: string;
  url: string;
  sTime: number;
  elapsedTime?: number;
  status?: number;
  response?: any;
  requestData?: any;
}

// 订阅事件处理函数
export function subscribeEvent(handler: { 
  callback: Function;
  type: EventTypes;
}): boolean {
  if (!handler || getFlag(handler.type)) return false;
  
  setFlag(handler.type, true);
  handlers[handler.type] = handlers[handler.type] || [];
  (handlers[handler.type] as Function[]).push(handler.callback);
  return true;
}

// 触发处理函数
export function triggerHandlers(type: EventTypes, data: any): void {
  if (!type || !handlers[type]) return;
  
  handlers[type].forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data);
      },
      (e: Error) => {
        console.error(`事件处理发生错误\nType:${type}\nError: ${e}`);
      },
    );
  });
}

// 监听全局错误
function listenError(): void {
  window.addEventListener(
    'error',
    function (e: ErrorEvent) {
      // 区分资源加载错误和JS错误
      if (e.target && (e.target as HTMLElement).nodeName) {
        const target = e.target as HTMLElement;
        // 资源加载错误
        breadcrumb.push({
          type: BreadcrumbTypes.ERROR,
          message: `Resource Load Error: ${(target as any).src || (target as any).href}`,
          data: {
            type: ErrorTypes.RESOURCE_ERROR,
            url: (target as any).src || (target as any).href,
            html: target.outerHTML,
            elementType: target.nodeName.toLowerCase()
          }
        });

        transportData.send({
          type: ErrorTypes.RESOURCE_ERROR,
          message: `Resource Load Error: ${(target as any).src || (target as any).href}`,
          url: getLocationHref(),
          time: getTimestamp(),
          level: Severity.High,
          data: {
            resourceUrl: (target as any).src || (target as any).href,
            resourceType: target.nodeName.toLowerCase(),
            html: target.outerHTML
          }
        });
      } else {
        // JS错误
        breadcrumb.push({
          type: BreadcrumbTypes.ERROR,
          message: e.message || 'Unknown error',
          data: {
            type: ErrorTypes.JAVASCRIPT_ERROR,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error?.stack
          }
        });

        transportData.send({
          type: ErrorTypes.JAVASCRIPT_ERROR,
          message: e.message,
          url: getLocationHref(),
          time: getTimestamp(),
          level: Severity.High,
          stack: e.error?.stack,
          data: {
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
          }
        });
      }
    },
    true
  );
}

// 监听Promise错误
function listenUnhandledrejection(): void {
  window.addEventListener(
    'unhandledrejection', 
    function (e: PromiseRejectionEvent) {
      // 获取Promise的错误信息
      const { reason } = e;
      let message = '';
      let stack = '';
      
      if (typeof reason === 'string') {
        message = reason;
      } else if (reason instanceof Error) {
        message = reason.message;
        stack = reason.stack || '';
      } else if (typeof reason === 'object') {
        message = reason.message || JSON.stringify(reason);
        stack = reason.stack || '';
      }

      // 记录用户行为
      breadcrumb.push({
        type: BreadcrumbTypes.ERROR,
        message: `Promise Error: ${message}`,
        data: {
          type: ErrorTypes.PROMISE_ERROR,
          message,
          stack
        }
      });
      
      // 上报错误
      transportData.send({
        type: ErrorTypes.PROMISE_ERROR,
        message: `Unhandled Promise Rejection: ${message}`,
        stack,
        time: getTimestamp(),
        url: getLocationHref(),
        level: Severity.High
      });
    },
    true
  );
}

// 重写XMLHttpRequest
function xhrReplace(): void {
  if (!('XMLHttpRequest' in window)) return;
  
  const originalXhrProto = XMLHttpRequest.prototype;
  
  // 重写 open 方法
  const originalOpen = originalXhrProto.open;
  originalXhrProto.open = function(method: string, url: string): void {
    const xhr = this;
    const requestData: RequestData = {
      type: 'xhr',
      method: method.toUpperCase(),
      url,
      sTime: getTimestamp()
    };
    
    // 保存请求数据
    (xhr as any).__requestData = requestData;
    
    originalOpen.apply(xhr, arguments as any);
  };
  
  // 重写 send 方法
  const originalSend = originalXhrProto.send;
  originalXhrProto.send = function(body: Document | XMLHttpRequestBodyInit | null): void {
    const xhr = this;
    const requestData = (xhr as any).__requestData;
    
    if (requestData) {
      requestData.requestData = body;
      
      // 监听请求完成
      xhr.addEventListener('loadend', function() {
        const endTime = getTimestamp();
        requestData.elapsedTime = endTime - requestData.sTime;
        requestData.status = xhr.status;
        requestData.response = xhr.response;
        
        // 记录用户行为
        breadcrumb.push({
          type: BreadcrumbTypes.XHR,
          message: `${requestData.method} ${requestData.url}`,
          data: requestData
        });
        
        // 如果是错误状态码,上报错误
        if (xhr.status >= 400) {
          const errorData = {
            type: ErrorTypes.FETCH_ERROR,
            message: `${requestData.method} ${requestData.url} Status: ${xhr.status}`,
            url: getLocationHref(),
            time: getTimestamp(),
            level: Severity.Low,
            request: {
              method: requestData.method,
              url: requestData.url,
              data: requestData.requestData
            },
            response: {
              status: xhr.status,
              data: xhr.response
            }
          };
          
          transportData.send(errorData);
        }
      });
    }
    
    originalSend.apply(xhr, arguments as any);
  };
}

// 重写Fetch
function fetchReplace(): void {
  if (!('fetch' in window)) return;
  
  const originalFetch = window.fetch;
  
  window.fetch = function(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const sTime = getTimestamp();
    const method = (init?.method || 'GET').toUpperCase();
    const url = typeof input === 'string' 
      ? input 
      : input instanceof URL 
        ? input.href 
        : input.url;
    
    const requestData: RequestData = {
      type: 'fetch',
      method,
      url,
      sTime,
      requestData: init?.body
    };
    
    // 记录请求开始
    breadcrumb.push({
      type: BreadcrumbTypes.XHR,
      message: `${method} ${url}`,
      data: requestData
    });
    
    return originalFetch.apply(window, arguments as any)
      .then(async (response) => {
        const endTime = getTimestamp();
        requestData.elapsedTime = endTime - sTime;
        requestData.status = response.status;
        
        try {
          requestData.response = await response.clone().text();
        } catch (e) {
          requestData.response = 'Failed to read response body';
        }
        
        // 如果是错误状态码，记录错误
        if (!response.ok) {
          breadcrumb.push({
            type: BreadcrumbTypes.ERROR,
            message: `HTTP Error: ${method} ${url} ${response.status}`,
            data: requestData
          });

          transportData.send({
            type: ErrorTypes.FETCH_ERROR,
            message: `HTTP Error ${response.status}: ${method} ${url}`,
            url: getLocationHref(),
            time: getTimestamp(),
            level: Severity.High,
            request: {
              method,
              url,
              data: init?.body
            },
            response: {
              status: response.status,
              data: requestData.response
            }
          });
        }
        
        return response;
      })
      .catch((error) => {
        const endTime = getTimestamp();
        requestData.elapsedTime = endTime - sTime;
        requestData.status = 0;
        requestData.response = error.message;
        
        // 记录网络错误
        breadcrumb.push({
          type: BreadcrumbTypes.ERROR,
          message: `Network Error: ${method} ${url}`,
          data: requestData
        });

        transportData.send({
          type: ErrorTypes.FETCH_ERROR,
          message: `Network Error: ${method} ${url} - ${error.message}`,
          url: getLocationHref(),
          time: getTimestamp(),
          level: Severity.High,
          request: {
            method,
            url,
            data: init?.body
          },
          response: {
            status: 0,
            data: error.message
          }
        });
        
        throw error;
      });
  };
}

// 修改初始化函数
export function setupReplace(): void {
  listenError();
  listenUnhandledrejection();
  xhrReplace();
  fetchReplace();
} 