export interface IZeroEvent extends Event {
    data: string;
}
export interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}
export declare class Util {
    constructor();
    static init(win?: Window): void;
    private static _createAsync();
    static getFunctionName(fn: Function): string;
    static getFunctionCode(fn: Function): string;
    static newUUID(): string;
    static newInt(): number;
    static debugger(): void;
    static pipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
    static assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
    static proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
    static async(fn: Function): void;
    static loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
    static toArray<T>(arr: ArrayLike<T>): T[];
}
