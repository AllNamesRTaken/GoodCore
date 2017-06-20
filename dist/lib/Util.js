import { Global } from "./Global";
import { hasConsole, hasWindow } from "./Test";
import { Timer } from "./Timer";
class UtilState {
}
UtilState._int = 0;
export function init(win) {
    if (win !== undefined) {
        Global.window = win;
    }
}
export function getFunctionName(fn) {
    let result;
    if (fn.hasOwnProperty("name") !== undefined) {
        result = fn.name;
    }
    else {
        const fnString = fn.toString();
        result = fnString.substring(9, fnString.indexOf("("));
    }
    return result;
}
export function getFunctionCode(fn) {
    let result;
    const fnString = fn.toString();
    result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
    return result;
}
export function newUUID() {
    let d = new Date().getTime();
    d += Timer.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
export function newInt() {
    return UtilState._int++;
}
export function callDebugger() {
    debugger;
}
export function pipeOut(log, warn, error) {
    if (hasConsole) {
        proxyFn(console, "log", function (superfn, ...args) { superfn(...args); log(...args); });
        proxyFn(console, "warn", function (superfn, ...args) { superfn(...args); warn(...args); });
        proxyFn(console, "error", function (superfn, ...args) { superfn(...args); error(...args); });
    }
    else {
        const console = {
            log,
            warn,
            error
        };
        if (!(hasWindow())) {
            Global.window = {
                console
            };
        }
        else {
            Global.window.console = console;
        }
    }
}
export function assert(assertion, message, isDebug = true) {
    let result = true;
    if (!assertion) {
        if (hasConsole) {
            result = false;
            console.error("Assertion failed: " + message);
        }
        if (isDebug) {
            callDebugger();
        }
    }
    return result;
}
export function proxyFn(that, fnName, proxyFn, onPrototype = false) {
    const fn = that[fnName];
    const _superFn = function (...args) {
        if (args.length !== 0) {
            return fn.apply(that, args);
        }
        else {
            return fn.call(that);
        }
    };
    if (onPrototype && that.prototype && that.prototype[fnName]) {
        that.prototype[fnName] = proxyFn.bind(_superFn);
    }
    else {
        that[fnName] = proxyFn.bind(that, _superFn);
    }
}
export function loop(count, fn) {
    let i = -1;
    while (++i < count) {
        fn(i);
    }
}
export function toArray(arr) {
    return Array.prototype.slice.call(arr);
}
//# sourceMappingURL=Util.js.map