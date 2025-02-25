// 获取当前时间戳
export function getTimestamp(): number {
  return Date.now();
}

// 获取当前URL
export function getLocationHref(): string {
  return window.location.href;
}

// 安全的执行函数
export function nativeTryCatch(fn: () => void, errorFn?: (err: Error) => void): void {
  try {
    fn();
  } catch (err) {
    if (errorFn) {
      errorFn(err as Error);
    }
  }
}

// 标记是否已经重写过某个事件
const flags: { [key: string]: boolean } = {};

export function getFlag(key: string): boolean {
  return flags[key] || false;
}

export function setFlag(key: string, value: boolean): void {
  flags[key] = value;
} 