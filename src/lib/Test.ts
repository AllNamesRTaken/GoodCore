import { Global } from "./Global";
export class Test {
	public constructor() {
	}
	public static get hasWindow(): boolean {
		return Global.window !== null;
	}
	public static get hasConsole(): boolean {
		return this.hasWindow && Global.window.console !== undefined || typeof(console) === "function";
	}
	public static isArray(it: any): boolean {
		return it && (it instanceof Array || typeof (it) === "array" as any);
	}
	public static isElement(target: any): boolean {
		return target !== undefined && target.nodeType === 1 ? true : false;
	}
	public static isFunction(it: any): boolean {
		return Object.prototype.toString.call(it) === "[object Function]";
	}
}
