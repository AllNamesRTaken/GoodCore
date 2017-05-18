let nativeWindow = true;
if (typeof (window) === "undefined") {
	// tslint:disable-next-line:no-var-keyword
	var window = null as any;
	nativeWindow = false;
}
(global as any).window = window;

export class _Global {
	private _window: Window = window;
	private _nativeWindow: boolean = nativeWindow;

	public get window(): Window {
		return this._window;
	}
	public set window(v: Window) {
		this._window = v;
		if (this.NativeWindow) {
			window = v;
		}
	}
	public get NativeWindow(): boolean {
		return this._nativeWindow;
	}
}
export let Global = new _Global();
