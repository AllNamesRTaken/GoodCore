export interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}
export declare function init(win?: Window): void;
export declare function getFunctionName(fn: Function): string;
export declare function getFunctionCode(fn: Function): string;
export declare function newUUID(): string;
export declare function newInt(): number;
export declare function callDebugger(): void;
export declare function pipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
export declare function assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
export declare function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
export declare function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
export declare function toArray<T>(arr: ArrayLike<T>): T[];
