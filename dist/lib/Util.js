import { Md5 } from "ts-md5/dist/md5";
import { Global } from "./Global";
import { Test } from "./Test";
import { Timer } from "./Timer";
var _Util = (function () {
    function _Util() {
        this._int = 0;
        this.init();
    }
    _Util.prototype.init = function (win) {
        if (win !== undefined) {
            Global.window = win;
        }
        this._createAsync();
    };
    _Util.prototype._createAsync = function () {
        this.async = (function () {
            var timeouts = [];
            var messageName = "zero-timeout-message";
            function setZeroTimeout(fn) {
                timeouts.push(fn);
                Global.window.postMessage(messageName, "*");
            }
            function handleMessage(event) {
                if (((event.source) === undefined || (event.source) === Global.window) && event.data === messageName) {
                    event.stopPropagation();
                    if (timeouts.length > (0 | 0)) {
                        var fn = timeouts.shift();
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
    };
    _Util.prototype.getFunctionName = function (fn) {
        var result;
        if (fn.hasOwnProperty("name") !== undefined) {
            result = fn.name;
        }
        else {
            var fnString = fn.toString();
            result = fnString.substring(9, fnString.indexOf("("));
        }
        return result;
    };
    _Util.prototype.getFunctionCode = function (fn) {
        var result;
        var fnString = fn.toString();
        result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
        return result;
    };
    _Util.prototype.newUUID = function () {
        var d = new Date().getTime();
        d += Timer.now();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    _Util.prototype.newInt = function () {
        return this._int++;
    };
    _Util.prototype.debugger = function () {
        debugger;
    };
    _Util.prototype.pipeOut = function (log, warn, error) {
        if (Test.hasConsole) {
            this.proxyFn(console, "log", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                log.apply(void 0, args);
            });
            this.proxyFn(console, "warn", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                warn.apply(void 0, args);
            });
            this.proxyFn(console, "error", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                error.apply(void 0, args);
            });
        }
        else {
            var console_1 = {
                log: log,
                warn: warn,
                error: error
            };
            if (!Test.hasWindow) {
                Global.window = {
                    console: console_1
                };
            }
            else {
                Global.window.console = console_1;
            }
        }
    };
    _Util.prototype.assert = function (assertion, message, isDebug) {
        if (isDebug === void 0) { isDebug = true; }
        var result = true;
        if (!assertion) {
            if (Test.hasConsole) {
                result = false;
                console.error("Assertion failed: " + message);
            }
            if (isDebug) {
                this.debugger();
            }
        }
        return result;
    };
    _Util.prototype.proxyFn = function (that, fnName, proxyFn, onPrototype) {
        if (onPrototype === void 0) { onPrototype = false; }
        var fn = that[fnName];
        var _superFn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
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
    };
    _Util.prototype.md5 = function (str) {
        return Md5.hashStr(str);
    };
    _Util.prototype.loop = function (count, fn) {
        var i = -1;
        while (++i < count) {
            fn(i);
        }
    };
    _Util.prototype.toArray = function (arr) {
        return Array.prototype.slice.call(arr);
    };
    return _Util;
}());
export { _Util };
export var Util = new _Util();
//# sourceMappingURL=Util.js.map