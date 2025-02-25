type VueInstance = any;
/**
 * Vue错误处理插件
 * 用法:
 * import { MonitorVue } from '@monitor/browser';
 * Vue.use(MonitorVue);
 */
export declare const MonitorVue: {
    install(Vue: VueInstance): void;
};
export {};
