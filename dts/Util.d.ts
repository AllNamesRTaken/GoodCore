/// <reference path="base.d.ts" />

export interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}
export class LoggableCounter {
    public name: string;
    public log(): void;
    public inc(): LoggableCounter;
    public reset(): LoggableCounter;
    valueOf(): number;
    toString(): string;
}
export function counter(key?: number | string): LoggableCounter;
export function count(key?: number | string): LoggableCounter;
export function init(win?: Window): void;
export function getFunctionName(fn: Function): string;
export function getFunctionCode(fn: Function): string;
export function newUUID(): string;
export function newInt(): number;
export function callDebugger(): void;
export function pipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
export function assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(objOrClass: U, fnName: string, proxyFn: (originalFn: (...args: any[]) => S | V, ...args: any[]) => void): void;
export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
export function toArray<T>(arr: ArrayLike<T>): T[];
interface IDebounceOptions {
    leading: boolean;
}
export interface IDebouncedFunction<T> {
	(...args: any[]): T
	resetTimer?: () => void;
}
export function debounce<S extends any, T extends (...args: any[])=>S|void>(method: T, duration?:number, options?: Partial<IDebounceOptions>): IDebouncedFunction<S>;
