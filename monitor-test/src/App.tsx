import { useEffect, useState } from 'react'
import { init, ErrorBoundary, loggers , breadcrumb , BreadcrumbTypes } from '@monitor/browser'

// SDK初始化
init({
  // 基础配置
  dsn: 'http://localhost:3031/api/errors',
  apikey: 'project-key',
  debug: true,
  
  // 暂时关闭数据上报
  enabled: true,
  enabledError: true,
  enabledPerformance: false,
  enabledBehavior: true,
  enabledNetwork: true,
  
  maxBreadcrumbs: 20,
  
  beforeDataReport: (data) => {
    console.log('准备上报数据:', data);
    return data;
  },
  
  beforePushBreadcrumb: (breadcrumb, data) => {
    console.log('记录用户行为:', data);
    return data;
  },
})

function TestComponent() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    
    // 记录点击行为
    breadcrumb.push({
      type: BreadcrumbTypes.CLICK,
      message: `Clicked button: ${count + 1}`,
      data: { count: count + 1 }
    })
  }

  const handleGetBreadcrumbs = () => {
    const breadcrumbs = breadcrumb.getBreadcrumbs()
    console.log('用户行为轨迹:', breadcrumbs)
  }

  return (
    <div>
      <h2>监控SDK测试</h2>
      
      {/* 测试按钮组 */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleClick}>
          计数器: {count}
        </button>
        <button onClick={handleGetBreadcrumbs}>获取用户行为轨迹</button> {/* 新增按钮 */}
      </div>

      {/* 错误测试按钮组 */}
      <div style={{ marginTop: '20px' }}>
        <h3>错误测试</h3>
        <button onClick={() => {
          throw new Error('测试JS错误');
        }}>JS错误</button>

        <button onClick={() => {
          Promise.reject('测试Promise错误');
        }}>Promise错误</button>

        <button onClick={() => {
          fetch('http://not-exist.com/');
        }}>请求错误</button>

        <button onClick={() => {
          const img = new Image();
          img.src = 'http://not-exist.com/image.jpg';
        }}>资源加载错误</button>

        <button onClick={() => {
          new WebSocket('ws://not-exist.com');
        }}>WebSocket错误</button>
      </div>

      {/* 日志查看按钮组 */}
      <div style={{ marginTop: '20px' }}>
        <h3>日志查看</h3>
        <button onClick={() => {
          console.log('=== 错误监控日志 ===');
          console.log(loggers.error.getLogs());
        }}>错误日志</button>

        <button onClick={() => {
          console.log('=== 性能监控日志 ===');
          console.log(loggers.performance.getLogs());
        }}>性能日志</button>

        <button onClick={() => {
          console.log('=== 用户行为日志 ===');
          console.log(loggers.behavior.getLogs());
        }}>行为日志</button>

        <button onClick={() => {
          console.log('=== 网络请求日志 ===');
          console.log(loggers.network.getLogs());
        }}>网络日志</button>

        <button onClick={() => {
          console.log('=== 数据上报日志 ===');
          console.log(loggers.transport.getLogs());
        }}>上报日志</button>

        <button onClick={() => {
          console.log('=== 所有模块日志 ===');
          Object.entries(loggers).forEach(([module, logger]) => {
            console.log(`\n${module}模块日志:`);
            console.log(logger.getLogs());
          });
        }}>查看所有日志</button>
      </div>

      {/* 日志导出按钮 */}
      <div style={{ marginTop: '20px' }}>
        <h3>日志导出</h3>
        <button onClick={() => {
          const allLogs = Object.entries(loggers).reduce((acc, [module, logger]) => {
            acc[module] = logger.getLogs();
            return acc;
          }, {} as Record<string, any>);
          
          console.log('=== SDK完整日志 ===');
          console.log(JSON.stringify(allLogs, null, 2));
        }}>导出完整日志</button>
      </div>

      <div id='test' className='text-red-500'>你好世界</div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      fallback={<div>组件出错了</div>}
      onError={(error, errorInfo) => {
        console.log('错误边界捕获:', error, errorInfo)
      }}
    >
      <TestComponent />
    </ErrorBoundary>
  )
}

export default App