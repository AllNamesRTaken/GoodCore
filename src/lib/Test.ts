import { Global } from "./Global";
export class _Test {
	public constructor() {
	}
	public get hasWindow(): boolean {
		return Global.window !== null;
	}
	public get hasConsole(): boolean {
		return this.hasWindow && Global.window.console !== undefined || typeof(console) === "function";
	}
	public isArray(it: any): boolean {
		return it && (it instanceof Array || typeof (it) === "array" as any);
	}
	public isElement(target: any): boolean {
		return target !== undefined && target.nodeType === 1 ? true : false;
	}
	public isFunction(it: any): boolean {
		return Object.prototype.toString.call(it) === "[object Function]";
	}
}

export let Test = new _Test();
