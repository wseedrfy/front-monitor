import { InitOptions } from '../types';
import { loggers } from '../utils/logger';
import { setupReplace } from './replace';
import { breadcrumb } from './breadcrumb';
import { transportData } from './transport';
import { performance } from './performance';
import { router } from './router';
import { behavior } from './behavior';
import { errorMonitor } from './error';
import { pageLoadMonitor } from './pageLoad';
import { networkMonitor } from './network';
import { tracking } from './tracking'; // 导入埋点模块

/**
 * SDK功能模块说明：
 * 
 * 1. 错误监控 (errorMonitor)
 * - JS执行错误
 * - Promise异常
 * - 资源加载错误
 * - 控制台错误
 * - 内存溢出
 * - WebSocket错误
 * - React错误边界
 * - Vue错误处理
 * 
 * 2. 性能监控 (performance & pageLoadMonitor)
 * - 页面加载性能
 *   - FP (First Paint)
 *   - FCP (First Contentful Paint)
 *   - LCP (Largest Contentful Paint)
 * - 资源加载性能
 * - 接口请求性能
 * - 内存使用情况
 * 
 * 3. 用户行为监控 (behavior)
 * - 点击事件
 * - 路由变化
 * - 页面滚动
 * - 页面可见性
 * - 用户行为回溯
 * 
 * 4. 网络请求监控 (networkMonitor)
 * - XHR请求
 * - Fetch请求
 * - WebSocket连接
 * - 网络状态变化
 * 
 * 5. 数据处理 (transportData)
 * - 数据上报
 * - 数据缓存
 * - 数据过滤
 * - 图片上报
 * - XHR上报
 * 
 * 6. 用户行为追踪 (breadcrumb)
 * - 行为记录
 * - 错误现场回溯
 * - 用户操作轨迹
 */

export function init(options: InitOptions = {}) {
  // 设置所有模块的日志开关
  Object.values(loggers).forEach(logger => {
    logger.enable(options.debug || false);
  });

  loggers.core.log('SDK初始化开始...');
  
  // 初始化配置
  transportData.bindOptions(options);
  breadcrumb.bindOptions(options);
  
  loggers.core.log('配置绑定完成');
  
  // 开始监听各类事件
  setupReplace();
  loggers.core.log('事件监听已设置');
  
  // 初始化各个监控器
  performance;    // 性能监控
  router;        // 路由监控
  behavior;      // 用户行为监控
  errorMonitor;  // 错误监控
  pageLoadMonitor; // 页面加载监控
  networkMonitor;  // 网络监控
  
  // 初始化埋点
  tracking; // 确保埋点模块被初始化
  
  loggers.core.log('所有监控器已初始化');
  loggers.core.debug('当前配置:', options);
}