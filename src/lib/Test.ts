import { Global } from "./Global";
import { once } from "./Decorators";

export function hasWindow(): boolean {
	return Global.window !== null;
}

export class Env {
	public static useNative?: boolean = undefined;
	@once
	public static isNode(): boolean {
		return !hasWindow() || typeof module !== "undefined" && module.exports !== undefined;
	}
	@once
	public static isOpera(): boolean {
		return hasWindow() && Global.window!.navigator.userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/) !== null;
	}
	@once
	public static isFirefox(): boolean {
		return hasWindow() && Global.window!.navigator.userAgent.toLowerCase().match(/(?:firefox|fxios)\/(\d+)/) !== null;
	}
	@once
	public static isSafari(): boolean {
		return hasWindow() && Global.window!.navigator.userAgent.match(/version\/(\d+).+?safari/) !== null;
	}
	@once
	public static isIE(): boolean {
		return hasWindow() && Global.window!.navigator.userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/) !== null;
	}
	@once
	public static isEdge(): boolean {
		return hasWindow() && Global.window!.navigator.userAgent.match(/edge\/(\d+)/) !== null;
	}
	@once
	public static isChrome(): boolean {
		return hasWindow() 
			&& ((/google inc/.test(Global.window!.navigator.vendor.toLowerCase()) ? 
			Global.window!.navigator.userAgent.toLowerCase().match(/(?:chrome|crios)\/(\d+)/) : 
			null) !== null) 
			&& !this.isOpera();
	}
	@once
	public static isBlink(): boolean {
		return hasWindow() && (this.isChrome || this.isOpera) && !!((Global.window as any).CSS);
	}
	public static hasFastNativeArrays(): boolean {
		// Node 10+, Chrome (modern) and FF (modern) has some very fast array operations
		return this.useNative === undefined ? this._hasFastNativeArrays() : this.useNative!;
	}
	@once
	private static _hasFastNativeArrays(): boolean {
		return !this.isIE();
	}
}

export function hasConsole(): boolean {
	return hasWindow() && Global.window!.console !== undefined || typeof (console) === "function";
}
export function isObject(it: any): boolean {
	return it !== null && typeof it === "object";
}
export function isArray(it: any): boolean {
	return Array.isArray ? Array.isArray(it) : Object.prototype.toString.call(it) === "[object Array]";
}
export function isElement(target: any): boolean {
	return target !== undefined && target !== null && (target as Element).nodeType === 1 ? true : false;
}
export function isFunction(it: any): boolean {
	return Object.prototype.toString.call(it) === "[object Function]";
}
export function isNumber(x: any): boolean {
	return x === + (x as number);
}
export function isInt(x: any): boolean {
	return isNumber(x) && ((x as number) === ((x as number) | 0));
}
export function isString(x: any): boolean {
	return isNotNullOrUndefined(x) && (x as string).constructor === String;
}
export function areNullOrUndefined(...args: any[]): boolean {
	const len = args.length;
	let i = -1;
	let a: any;
	let result = false;
	while (!result && ++i < len) {
		a = args[i];
		result = a === undefined || a === null;
	}
	return result;
}
export function areNotNullOrUndefined(...args: any[]): boolean {
	return !areNullOrUndefined(...args);
}
export function isNull(arg: any): boolean {
	return arg === null;
}
export function isNotNull(arg: any): boolean {
	return arg !== null;
}
export function isNullOrUndefined(arg: any): boolean {
	return arg === undefined || arg === null;
}
export function isNotNullOrUndefined(arg: any): boolean {
	return !isNullOrUndefined(arg);
}
export function areUndefined(...args: any[]): boolean {
	const len = args.length;
	let i = -1;
	let a: any;
	let result = false;
	while (!result && ++i < len) {
		a = args[i];
		result = a === undefined;
	}
	return result;
}
export function areNotUndefined(...args: any[]): boolean {
	return !areUndefined(...args);
}
export function isUndefined(arg: any): boolean {
	return arg === undefined;
}
export function isNotUndefined(arg: any): boolean {
	return !isUndefined(arg);
}
