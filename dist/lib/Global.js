var nativeWindow = true;
var win;
if (typeof (window) === "undefined") {
    win = null;
    nativeWindow = false;
}
else {
    win = window;
}
var _Global = (function () {
    function _Global() {
        this._window = win;
        this._nativeWindow = nativeWindow;
    }
    Object.defineProperty(_Global.prototype, "global", {
        get: function () {
            if (this.hasNativeWindow) {
                return this.window;
            }
            return global;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_Global.prototype, "window", {
        get: function () {
            return this._window;
        },
        set: function (v) {
            this._window = v;
            if (!this.hasNativeWindow && v !== null) {
                win = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_Global.prototype, "hasNativeWindow", {
        get: function () {
            return this._nativeWindow;
        },
        enumerable: true,
        configurable: true
    });
    return _Global;
}());
export { _Global };
export var Global = new _Global();
//# sourceMappingURL=Global.js.map