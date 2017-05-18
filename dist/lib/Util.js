import { Md5 } from "ts-md5/dist/md5";
import { Global } from "./Global";
import { Test } from "./Test";
import { Timer } from "./Timer";
var _Util = (function () {
    function _Util() {
        this._int = 0;
        this.Init();
    }
    _Util.prototype.Init = function (win) {
        if (win !== undefined) {
            Global.window = win;
        }
        this._CreateAsync();
    };
    _Util.prototype._CreateAsync = function () {
        this.Async = (function () {
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
            if (Test.HasWindow) {
                Global.window.addEventListener("message", handleMessage, true);
                return setZeroTimeout;
            }
            else {
                return setTimeout;
            }
        })();
    };
    _Util.prototype.GetFunctionName = function (fn) {
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
    _Util.prototype.GetFunctionCode = function (fn) {
        var result;
        var fnString = fn.toString();
        result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
        return result;
    };
    _Util.prototype.NewUUID = function () {
        var d = new Date().getTime();
        d += Timer.Now();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    _Util.prototype.NewInt = function () {
        return this._int++;
    };
    _Util.prototype.Debugger = function () {
        debugger;
    };
    _Util.prototype.PipeOut = function (log, warn, error) {
        if (Test.HasConsole) {
            this.ProxyFn(Global.window.console, "log", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                log.apply(void 0, args);
            });
            this.ProxyFn(Global.window.console, "warn", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                warn.apply(void 0, args);
            });
            this.ProxyFn(Global.window.console, "error", function (superfn) {
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
            if (!Test.HasWindow) {
                Global.window = {
                    console: console_1
                };
            }
            else {
                Global.window.console = console_1;
            }
        }
    };
    _Util.prototype.Assert = function (assertion, message, isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        var result = true;
        if (!assertion) {
            if (Test.HasConsole) {
                result = false;
                Global.window.console.error("Assertion failed: " + message);
            }
            if (isDebug) {
                this.Debugger();
            }
        }
        return result;
    };
    _Util.prototype.ProxyFn = function (that, fnName, proxyFn, onPrototype) {
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
    _Util.prototype.Md5 = function (str) {
        return Md5.hashStr(str);
    };
    return _Util;
}());
export { _Util };
export var Util = new _Util();
//# sourceMappingURL=Util.js.map