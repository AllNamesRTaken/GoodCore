/// <reference path="base.d.ts" />
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
export function once<T extends (...args: any[]) => S, S = void>(fn: T): T;
export function deprecate<T extends Function>(instead: string, fn: T): T;
export function init(win?: Window): void;
export function getDate(delta?: string, start?: Date): Date;
export function newUUID(): string;
export function newInt(key?: number | string): number;
export function callDebugger(): void;
export function pipeOut(
    log?: ((...args: any[]) => void) | null,
	warn?: ((...args: any[]) => void) | null,
	error?: ((...args: any[]) => void) | null,
	catchDefault?: boolean | {log?: boolean, warn?: boolean, error: boolean}
): void;
export class AssertError extends Error {}
export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(objOrClass: U, fnName: string, proxyFn: (originalFn: (...args: any[]) => S | V, ...args: any[]) => void): void;
export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
export function toArray<T>(arr: ArrayLike<T>): T[];
export function debounce<T extends (...args: any[]) => any, U extends Partial<IDebounceOptions>>(
	method: T,
	duration?: number,
	options?: U,
): IDebouncedFunction<T, U>;
export function throttle<T extends (...args: any[]) => unknown>(
	method: T,
	duration?: number,
	options?: Partial<IThrottleOptions>
): IThrottledFunction<T>;
