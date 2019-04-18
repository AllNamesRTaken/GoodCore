import { Global } from "./Global";
import { hasConsole, isNotUndefined, isNotNullOrUndefined, isUndefined } from "./Test";
import { Timer } from "./Timer";

export interface IObjectWithFunctions<T extends Object | void> {
	[key: string]: (...args: any[]) => T;
}

class LoggableCounter {
	public name = "";
	private _value = 0;
	public log() {
		console.log(`Counter ${this.name}: ${this.toString()}`);
	}
	constructor(name: string = "") {
		this.name = name;
	}
	public inc() {
		this._value++;
		return this;
	}
	public reset() {
		this._value = 0;
		return this;
	}
	public valueOf(): number {
		return this._value;
	}
	public toString(): string {
		return this._value.toString();
	}
}
class UtilState {
	public static _int: { [key: string]: number } = { 0: 0 };
	public static _counter: { [key: string]: LoggableCounter } = { "": new LoggableCounter("") };
}

export function once<T extends (...args: any[]) => S, S = void>(fn: T): T {
	let result: S;
	let first = true;
	return function (...args: any[]): S {
		if (first) {
			result = fn.apply(this, args);
			first = false;
		}
		return result;
	} as T;
}
export function init(win?: Window) {
	if (win !== undefined) {
		Global.window = win;
	}
}
export function getFunctionName(fn: Function): string {
	let result: string;
	if (fn.hasOwnProperty("name") !== undefined) {
		result = (fn as any).name;
	} else {
		//for old browsers not inferring anonymous function names.
		const fnString = fn.toString();
		result = fnString.substring(9, fnString.indexOf("("));
	}
	return result;
}
export function getFunctionCode(fn: Function): string {
	let result: string;
	const fnString = fn.toString();
	result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
	return result;
}
function stdTimezoneOffset(date: Date) {
    var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
export function isDaylightSavingTime(date: Date) {
    return date.getTimezoneOffset() < stdTimezoneOffset(date);
}
export function getDate(delta: string = "", start?: Date): Date {
	const date = start ? new Date(start.getTime()) : new Date();
	const rel = delta.split(" ").join("");
	const [, sign, years, months, days, hours, mins, secs] = toArray(/([+-])?(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(rel) as ArrayLike<string>);
	const plus = sign !== "-"; 
	if (secs) date.setSeconds(date.getSeconds() + (plus ? +parseInt(secs, 10) : -parseInt(secs, 10)));
	if (mins) date.setMinutes(date.getMinutes() + (plus ? +parseInt(mins, 10): -parseInt(mins, 10)));
	if (hours) date.setHours(date.getHours() + (plus ? +parseInt(hours, 10): -parseInt(hours, 10)));
	if (days) date.setDate(date.getDate() + (plus ? +parseInt(days, 10) : -parseInt(days, 10)));
	if (months) date.setMonth(date.getMonth() + (plus ? +parseInt(months, 10) : -parseInt(months, 10)));
	if (years) date.setFullYear(date.getFullYear() + (plus ? +parseInt(years, 10) : -parseInt(years, 10)));
	return date;
}
export function newUUID(): string { // export function Domain/MIT
	let d: number = new Date().getTime();
	d += Timer.now();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r: number = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
	});
}
export function newInt(key: number | string = 0): number {
	if (UtilState._int[key] === undefined) {
		UtilState._int[key] = 0;
	}
	return UtilState._int[key]++;
}
export function counter(key: number | string = ""): LoggableCounter {
	if (UtilState._counter[key] === undefined) {
		UtilState._counter[key] = new LoggableCounter(key.toString());
	}
	return UtilState._counter[key];
}
export function count(key: number | string = ""): LoggableCounter {
	return counter(key).inc();
}
export function pipeOut(
	log?: ((...args: any[]) => void) | null,
	warn?: ((...args: any[]) => void) | null,
	error?: ((...args: any[]) => void) | null
) {
	if (hasConsole()) {
		if (isNotNullOrUndefined(log)) {
			proxyFn(
				Global.global.console as any,
				"log",
				function (superfn, ...args: any[]) {
					superfn.apply(this, args);
					log!.apply(this, args);
				}
			);
		}
		if (isNotNullOrUndefined(warn)) {
			proxyFn(
				Global.global.console as any,
				"warn",
				function (superfn, ...args: any[]) {
					superfn.apply(this, args);
					warn!.apply(this, args);
				}
			);
		}
		if (isNotNullOrUndefined(error)) {
			proxyFn(
				Global.global.console as any,
				"error",
				function (superfn, ...args: any[]) {
					superfn.apply(this, args);
					error!.apply(this, args);
				}
			);
		}
	}
}
export class AssertError extends Error {
	constructor(m: string) {
		super(m);
		Object.setPrototypeOf(this, AssertError.prototype);
	}
}
export function assert(assertion: boolean, message: string = "", noThrow: boolean = false) {
	if (!assertion) {
		if (noThrow) {
			console.error("Assertion failed: " + message);
		} else {
			throw new AssertError(message);
		}
	}
}
export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(
	objOrClass: U,
	fnName: string,
	proxyFn: (
		originalFn: (...args: any[]) => S | V,
		...args: any[]) => void
): void {
	objOrClass = isNotUndefined(objOrClass.prototype) ? objOrClass.prototype : objOrClass;
	const fn = objOrClass[fnName];
	const _superFn = function (...args: any[]): S {
		if (args.length !== 0) {
			return fn.apply(this || objOrClass, args);
		} else {
			return fn.call(this || objOrClass);
		}
	};
	objOrClass[fnName] = proxyFn.bind(objOrClass, _superFn);
}
export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void {
	let i = -1;
	let run = true;
	while (run && ++i < count) {
		run = fn(i) !== true;
	}
}
export function toArray<T>(arr: ArrayLike<T>): T[] {
	return Array.prototype.slice.call(arr);
}
export const DEFAULT_DURATION = 100;
export interface IDebounceOptions {
	leading: boolean;
}
type InnerResultType<T> = T extends (...a: unknown[]) => PromiseLike<infer S> ? S : T extends (...a: unknown[]) => infer S ? S : never;
type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ? 
	PromiseLike<S> : 
	T extends (...a: unknown[]) => infer R ? 
		U extends { leading: true } ?
			R : 
			PromiseLike<R>
		: never;
export interface IDebouncedFunction<T, U> {
	(...args: ArgTypes<T>): DebounceResultType<T, U>;
	resetTimer?(): void;
}
export function debounce<T extends (...args: any[]) => any, U extends Partial<IDebounceOptions>>(
	method: T,
	duration: number = DEFAULT_DURATION,
	options?: U,
): IDebouncedFunction<T, U> {
	let timeoutHandle: number | null = null;
	let leading = isUndefined(options) || isUndefined(options!.leading) ? false : options!.leading;
	let executed = false;
	let result: DebounceResultType<T, U> | undefined = undefined;
	let resolve: (value?: DebounceResultType<T, U>) => void;
	let reject: (value?: DebounceResultType<T, U>) => void;

	let wrapper: IDebouncedFunction<T, U> = function (...args: any[]) {
		if (!leading) {
			result = result || new Promise<InnerResultType<T>>((_resolve, _reject) => {
				resolve = _resolve as (value?: DebounceResultType<T, U>) => void;
				reject = _reject as (value?: DebounceResultType<T, U>) => void;
			}) as DebounceResultType<T, U>;
		}
		if (timeoutHandle === null) {
			if (leading) {
				executed = true;
				result = method.apply(this, args);
			}
		}
		wrapper.resetTimer!();

		timeoutHandle = setTimeout(() => {
			timeoutHandle = null;
			if (!executed) {
				let value: DebounceResultType<T, U> = method.apply(this, args);
				if (isNotNullOrUndefined(value) && (value as Promise<DebounceResultType<T, U>>).hasOwnProperty("then")) {
					(value as Promise<DebounceResultType<T, U>>).then((v) => {
						resolve(v);
					});
				} else {
					resolve(value);
				}
			}
			executed = false;
			result = undefined;
		}, duration) as any;
		return result as DebounceResultType<T, U>;
	};

	wrapper.resetTimer = function () {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}
	};

	return wrapper;
}
export interface IThrottleOptions {
	leading: boolean;
	trailing: boolean;
}
export interface IThrottledFunction<T> {
	(...args: ArgTypes<T>): ResultType<T>;
}
export function throttle<T extends (...args: any[]) => any>(
	method: T,
	duration: number = DEFAULT_DURATION,
	options?: Partial<IThrottleOptions>
): IThrottledFunction<T> {
	let timeoutHandle: number | null = null;
	let leading = isUndefined(options) || isUndefined(options!.leading) ? true : options!.leading;
	let trailing = !leading || isUndefined(options) || isUndefined(options!.trailing) ? true : options!.trailing;
	let result: ResultType<T>;
	let lastContext: any;
	let lastArgs: any[];

	let wrapper: IThrottledFunction<T> = function (...args: any[]): ResultType<T> {
		lastArgs = args;
		lastContext = this;
		if (timeoutHandle === null) {
			if (leading) {
				result = method.apply(lastContext, lastArgs);
			}

			if (!trailing) {
				lastContext = null;
				lastArgs = [];
			}
			timeoutHandle = setTimeout(() => {
				timeoutHandle = null;
				if (trailing) {
					method.apply(lastContext, lastArgs);
					lastContext = null;
					lastArgs = [];
				}
			}, duration) as any;
		}
		return result;
	};

	return wrapper;
}
