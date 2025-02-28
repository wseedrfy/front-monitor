import { init } from './core';
import { ErrorBoundary } from './plugins/react';
import { MonitorVue } from './plugins/vue';
import { breadcrumb, BreadcrumbTypes } from './core/breadcrumb';
import { loggers } from './utils/logger';
import { log } from './core/log';
import { InitOptions, ReportDataType, PerformanceMetrics, ErrorTypes, EventTypes, Severity } from './types';

export { init, log, breadcrumb, loggers, ErrorBoundary, MonitorVue, ErrorTypes, EventTypes, Severity, BreadcrumbTypes };
export type { InitOptions, ReportDataType, PerformanceMetrics };
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
