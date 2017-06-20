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

// tslint:disable-next-line:class-name
export class _Global {
	private _window: Window = win;
	private _nativeWindow: boolean = nativeWindow;

	public get window(): Window {
		return this._window;
	}
	public set window(v: Window) {
		this._window = v;
		if (this.hasNativeWindow) {
			win = v;
		}
	}
	public get hasNativeWindow(): boolean {
		return this._nativeWindow;
	}
}
// tslint:disable-next-line:variable-name
export let Global = new _Global();
