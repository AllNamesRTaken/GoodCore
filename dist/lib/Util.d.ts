export interface IZeroEvent extends Event {
    data: string;
}
export declare type ObjectWithFunctions<T extends Object | void> = {
    [key: string]: (...args: any[]) => T;
};
export declare class _Util {
    private _window;
    private _int;
    _(win?: Window): _Util;
    constructor(win?: Window);
    Init(win?: Window): void;
    readonly HasWindow: boolean;
    readonly HasConsole: boolean;
    ToArray<T>(arr: ArrayLike<T>): Array<T>;
    IsArray(it: any): boolean;
    IsElement(target: any): boolean;
    IsFunction(it: any): boolean;
    GetFunctionName(fn: Function): string;
    GetFunctionCode(fn: Function): string;
    NewUUID(): string;
    NewInt(): number;
    Debugger(): void;
    PipeOut(log: (...args: Array<any>) => void, warn: (...args: Array<any>) => void, error: (...args: Array<any>) => void): void;
    Assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
    ProxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends ObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
    Md5(str: string): string;
    Async: (fn: Function) => void;
}
export declare var Util: _Util;
