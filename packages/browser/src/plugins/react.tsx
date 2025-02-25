import * as React from 'react';
import { ErrorTypes, Severity, ReportDataType } from '../types';
import { breadcrumb, BreadcrumbTypes } from '../core/breadcrumb';
import { transportData } from '../core/transport';
import { getLocationHref, getTimestamp } from '../utils';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React错误边界组件
 * 用法:
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError } = this.props;

    // 生成错误信息
    const errorData: ReportDataType = {
      type: ErrorTypes.REACT_ERROR,
      message: error.message,
      url: getLocationHref(),
      name: error.name,
      stack: error.stack,
      time: getTimestamp(),
      level: Severity.Normal
    };

    // 确保componentStack是string类型
    const componentStack = errorInfo.componentStack || undefined;
    if (typeof componentStack === 'string') {
      errorData.componentStack = componentStack;
    }

    // 记录用户行为
    breadcrumb.push({
      type: BreadcrumbTypes.ERROR,
      message: errorData.message,
      data: errorData
    });

    // 上报错误
    transportData.send(errorData);

    // 调用自定义错误处理函数
    if (onError) {
      onError(error, errorInfo);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fff5f5',
          color: '#ff4d4f',
          border: '1px solid #ffccc7',
          borderRadius: '4px'
        }}>
          Something went wrong
        </div>
      );
    }

    return this.props.children;
  }
} 