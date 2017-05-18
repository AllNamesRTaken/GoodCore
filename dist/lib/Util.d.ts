export interface IZeroEvent extends Event {
    data: string;
}
export interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}
export declare class _Util {
    private _int;
    constructor();
    Init(win?: Window): void;
    private _CreateAsync();
    GetFunctionName(fn: Function): string;
    GetFunctionCode(fn: Function): string;
    NewUUID(): string;
    NewInt(): number;
    Debugger(): void;
    PipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
    Assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
    ProxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
    Md5(str: string): string;
    Async: (fn: Function) => void;
}
export declare let Util: _Util;
