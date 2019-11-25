let nativeWindow = true;
// tslint:disable-next-line:no-var-keyword
var win: Window;
if (typeof (window) === "undefined") {
	// tslint:disable-next-line:no-var-keyword
	win = null as any;
	nativeWindow = false;
} else {
	win = window;
}
const root: NodeJS.Global | Window = typeof(window) !== "undefined" 
	? window 
	: typeof(global) !== "undefined" 
		? global 
		: (() => this)() as unknown as NodeJS.Global; 
// tslint:disable-next-line:class-name
export class _Global {
	private _window: Window | null = win;
	private _nativeWindow: boolean = nativeWindow;

	public get global(): NodeJS.Global | Window {
		if (this.hasNativeWindow) {
			return this.window!;
		}
		return global || root;
	}
	public get window(): Window | null {
		return this._window;
	}
	public set window(v: Window | null) {
		this._window = v;
		if (!this.hasNativeWindow && v !== null) {
			win = v;
		}
	}
	public get hasNativeWindow(): boolean {
		return this._nativeWindow;
	}
}
// tslint:disable-next-line:variable-name
export let Global = new _Global();
