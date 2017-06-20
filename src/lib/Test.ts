import { Global } from "./Global";
export function hasWindow(): boolean {
	return Global.window !== null;
}
export function hasConsole(): boolean {
	return this.hasWindow() && Global.window.console !== undefined || typeof (console) === "function";
}
export function isArray(it: any): boolean {
	return it && (it instanceof Array || typeof (it) === "array" as any);
}
export function isElement(target: any): boolean {
	return target !== undefined && target.nodeType === 1 ? true : false;
}
export function isFunction(it: any): boolean {
	return Object.prototype.toString.call(it) === "[object Function]";
}
