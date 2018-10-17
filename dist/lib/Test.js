import { Global } from "./Global";
export function hasWindow() {
    return Global.window !== null;
}
var Env = (function () {
    function Env() {
    }
    Env.isNode = function () {
        this._isNode = this._isNode || (!hasWindow() || typeof module !== "undefined" && module.exports !== undefined);
        return this._isNode;
    };
    Env.isOpera = function () {
        this._isOpera = this._isOpera || (hasWindow() && Global.window.navigator.userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/) !== null);
        return this._isOpera;
    };
    Env.isFirefox = function () {
        this._isFirefox = this._isFirefox || (hasWindow() && Global.window.navigator.userAgent.toLowerCase().match(/(?:firefox|fxios)\/(\d+)/) !== null);
        return this._isFirefox;
    };
    Env.isSafari = function () {
        this._isSafari = this._isSafari || (hasWindow() && Global.window.navigator.userAgent.match(/version\/(\d+).+?safari/) !== null);
        return this._isSafari;
    };
    Env.isIE = function () {
        this._isIE = this._isIE || (hasWindow() && Global.window.navigator.userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/) !== null);
        return this._isIE;
    };
    Env.isEdge = function () {
        this._isEdge = this._isEdge || (hasWindow() && Global.window.navigator.userAgent.match(/edge\/(\d+)/) !== null);
        return this._isEdge;
    };
    Env.isChrome = function () {
        this._isChrome = this._isChrome || (hasWindow()
            && ((/google inc/.test(Global.window.navigator.vendor.toLowerCase()) ?
                Global.window.navigator.userAgent.toLowerCase().match(/(?:chrome|crios)\/(\d+)/) :
                null) !== null)
            && !this.isOpera());
        return this._isChrome;
    };
    Env.isBlink = function () {
        this._isBlink = this._isBlink || (hasWindow() && (this.isChrome || this.isOpera) && !!(Global.window.CSS));
        return this._isBlink;
    };
    Env.hasFastNativeArrays = function () {
        return this.useNative === undefined ? this._hasFastNativeArrays() : this.useNative;
    };
    Env._hasFastNativeArrays = function () {
        return this.__hasFastNativeArrays = this.__hasFastNativeArrays || !this.isIE();
    };
    Env.useNative = undefined;
    return Env;
}());
export { Env };
export function hasConsole() {
    return hasWindow() && Global.window.console !== undefined || typeof (console) === "function";
}
export function isObject(it) {
    return it !== null && typeof it === "object";
}
export function isArray(it) {
    return Array.isArray ? Array.isArray(it) : Object.prototype.toString.call(it) === "[object Array]";
}
export function isElement(target) {
    return target !== undefined && target !== null && target.nodeType === 1 ? true : false;
}
export function isFunction(it) {
    return Object.prototype.toString.call(it) === "[object Function]";
}
export function isNumber(x) {
    return x === +x;
}
export function isInt(x) {
    return isNumber(x) && (x === (x | 0));
}
export function isString(x) {
    return isNotNullOrUndefined(x) && x.constructor === String;
}
export function areNullOrUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var len = args.length;
    var i = -1;
    var a;
    var result = false;
    while (!result && ++i < len) {
        a = args[i];
        result = a === undefined || a === null;
    }
    return result;
}
export function areNotNullOrUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return !areNullOrUndefined.apply(this, Array.prototype.slice.apply(arguments));
    ;
}
export function isNull(arg) {
    return arg === null;
}
export function isNotNull(arg) {
    return arg !== null;
}
export function isNullOrUndefined(arg) {
    return arg === undefined || arg === null;
}
export function isNotNullOrUndefined(arg) {
    return !isNullOrUndefined(arg);
}
export function areUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var len = args.length;
    var i = -1;
    var a;
    var result = false;
    while (!result && ++i < len) {
        a = args[i];
        result = a === undefined;
    }
    return result;
}
export function areNotUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return !areUndefined.apply(this, Array.prototype.slice.apply(arguments));
}
export function isUndefined(arg) {
    return arg === undefined;
}
export function isNotUndefined(arg) {
    return !isUndefined(arg);
}
//# sourceMappingURL=Test.js.map