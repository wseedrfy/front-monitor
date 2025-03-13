# @monitor/browser

一个轻量级、高性能的前端监控SDK，支持错误监控、性能监控、用户行为监控等功能。

## 项目架构

#### backend -- 监控系统后端

运行的时候需要把backend/src/config/db.ts 改成 database.ts

#### monitor-dashboard -- 监控系统看板

#### monitor-test -- 测试sdk监控效果的前端项目

#### packages/browser -- 浏览器前端监控的sdk

## 功能特点

### 🔨 错误监控

- JavaScript执行错误
- Promise异常捕获
- 资源加载错误(img, script, css等)
- 网络请求异常(XMLHttpRequest, Fetch)
- React错误边界
- Vue错误处理
- 控制台错误
- 内存溢出
- WebSocket错误

### 📊 性能监控

- 首次绘制(FP)
- 首次内容绘制(FCP)
- 最大内容绘制(LCP)
- 首次输入延迟(FID)
- 累积布局偏移(CLS)
- DOM加载时间
- 页面完全加载时间
- 资源加载性能
- 内存使用情况

### 🔍 用户行为追踪

- 页面路由变化
- 用户点击事件
- 页面滚动
- 页面可见性变化
- 用户行为回溯
- 错误发生时的用户操作

### 📡 网络监控

- 在线/离线检测
- 网络类型识别(4g/3g/2g)
- 网络速度
- 网络延迟(RTT)
- 流量使用情况

## 安装

```bash
npm install @monitor/browser
# 或者
yarn add @monitor/browser
# 或者
pnpm add @monitor/browser
```

## 快速开始

### 基础配置

```javascript
import { init } from '@monitor/browser';

init({
  // 基础配置
  dsn: 'http://localhost:3000/api/errors', // 上报接口地址
  apikey: 'project-key',                   // 项目标识
  
  // 日志配置
  debug: true,                             // 是否开启调试日志
  
  // 数据上报配置
  enabled: true,                           // 是否启用数据上报(总开关)
  useImgUpload: false,                     // 是否使用图片上报(默认XHR)
  
  // 各类型数据上报开关
  enabledError: true,                      // 是否上报错误
  enabledPerformance: true,                // 是否上报性能数据
  enabledBehavior: true,                   // 是否上报用户行为
  enabledNetwork: true,                    // 是否上报网络请求
  
  // 用户行为配置
  maxBreadcrumbs: 20,                     // 用户行为栈最大长度
  
  // 数据处理hooks
  beforeDataReport: (data) => {
    // 上报前数据处理
    console.log('准备上报数据:', data);
  
    // 可以修改上报数据
    data.customField = 'test';
  
    // 返回false则取消上报
    // return false;
  
    // 返回处理后的数据
    return data;
  },
  
  // 用户行为处理hook
  beforePushBreadcrumb: (breadcrumb, data) => {
    // 记录用户行为前的处理
    console.log('记录用户行为:', data);
  
    // 可以修改行为数据
    data.customField = 'test';
  
    // 返回false则不记录该行为
    // return false;
  
    // 返回处理后的数据
    return data;
  }
})
```

### React集成

```jsx
import { ErrorBoundary } from '@monitor/browser';

function App() {
  return (
    <ErrorBoundary 
      fallback={<div>出错了</div>}
      onError={(error, errorInfo) => {
        // 自定义错误处理
        console.log(error, errorInfo);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Vue集成

```javascript
import { MonitorVue } from '@monitor/browser';
import Vue from 'vue';

Vue.use(MonitorVue);
```

## API文档

### init 配置项


| 配置项               | 类型     | 必填 | 默认值 | 说明             |
| -------------------- | -------- | ---- | ------ | ---------------- |
| dsn                  | string   | 是   | -      | 错误上报接口地址 |
| apikey               | string   | 是   | -      | 项目唯一标识     |
| useImgUpload         | boolean  | 否   | false  | 使用图片上报     |
| maxBreadcrumbs       | number   | 否   | 10     | 行为栈长度       |
| beforeDataReport     | function | 否   | -      | 上报前处理       |
| beforePushBreadcrumb | function | 否   | -      | 行为记录前处理   |

### 错误类型

```typescript
enum ErrorTypes {
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',  // JS错误
  RESOURCE_ERROR = 'RESOURCE_ERROR',      // 资源错误
  PROMISE_ERROR = 'PROMISE_ERROR',        // Promise错误
  FETCH_ERROR = 'FETCH_ERROR',           // 请求错误
  VUE_ERROR = 'VUE_ERROR',              // Vue错误
  REACT_ERROR = 'REACT_ERROR',           // React错误
  LOG_ERROR = 'LOG_ERROR',               // 自定义错误
  PERFORMANCE = 'PERFORMANCE',           // 性能指标
  ROUTE_ERROR = 'ROUTE_ERROR',           // 路由错误
  BEHAVIOR = 'BEHAVIOR',                 // 用户行为
  CONSOLE_ERROR = 'CONSOLE_ERROR',       // 控制台错误
  WINDOW_ERROR = 'WINDOW_ERROR',         // 全局错误
  MEMORY_ERROR = 'MEMORY_ERROR',         // 内存错误
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'    // WebSocket错误
}
```

### 错误等级

```typescript
enum Severity {
  Critical = 'critical',   // 严重
  High = 'high',          // 高
  Normal = 'normal',      // 中
  Low = 'low'            // 低
}
```

### 上报数据格式

```typescript
interface ReportDataType {
  type: ErrorTypes;              // 错误类型
  message: string;              // 错误信息
  url: string;                  // 错误URL
  name?: string;               // 错误名称
  stack?: string;              // 错误堆栈
  time?: number;               // 时间戳
  level?: Severity;            // 错误等级
  // ... 更多字段见类型定义
}
```

## 高级用法

### 自定义错误上报

```javascript
import { log } from '@monitor/browser';

try {
  // 你的代码
} catch (error) {
  log({
    message: error.message,
    tag: 'business-error',
    level: 'high',
    ex: error
  });
}
```

### 性能指标监控

```javascript
import { performance } from '@monitor/browser';

// 性能指标会自动收集并上报
// 可以通过beforeDataReport配置过滤或修改性能数据
```

### 用户行为追踪

```javascript
import { breadcrumb } from '@monitor/browser';

// 获取用户行为栈
const behaviors = breadcrumb.getStack();

// 手动添加行为记录
breadcrumb.push({
  type: 'Custom',
  message: '用户触发了某个操作',
  data: { /* 自定义数据 */ }
});
```

## 浏览器支持

- Chrome >= 49
- Firefox >= 52
- Safari >= 10
- Edge >= 79
- IE 11(需要polyfill)

## 开发相关

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test               # 运行所有测试
npm run test:watch    # 监听模式
npm run test:coverage # 生成覆盖率报告
```

### 构建

```bash
npm run build
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (git checkout -b feature/AmazingFeature)
3. 提交更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 创建 Pull Request

## 许可证

MIT License

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础错误监控
- 支持性能监控
- 支持用户行为追踪
- 支持React和Vue集成
