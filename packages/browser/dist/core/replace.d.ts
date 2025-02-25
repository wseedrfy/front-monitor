import { EventTypes } from '../types';

export declare function subscribeEvent(handler: {
    callback: Function;
    type: EventTypes;
}): boolean;
export declare function triggerHandlers(type: EventTypes, data: any): void;
export declare function setupReplace(): void;
