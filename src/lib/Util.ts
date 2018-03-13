import { Global } from "./Global";
import { hasConsole, hasWindow, isNotUndefined } from "./Test";
import { Timer } from "./Timer";

export interface IObjectWithFunctions<T extends Object | void> {
	[key: string]: (...args: any[]) => T;
}

class LoggableCounter {
	public name = "";
	private _value = 0;
	public log() {
		console.log("Counter " + this.name + ": " + this.toString());
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
	valueOf(): number {
		return this._value;
	}
	toString(): string {
		return this._value.toString();
	}
}
class UtilState {
	public static _int: {[key: string]: number} = {"0": 0};
	public static _counter: {[key: string]: LoggableCounter} = {"": new LoggableCounter("")};
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
export function callDebugger(): void {
	// tslint:disable-next-line:no-debugger
	debugger;
}
export function pipeOut(
	log: (...args: any[]) => void,
	warn: (...args: any[]) => void,
	error: (...args: any[]) => void
) {
	if (hasConsole()) {
		proxyFn(
			console as any,
			"log",
			function (superfn, ...args: any[]) { superfn(...args); log(...args); }
		);
		proxyFn(
			console as any,
			"warn",
			function (superfn, ...args: any[]) { superfn(...args); warn(...args); }
		);
		proxyFn(
			console as any,
			"error",
			function (superfn, ...args: any[]) { superfn(...args); error(...args); }
		);
	} else {
		const console = {
			log,
			warn,
			error
		};
		if (!(hasWindow())) {
			Global.window = {
			} as any;
		}
		(Global.window as any).console = console;
	}
}
export function assert(assertion: boolean, message: string, isDebug: boolean = true): boolean {
	let result = true;
	if (!assertion) {
		if (hasConsole) {
			result = false;
			console.error("Assertion failed: " + message);
		}
		if (isDebug) {
			callDebugger();
			//throw errorMessage;
		}
	}
	return result;
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
	while (++i < count) {
		fn(i);
	}
}
export function toArray<T>(arr: ArrayLike<T>): T[] {
	return Array.prototype.slice.call(arr);
}
export const DEFAULT_DURATION = 100;
export interface IDebounceOptions {
    leading: boolean;
}
export interface IDebouncedFunction extends Function{
	clear?: () => void;
}
export function debounce<T extends Function>(method: T, duration:number = DEFAULT_DURATION, options?: Partial<IDebounceOptions>): IDebouncedFunction {
    let timeoutHandle: any = null;

    let wrapper: IDebouncedFunction = function (...args: any[]) {
        if(timeoutHandle === null) {
            if (isNotUndefined(options) && isNotUndefined(options!.leading)) {
                method.apply(this, args);
            }    
        }
        wrapper.clear!()

        timeoutHandle = setTimeout(() => {
            timeoutHandle = null
            method.apply(this, args)
        }, duration)
    }

    wrapper.clear = function () {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle)
            timeoutHandle = null
        }
    }

    return wrapper
}