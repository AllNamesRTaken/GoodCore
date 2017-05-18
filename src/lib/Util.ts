import { Md5 } from "ts-md5/dist/md5";
import { Global } from "./Global";
import { Test } from "./Test";
import { Timer } from "./Timer";

export interface IZeroEvent extends Event {
	data: string;
}
export interface IObjectWithFunctions<T extends Object | void> {
	[key: string]: (...args: any[]) => T;
}

export class _Util {
	private _int: number = 0;

	public constructor() {
		this.Init();
	}
	public Init(win?: Window) {
		if (win !== undefined) {
			Global.window = win;
		}
		this._CreateAsync();
	}
	private _CreateAsync() {
		this.Async = (() => {
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
			if (Test.HasWindow) {
				Global.window.addEventListener("message", handleMessage, true);
				return setZeroTimeout;
			} else {
				return setTimeout;
			}
		})();
	}
	public GetFunctionName(fn: Function): string {
		let result: string;
		if (fn.hasOwnProperty("name") !== undefined) {
			result = (fn as any).name;
		} else {
			const fnString = fn.toString();
			result = fnString.substring(9, fnString.indexOf("("));
		}
		return result;
	}
	public GetFunctionCode(fn: Function): string {
		let result: string;
		const fnString = fn.toString();
		result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
		return result;
	}
	public NewUUID(): string { // Public Domain/MIT
		let d: number = new Date().getTime();
		d += Timer.Now();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			const r: number = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}
	public NewInt(): number {
		return this._int++;
	}
	public Debugger(): void {
		// tslint:disable-next-line:no-debugger
		debugger;
	}
	public PipeOut(
		log: (...args: any[]) => void,
		warn: (...args: any[]) => void,
		error: (...args: any[]) => void
	) {
		if (Test.HasConsole) {
			this.ProxyFn(
				Global.window.console as any,
				"log",
				function(superfn, ...args: any[]) { superfn(...args); log(...args); }
			);
			this.ProxyFn(
				Global.window.console as any,
				"warn",
				function(superfn, ...args: any[]) { superfn(...args); warn(...args); }
			);
			this.ProxyFn(
				Global.window.console as any,
				"error",
				function(superfn, ...args: any[]) { superfn(...args); error(...args); }
			);
		} else {
			const console = {
				log,
				warn,
				error
			};
			if (!Test.HasWindow) {
				Global.window = {
					console
				} as any;
			} else {
				(Global.window as any).console = console;
			}
		}
	}
	public Assert(assertion: boolean, message: string, isDebug: boolean = false): boolean {
		let result = true;
		if (!assertion) {
			if (Test.HasConsole) {
				result = false;
				Global.window.console.error("Assertion failed: " + message);
			}
			if (isDebug) {
				this.Debugger();
				//throw errorMessage;
			}
		}
		return result;
	}
	public ProxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(
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
	public Md5(str: string): string {
		return Md5.hashStr(str) as string;
	}
	//Like SetTimeout but 0
	public Async: (fn: Function) => void;
}

export let Util = new _Util();
