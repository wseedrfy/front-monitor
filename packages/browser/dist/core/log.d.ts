import { ErrorTypes, Severity } from '../types';

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
export declare function log({ message, tag, level, ex, type, }: LogTypes): void;
export {};
