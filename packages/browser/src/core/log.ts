import { ErrorTypes, Severity, ReportDataType } from '../types';
import { breadcrumb, BreadcrumbTypes } from './breadcrumb';
import { getLocationHref, getTimestamp } from '../utils';
import { transportData } from './transport';

interface LogTypes {
  message?: string;
  tag?: string;
  level?: Severity;
  ex?: any;
  type?: ErrorTypes;
}

/**
 * 自定义上报错误信息
 */
export function log({
  message = 'emptyMsg',
  tag = '',
  level = Severity.Critical,
  ex = '',
  type = ErrorTypes.LOG_ERROR,
}: LogTypes): void {
  const errorInfo: ReportDataType = {
    type,
    level,
    message: typeof message === 'string' ? message : JSON.stringify(message),
    name: 'Monitor.log',
    customTag: tag,
    time: getTimestamp(),
    url: getLocationHref()
  };

  // 如果有异常对象，提取堆栈信息
  if (ex) {
    if (ex instanceof Error) {
      errorInfo.stack = ex.stack;
    } else {
      errorInfo.stack = typeof ex === 'string' ? ex : JSON.stringify(ex);
    }
  }

  // 记录用户行为
  breadcrumb.push({
    type: BreadcrumbTypes.CUSTOM,
    message,
    data: errorInfo
  });

  transportData.send(errorInfo);
} 