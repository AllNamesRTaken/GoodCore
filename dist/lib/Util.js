import { Global } from "./Global";
import { hasConsole, hasWindow, isNotUndefined, isNotNullOrUndefined } from "./Test";
import { Timer } from "./Timer";
var LoggableCounter = (function () {
    function LoggableCounter(name) {
        if (name === void 0) { name = ""; }
        this.name = "";
        this._value = 0;
        this.name = name;
    }
    LoggableCounter.prototype.log = function () {
        console.log("Counter " + this.name + ": " + this.toString());
    };
    LoggableCounter.prototype.inc = function () {
        this._value++;
        return this;
    };
    LoggableCounter.prototype.reset = function () {
        this._value = 0;
        return this;
    };
    LoggableCounter.prototype.valueOf = function () {
        return this._value;
    };
    LoggableCounter.prototype.toString = function () {
        return this._value.toString();
    };
    return LoggableCounter;
}());
var UtilState = (function () {
    function UtilState() {
    }
    UtilState._int = { 0: 0 };
    UtilState._counter = { "": new LoggableCounter("") };
    return UtilState;
}());
export function init(win) {
    if (win !== undefined) {
        Global.window = win;
    }
}
export function getFunctionName(fn) {
    var result;
    if (fn.hasOwnProperty("name") !== undefined) {
        result = fn.name;
    }
    else {
        var fnString = fn.toString();
        result = fnString.substring(9, fnString.indexOf("("));
    }
    return result;
}
export function getFunctionCode(fn) {
    var result;
    var fnString = fn.toString();
    result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
    return result;
}
export function newUUID() {
    var d = new Date().getTime();
    d += Timer.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
export function newInt(key) {
    if (key === void 0) { key = 0; }
    if (UtilState._int[key] === undefined) {
        UtilState._int[key] = 0;
    }
    return UtilState._int[key]++;
}
export function counter(key) {
    if (key === void 0) { key = ""; }
    if (UtilState._counter[key] === undefined) {
        UtilState._counter[key] = new LoggableCounter(key.toString());
    }
    return UtilState._counter[key];
}
export function count(key) {
    if (key === void 0) { key = ""; }
    return counter(key).inc();
}
export function callDebugger() {
    debugger;
}
export function pipeOut(log, warn, error) {
    if (hasConsole()) {
        proxyFn(Global.global.console, "log", function (superfn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            superfn.apply(this, args);
            log.apply(this, args);
        });
        proxyFn(Global.global.console, "warn", function (superfn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            superfn.apply(this, args);
            warn.apply(this, args);
        });
        proxyFn(Global.global.console, "error", function (superfn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            superfn.apply(this, args);
            error.apply(this, args);
        });
    }
    else {
        var console_1 = {
            log: log,
            warn: warn,
            error: error
        };
        if (!(hasWindow())) {
            Global.window = {};
        }
        Global.window.console = console_1;
    }
}
export function assert(assertion, message, isDebug) {
    if (isDebug === void 0) { isDebug = true; }
    var result = true;
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
    var fn = objOrClass[fnName];
    var _superFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
    var i = -1;
    var run = true;
    while (run && ++i < count) {
        run = fn(i) !== true;
    }
}
export function toArray(arr) {
    return Array.prototype.slice.call(arr);
}
export var DEFAULT_DURATION = 100;
export function debounce(method, duration, options) {
    if (duration === void 0) { duration = DEFAULT_DURATION; }
    var timeoutHandle = null;
    var leading = isNotUndefined(options) && isNotUndefined(options.leading);
    var executed = false;
    var result;
    var resolve;
    var reject;
    if (!leading) {
        result = new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    }
    var wrapper = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeoutHandle === null) {
            if (leading) {
                executed = true;
                result = method.apply(this, args);
            }
        }
        wrapper.resetTimer();
        timeoutHandle = setTimeout(function () {
            timeoutHandle = null;
            if (!executed) {
                var value = method.apply(_this, args);
                if (isNotNullOrUndefined(value) && value.hasOwnProperty("then")) {
                    value.then(function (v) {
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