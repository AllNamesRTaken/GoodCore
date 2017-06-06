export interface IZeroEvent extends Event {
    data: string;
}
export interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}
export declare class _Util {
    private _int;
    constructor();
    init(win?: Window): void;
    private _createAsync();
    getFunctionName(fn: Function): string;
    getFunctionCode(fn: Function): string;
    newUUID(): string;
    newInt(): number;
    debugger(): void;
    pipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
    assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
    proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
    md5(str: string): string;
    async: (fn: Function) => void;
    loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
    toArray<T>(arr: ArrayLike<T>): T[];
}
export declare let Util: _Util;
