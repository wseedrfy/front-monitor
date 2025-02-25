import * as wt from "react";
import Ae from "react";
var X = /* @__PURE__ */ ((o) => (o.Debug = "debug", o.Info = "info", o.Warn = "warn", o.Error = "error", o))(X || {});
function R() {
  return Date.now();
}
function O() {
  return window.location.href;
}
class q {
  constructor(e, r) {
    this.enabled = !1, this.prefix = "[Monitor]", this.maxCache = 100, this.logs = [], this.module = "core", this.enabled = (r == null ? void 0 : r.debug) || !1, this.maxCache = (r == null ? void 0 : r.maxCache) || 100, this.module = e;
  }
  /**
   * 启用日志
   */
  enable(e = !0) {
    this.enabled = e;
  }
  /**
   * 设置日志前缀
   */
  setPrefix(e) {
    this.prefix = e;
  }
  /**
   * 添加日志
   */
  addLog(e, r, n) {
    const i = {
      level: e,
      module: this.module,
      message: r,
      timestamp: R(),
      data: n
    };
    return this.logs.push(i), this.logs.length > this.maxCache && this.logs.shift(), i;
  }
  /**
   * 普通日志
   */
  log(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(X.Info, r);
    return this.enabled && console.log(`${this.prefix}[${this.module}]`, r), n;
  }
  /**
   * 调试日志
   */
  debug(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(X.Debug, r);
    return this.enabled && console.debug(this.prefix, r), n;
  }
  /**
   * 警告日志
   */
  warn(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(X.Warn, r);
    return this.enabled && console.warn(this.prefix, r), n;
  }
  /**
   * 错误日志
   */
  error(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(X.Error, r);
    return this.enabled && console.error(this.prefix, r), n;
  }
  /**
   * 获取所有日志
   */
  getLogs() {
    return this.logs;
  }
  /**
   * 获取指定级别的日志
   */
  getLogsByLevel(e) {
    return this.logs.filter((r) => r.level === e);
  }
  /**
   * 清除日志
   */
  clearLogs() {
    this.logs = [];
  }
  /**
   * 导出日志
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}
const N = {
  core: new q("core"),
  error: new q("error"),
  performance: new q("performance"),
  network: new q("network"),
  behavior: new q("behavior"),
  transport: new q("transport")
};
var Ot = /* @__PURE__ */ ((o) => (o.ERROR = "error", o.UNHANDLEDREJECTION = "unhandledrejection", o.RESOURCE = "resource", o.XHR = "xhr", o.FETCH = "fetch", o.CLICK = "click", o.HISTORY = "history", o.HASHCHANGE = "hashchange", o.PERFORMANCE = "performance", o))(Ot || {}), E = /* @__PURE__ */ ((o) => (o.JAVASCRIPT_ERROR = "JAVASCRIPT_ERROR", o.RESOURCE_ERROR = "RESOURCE_ERROR", o.PROMISE_ERROR = "PROMISE_ERROR", o.FETCH_ERROR = "FETCH_ERROR", o.VUE_ERROR = "VUE_ERROR", o.REACT_ERROR = "REACT_ERROR", o.LOG_ERROR = "LOG_ERROR", o.PERFORMANCE = "PERFORMANCE", o.ROUTE_ERROR = "ROUTE_ERROR", o.BEHAVIOR = "BEHAVIOR", o.CONSOLE_ERROR = "CONSOLE_ERROR", o.WINDOW_ERROR = "WINDOW_ERROR", o.MEMORY_ERROR = "MEMORY_ERROR", o.WEBSOCKET_ERROR = "WEBSOCKET_ERROR", o))(E || {}), P = /* @__PURE__ */ ((o) => (o.Critical = "critical", o.High = "high", o.Normal = "normal", o.Low = "low", o))(P || {});
((o) => {
  function e(r) {
    switch (r.toLowerCase()) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "normal":
        return "normal";
      case "low":
        return "low";
      default:
        return "normal";
    }
  }
  o.fromString = e;
})(P || (P = {}));
var S = /* @__PURE__ */ ((o) => (o.ROUTE = "Route", o.CLICK = "Click", o.XHR = "Xhr", o.ERROR = "Error", o.CUSTOM = "Custom", o.PERFORMANCE = "Performance", o))(S || {});
class St {
  constructor() {
    this.maxBreadcrumbs = 10, this.stack = [], this.beforePushBreadcrumb = null;
  }
  /**
   * 添加用户行为
   */
  push(e) {
    if (typeof this.beforePushBreadcrumb == "function") {
      const r = this.beforePushBreadcrumb(this, e);
      if (!r) return;
      this.immediatePush(r);
      return;
    }
    this.immediatePush(e);
  }
  immediatePush(e) {
    e.time = e.time || R(), this.stack.length >= this.maxBreadcrumbs && this.shift(), this.stack.push(e), this.stack.sort((r, n) => r.time - n.time);
  }
  shift() {
    return this.stack.shift() !== void 0;
  }
  getStack() {
    return this.stack;
  }
  bindOptions(e = {}) {
    const { maxBreadcrumbs: r, beforePushBreadcrumb: n } = e;
    typeof r == "number" && (this.maxBreadcrumbs = r), typeof n == "function" && (this.beforePushBreadcrumb = n);
  }
}
const C = new St();
class Ct {
  constructor() {
    this.stack = [], this.isProcessing = !1;
  }
  /**
   * 添加函数到队列中
   */
  addFn(e) {
    typeof e == "function" && this.stack.indexOf(e) === -1 && (this.stack.push(e), this.isProcessing || this.processStack());
  }
  /**
   * 处理队列中的函数
   */
  processStack() {
    if (this.stack.length === 0) {
      this.isProcessing = !1;
      return;
    }
    this.isProcessing = !0;
    const e = this.stack.shift();
    if (e)
      try {
        e();
      } catch (r) {
        console.error(`Queue process error: ${r}`);
      }
    setTimeout(() => {
      this.processStack();
    }, 0);
  }
  /**
   * 清空队列
   */
  clear() {
    this.stack = [], this.isProcessing = !1;
  }
}
const H = N.transport;
class Pt {
  constructor() {
    this.beforeDataReport = null, this.dsn = "", this.apikey = "", this.useImgUpload = !1, this.enabled = !0, this.enabledError = !0, this.enabledPerformance = !0, this.enabledBehavior = !0, this.enabledNetwork = !0, this.queue = new Ct();
  }
  /**
   * 图片上报
   */
  imgRequest(e, r) {
    const n = () => {
      const i = new Image(), c = r.indexOf("?") === -1 ? "?" : "&";
      i.src = `${r}${c}data=${encodeURIComponent(JSON.stringify(e))}`, i.onload = i.onerror = () => {
        i.onload = i.onerror = null;
      };
    };
    this.queue.addFn(n);
  }
  /**
   * xhr请求上报
   */
  async xhrPost(e, r) {
    const n = () => {
      const i = new XMLHttpRequest();
      i.open("POST", r), i.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), i.send(JSON.stringify(e));
    };
    this.queue.addFn(n);
  }
  /**
   * 发送数据到服务端
   */
  async send(e) {
    if (!this.enabled) {
      H.debug(`[${e.type}] 数据上报已全局禁用`);
      return;
    }
    if (e.type.includes("ERROR") && !this.enabledError || e.type === "PERFORMANCE" && !this.enabledPerformance || e.type === "BEHAVIOR" && !this.enabledBehavior || e.type.includes("NETWORK") && !this.enabledNetwork) {
      H.debug(`[${e.type}] 该类型的数据上报已禁用`);
      return;
    }
    if (!this.dsn) {
      H.error("缺少上报地址(dsn)配置");
      return;
    }
    if (H.debug(`准备上报 ${e.type} 数据:`, e), typeof this.beforeDataReport == "function") {
      const r = await this.beforeDataReport(e);
      if (!r) {
        H.debug("数据被beforeDataReport过滤");
        return;
      }
      e = r;
    }
    return this.useImgUpload ? (H.debug("使用图片上报"), this.imgRequest(e, this.dsn)) : (H.debug("使用XHR上报"), this.xhrPost(e, this.dsn));
  }
  bindOptions(e = {}) {
    const {
      dsn: r,
      beforeDataReport: n,
      apikey: i,
      useImgUpload: c,
      enabled: u,
      enabledError: f,
      enabledPerformance: g,
      enabledBehavior: I,
      enabledNetwork: T
    } = e;
    typeof r == "string" && (this.dsn = r), typeof i == "string" && (this.apikey = i), typeof c == "boolean" && (this.useImgUpload = c), typeof n == "function" && (this.beforeDataReport = n), typeof u == "boolean" && (this.enabled = u), typeof f == "boolean" && (this.enabledError = f), typeof g == "boolean" && (this.enabledPerformance = g), typeof I == "boolean" && (this.enabledBehavior = I), typeof T == "boolean" && (this.enabledNetwork = T);
  }
}
const _ = new Pt();
function _t() {
  window.addEventListener(
    "error",
    function(o) {
      var e, r;
      if (o.target && o.target.nodeName) {
        const n = o.target;
        C.push({
          type: S.ERROR,
          message: `Resource Load Error: ${n.src || n.href}`,
          data: {
            type: E.RESOURCE_ERROR,
            url: n.src || n.href,
            html: n.outerHTML,
            elementType: n.nodeName.toLowerCase()
          }
        }), _.send({
          type: E.RESOURCE_ERROR,
          message: `Resource Load Error: ${n.src || n.href}`,
          url: O(),
          time: R(),
          level: P.High,
          data: {
            resourceUrl: n.src || n.href,
            resourceType: n.nodeName.toLowerCase(),
            html: n.outerHTML
          }
        });
      } else
        C.push({
          type: S.ERROR,
          message: o.message || "Unknown error",
          data: {
            type: E.JAVASCRIPT_ERROR,
            filename: o.filename,
            lineno: o.lineno,
            colno: o.colno,
            stack: (e = o.error) == null ? void 0 : e.stack
          }
        }), _.send({
          type: E.JAVASCRIPT_ERROR,
          message: o.message,
          url: O(),
          time: R(),
          level: P.High,
          stack: (r = o.error) == null ? void 0 : r.stack,
          data: {
            filename: o.filename,
            lineno: o.lineno,
            colno: o.colno
          }
        });
    },
    !0
  );
}
function Tt() {
  window.addEventListener(
    "unhandledrejection",
    function(o) {
      const { reason: e } = o;
      let r = "", n = "";
      typeof e == "string" ? r = e : e instanceof Error ? (r = e.message, n = e.stack || "") : typeof e == "object" && (r = e.message || JSON.stringify(e), n = e.stack || ""), C.push({
        type: S.ERROR,
        message: `Promise Error: ${r}`,
        data: {
          type: E.PROMISE_ERROR,
          message: r,
          stack: n
        }
      }), _.send({
        type: E.PROMISE_ERROR,
        message: `Unhandled Promise Rejection: ${r}`,
        stack: n,
        time: R(),
        url: O(),
        level: P.High
      });
    },
    !0
  );
}
function kt() {
  if (!("XMLHttpRequest" in window)) return;
  const o = XMLHttpRequest.prototype, e = o.open;
  o.open = function(n, i) {
    const c = this, u = {
      type: "xhr",
      method: n.toUpperCase(),
      url: i,
      sTime: R()
    };
    c.__requestData = u, e.apply(c, arguments);
  };
  const r = o.send;
  o.send = function(n) {
    const i = this, c = i.__requestData;
    c && (c.requestData = n, i.addEventListener("loadend", function() {
      const u = R();
      if (c.elapsedTime = u - c.sTime, c.status = i.status, c.response = i.response, C.push({
        type: S.XHR,
        message: `${c.method} ${c.url}`,
        data: c
      }), i.status >= 400) {
        const f = {
          type: E.FETCH_ERROR,
          message: `${c.method} ${c.url} Status: ${i.status}`,
          url: O(),
          time: R(),
          level: P.Low,
          request: {
            method: c.method,
            url: c.url,
            data: c.requestData
          },
          response: {
            status: i.status,
            data: i.response
          }
        };
        _.send(f);
      }
    })), r.apply(i, arguments);
  };
}
function Lt() {
  if (!("fetch" in window)) return;
  const o = window.fetch;
  window.fetch = function(e, r) {
    const n = R(), i = ((r == null ? void 0 : r.method) || "GET").toUpperCase(), c = typeof e == "string" ? e : e instanceof URL ? e.href : e.url, u = {
      type: "fetch",
      method: i,
      url: c,
      sTime: n,
      requestData: r == null ? void 0 : r.body
    };
    return C.push({
      type: S.XHR,
      message: `${i} ${c}`,
      data: u
    }), o.apply(window, arguments).then(async (f) => {
      const g = R();
      u.elapsedTime = g - n, u.status = f.status;
      try {
        u.response = await f.clone().text();
      } catch {
        u.response = "Failed to read response body";
      }
      return f.ok || (C.push({
        type: S.ERROR,
        message: `HTTP Error: ${i} ${c} ${f.status}`,
        data: u
      }), _.send({
        type: E.FETCH_ERROR,
        message: `HTTP Error ${f.status}: ${i} ${c}`,
        url: O(),
        time: R(),
        level: P.High,
        request: {
          method: i,
          url: c,
          data: r == null ? void 0 : r.body
        },
        response: {
          status: f.status,
          data: u.response
        }
      })), f;
    }).catch((f) => {
      const g = R();
      throw u.elapsedTime = g - n, u.status = 0, u.response = f.message, C.push({
        type: S.ERROR,
        message: `Network Error: ${i} ${c}`,
        data: u
      }), _.send({
        type: E.FETCH_ERROR,
        message: `Network Error: ${i} ${c} - ${f.message}`,
        url: O(),
        time: R(),
        level: P.High,
        request: {
          method: i,
          url: c,
          data: r == null ? void 0 : r.body
        },
        response: {
          status: 0,
          data: f.message
        }
      }), f;
    });
  };
}
function Dt() {
  _t(), Tt(), kt(), Lt();
}
const b = N.performance;
class xt {
  constructor() {
    this.metrics = {}, this.isCollecting = !1, b.debug("性能监控初始化..."), this.init();
  }
  init() {
    if (!window.performance) {
      b.warn("浏览器不支持performance API");
      return;
    }
    window.addEventListener("load", () => {
      b.debug("页面加载完成，等待收集性能指标..."), setTimeout(() => {
        this.getPerformanceMetrics();
      }, 5e3);
    }), this.observeFCP(), this.observeLCP(), this.observeFID(), this.observeCLS();
  }
  observeFCP() {
    try {
      const e = new PerformanceObserver((r) => {
        for (const n of r.getEntries())
          n.name === "first-contentful-paint" && (this.metrics.FCP = n.startTime, b.debug("FCP指标:", this.metrics.FCP), e.disconnect());
      });
      e.observe({ entryTypes: ["paint"] }), b.debug("开始监听FCP...");
    } catch (e) {
      b.warn("FCP不支持:", e);
    }
  }
  observeLCP() {
    try {
      new PerformanceObserver((r) => {
        const n = r.getEntries(), i = n[n.length - 1];
        this.metrics.LCP = i.startTime, b.debug("LCP指标:", this.metrics.LCP);
      }).observe({ entryTypes: ["largest-contentful-paint"] }), b.debug("开始监听LCP...");
    } catch (e) {
      b.warn("LCP不支持:", e);
    }
  }
  observeFID() {
    try {
      const e = new PerformanceObserver((r) => {
        const n = r.getEntries()[0];
        n && n.processingStart && (this.metrics.FID = n.processingStart - n.startTime, b.debug("FID指标:", this.metrics.FID), e.disconnect());
      });
      e.observe({ entryTypes: ["first-input"] }), b.debug("开始监听FID...");
    } catch (e) {
      b.warn("FID不支持:", e);
    }
  }
  observeCLS() {
    try {
      let e = 0;
      new PerformanceObserver((n) => {
        for (const i of n.getEntries())
          i.hadRecentInput || (e += i.value, this.metrics.CLS = e, b.debug("CLS指标:", this.metrics.CLS));
      }).observe({ entryTypes: ["layout-shift"] }), b.debug("开始监听CLS...");
    } catch (e) {
      b.warn("CLS不支持:", e);
    }
  }
  getPerformanceMetrics() {
    var e, r, n, i;
    if (this.isCollecting) {
      b.debug("性能指标正在收集中...");
      return;
    }
    this.isCollecting = !0, b.debug("开始收集性能指标...");
    try {
      const c = (r = (e = window.performance) == null ? void 0 : e.getEntriesByType) == null ? void 0 : r.call(e, "navigation"), u = c == null ? void 0 : c[0];
      if (!u) {
        b.warn("Navigation Timing API不支持");
        return;
      }
      const f = {
        ...this.metrics,
        // DNS查询时间
        DNS: u.domainLookupEnd - u.domainLookupStart,
        // TCP连接时间
        TCP: u.connectEnd - u.connectStart,
        // 首字节时间 (TTFB)
        TTFB: u.responseStart,
        // DOM解析时间
        DOMParse: u.domComplete - u.domInteractive,
        // DOM加载完成时间
        domLoad: u.domContentLoadedEventEnd,
        // 页面完全加载时间
        loadTime: u.loadEventEnd
      };
      this.metrics = f, b.debug("基础性能指标:", {
        DNS: f.DNS + "ms",
        TCP: f.TCP + "ms",
        TTFB: f.TTFB + "ms",
        DOMParse: f.DOMParse + "ms",
        domLoad: f.domLoad + "ms",
        loadTime: f.loadTime + "ms"
      });
      const g = ((i = (n = window.performance) == null ? void 0 : n.getEntriesByType) == null ? void 0 : i.call(n, "resource")) || [];
      this.metrics.resourceList = g, b.debug("资源加载数量:", this.metrics.resourceList.length), C.push({
        type: S.PERFORMANCE,
        message: "Performance Metrics Collected",
        data: this.metrics
      }), _.send({
        type: E.PERFORMANCE,
        time: R(),
        name: "performance",
        message: "Performance Metrics",
        url: window.location.href,
        metrics: this.metrics
      });
    } catch (c) {
      b.error("收集性能指标失败:", c);
    } finally {
      this.isCollecting = !1;
    }
  }
}
new xt();
class It {
  constructor() {
    this.lastHref = O(), this.init();
  }
  init() {
    this.initHistory(), this.initHash();
  }
  /**
   * 监听history路由变化
   */
  initHistory() {
    if (!window.history) return;
    const e = window.history.pushState, r = this;
    window.history.pushState = function(i, c, u) {
      if (u) {
        const f = O();
        e.call(this, i, c, u);
        const g = u.toString();
        r.recordRouteChange(f, g);
      } else
        e.call(this, i, c);
    };
    const n = window.history.replaceState;
    window.history.replaceState = function(i, c, u) {
      if (u) {
        const f = O();
        n.call(this, i, c, u);
        const g = u.toString();
        r.recordRouteChange(f, g);
      } else
        n.call(this, i, c);
    }, window.addEventListener("popstate", () => {
      const i = O(), c = this.lastHref;
      this.recordRouteChange(c, i);
    });
  }
  /**
   * 监听hash路由变化
   */
  initHash() {
    window.addEventListener("hashchange", (e) => {
      const { oldURL: r, newURL: n } = e;
      this.recordRouteChange(r, n);
    });
  }
  /**
   * 记录路由变化
   */
  recordRouteChange(e, r) {
    const n = {
      from: e,
      to: r,
      time: R()
    };
    this.lastHref = r, C.push({
      type: S.ROUTE,
      message: `Route changed from ${e} to ${r}`,
      data: n
    }), _.send({
      type: E.ROUTE_ERROR,
      time: R(),
      message: `Route changed from ${e} to ${r}`,
      url: r,
      name: "route-change"
    });
  }
}
new It();
class Ft {
  // 点击事件节流时间(ms)
  constructor() {
    this.lastClick = 0, this.clickThrottle = 300, this.init();
  }
  init() {
    this.initClick(), this.initScroll(), this.initVisibility();
  }
  /**
   * 监听点击事件
   */
  initClick() {
    window.addEventListener("click", (e) => {
      const r = R();
      if (r - this.lastClick < this.clickThrottle) return;
      this.lastClick = r;
      const n = e.target;
      if (!n) return;
      const i = {
        type: "click",
        message: this.getElementInfo(n),
        data: {
          x: e.x,
          y: e.y,
          path: this.getElementPath(n)
        },
        time: r
      };
      this.recordBehavior(i);
    }, !0);
  }
  /**
   * 监听滚动事件
   */
  initScroll() {
    let e = null;
    window.addEventListener("scroll", () => {
      e || (e = window.setTimeout(() => {
        const r = {
          type: "scroll",
          message: "Page scrolled",
          data: {
            scrollX: window.scrollX,
            scrollY: window.scrollY
          },
          time: R()
        };
        this.recordBehavior(r), e = null;
      }, 500));
    }, !0);
  }
  /**
   * 监听页面可见性变化
   */
  initVisibility() {
    document.addEventListener("visibilitychange", () => {
      const e = {
        type: "visibility",
        message: `Page ${document.hidden ? "hidden" : "visible"}`,
        data: {
          hidden: document.hidden,
          visibilityState: document.visibilityState
        },
        time: R()
      };
      this.recordBehavior(e);
    });
  }
  /**
   * 获取元素的相关信息
   */
  getElementInfo(e) {
    const r = e.tagName.toLowerCase(), n = e.id ? `#${e.id}` : "", i = e.className ? `.${e.className.replace(/\s+/g, ".")}` : "", c = e.textContent ? e.textContent.slice(0, 20) : "";
    return `${r}${n}${i}${c ? `: "${c}"` : ""}`;
  }
  /**
   * 获取元素的路径
   */
  getElementPath(e) {
    const r = [];
    let n = e;
    for (; n && n !== document.documentElement; )
      r.push(this.getElementInfo(n)), n = n.parentElement;
    return r;
  }
  /**
   * 记录用户行为
   */
  recordBehavior(e) {
    C.push({
      type: S.CLICK,
      message: e.message,
      data: e
    }), _.send({
      type: E.BEHAVIOR,
      time: e.time,
      message: e.message,
      url: O(),
      name: `user-${e.type}`,
      behavior: e
    });
  }
}
new Ft();
const w = N.error;
class Nt {
  // 添加标志位防止递归
  constructor() {
    this.isReporting = !1, w.debug("初始化错误监控..."), this.init();
  }
  init() {
    w.debug("开始监听console.error"), this.initConsoleError(), w.debug("开始监听window错误"), this.initWindowError(), w.debug("开始监听内存使用"), this.initMemoryWarning(), w.debug("开始监听WebSocket错误"), this.initWebSocketError(), w.debug("错误监控初始化完成");
  }
  /**
   * 监控console.error
   */
  initConsoleError() {
    if (w.debug("开始监听console.error..."), !window.console || !window.console.error) return;
    const e = window.console.error;
    window.console.error = (...r) => {
      if (!this.isReporting) {
        this.isReporting = !0;
        const n = r.join(" ");
        w.debug("捕获到console.error:", n), this.reportError(E.CONSOLE_ERROR, n), this.isReporting = !1;
      }
      e.apply(window.console, r);
    };
  }
  /**
   * 监控window全局错误
   */
  initWindowError() {
    w.debug("开始监听window错误..."), window.addEventListener("error", (e) => {
      w.debug("捕获到window错误:", e.error), e.error && e.error.stack && e.error.message && this.reportError(E.WINDOW_ERROR, e.error.message, e.error);
    }, !0);
  }
  /**
   * 监控内存使用情况
   */
  initMemoryWarning() {
    w.debug("开始监听内存使用...");
    const e = window.performance;
    if (!e || !e.memory) return;
    setInterval(() => {
      const n = e.memory;
      if (!n) return;
      const i = n.usedJSHeapSize / n.jsHeapSizeLimit;
      i > 0.9 && (w.warn("内存使用过高:", {
        used: n.usedJSHeapSize,
        limit: n.jsHeapSizeLimit,
        ratio: i
      }), this.reportError(E.MEMORY_ERROR, "Memory usage is too high", void 0, {
        usedJSHeapSize: n.usedJSHeapSize,
        jsHeapSizeLimit: n.jsHeapSizeLimit,
        usageRatio: i
      }));
    }, 3e4);
  }
  /**
   * 监控WebSocket错误
   */
  initWebSocketError() {
    w.debug("开始监听WebSocket错误...");
    const e = window.WebSocket;
    window.WebSocket = (r, n) => {
      const i = new e(r, n);
      return w.debug("创建新的WebSocket连接:", r.toString()), i.addEventListener("error", () => {
        w.error("WebSocket连接错误:", r.toString()), this.reportError(E.WEBSOCKET_ERROR, "WebSocket connection error", void 0, {
          url: r.toString(),
          protocols: n
        });
      }), i;
    };
  }
  /**
   * 上报错误
   */
  reportError(e, r, n, i) {
    if (this.isReporting) {
      w.debug("防止递归上报");
      return;
    }
    this.isReporting = !0;
    try {
      w.debug("准备上报错误:", {
        type: e,
        message: r,
        error: n,
        data: i
      }), C.push({
        type: S.ERROR,
        message: r,
        data: {
          type: e,
          message: r,
          stack: n == null ? void 0 : n.stack,
          level: P.High,
          time: R(),
          url: O(),
          ...i
        }
      }), _.send({
        type: e,
        message: r,
        stack: n == null ? void 0 : n.stack,
        level: P.High,
        time: R(),
        url: O(),
        data: i
      }), w.debug("错误上报完成");
    } catch (c) {
      w.error("错误上报失败:", c);
    } finally {
      this.isReporting = !1;
    }
  }
}
new Nt();
class $t {
  constructor() {
    this.init();
  }
  init() {
    this.initPageLoad(), this.initResourceLoad();
  }
  /**
   * 监控页面加载性能
   */
  initPageLoad() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const e = performance.timing, r = {
          // DNS解析时间
          dnsTime: e.domainLookupEnd - e.domainLookupStart,
          // TCP连接时间
          tcpTime: e.connectEnd - e.connectStart,
          // 白屏时间
          whiteScreenTime: e.domInteractive - e.navigationStart,
          // DOM解析时间
          domParseTime: e.domComplete - e.domInteractive,
          // DOM完成时间
          domReadyTime: e.domContentLoadedEventEnd - e.navigationStart,
          // 页面完全加载时间
          loadTime: e.loadEventEnd - e.navigationStart,
          // 页面大小
          pageSize: this.getPageSize()
        };
        C.push({
          type: S.PERFORMANCE,
          message: "Page Load Performance",
          data: r
        }), _.send({
          type: E.PERFORMANCE,
          time: R(),
          message: "Page Load Performance Metrics",
          url: O(),
          level: P.Low,
          data: r
        });
      }, 0);
    });
  }
  /**
   * 监控资源加载性能
   */
  initResourceLoad() {
    new PerformanceObserver((r) => {
      const i = r.getEntries().map((c) => this.formatResourceTiming(c));
      C.push({
        type: S.PERFORMANCE,
        message: "Resource Load Performance",
        data: i
      }), _.send({
        type: E.PERFORMANCE,
        time: R(),
        message: "Resource Load Performance Metrics",
        url: O(),
        level: P.Low,
        data: {
          resources: i
        }
      });
    }).observe({ entryTypes: ["resource"] });
  }
  /**
   * 格式化资源加载数据
   */
  formatResourceTiming(e) {
    return {
      name: e.name,
      initiatorType: e.initiatorType,
      duration: e.duration,
      startTime: e.startTime,
      responseEnd: e.responseEnd,
      transferSize: e.transferSize,
      encodedBodySize: e.encodedBodySize,
      decodedBodySize: e.decodedBodySize
    };
  }
  /**
   * 获取页面大小
   */
  getPageSize() {
    return performance.getEntriesByType("resource").reduce((r, n) => r + (n.transferSize || 0), 0);
  }
}
new $t();
class jt {
  constructor() {
    this.lastStatus = {
      online: navigator.onLine
    }, this.init();
  }
  init() {
    this.initOnlineStatus(), this.initConnectionInfo();
  }
  /**
   * 监控在线状态
   */
  initOnlineStatus() {
    window.addEventListener("online", () => {
      this.handleNetworkChange({ online: !0 });
    }), window.addEventListener("offline", () => {
      this.handleNetworkChange({ online: !1 });
    });
  }
  /**
   * 监控网络信息
   */
  initConnectionInfo() {
    const e = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    e && (this.handleNetworkChange({
      online: navigator.onLine,
      effectiveType: e.effectiveType,
      downlink: e.downlink,
      rtt: e.rtt,
      saveData: e.saveData
    }), e.addEventListener("change", () => {
      this.handleNetworkChange({
        online: navigator.onLine,
        effectiveType: e.effectiveType,
        downlink: e.downlink,
        rtt: e.rtt,
        saveData: e.saveData
      });
    }));
  }
  /**
   * 处理网络状态变化
   */
  handleNetworkChange(e) {
    this.isStatusChanged(e) && (C.push({
      type: S.PERFORMANCE,
      message: "Network Status Changed",
      data: e
    }), _.send({
      type: E.PERFORMANCE,
      time: R(),
      message: "Network Status Changed",
      url: O(),
      level: e.online ? P.Low : P.High,
      data: {
        from: this.lastStatus,
        to: e
      }
    }), this.lastStatus = { ...e });
  }
  /**
   * 检查网络状态是否发生变化
   */
  isStatusChanged(e) {
    return Object.keys(e).some((r) => e[r] !== this.lastStatus[r]);
  }
  /**
   * 获取当前网络状态
   */
  getNetworkStatus() {
    return { ...this.lastStatus };
  }
}
new jt();
function Bt(o = {}) {
  Object.values(N).forEach((e) => {
    e.enable(o.debug || !1);
  }), N.core.log("SDK初始化开始..."), _.bindOptions(o), C.bindOptions(o), N.core.log("配置绑定完成"), Dt(), N.core.log("事件监听已设置"), N.core.log("所有监控器已初始化"), N.core.debug("当前配置:", o);
}
var ue = { exports: {} }, V = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $e;
function At() {
  if ($e) return V;
  $e = 1;
  var o = Ae, e = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, c = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(f, g, I) {
    var T, F = {}, j = null, K = null;
    I !== void 0 && (j = "" + I), g.key !== void 0 && (j = "" + g.key), g.ref !== void 0 && (K = g.ref);
    for (T in g) n.call(g, T) && !c.hasOwnProperty(T) && (F[T] = g[T]);
    if (f && f.defaultProps) for (T in g = f.defaultProps, g) F[T] === void 0 && (F[T] = g[T]);
    return { $$typeof: e, type: f, key: j, ref: K, props: F, _owner: i.current };
  }
  return V.Fragment = r, V.jsx = u, V.jsxs = u, V;
}
var z = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var je;
function Mt() {
  return je || (je = 1, process.env.NODE_ENV !== "production" && function() {
    var o = Ae, e = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), f = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), j = Symbol.for("react.lazy"), K = Symbol.for("react.offscreen"), le = Symbol.iterator, Me = "@@iterator";
    function He(t) {
      if (t === null || typeof t != "object")
        return null;
      var s = le && t[le] || t[Me];
      return typeof s == "function" ? s : null;
    }
    var W = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function k(t) {
      {
        for (var s = arguments.length, a = new Array(s > 1 ? s - 1 : 0), l = 1; l < s; l++)
          a[l - 1] = arguments[l];
        We("error", t, a);
      }
    }
    function We(t, s, a) {
      {
        var l = W.ReactDebugCurrentFrame, m = l.getStackAddendum();
        m !== "" && (s += "%s", a = a.concat([m]));
        var p = a.map(function(h) {
          return String(h);
        });
        p.unshift("Warning: " + s), Function.prototype.apply.call(console[t], console, p);
      }
    }
    var Ue = !1, Be = !1, qe = !1, Ye = !1, Je = !1, fe;
    fe = Symbol.for("react.module.reference");
    function Ve(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === n || t === c || Je || t === i || t === I || t === T || Ye || t === K || Ue || Be || qe || typeof t == "object" && t !== null && (t.$$typeof === j || t.$$typeof === F || t.$$typeof === u || t.$$typeof === f || t.$$typeof === g || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === fe || t.getModuleId !== void 0));
    }
    function ze(t, s, a) {
      var l = t.displayName;
      if (l)
        return l;
      var m = s.displayName || s.name || "";
      return m !== "" ? a + "(" + m + ")" : a;
    }
    function de(t) {
      return t.displayName || "Context";
    }
    function $(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && k("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
        return t.displayName || t.name || null;
      if (typeof t == "string")
        return t;
      switch (t) {
        case n:
          return "Fragment";
        case r:
          return "Portal";
        case c:
          return "Profiler";
        case i:
          return "StrictMode";
        case I:
          return "Suspense";
        case T:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case f:
            var s = t;
            return de(s) + ".Consumer";
          case u:
            var a = t;
            return de(a._context) + ".Provider";
          case g:
            return ze(t, t.render, "ForwardRef");
          case F:
            var l = t.displayName || null;
            return l !== null ? l : $(t.type) || "Memo";
          case j: {
            var m = t, p = m._payload, h = m._init;
            try {
              return $(h(p));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var A = Object.assign, Y = 0, he, ge, me, pe, Re, Ee, ve;
    function be() {
    }
    be.__reactDisabledLog = !0;
    function Xe() {
      {
        if (Y === 0) {
          he = console.log, ge = console.info, me = console.warn, pe = console.error, Re = console.group, Ee = console.groupCollapsed, ve = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: be,
            writable: !0
          };
          Object.defineProperties(console, {
            info: t,
            log: t,
            warn: t,
            error: t,
            group: t,
            groupCollapsed: t,
            groupEnd: t
          });
        }
        Y++;
      }
    }
    function Ke() {
      {
        if (Y--, Y === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: A({}, t, {
              value: he
            }),
            info: A({}, t, {
              value: ge
            }),
            warn: A({}, t, {
              value: me
            }),
            error: A({}, t, {
              value: pe
            }),
            group: A({}, t, {
              value: Re
            }),
            groupCollapsed: A({}, t, {
              value: Ee
            }),
            groupEnd: A({}, t, {
              value: ve
            })
          });
        }
        Y < 0 && k("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var te = W.ReactCurrentDispatcher, re;
    function G(t, s, a) {
      {
        if (re === void 0)
          try {
            throw Error();
          } catch (m) {
            var l = m.stack.trim().match(/\n( *(at )?)/);
            re = l && l[1] || "";
          }
        return `
` + re + t;
      }
    }
    var ne = !1, Q;
    {
      var Ge = typeof WeakMap == "function" ? WeakMap : Map;
      Q = new Ge();
    }
    function ye(t, s) {
      if (!t || ne)
        return "";
      {
        var a = Q.get(t);
        if (a !== void 0)
          return a;
      }
      var l;
      ne = !0;
      var m = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var p;
      p = te.current, te.current = null, Xe();
      try {
        if (s) {
          var h = function() {
            throw Error();
          };
          if (Object.defineProperty(h.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(h, []);
            } catch (D) {
              l = D;
            }
            Reflect.construct(t, [], h);
          } else {
            try {
              h.call();
            } catch (D) {
              l = D;
            }
            t.call(h.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (D) {
            l = D;
          }
          t();
        }
      } catch (D) {
        if (D && l && typeof D.stack == "string") {
          for (var d = D.stack.split(`
`), L = l.stack.split(`
`), v = d.length - 1, y = L.length - 1; v >= 1 && y >= 0 && d[v] !== L[y]; )
            y--;
          for (; v >= 1 && y >= 0; v--, y--)
            if (d[v] !== L[y]) {
              if (v !== 1 || y !== 1)
                do
                  if (v--, y--, y < 0 || d[v] !== L[y]) {
                    var x = `
` + d[v].replace(" at new ", " at ");
                    return t.displayName && x.includes("<anonymous>") && (x = x.replace("<anonymous>", t.displayName)), typeof t == "function" && Q.set(t, x), x;
                  }
                while (v >= 1 && y >= 0);
              break;
            }
        }
      } finally {
        ne = !1, te.current = p, Ke(), Error.prepareStackTrace = m;
      }
      var B = t ? t.displayName || t.name : "", M = B ? G(B) : "";
      return typeof t == "function" && Q.set(t, M), M;
    }
    function Qe(t, s, a) {
      return ye(t, !1);
    }
    function Ze(t) {
      var s = t.prototype;
      return !!(s && s.isReactComponent);
    }
    function Z(t, s, a) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return ye(t, Ze(t));
      if (typeof t == "string")
        return G(t);
      switch (t) {
        case I:
          return G("Suspense");
        case T:
          return G("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case g:
            return Qe(t.render);
          case F:
            return Z(t.type, s, a);
          case j: {
            var l = t, m = l._payload, p = l._init;
            try {
              return Z(p(m), s, a);
            } catch {
            }
          }
        }
      return "";
    }
    var J = Object.prototype.hasOwnProperty, we = {}, Oe = W.ReactDebugCurrentFrame;
    function ee(t) {
      if (t) {
        var s = t._owner, a = Z(t.type, t._source, s ? s.type : null);
        Oe.setExtraStackFrame(a);
      } else
        Oe.setExtraStackFrame(null);
    }
    function et(t, s, a, l, m) {
      {
        var p = Function.call.bind(J);
        for (var h in t)
          if (p(t, h)) {
            var d = void 0;
            try {
              if (typeof t[h] != "function") {
                var L = Error((l || "React class") + ": " + a + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw L.name = "Invariant Violation", L;
              }
              d = t[h](s, h, l, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (v) {
              d = v;
            }
            d && !(d instanceof Error) && (ee(m), k("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", a, h, typeof d), ee(null)), d instanceof Error && !(d.message in we) && (we[d.message] = !0, ee(m), k("Failed %s type: %s", a, d.message), ee(null));
          }
      }
    }
    var tt = Array.isArray;
    function oe(t) {
      return tt(t);
    }
    function rt(t) {
      {
        var s = typeof Symbol == "function" && Symbol.toStringTag, a = s && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return a;
      }
    }
    function nt(t) {
      try {
        return Se(t), !1;
      } catch {
        return !0;
      }
    }
    function Se(t) {
      return "" + t;
    }
    function Ce(t) {
      if (nt(t))
        return k("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rt(t)), Se(t);
    }
    var Pe = W.ReactCurrentOwner, ot = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, _e, Te;
    function it(t) {
      if (J.call(t, "ref")) {
        var s = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function st(t) {
      if (J.call(t, "key")) {
        var s = Object.getOwnPropertyDescriptor(t, "key").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function at(t, s) {
      typeof t.ref == "string" && Pe.current;
    }
    function ct(t, s) {
      {
        var a = function() {
          _e || (_e = !0, k("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        a.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: a,
          configurable: !0
        });
      }
    }
    function ut(t, s) {
      {
        var a = function() {
          Te || (Te = !0, k("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        a.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: a,
          configurable: !0
        });
      }
    }
    var lt = function(t, s, a, l, m, p, h) {
      var d = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: t,
        key: s,
        ref: a,
        props: h,
        // Record the component responsible for creating this element.
        _owner: p
      };
      return d._store = {}, Object.defineProperty(d._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(d, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(d, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: m
      }), Object.freeze && (Object.freeze(d.props), Object.freeze(d)), d;
    };
    function ft(t, s, a, l, m) {
      {
        var p, h = {}, d = null, L = null;
        a !== void 0 && (Ce(a), d = "" + a), st(s) && (Ce(s.key), d = "" + s.key), it(s) && (L = s.ref, at(s, m));
        for (p in s)
          J.call(s, p) && !ot.hasOwnProperty(p) && (h[p] = s[p]);
        if (t && t.defaultProps) {
          var v = t.defaultProps;
          for (p in v)
            h[p] === void 0 && (h[p] = v[p]);
        }
        if (d || L) {
          var y = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          d && ct(h, y), L && ut(h, y);
        }
        return lt(t, d, L, m, l, Pe.current, h);
      }
    }
    var ie = W.ReactCurrentOwner, ke = W.ReactDebugCurrentFrame;
    function U(t) {
      if (t) {
        var s = t._owner, a = Z(t.type, t._source, s ? s.type : null);
        ke.setExtraStackFrame(a);
      } else
        ke.setExtraStackFrame(null);
    }
    var se;
    se = !1;
    function ae(t) {
      return typeof t == "object" && t !== null && t.$$typeof === e;
    }
    function Le() {
      {
        if (ie.current) {
          var t = $(ie.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function dt(t) {
      return "";
    }
    var De = {};
    function ht(t) {
      {
        var s = Le();
        if (!s) {
          var a = typeof t == "string" ? t : t.displayName || t.name;
          a && (s = `

Check the top-level render call using <` + a + ">.");
        }
        return s;
      }
    }
    function xe(t, s) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var a = ht(s);
        if (De[a])
          return;
        De[a] = !0;
        var l = "";
        t && t._owner && t._owner !== ie.current && (l = " It was passed a child from " + $(t._owner.type) + "."), U(t), k('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', a, l), U(null);
      }
    }
    function Ie(t, s) {
      {
        if (typeof t != "object")
          return;
        if (oe(t))
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ae(l) && xe(l, s);
          }
        else if (ae(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var m = He(t);
          if (typeof m == "function" && m !== t.entries)
            for (var p = m.call(t), h; !(h = p.next()).done; )
              ae(h.value) && xe(h.value, s);
        }
      }
    }
    function gt(t) {
      {
        var s = t.type;
        if (s == null || typeof s == "string")
          return;
        var a;
        if (typeof s == "function")
          a = s.propTypes;
        else if (typeof s == "object" && (s.$$typeof === g || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        s.$$typeof === F))
          a = s.propTypes;
        else
          return;
        if (a) {
          var l = $(s);
          et(a, t.props, "prop", l, t);
        } else if (s.PropTypes !== void 0 && !se) {
          se = !0;
          var m = $(s);
          k("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", m || "Unknown");
        }
        typeof s.getDefaultProps == "function" && !s.getDefaultProps.isReactClassApproved && k("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function mt(t) {
      {
        for (var s = Object.keys(t.props), a = 0; a < s.length; a++) {
          var l = s[a];
          if (l !== "children" && l !== "key") {
            U(t), k("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), U(null);
            break;
          }
        }
        t.ref !== null && (U(t), k("Invalid attribute `ref` supplied to `React.Fragment`."), U(null));
      }
    }
    var Fe = {};
    function Ne(t, s, a, l, m, p) {
      {
        var h = Ve(t);
        if (!h) {
          var d = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (d += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var L = dt();
          L ? d += L : d += Le();
          var v;
          t === null ? v = "null" : oe(t) ? v = "array" : t !== void 0 && t.$$typeof === e ? (v = "<" + ($(t.type) || "Unknown") + " />", d = " Did you accidentally export a JSX literal instead of a component?") : v = typeof t, k("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", v, d);
        }
        var y = ft(t, s, a, m, p);
        if (y == null)
          return y;
        if (h) {
          var x = s.children;
          if (x !== void 0)
            if (l)
              if (oe(x)) {
                for (var B = 0; B < x.length; B++)
                  Ie(x[B], t);
                Object.freeze && Object.freeze(x);
              } else
                k("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ie(x, t);
        }
        if (J.call(s, "key")) {
          var M = $(t), D = Object.keys(s).filter(function(yt) {
            return yt !== "key";
          }), ce = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Fe[M + ce]) {
            var bt = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            k(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ce, M, bt, M), Fe[M + ce] = !0;
          }
        }
        return t === n ? mt(y) : gt(y), y;
      }
    }
    function pt(t, s, a) {
      return Ne(t, s, a, !0);
    }
    function Rt(t, s, a) {
      return Ne(t, s, a, !1);
    }
    var Et = Rt, vt = pt;
    z.Fragment = n, z.jsx = Et, z.jsxs = vt;
  }()), z;
}
process.env.NODE_ENV === "production" ? ue.exports = At() : ue.exports = Mt();
var Ht = ue.exports;
class qt extends wt.Component {
  constructor(e) {
    super(e), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(e) {
    return { hasError: !0 };
  }
  componentDidCatch(e, r) {
    const { onError: n } = this.props, i = {
      type: E.REACT_ERROR,
      message: e.message,
      url: O(),
      name: e.name,
      stack: e.stack,
      time: R(),
      level: P.Normal
    }, c = r.componentStack || void 0;
    typeof c == "string" && (i.componentStack = c), C.push({
      type: S.ERROR,
      message: i.message,
      data: i
    }), _.send(i), n && n(e, r);
  }
  render() {
    return this.state.hasError ? this.props.fallback || /* @__PURE__ */ Ht.jsx("div", { style: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#fff5f5",
      color: "#ff4d4f",
      border: "1px solid #ffccc7",
      borderRadius: "4px"
    }, children: "Something went wrong" }) : this.props.children;
  }
}
function Wt(o, e, r, n, i) {
  var f, g;
  const c = (i == null ? void 0 : i.version) || "unknown", u = {
    type: E.VUE_ERROR,
    message: `${o.message}
info: ${r}`,
    level: n,
    url: O(),
    name: o.name,
    stack: o.stack,
    time: R(),
    componentName: ((f = e == null ? void 0 : e.$options) == null ? void 0 : f._componentTag) || "anonymous",
    propsData: (g = e == null ? void 0 : e.$options) == null ? void 0 : g.propsData,
    vueVersion: c
  };
  C.push({
    type: S.ERROR,
    message: u.message,
    data: u
  }), _.send(u);
}
const Yt = {
  install(o) {
    if (!o || !o.config) return;
    const e = o.config.errorHandler;
    o.config.errorHandler = function(r, n, i) {
      Wt(r, n, i, P.Normal, o), typeof e == "function" && e.call(this, r, n, i), console && !o.config.silent && console.error("Vue Error Info: ", r);
    };
  }
};
function Jt({
  message: o = "emptyMsg",
  tag: e = "",
  level: r = P.Critical,
  ex: n = "",
  type: i = E.LOG_ERROR
}) {
  const c = {
    type: i,
    level: r,
    message: typeof o == "string" ? o : JSON.stringify(o),
    name: "Monitor.log",
    customTag: e,
    time: R(),
    url: O()
  };
  n && (n instanceof Error ? c.stack = n.stack : c.stack = typeof n == "string" ? n : JSON.stringify(n)), C.push({
    type: S.CUSTOM,
    message: o,
    data: c
  }), _.send(c);
}
export {
  qt as ErrorBoundary,
  E as ErrorTypes,
  Ot as EventTypes,
  Yt as MonitorVue,
  P as Severity,
  C as breadcrumb,
  Bt as init,
  Jt as log,
  N as loggers
};
