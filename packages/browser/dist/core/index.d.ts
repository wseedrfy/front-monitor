import { InitOptions } from '../types';

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
export declare function init(options?: InitOptions): void;
