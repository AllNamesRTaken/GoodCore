let nativeWindow = true;
var win;
if (typeof (window) === "undefined") {
    win = null;
    nativeWindow = false;
}
else {
    win = window;
}
export class _Global {
    constructor() {
        this._window = win;
        this._nativeWindow = nativeWindow;
    }
    get global() {
        if (this.hasNativeWindow) {
            return this.window;
        }
        return global;
    }
    get window() {
        return this._window;
    }
    set window(v) {
        this._window = v;
        if (!this.hasNativeWindow && v !== null) {
            win = v;
        }
    }
    get hasNativeWindow() {
        return this._nativeWindow;
    }
}
export let Global = new _Global();
//# sourceMappingURL=Global.js.map