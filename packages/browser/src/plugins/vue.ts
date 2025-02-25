import { ErrorTypes, Severity } from '../types';
import { breadcrumb, BreadcrumbTypes } from '../core/breadcrumb';
import { transportData } from '../core/transport';
import { getLocationHref, getTimestamp } from '../utils';

type VueInstance = any; // Vue 实例类型
type ViewModel = any;   // Vue 组件实例类型

/**
 * 处理Vue错误
 */
function handleVueError(
  err: Error,
  vm: ViewModel,
  info: string,
  level: Severity,
  Vue: VueInstance
): void {
  const version = Vue?.version || 'unknown';
  
  // 生成错误信息
  const errorInfo = {
    type: ErrorTypes.VUE_ERROR,
    message: `${err.message}\ninfo: ${info}`,
    level,
    url: getLocationHref(),
    name: err.name,
    stack: err.stack,
    time: getTimestamp(),
    componentName: vm?.$options?._componentTag || 'anonymous',
    propsData: vm?.$options?.propsData,
    vueVersion: version
  };

  // 记录用户行为
  breadcrumb.push({
    type: BreadcrumbTypes.ERROR,
    message: errorInfo.message,
    data: errorInfo
  });

  // 上报错误
  transportData.send(errorInfo);
}

/**
 * Vue错误处理插件
 * 用法:
 * import { MonitorVue } from '@monitor/browser';
 * Vue.use(MonitorVue);
 */
export const MonitorVue = {
  install(Vue: VueInstance): void {
    if (!Vue || !Vue.config) return;
    
    // 保存原始的错误处理函数
    const originalErrorHandler = Vue.config.errorHandler;

    // 重写Vue的错误处理
    Vue.config.errorHandler = function(err: Error, vm: ViewModel, info: string): void {
      handleVueError(err, vm, info, Severity.Normal, Vue);

      // 调用原始错误处理
      if (typeof originalErrorHandler === 'function') {
        originalErrorHandler.call(this, err, vm, info);
      }

      // 在控制台显示错误
      if (console && !Vue.config.silent) {
        console.error('Vue Error Info: ', err);
      }
    };
  }
}; 