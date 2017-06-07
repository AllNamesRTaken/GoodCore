import { Global } from "./Global";
import { Test } from "./Test";
import { Timer } from "./Timer";

export interface IZeroEvent extends Event {
	data: string;
}
export interface IObjectWithFunctions<T extends Object | void> {
	[key: string]: (...args: any[]) => T;
}

class UtilState {
	public static _int: number = 0;
}
export class Util {

	constructor() {
	}
	public static init(win?: Window) {
		if (win !== undefined) {
			Global.window = win;
		}
		Util._createAsync();
	}
	private static _createAsync() {
		Util.async = (() => {
			const timeouts: Function[] = [];
			const messageName = "zero-timeout-message";

			function setZeroTimeout(fn: Function): void {
				timeouts.push(fn);
				Global.window.postMessage(messageName, "*");
			}

			function handleMessage(event: IZeroEvent) {
				if ((((event as any).source) === undefined || ((event as any).source) === Global.window) && event.data === messageName) {
					event.stopPropagation();
					if (timeouts.length > (0 | 0)) {
						const fn = timeouts.shift();
						fn();
					}
				}
			}
			if (Test.hasWindow) {
				Global.window.addEventListener("message", handleMessage, true);
				return setZeroTimeout;
			} else {
				return setTimeout;
			}
		})();
	}
	public static getFunctionName(fn: Function): string {
		let result: string;
		if (fn.hasOwnProperty("name") !== undefined) {
			result = (fn as any).name;
		} else {
			const fnString = fn.toString();
			result = fnString.substring(9, fnString.indexOf("("));
		}
		return result;
	}
	public static getFunctionCode(fn: Function): string {
		let result: string;
		const fnString = fn.toString();
		result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
		return result;
	}
	public static newUUID(): string { // public static Domain/MIT
		let d: number = new Date().getTime();
		d += Timer.now();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			const r: number = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}
	public static newInt(): number {
		return UtilState._int++;
	}
	public static debugger(): void {
		// tslint:disable-next-line:no-debugger
		debugger;
	}
	public static pipeOut(
		log: (...args: any[]) => void,
		warn: (...args: any[]) => void,
		error: (...args: any[]) => void
	) {
		if (Test.hasConsole) {
			Util.proxyFn(
				console as any,
				"log",
				function(superfn, ...args: any[]) { superfn(...args); log(...args); }
			);
			Util.proxyFn(
				console as any,
				"warn",
				function(superfn, ...args: any[]) { superfn(...args); warn(...args); }
			);
			Util.proxyFn(
				console as any,
				"error",
				function(superfn, ...args: any[]) { superfn(...args); error(...args); }
			);
		} else {
			const console = {
				log,
				warn,
				error
			};
			if (!Test.hasWindow) {
				Global.window = {
					console
				} as any;
			} else {
				(Global.window as any).console = console;
			}
		}
	}
	public static assert(assertion: boolean, message: string, isDebug: boolean = true): boolean {
		let result = true;
		if (!assertion) {
			if (Test.hasConsole) {
				result = false;
				console.error("Assertion failed: " + message);
			}
			if (isDebug) {
				Util.debugger();
				//throw errorMessage;
			}
		}
		return result;
	}
	public static proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(
		that: U,
		fnName: string,
		proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void,
		onPrototype: boolean = false
	): void {
		const fn = that[fnName];
		const _superFn = function(...args: any[]): S {
			if (args.length !== 0) {
				return fn.apply(that, args);
			} else {
				return fn.call(that);
			}
		};
		if (onPrototype && that.prototype && (that.prototype as any)[fnName]) {
			(that.prototype as any)[fnName] = proxyFn.bind(_superFn);
		} else {
			that[fnName] = proxyFn.bind(that, _superFn);
		}
	}
	//Like SetTimeout but 0
	public static async(fn: Function): void {}
	public static loop(count: number, fn: (i: number, ...args: any[]) => any | void): void {
		let i = -1;
		while (++i < count) {
			fn(i);
		}
	}
	public static toArray<T>(arr: ArrayLike<T>): T[] {
		return Array.prototype.slice.call(arr);
	}
}
