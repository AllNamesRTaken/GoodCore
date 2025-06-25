let hasNativeWindow = true;
// tslint:disable-next-line:no-var-keyword
var nativeWindow: Window;
if (typeof (window) === "undefined") {
	// tslint:disable-next-line:no-var-keyword
	nativeWindow = null as any;
	hasNativeWindow = false;
} else {
	nativeWindow = window;
}

const root: Window = nativeWindow || typeof(global) !== "undefined" ? global : globalThis as unknown as any; 

		// tslint:disable-next-line:class-name
class _Global {
	private _window: Window | null = nativeWindow;
	private _nativeWindow: boolean = hasNativeWindow;

	public get global(): Window {
		return typeof(global) !== "undefined" ? global as any : this._window || root;
	}
	public get window(): Window | null {
		return this._window;
	}
	public set window(v: Window | null) {
		this._window = v;
		if (!this.hasNativeWindow && v !== null) {
			nativeWindow = v;
		}
	}
	public get hasNativeWindow(): boolean {
		return this._nativeWindow;
	}
	public noDeprecationWarnings: boolean = false;
}

// tslint:disable-next-line:variable-name
export let Global = new _Global();
