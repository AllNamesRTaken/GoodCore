import { Global } from "./Global";
import { hasConsole, hasWindow, isNotUndefined, isNotNullOrUndefined } from "./Test";
import { Timer } from "./Timer";
class LoggableCounter {
    constructor(name = "") {
        this.name = "";
        this._value = 0;
        this.name = name;
    }
    log() {
        console.log(`Counter ${this.name}: ${this.toString()}`);
    }
    inc() {
        this._value++;
        return this;
    }
    reset() {
        this._value = 0;
        return this;
    }
    valueOf() {
        return this._value;
    }
    toString() {
        return this._value.toString();
    }
}
class UtilState {
}
UtilState._int = { 0: 0 };
UtilState._counter = { "": new LoggableCounter("") };
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
export function newInt(key = 0) {
    if (UtilState._int[key] === undefined) {
        UtilState._int[key] = 0;
    }
    return UtilState._int[key]++;
}
export function counter(key = "") {
    if (UtilState._counter[key] === undefined) {
        UtilState._counter[key] = new LoggableCounter(key.toString());
    }
    return UtilState._counter[key];
}
export function count(key = "") {
    return counter(key).inc();
}
export function callDebugger() {
    debugger;
}
export function pipeOut(log, warn, error) {
    if (hasConsole()) {
        proxyFn(Global.global.console, "log", function (superfn, ...args) {
            superfn.apply(this, args);
            log.apply(this, args);
        });
        proxyFn(Global.global.console, "warn", function (superfn, ...args) {
            superfn.apply(this, args);
            warn.apply(this, args);
        });
        proxyFn(Global.global.console, "error", function (superfn, ...args) {
            superfn.apply(this, args);
            error.apply(this, args);
        });
    }
    else {
        const console = {
            log,
            warn,
            error
        };
        if (!(hasWindow())) {
            Global.window = {};
        }
        Global.window.console = console;
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
export function proxyFn(objOrClass, fnName, proxyFn) {
    objOrClass = isNotUndefined(objOrClass.prototype) ? objOrClass.prototype : objOrClass;
    const fn = objOrClass[fnName];
    const _superFn = function (...args) {
        if (args.length !== 0) {
            return fn.apply(this || objOrClass, args);
        }
        else {
            return fn.call(this || objOrClass);
        }
    };
    objOrClass[fnName] = proxyFn.bind(objOrClass, _superFn);
}
export function loop(count, fn) {
    let i = -1;
    let run = true;
    while (run && ++i < count) {
        run = fn(i) !== true;
    }
}
export function toArray(arr) {
    return Array.prototype.slice.call(arr);
}
export const DEFAULT_DURATION = 100;
export function debounce(method, duration = DEFAULT_DURATION, options) {
    let timeoutHandle = null;
    let leading = isNotUndefined(options) && isNotUndefined(options.leading);
    let executed = false;
    let result;
    let resolve;
    let reject;
    if (!leading) {
        result = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
    }
    let wrapper = function (...args) {
        if (timeoutHandle === null) {
            if (leading) {
                executed = true;
                result = method.apply(this, args);
            }
        }
        wrapper.resetTimer();
        timeoutHandle = setTimeout(() => {
            timeoutHandle = null;
            if (!executed) {
                let value = method.apply(this, args);
                if (isNotNullOrUndefined(value) && value.hasOwnProperty("then")) {
                    value.then((v) => {
                        resolve(v);
                    });
                }
                else {
                    resolve(value);
                }
            }
            executed = false;
        }, duration);
        return result;
    };
    wrapper.resetTimer = function () {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        }
    };
    return wrapper;
}
//# sourceMappingURL=Util.js.map