import { Global } from "./Global";
export class _Test {
	public constructor() {
	}
	public get HasWindow(): boolean {
		return Global.window !== null;
	}
	public get HasConsole(): boolean {
		return this.HasWindow && Global.window.console !== undefined;
	}
	public ToArray<T>(arr: ArrayLike<T>): T[] {
		return Array.prototype.slice.call(arr);
	}
	public IsArray(it: any): boolean {
		return it && (it instanceof Array || typeof (it) === "array" as any);
	}
	public IsElement(target: any): boolean {
		return target !== undefined && target.nodeType === 1 ? true : false;
	}
	public IsFunction(it: any): boolean {
		return Object.prototype.toString.call(it) === "[object Function]";
	}
}

export let Test = new _Test();
