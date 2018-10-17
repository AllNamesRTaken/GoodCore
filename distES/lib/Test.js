import { Global } from "./Global";
export function hasWindow() {
    return Global.window !== null;
}
export class Env {
    static isNode() {
        this._isNode = this._isNode || (!hasWindow() || typeof module !== "undefined" && module.exports !== undefined);
        return this._isNode;
    }
    static isOpera() {
        this._isOpera = this._isOpera || (hasWindow() && Global.window.navigator.userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/) !== null);
        return this._isOpera;
    }
    static isFirefox() {
        this._isFirefox = this._isFirefox || (hasWindow() && Global.window.navigator.userAgent.toLowerCase().match(/(?:firefox|fxios)\/(\d+)/) !== null);
        return this._isFirefox;
    }
    static isSafari() {
        this._isSafari = this._isSafari || (hasWindow() && Global.window.navigator.userAgent.match(/version\/(\d+).+?safari/) !== null);
        return this._isSafari;
    }
    static isIE() {
        this._isIE = this._isIE || (hasWindow() && Global.window.navigator.userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/) !== null);
        return this._isIE;
    }
    static isEdge() {
        this._isEdge = this._isEdge || (hasWindow() && Global.window.navigator.userAgent.match(/edge\/(\d+)/) !== null);
        return this._isEdge;
    }
    static isChrome() {
        this._isChrome = this._isChrome || (hasWindow()
            && ((/google inc/.test(Global.window.navigator.vendor.toLowerCase()) ?
                Global.window.navigator.userAgent.toLowerCase().match(/(?:chrome|crios)\/(\d+)/) :
                null) !== null)
            && !this.isOpera());
        return this._isChrome;
    }
    static isBlink() {
        this._isBlink = this._isBlink || (hasWindow() && (this.isChrome || this.isOpera) && !!(Global.window.CSS));
        return this._isBlink;
    }
    static hasFastNativeArrays() {
        return this.useNative === undefined ? this._hasFastNativeArrays() : this.useNative;
    }
    static _hasFastNativeArrays() {
        return this.__hasFastNativeArrays = this.__hasFastNativeArrays || !this.isIE();
    }
}
Env.useNative = undefined;
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
export function areNullOrUndefined(...args) {
    const len = args.length;
    let i = -1;
    let a;
    let result = false;
    while (!result && ++i < len) {
        a = args[i];
        result = a === undefined || a === null;
    }
    return result;
}
export function areNotNullOrUndefined(...args) {
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
export function areUndefined(...args) {
    const len = args.length;
    let i = -1;
    let a;
    let result = false;
    while (!result && ++i < len) {
        a = args[i];
        result = a === undefined;
    }
    return result;
}
export function areNotUndefined(...args) {
    return !areUndefined.apply(this, Array.prototype.slice.apply(arguments));
}
export function isUndefined(arg) {
    return arg === undefined;
}
export function isNotUndefined(arg) {
    return !isUndefined(arg);
}
//# sourceMappingURL=Test.js.map