/**
 * 监控SDK入口文件
 * @packageDocumentation
 */

import { init } from './core';
import { ErrorBoundary } from './plugins/react';
import { MonitorVue } from './plugins/vue';
import { breadcrumb , BreadcrumbTypes } from './core/breadcrumb';
import { loggers } from './utils/logger';
import { log } from './core/log';
import type {   
  InitOptions,
  ReportDataType,
  PerformanceMetrics,
} from './types';
import {
  ErrorTypes,
  EventTypes,
  Severity
} from './types';

// 导出核心功能
export {
  init,
  log,
  breadcrumb,
  loggers,
  ErrorBoundary,
  MonitorVue,
  // 导出枚举
  ErrorTypes,
  EventTypes,
  Severity,
  BreadcrumbTypes
};

// 导出类型
export type {
  InitOptions,
  ReportDataType,
  PerformanceMetrics
};

/**
 * 使用示例:
 * 
 * 1. 基础使用:
 * ```ts
 * import { init } from '@monitor/browser';
 * 
 * init({
 *   dsn: 'https://your-monitor-server.com/api/errors',
 *   apikey: 'your-project-key'
 * });
 * ```
 * 
 * 2. React错误边界:
 * ```tsx
 * import { ErrorBoundary } from '@monitor/browser';
 * 
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * 3. Vue错误处理:
 * ```ts
 * import { MonitorVue } from '@monitor/browser';
 * import Vue from 'vue';
 * 
 * Vue.use(MonitorVue);
 * ```
 */
// 初始化SDK - 修改这里的配置
// init({
//   // 错误上报接口地址
//   dsn: 'https://your-monitor-server.com/api/errors',
//   // 项目唯一标识
//   apikey: 'your-project-key',
//   // 是否使用图片上报(可选,默认false)
//   useImgUpload: false,
//   // 数据上报前的hook(可选)
//   beforeDataReport: (data) => {
//     // 可以在这里对上报数据进行修改
//     return data;
//   },
//   // 用户行为栈最大长度(可选,默认10)
//   maxBreadcrumbs: 20
// });

// // 此时如果发生JS错误,会被捕获并上报
// throw new Error('测试错误');
