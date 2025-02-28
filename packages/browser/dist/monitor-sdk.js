import * as St from "react";
import We from "react";
var G = /* @__PURE__ */ ((o) => (o.Debug = "debug", o.Info = "info", o.Warn = "warn", o.Error = "error", o))(G || {});
function p() {
  return Date.now();
}
function y() {
  return window.location.href;
}
class U {
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
      timestamp: p(),
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
    ).join(" "), n = this.addLog(G.Info, r);
    return this.enabled && console.log(`${this.prefix}[${this.module}]`, r), n;
  }
  /**
   * 调试日志
   */
  debug(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(G.Debug, r);
    return this.enabled && console.debug(this.prefix, r), n;
  }
  /**
   * 警告日志
   */
  warn(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(G.Warn, r);
    return this.enabled && console.warn(this.prefix, r), n;
  }
  /**
   * 错误日志
   */
  error(...e) {
    const r = e.map(
      (i) => typeof i == "object" ? JSON.stringify(i) : i
    ).join(" "), n = this.addLog(G.Error, r);
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
const x = {
  core: new U("core"),
  error: new U("error"),
  performance: new U("performance"),
  network: new U("network"),
  behavior: new U("behavior"),
  transport: new U("transport"),
  breadcrumb: new U("breadcrumb")
};
var Pt = /* @__PURE__ */ ((o) => (o.ERROR = "error", o.UNHANDLEDREJECTION = "unhandledrejection", o.RESOURCE = "resource", o.XHR = "xhr", o.FETCH = "fetch", o.CLICK = "click", o.HISTORY = "history", o.HASHCHANGE = "hashchange", o.PERFORMANCE = "performance", o))(Pt || {}), E = /* @__PURE__ */ ((o) => (o.JAVASCRIPT_ERROR = "JAVASCRIPT_ERROR", o.RESOURCE_ERROR = "RESOURCE_ERROR", o.PROMISE_ERROR = "PROMISE_ERROR", o.FETCH_ERROR = "FETCH_ERROR", o.VUE_ERROR = "VUE_ERROR", o.REACT_ERROR = "REACT_ERROR", o.LOG_ERROR = "LOG_ERROR", o.PERFORMANCE = "PERFORMANCE", o.ROUTE_ERROR = "ROUTE_ERROR", o.BEHAVIOR = "BEHAVIOR", o.CONSOLE_ERROR = "CONSOLE_ERROR", o.WINDOW_ERROR = "WINDOW_ERROR", o.MEMORY_ERROR = "MEMORY_ERROR", o.WEBSOCKET_ERROR = "WEBSOCKET_ERROR", o.TRACKING_EVENT = "TRACKING_EVENT", o))(E || {}), P = /* @__PURE__ */ ((o) => (o.Critical = "critical", o.High = "high", o.Normal = "normal", o.Low = "low", o))(P || {});
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
const Ae = x.breadcrumb;
var C = /* @__PURE__ */ ((o) => (o.ROUTE = "Route", o.CLICK = "Click", o.XHR = "Xhr", o.ERROR = "Error", o.CUSTOM = "Custom", o.PERFORMANCE = "Performance", o))(C || {});
class kt {
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
    e.time = e.time || p(), this.stack.length >= this.maxBreadcrumbs && this.shift(), this.stack.push(e), this.stack.sort((r, n) => r.time - n.time), Ae.debug("Breadcrumb pushed:", e);
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
  /**
   * 获取用户行为轨迹
   */
  getBreadcrumbs() {
    return Ae.debug("Retrieving breadcrumbs:", this.stack), this.stack;
  }
}
const S = new kt();
class Tt {
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
const B = x.transport;
class _t {
  constructor() {
    this.beforeDataReport = null, this.dsn = "", this.apikey = "", this.useImgUpload = !1, this.enabled = !0, this.enabledError = !0, this.enabledPerformance = !0, this.enabledBehavior = !0, this.enabledNetwork = !0, this.queue = new Tt();
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
      B.debug(`[${e.type}] 数据上报已全局禁用`);
      return;
    }
    if (e.type.includes("ERROR") && !this.enabledError || e.type === "PERFORMANCE" && !this.enabledPerformance || e.type === "BEHAVIOR" && !this.enabledBehavior || e.type.includes("NETWORK") && !this.enabledNetwork) {
      B.debug(`[${e.type}] 该类型的数据上报已禁用`);
      return;
    }
    if (!this.dsn) {
      B.error("缺少上报地址(dsn)配置");
      return;
    }
    if (B.debug(`准备上报 ${e.type} 数据:`, e), typeof this.beforeDataReport == "function") {
      const r = await this.beforeDataReport(e);
      if (!r) {
        B.debug("数据被beforeDataReport过滤");
        return;
      }
      e = r;
    }
    return this.useImgUpload ? (B.debug("使用图片上报"), this.imgRequest(e, this.dsn)) : (B.debug("使用XHR上报"), this.xhrPost(e, this.dsn));
  }
  bindOptions(e = {}) {
    const {
      dsn: r,
      beforeDataReport: n,
      apikey: i,
      useImgUpload: c,
      enabled: u,
      enabledError: d,
      enabledPerformance: g,
      enabledBehavior: I,
      enabledNetwork: T
    } = e;
    typeof r == "string" && (this.dsn = r), typeof i == "string" && (this.apikey = i), typeof c == "boolean" && (this.useImgUpload = c), typeof n == "function" && (this.beforeDataReport = n), typeof u == "boolean" && (this.enabled = u), typeof d == "boolean" && (this.enabledError = d), typeof g == "boolean" && (this.enabledPerformance = g), typeof I == "boolean" && (this.enabledBehavior = I), typeof T == "boolean" && (this.enabledNetwork = T);
  }
}
const k = new _t();
function Lt() {
  window.addEventListener(
    "error",
    function(o) {
      var e, r;
      if (o.target && o.target.nodeName) {
        const n = o.target;
        S.push({
          type: C.ERROR,
          message: `Resource Load Error: ${n.src || n.href}`,
          data: {
            type: E.RESOURCE_ERROR,
            url: n.src || n.href,
            html: n.outerHTML,
            elementType: n.nodeName.toLowerCase()
          }
        }), k.send({
          type: E.RESOURCE_ERROR,
          message: `Resource Load Error: ${n.src || n.href}`,
          url: y(),
          time: p(),
          level: P.High,
          data: {
            resourceUrl: n.src || n.href,
            resourceType: n.nodeName.toLowerCase(),
            html: n.outerHTML
          }
        });
      } else
        S.push({
          type: C.ERROR,
          message: o.message || "Unknown error",
          data: {
            type: E.JAVASCRIPT_ERROR,
            filename: o.filename,
            lineno: o.lineno,
            colno: o.colno,
            stack: (e = o.error) == null ? void 0 : e.stack
          }
        }), k.send({
          type: E.JAVASCRIPT_ERROR,
          message: o.message,
          url: y(),
          time: p(),
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
function Dt() {
  window.addEventListener(
    "unhandledrejection",
    function(o) {
      const { reason: e } = o;
      let r = "", n = "";
      typeof e == "string" ? r = e : e instanceof Error ? (r = e.message, n = e.stack || "") : typeof e == "object" && (r = e.message || JSON.stringify(e), n = e.stack || ""), S.push({
        type: C.ERROR,
        message: `Promise Error: ${r}`,
        data: {
          type: E.PROMISE_ERROR,
          message: r,
          stack: n
        }
      }), k.send({
        type: E.PROMISE_ERROR,
        message: `Unhandled Promise Rejection: ${r}`,
        stack: n,
        time: p(),
        url: y(),
        level: P.High
      });
    },
    !0
  );
}
function Nt() {
  if (!("XMLHttpRequest" in window)) return;
  const o = XMLHttpRequest.prototype, e = o.open;
  o.open = function(n, i) {
    const c = this, u = {
      type: "xhr",
      method: n.toUpperCase(),
      url: i,
      sTime: p()
    };
    c.__requestData = u, e.apply(c, arguments);
  };
  const r = o.send;
  o.send = function(n) {
    const i = this, c = i.__requestData;
    c && (c.requestData = n, i.addEventListener("loadend", function() {
      const u = p();
      if (c.elapsedTime = u - c.sTime, c.status = i.status, c.response = i.response, S.push({
        type: C.XHR,
        message: `${c.method} ${c.url}`,
        data: c
      }), i.status >= 400) {
        const d = {
          type: E.FETCH_ERROR,
          message: `${c.method} ${c.url} Status: ${i.status}`,
          url: y(),
          time: p(),
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
        k.send(d);
      }
    })), r.apply(i, arguments);
  };
}
function xt() {
  if (!("fetch" in window)) return;
  const o = window.fetch;
  window.fetch = function(e, r) {
    const n = p(), i = ((r == null ? void 0 : r.method) || "GET").toUpperCase(), c = typeof e == "string" ? e : e instanceof URL ? e.href : e.url, u = {
      type: "fetch",
      method: i,
      url: c,
      sTime: n,
      requestData: r == null ? void 0 : r.body
    };
    return S.push({
      type: C.XHR,
      message: `${i} ${c}`,
      data: u
    }), o.apply(window, arguments).then(async (d) => {
      const g = p();
      u.elapsedTime = g - n, u.status = d.status;
      try {
        u.response = await d.clone().text();
      } catch {
        u.response = "Failed to read response body";
      }
      return d.ok || (S.push({
        type: C.ERROR,
        message: `HTTP Error: ${i} ${c} ${d.status}`,
        data: u
      }), k.send({
        type: E.FETCH_ERROR,
        message: `HTTP Error ${d.status}: ${i} ${c}`,
        url: y(),
        time: p(),
        level: P.High,
        request: {
          method: i,
          url: c,
          data: r == null ? void 0 : r.body
        },
        response: {
          status: d.status,
          data: u.response
        }
      })), d;
    }).catch((d) => {
      const g = p();
      throw u.elapsedTime = g - n, u.status = 0, u.response = d.message, S.push({
        type: C.ERROR,
        message: `Network Error: ${i} ${c}`,
        data: u
      }), k.send({
        type: E.FETCH_ERROR,
        message: `Network Error: ${i} ${c} - ${d.message}`,
        url: y(),
        time: p(),
        level: P.High,
        request: {
          method: i,
          url: c,
          data: r == null ? void 0 : r.body
        },
        response: {
          status: 0,
          data: d.message
        }
      }), d;
    });
  };
}
function It() {
  Lt(), Dt(), Nt(), xt();
}
const v = x.performance;
class Ft {
  constructor() {
    this.metrics = {}, this.isCollecting = !1, v.debug("性能监控初始化..."), this.init();
  }
  init() {
    if (!window.performance) {
      v.warn("浏览器不支持performance API");
      return;
    }
    window.addEventListener("load", () => {
      v.debug("页面加载完成，等待收集性能指标..."), setTimeout(() => {
        this.getPerformanceMetrics();
      }, 5e3);
    }), this.observeFCP(), this.observeLCP(), this.observeFID(), this.observeCLS();
  }
  observeFCP() {
    try {
      const e = new PerformanceObserver((r) => {
        for (const n of r.getEntries())
          n.name === "first-contentful-paint" && (this.metrics.FCP = n.startTime, v.debug("FCP指标:", this.metrics.FCP), e.disconnect());
      });
      e.observe({ entryTypes: ["paint"] }), v.debug("开始监听FCP...");
    } catch (e) {
      v.warn("FCP不支持:", e);
    }
  }
  observeLCP() {
    try {
      new PerformanceObserver((r) => {
        const n = r.getEntries(), i = n[n.length - 1];
        this.metrics.LCP = i.startTime, v.debug("LCP指标:", this.metrics.LCP);
      }).observe({ entryTypes: ["largest-contentful-paint"] }), v.debug("开始监听LCP...");
    } catch (e) {
      v.warn("LCP不支持:", e);
    }
  }
  observeFID() {
    try {
      const e = new PerformanceObserver((r) => {
        const n = r.getEntries()[0];
        n && n.processingStart && (this.metrics.FID = n.processingStart - n.startTime, v.debug("FID指标:", this.metrics.FID), e.disconnect());
      });
      e.observe({ entryTypes: ["first-input"] }), v.debug("开始监听FID...");
    } catch (e) {
      v.warn("FID不支持:", e);
    }
  }
  observeCLS() {
    try {
      let e = 0;
      new PerformanceObserver((n) => {
        for (const i of n.getEntries())
          i.hadRecentInput || (e += i.value, this.metrics.CLS = e, v.debug("CLS指标:", this.metrics.CLS));
      }).observe({ entryTypes: ["layout-shift"] }), v.debug("开始监听CLS...");
    } catch (e) {
      v.warn("CLS不支持:", e);
    }
  }
  getPerformanceMetrics() {
    var e, r, n, i;
    if (this.isCollecting) {
      v.debug("性能指标正在收集中...");
      return;
    }
    this.isCollecting = !0, v.debug("开始收集性能指标...");
    try {
      const c = (r = (e = window.performance) == null ? void 0 : e.getEntriesByType) == null ? void 0 : r.call(e, "navigation"), u = c == null ? void 0 : c[0];
      if (!u) {
        v.warn("Navigation Timing API不支持");
        return;
      }
      const d = {
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
      this.metrics = d, v.debug("基础性能指标:", {
        DNS: d.DNS + "ms",
        TCP: d.TCP + "ms",
        TTFB: d.TTFB + "ms",
        DOMParse: d.DOMParse + "ms",
        domLoad: d.domLoad + "ms",
        loadTime: d.loadTime + "ms"
      });
      const g = ((i = (n = window.performance) == null ? void 0 : n.getEntriesByType) == null ? void 0 : i.call(n, "resource")) || [];
      this.metrics.resourceList = g, v.debug("资源加载数量:", this.metrics.resourceList.length), S.push({
        type: C.PERFORMANCE,
        message: "Performance Metrics Collected",
        data: this.metrics
      }), k.send({
        type: E.PERFORMANCE,
        time: p(),
        name: "performance",
        message: "Performance Metrics",
        url: window.location.href,
        metrics: this.metrics
      });
    } catch (c) {
      v.error("收集性能指标失败:", c);
    } finally {
      this.isCollecting = !1;
    }
  }
}
new Ft();
class $t {
  constructor() {
    this.lastHref = y(), this.init();
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
        const d = y();
        e.call(this, i, c, u);
        const g = u.toString();
        r.recordRouteChange(d, g);
      } else
        e.call(this, i, c);
    };
    const n = window.history.replaceState;
    window.history.replaceState = function(i, c, u) {
      if (u) {
        const d = y();
        n.call(this, i, c, u);
        const g = u.toString();
        r.recordRouteChange(d, g);
      } else
        n.call(this, i, c);
    }, window.addEventListener("popstate", () => {
      const i = y(), c = this.lastHref;
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
      time: p()
    };
    this.lastHref = r, S.push({
      type: C.ROUTE,
      message: `Route changed from ${e} to ${r}`,
      data: n
    }), k.send({
      type: E.ROUTE_ERROR,
      time: p(),
      message: `Route changed from ${e} to ${r}`,
      url: r,
      name: "route-change"
    });
  }
}
new $t();
const j = x.behavior;
class jt {
  // 点击事件节流时间(ms)
  constructor() {
    this.lastClick = 0, this.clickThrottle = 300, j.debug("用户行为监控初始化..."), this.init();
  }
  init() {
    j.debug("开始监听用户行为..."), this.initClick(), this.initScroll(), this.initVisibility(), j.debug("用户行为监控初始化完成");
  }
  /**
   * 监听点击事件
   */
  initClick() {
    j.debug("监听点击事件"), window.addEventListener("click", (e) => {
      const r = p();
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
      j.debug("记录点击行为:", i.message, {
        x: e.x,
        y: e.y,
        element: n.tagName.toLowerCase()
      }), this.recordBehavior(i);
    }, !0);
  }
  /**
   * 监听滚动事件
   */
  initScroll() {
    j.debug("监听滚动事件");
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
          time: p()
        };
        j.debug("记录滚动行为:", {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        }), this.recordBehavior(r), e = null;
      }, 500));
    }, !0);
  }
  /**
   * 监听页面可见性变化
   */
  initVisibility() {
    j.debug("监听页面可见性"), document.addEventListener("visibilitychange", () => {
      const e = {
        type: "visibility",
        message: `Page ${document.hidden ? "hidden" : "visible"}`,
        data: {
          hidden: document.hidden,
          visibilityState: document.visibilityState
        },
        time: p()
      };
      j.debug("页面可见性变化:", document.hidden ? "隐藏" : "可见"), this.recordBehavior(e);
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
    S.push({
      type: C.CLICK,
      message: e.message,
      data: e
    }), k.send({
      type: E.BEHAVIOR,
      time: e.time,
      message: e.message,
      url: y(),
      name: `user-${e.type}`,
      behavior: e
    });
  }
}
new jt();
const O = x.error;
class At {
  // 添加标志位防止递归
  constructor() {
    this.isReporting = !1, O.debug("初始化错误监控..."), this.init();
  }
  init() {
    O.debug("开始监听console.error"), this.initConsoleError(), O.debug("开始监听window错误"), this.initWindowError(), O.debug("开始监听内存使用"), this.initMemoryWarning(), O.debug("开始监听WebSocket错误"), this.initWebSocketError(), O.debug("错误监控初始化完成");
  }
  /**
   * 监控console.error
   */
  initConsoleError() {
    if (O.debug("开始监听console.error..."), !window.console || !window.console.error) return;
    const e = window.console.error;
    window.console.error = (...r) => {
      if (!this.isReporting) {
        this.isReporting = !0;
        const n = r.join(" ");
        O.debug("捕获到console.error:", n), this.reportError(E.CONSOLE_ERROR, n), this.isReporting = !1;
      }
      e.apply(window.console, r);
    };
  }
  /**
   * 监控window全局错误
   */
  initWindowError() {
    O.debug("开始监听window错误..."), window.addEventListener("error", (e) => {
      O.debug("捕获到window错误:", e.error), e.error && e.error.stack && e.error.message && this.reportError(E.WINDOW_ERROR, e.error.message, e.error);
    }, !0);
  }
  /**
   * 监控内存使用情况
   */
  initMemoryWarning() {
    O.debug("开始监听内存使用...");
    const e = window.performance;
    if (!e || !e.memory) return;
    setInterval(() => {
      const n = e.memory;
      if (!n) return;
      const i = n.usedJSHeapSize / n.jsHeapSizeLimit;
      i > 0.9 && (O.warn("内存使用过高:", {
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
    O.debug("开始监听WebSocket错误...");
    const e = window.WebSocket;
    window.WebSocket = (r, n) => {
      const i = new e(r, n);
      return O.debug("创建新的WebSocket连接:", r.toString()), i.addEventListener("error", () => {
        O.error("WebSocket连接错误:", r.toString()), this.reportError(E.WEBSOCKET_ERROR, "WebSocket connection error", void 0, {
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
      O.debug("防止递归上报");
      return;
    }
    this.isReporting = !0;
    try {
      O.debug("准备上报错误:", {
        type: e,
        message: r,
        error: n,
        data: i
      }), S.push({
        type: C.ERROR,
        message: r,
        data: {
          type: e,
          message: r,
          stack: n == null ? void 0 : n.stack,
          level: P.High,
          time: p(),
          url: y(),
          ...i
        }
      }), k.send({
        type: e,
        message: r,
        stack: n == null ? void 0 : n.stack,
        level: P.High,
        time: p(),
        url: y(),
        data: i
      }), O.debug("错误上报完成");
    } catch (c) {
      O.error("错误上报失败:", c);
    } finally {
      this.isReporting = !1;
    }
  }
}
new At();
class Mt {
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
        S.push({
          type: C.PERFORMANCE,
          message: "Page Load Performance",
          data: r
        }), k.send({
          type: E.PERFORMANCE,
          time: p(),
          message: "Page Load Performance Metrics",
          url: y(),
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
      S.push({
        type: C.PERFORMANCE,
        message: "Resource Load Performance",
        data: i
      }), k.send({
        type: E.PERFORMANCE,
        time: p(),
        message: "Resource Load Performance Metrics",
        url: y(),
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
new Mt();
const F = x.network;
class Ht {
  constructor() {
    F.debug("网络监控初始化..."), this.lastStatus = {
      online: navigator.onLine
    }, this.init();
  }
  init() {
    F.debug("开始监听网络状态..."), this.initOnlineStatus(), this.initConnectionInfo(), F.debug("网络监控初始化完成");
  }
  /**
   * 监控在线状态
   */
  initOnlineStatus() {
    F.debug("监听在线状态变化"), window.addEventListener("online", () => {
      F.debug("网络已连接"), this.handleNetworkChange({ online: !0 });
    }), window.addEventListener("offline", () => {
      F.debug("网络已断开"), this.handleNetworkChange({ online: !1 });
    });
  }
  /**
   * 监控网络信息
   */
  initConnectionInfo() {
    const e = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!e) {
      F.debug("浏览器不支持网络信息API");
      return;
    }
    F.debug("当前网络状态:", {
      type: e.effectiveType,
      downlink: e.downlink + "Mbps",
      rtt: e.rtt + "ms",
      saveData: e.saveData ? "开启" : "关闭"
    }), this.handleNetworkChange({
      online: navigator.onLine,
      effectiveType: e.effectiveType,
      downlink: e.downlink,
      rtt: e.rtt,
      saveData: e.saveData
    }), e.addEventListener("change", () => {
      F.debug("网络状态变化:", {
        type: e.effectiveType,
        downlink: e.downlink + "Mbps",
        rtt: e.rtt + "ms"
      }), this.handleNetworkChange({
        online: navigator.onLine,
        effectiveType: e.effectiveType,
        downlink: e.downlink,
        rtt: e.rtt,
        saveData: e.saveData
      });
    });
  }
  /**
   * 处理网络状态变化
   */
  handleNetworkChange(e) {
    this.isStatusChanged(e) && (F.debug("网络状态发生变化:", {
      from: this.lastStatus,
      to: e
    }), S.push({
      type: C.PERFORMANCE,
      message: "Network Status Changed",
      data: e
    }), k.send({
      type: E.PERFORMANCE,
      time: p(),
      message: "Network Status Changed",
      url: y(),
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
new Ht();
class Wt {
  constructor() {
    this.init();
  }
  init() {
    this.initPageView(), this.initClickTracking();
  }
  /**
   * 监听页面加载
   */
  initPageView() {
    window.addEventListener("load", () => {
      this.trackEvent({
        eventType: "page_view",
        timestamp: p(),
        url: y()
      });
    });
  }
  /**
   * 监听点击事件
   */
  initClickTracking() {
    window.addEventListener("click", (e) => {
      var i;
      const r = e.target;
      if (!r) return;
      const n = {
        eventType: "click",
        timestamp: p(),
        url: y(),
        additionalData: {
          element: r.tagName.toLowerCase(),
          id: r.id,
          className: r.className,
          text: (i = r.textContent) == null ? void 0 : i.trim()
        }
      };
      this.trackEvent(n);
    });
  }
  /**
   * 上报埋点事件
   */
  trackEvent(e) {
    console.log("Tracking Event:", e), k.send({
      type: E.TRACKING_EVENT,
      time: e.timestamp,
      message: e.eventType,
      url: e.url,
      data: e.additionalData
    });
  }
}
new Wt();
function Jt(o = {}) {
  Object.values(x).forEach((e) => {
    e.enable(o.debug || !1);
  }), x.core.log("SDK初始化开始..."), k.bindOptions(o), S.bindOptions(o), x.core.log("配置绑定完成"), It(), x.core.log("事件监听已设置"), x.core.log("所有监控器已初始化"), x.core.debug("当前配置:", o);
}
var de = { exports: {} }, K = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Me;
function Ut() {
  if (Me) return K;
  Me = 1;
  var o = We, e = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, c = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(d, g, I) {
    var T, $ = {}, M = null, Q = null;
    I !== void 0 && (M = "" + I), g.key !== void 0 && (M = "" + g.key), g.ref !== void 0 && (Q = g.ref);
    for (T in g) n.call(g, T) && !c.hasOwnProperty(T) && ($[T] = g[T]);
    if (d && d.defaultProps) for (T in g = d.defaultProps, g) $[T] === void 0 && ($[T] = g[T]);
    return { $$typeof: e, type: d, key: M, ref: Q, props: $, _owner: i.current };
  }
  return K.Fragment = r, K.jsx = u, K.jsxs = u, K;
}
var X = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var He;
function Bt() {
  return He || (He = 1, process.env.NODE_ENV !== "production" && function() {
    var o = We, e = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), d = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), $ = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), Q = Symbol.for("react.offscreen"), fe = Symbol.iterator, Ue = "@@iterator";
    function Be(t) {
      if (t === null || typeof t != "object")
        return null;
      var s = fe && t[fe] || t[Ue];
      return typeof s == "function" ? s : null;
    }
    var q = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function _(t) {
      {
        for (var s = arguments.length, a = new Array(s > 1 ? s - 1 : 0), l = 1; l < s; l++)
          a[l - 1] = arguments[l];
        qe("error", t, a);
      }
    }
    function qe(t, s, a) {
      {
        var l = q.ReactDebugCurrentFrame, m = l.getStackAddendum();
        m !== "" && (s += "%s", a = a.concat([m]));
        var R = a.map(function(h) {
          return String(h);
        });
        R.unshift("Warning: " + s), Function.prototype.apply.call(console[t], console, R);
      }
    }
    var Ve = !1, Ye = !1, Je = !1, ze = !1, Ke = !1, he;
    he = Symbol.for("react.module.reference");
    function Xe(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === n || t === c || Ke || t === i || t === I || t === T || ze || t === Q || Ve || Ye || Je || typeof t == "object" && t !== null && (t.$$typeof === M || t.$$typeof === $ || t.$$typeof === u || t.$$typeof === d || t.$$typeof === g || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === he || t.getModuleId !== void 0));
    }
    function Ge(t, s, a) {
      var l = t.displayName;
      if (l)
        return l;
      var m = s.displayName || s.name || "";
      return m !== "" ? a + "(" + m + ")" : a;
    }
    function ge(t) {
      return t.displayName || "Context";
    }
    function A(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && _("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
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
          case d:
            var s = t;
            return ge(s) + ".Consumer";
          case u:
            var a = t;
            return ge(a._context) + ".Provider";
          case g:
            return Ge(t, t.render, "ForwardRef");
          case $:
            var l = t.displayName || null;
            return l !== null ? l : A(t.type) || "Memo";
          case M: {
            var m = t, R = m._payload, h = m._init;
            try {
              return A(h(R));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var H = Object.assign, J = 0, me, pe, Re, Ee, be, ve, ye;
    function we() {
    }
    we.__reactDisabledLog = !0;
    function Qe() {
      {
        if (J === 0) {
          me = console.log, pe = console.info, Re = console.warn, Ee = console.error, be = console.group, ve = console.groupCollapsed, ye = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: we,
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
        J++;
      }
    }
    function Ze() {
      {
        if (J--, J === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: H({}, t, {
              value: me
            }),
            info: H({}, t, {
              value: pe
            }),
            warn: H({}, t, {
              value: Re
            }),
            error: H({}, t, {
              value: Ee
            }),
            group: H({}, t, {
              value: be
            }),
            groupCollapsed: H({}, t, {
              value: ve
            }),
            groupEnd: H({}, t, {
              value: ye
            })
          });
        }
        J < 0 && _("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ne = q.ReactCurrentDispatcher, oe;
    function Z(t, s, a) {
      {
        if (oe === void 0)
          try {
            throw Error();
          } catch (m) {
            var l = m.stack.trim().match(/\n( *(at )?)/);
            oe = l && l[1] || "";
          }
        return `
` + oe + t;
      }
    }
    var ie = !1, ee;
    {
      var et = typeof WeakMap == "function" ? WeakMap : Map;
      ee = new et();
    }
    function Oe(t, s) {
      if (!t || ie)
        return "";
      {
        var a = ee.get(t);
        if (a !== void 0)
          return a;
      }
      var l;
      ie = !0;
      var m = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var R;
      R = ne.current, ne.current = null, Qe();
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
          for (var f = D.stack.split(`
`), L = l.stack.split(`
`), b = f.length - 1, w = L.length - 1; b >= 1 && w >= 0 && f[b] !== L[w]; )
            w--;
          for (; b >= 1 && w >= 0; b--, w--)
            if (f[b] !== L[w]) {
              if (b !== 1 || w !== 1)
                do
                  if (b--, w--, w < 0 || f[b] !== L[w]) {
                    var N = `
` + f[b].replace(" at new ", " at ");
                    return t.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", t.displayName)), typeof t == "function" && ee.set(t, N), N;
                  }
                while (b >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        ie = !1, ne.current = R, Ze(), Error.prepareStackTrace = m;
      }
      var Y = t ? t.displayName || t.name : "", W = Y ? Z(Y) : "";
      return typeof t == "function" && ee.set(t, W), W;
    }
    function tt(t, s, a) {
      return Oe(t, !1);
    }
    function rt(t) {
      var s = t.prototype;
      return !!(s && s.isReactComponent);
    }
    function te(t, s, a) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return Oe(t, rt(t));
      if (typeof t == "string")
        return Z(t);
      switch (t) {
        case I:
          return Z("Suspense");
        case T:
          return Z("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case g:
            return tt(t.render);
          case $:
            return te(t.type, s, a);
          case M: {
            var l = t, m = l._payload, R = l._init;
            try {
              return te(R(m), s, a);
            } catch {
            }
          }
        }
      return "";
    }
    var z = Object.prototype.hasOwnProperty, Ce = {}, Se = q.ReactDebugCurrentFrame;
    function re(t) {
      if (t) {
        var s = t._owner, a = te(t.type, t._source, s ? s.type : null);
        Se.setExtraStackFrame(a);
      } else
        Se.setExtraStackFrame(null);
    }
    function nt(t, s, a, l, m) {
      {
        var R = Function.call.bind(z);
        for (var h in t)
          if (R(t, h)) {
            var f = void 0;
            try {
              if (typeof t[h] != "function") {
                var L = Error((l || "React class") + ": " + a + " type `" + h + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[h] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw L.name = "Invariant Violation", L;
              }
              f = t[h](s, h, l, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (b) {
              f = b;
            }
            f && !(f instanceof Error) && (re(m), _("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", a, h, typeof f), re(null)), f instanceof Error && !(f.message in Ce) && (Ce[f.message] = !0, re(m), _("Failed %s type: %s", a, f.message), re(null));
          }
      }
    }
    var ot = Array.isArray;
    function se(t) {
      return ot(t);
    }
    function it(t) {
      {
        var s = typeof Symbol == "function" && Symbol.toStringTag, a = s && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return a;
      }
    }
    function st(t) {
      try {
        return Pe(t), !1;
      } catch {
        return !0;
      }
    }
    function Pe(t) {
      return "" + t;
    }
    function ke(t) {
      if (st(t))
        return _("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", it(t)), Pe(t);
    }
    var Te = q.ReactCurrentOwner, at = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, _e, Le;
    function ct(t) {
      if (z.call(t, "ref")) {
        var s = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function ut(t) {
      if (z.call(t, "key")) {
        var s = Object.getOwnPropertyDescriptor(t, "key").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function lt(t, s) {
      typeof t.ref == "string" && Te.current;
    }
    function dt(t, s) {
      {
        var a = function() {
          _e || (_e = !0, _("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        a.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: a,
          configurable: !0
        });
      }
    }
    function ft(t, s) {
      {
        var a = function() {
          Le || (Le = !0, _("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        a.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: a,
          configurable: !0
        });
      }
    }
    var ht = function(t, s, a, l, m, R, h) {
      var f = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: t,
        key: s,
        ref: a,
        props: h,
        // Record the component responsible for creating this element.
        _owner: R
      };
      return f._store = {}, Object.defineProperty(f._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(f, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(f, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: m
      }), Object.freeze && (Object.freeze(f.props), Object.freeze(f)), f;
    };
    function gt(t, s, a, l, m) {
      {
        var R, h = {}, f = null, L = null;
        a !== void 0 && (ke(a), f = "" + a), ut(s) && (ke(s.key), f = "" + s.key), ct(s) && (L = s.ref, lt(s, m));
        for (R in s)
          z.call(s, R) && !at.hasOwnProperty(R) && (h[R] = s[R]);
        if (t && t.defaultProps) {
          var b = t.defaultProps;
          for (R in b)
            h[R] === void 0 && (h[R] = b[R]);
        }
        if (f || L) {
          var w = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          f && dt(h, w), L && ft(h, w);
        }
        return ht(t, f, L, m, l, Te.current, h);
      }
    }
    var ae = q.ReactCurrentOwner, De = q.ReactDebugCurrentFrame;
    function V(t) {
      if (t) {
        var s = t._owner, a = te(t.type, t._source, s ? s.type : null);
        De.setExtraStackFrame(a);
      } else
        De.setExtraStackFrame(null);
    }
    var ce;
    ce = !1;
    function ue(t) {
      return typeof t == "object" && t !== null && t.$$typeof === e;
    }
    function Ne() {
      {
        if (ae.current) {
          var t = A(ae.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function mt(t) {
      return "";
    }
    var xe = {};
    function pt(t) {
      {
        var s = Ne();
        if (!s) {
          var a = typeof t == "string" ? t : t.displayName || t.name;
          a && (s = `

Check the top-level render call using <` + a + ">.");
        }
        return s;
      }
    }
    function Ie(t, s) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var a = pt(s);
        if (xe[a])
          return;
        xe[a] = !0;
        var l = "";
        t && t._owner && t._owner !== ae.current && (l = " It was passed a child from " + A(t._owner.type) + "."), V(t), _('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', a, l), V(null);
      }
    }
    function Fe(t, s) {
      {
        if (typeof t != "object")
          return;
        if (se(t))
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ue(l) && Ie(l, s);
          }
        else if (ue(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var m = Be(t);
          if (typeof m == "function" && m !== t.entries)
            for (var R = m.call(t), h; !(h = R.next()).done; )
              ue(h.value) && Ie(h.value, s);
        }
      }
    }
    function Rt(t) {
      {
        var s = t.type;
        if (s == null || typeof s == "string")
          return;
        var a;
        if (typeof s == "function")
          a = s.propTypes;
        else if (typeof s == "object" && (s.$$typeof === g || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        s.$$typeof === $))
          a = s.propTypes;
        else
          return;
        if (a) {
          var l = A(s);
          nt(a, t.props, "prop", l, t);
        } else if (s.PropTypes !== void 0 && !ce) {
          ce = !0;
          var m = A(s);
          _("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", m || "Unknown");
        }
        typeof s.getDefaultProps == "function" && !s.getDefaultProps.isReactClassApproved && _("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Et(t) {
      {
        for (var s = Object.keys(t.props), a = 0; a < s.length; a++) {
          var l = s[a];
          if (l !== "children" && l !== "key") {
            V(t), _("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), V(null);
            break;
          }
        }
        t.ref !== null && (V(t), _("Invalid attribute `ref` supplied to `React.Fragment`."), V(null));
      }
    }
    var $e = {};
    function je(t, s, a, l, m, R) {
      {
        var h = Xe(t);
        if (!h) {
          var f = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (f += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var L = mt();
          L ? f += L : f += Ne();
          var b;
          t === null ? b = "null" : se(t) ? b = "array" : t !== void 0 && t.$$typeof === e ? (b = "<" + (A(t.type) || "Unknown") + " />", f = " Did you accidentally export a JSX literal instead of a component?") : b = typeof t, _("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", b, f);
        }
        var w = gt(t, s, a, m, R);
        if (w == null)
          return w;
        if (h) {
          var N = s.children;
          if (N !== void 0)
            if (l)
              if (se(N)) {
                for (var Y = 0; Y < N.length; Y++)
                  Fe(N[Y], t);
                Object.freeze && Object.freeze(N);
              } else
                _("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Fe(N, t);
        }
        if (z.call(s, "key")) {
          var W = A(t), D = Object.keys(s).filter(function(Ct) {
            return Ct !== "key";
          }), le = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!$e[W + le]) {
            var Ot = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            _(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, le, W, Ot, W), $e[W + le] = !0;
          }
        }
        return t === n ? Et(w) : Rt(w), w;
      }
    }
    function bt(t, s, a) {
      return je(t, s, a, !0);
    }
    function vt(t, s, a) {
      return je(t, s, a, !1);
    }
    var yt = vt, wt = bt;
    X.Fragment = n, X.jsx = yt, X.jsxs = wt;
  }()), X;
}
process.env.NODE_ENV === "production" ? de.exports = Ut() : de.exports = Bt();
var qt = de.exports;
class zt extends St.Component {
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
      url: y(),
      name: e.name,
      stack: e.stack,
      time: p(),
      level: P.Normal
    }, c = r.componentStack || void 0;
    typeof c == "string" && (i.componentStack = c), S.push({
      type: C.ERROR,
      message: i.message,
      data: i
    }), k.send(i), n && n(e, r);
  }
  render() {
    return this.state.hasError ? this.props.fallback || /* @__PURE__ */ qt.jsx("div", { style: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#fff5f5",
      color: "#ff4d4f",
      border: "1px solid #ffccc7",
      borderRadius: "4px"
    }, children: "Something went wrong" }) : this.props.children;
  }
}
function Vt(o, e, r, n, i) {
  var d, g;
  const c = (i == null ? void 0 : i.version) || "unknown", u = {
    type: E.VUE_ERROR,
    message: `${o.message}
info: ${r}`,
    level: n,
    url: y(),
    name: o.name,
    stack: o.stack,
    time: p(),
    componentName: ((d = e == null ? void 0 : e.$options) == null ? void 0 : d._componentTag) || "anonymous",
    propsData: (g = e == null ? void 0 : e.$options) == null ? void 0 : g.propsData,
    vueVersion: c
  };
  S.push({
    type: C.ERROR,
    message: u.message,
    data: u
  }), k.send(u);
}
const Kt = {
  install(o) {
    if (!o || !o.config) return;
    const e = o.config.errorHandler;
    o.config.errorHandler = function(r, n, i) {
      Vt(r, n, i, P.Normal, o), typeof e == "function" && e.call(this, r, n, i), console && !o.config.silent && console.error("Vue Error Info: ", r);
    };
  }
};
function Xt({
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
    time: p(),
    url: y()
  };
  n && (n instanceof Error ? c.stack = n.stack : c.stack = typeof n == "string" ? n : JSON.stringify(n)), S.push({
    type: C.CUSTOM,
    message: o,
    data: c
  }), k.send(c);
}
export {
  C as BreadcrumbTypes,
  zt as ErrorBoundary,
  E as ErrorTypes,
  Pt as EventTypes,
  Kt as MonitorVue,
  P as Severity,
  S as breadcrumb,
  Jt as init,
  Xt as log,
  x as loggers
};
