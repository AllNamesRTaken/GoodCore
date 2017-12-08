import { Global } from "./Global";

export function hasWindow(): boolean {
	return Global.window !== null;
}
export function hasConsole(): boolean {
	return this.hasWindow() && Global.window.console !== undefined || typeof (console) === "function";
}
export function isArray(it: any): boolean {
	return !!(it && (it instanceof Array || typeof (it) === "array" as any));
}
export function isElement(target: any): boolean {
	return target !== undefined && target !== null && target.nodeType === 1 ? true : false;
}
export function isFunction(it: any): boolean {
	return Object.prototype.toString.call(it) === "[object Function]";
}
export function isNumber(x: any): boolean {
	return x === + x;
}
export function isInt(x: any): boolean {
	return isNumber(x) && ((x as number) === ((x as number) | 0));
}
export function isString(x: any): boolean {
	return isNotNullOrUndefined(x) && x.constructor === String;
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