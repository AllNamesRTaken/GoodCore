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
export let Global = new _Global();
