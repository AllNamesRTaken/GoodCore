import { Global } from "./Global";
import { Test } from "./Test";
import { Timer } from "./Timer";
class UtilState {
}
UtilState._int = 0;
export class Util {
    constructor() {
    }
    static init(win) {
        if (win !== undefined) {
            Global.window = win;
        }
        Util._createAsync();
    }
    static _createAsync() {
        Util.async = (() => {
            const timeouts = [];
            const messageName = "zero-timeout-message";
            function setZeroTimeout(fn) {
                timeouts.push(fn);
                Global.window.postMessage(messageName, "*");
            }
            function handleMessage(event) {
                if (((event.source) === undefined || (event.source) === Global.window) && event.data === messageName) {
                    event.stopPropagation();
                    if (timeouts.length > (0 | 0)) {
                        const fn = timeouts.shift();
                        fn();
                    }
                }
            }
            if (Test.hasWindow) {
                Global.window.addEventListener("message", handleMessage, true);
                return setZeroTimeout;
            }
            else {
                return setTimeout;
            }
        })();
    }
    static getFunctionName(fn) {
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
    static getFunctionCode(fn) {
        let result;
        const fnString = fn.toString();
        result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
        return result;
    }
    static newUUID() {
        let d = new Date().getTime();
        d += Timer.now();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    static newInt() {
        return UtilState._int++;
    }
    static debugger() {
        debugger;
    }
    static pipeOut(log, warn, error) {
        if (Test.hasConsole) {
            Util.proxyFn(console, "log", function (superfn, ...args) { superfn(...args); log(...args); });
            Util.proxyFn(console, "warn", function (superfn, ...args) { superfn(...args); warn(...args); });
            Util.proxyFn(console, "error", function (superfn, ...args) { superfn(...args); error(...args); });
        }
        else {
            const console = {
                log,
                warn,
                error
            };
            if (!Test.hasWindow) {
                Global.window = {
                    console
                };
            }
            else {
                Global.window.console = console;
            }
        }
    }
    static assert(assertion, message, isDebug = true) {
        let result = true;
        if (!assertion) {
            if (Test.hasConsole) {
                result = false;
                console.error("Assertion failed: " + message);
            }
            if (isDebug) {
                Util.debugger();
            }
        }
        return result;
    }
    static proxyFn(that, fnName, proxyFn, onPrototype = false) {
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
    static async(fn) { }
    static loop(count, fn) {
        let i = -1;
        while (++i < count) {
            fn(i);
        }
    }
    static toArray(arr) {
        return Array.prototype.slice.call(arr);
    }
}
//# sourceMappingURL=Util.js.map