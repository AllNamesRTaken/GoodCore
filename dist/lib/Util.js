"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = require("ts-md5/dist/md5");
var _Util = (function () {
    function _Util(win) {
        this._window = null;
        this._int = 0;
        this.Init(win);
    }
    _Util.prototype._ = function (win) {
        return new _Util(win);
    };
    _Util.prototype.Init = function (win) {
        var _this = this;
        if (win === undefined && typeof (window) !== undefined) {
            win = window;
        }
        if (win !== undefined) {
            this._window = win;
        }
        this.Async = (function () {
            var timeouts = [];
            var messageName = "zero-timeout-message";
            function setZeroTimeout(fn) {
                timeouts.push(fn);
                this._window.postMessage(messageName, "*");
            }
            function handleMessage(event) {
                if (((event.source) === undefined || (event.source) === this._window) && event.data == messageName) {
                    event.stopPropagation();
                    if (timeouts.length > (0 | 0)) {
                        var fn = timeouts.shift();
                        fn();
                    }
                }
            }
            if (_this.HasWindow) {
                _this._window.addEventListener("message", handleMessage, true);
                return setZeroTimeout;
            }
            else {
                return setTimeout;
            }
        })();
    };
    Object.defineProperty(_Util.prototype, "HasWindow", {
        get: function () {
            return this._window !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_Util.prototype, "HasConsole", {
        get: function () {
            return this.HasWindow && this._window.console !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    _Util.prototype.ToArray = function (arr) {
        return Array.prototype.slice.call(arr);
    };
    _Util.prototype.IsArray = function (it) {
        return it && (it instanceof Array || typeof (it) === "array");
    };
    _Util.prototype.IsElement = function (target) {
        return target !== undefined && target.nodeType === 1 ? true : false;
    };
    _Util.prototype.IsFunction = function (it) {
        return Object.prototype.toString.call(it) === "[object Function]";
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
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    _Util.prototype.NewInt = function () {
        return this._int++;
    };
    _Util.prototype.Debugger = function () {
        debugger;
    };
    _Util.prototype.PipeOut = function (log, warn, error) {
        if (this.HasConsole) {
            this.ProxyFn(this._window.console, "log", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                log.apply(void 0, args);
            });
            this.ProxyFn(this._window.console, "warn", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                warn.apply(void 0, args);
            });
            this.ProxyFn(this._window.console, "error", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                error.apply(void 0, args);
            });
        }
        else {
            console = {
                log: log,
                warn: warn,
                error: error
            };
            if (!this.HasWindow) {
                window = {
                    console: console
                };
                this._window = window;
            }
            else {
                window.console = console;
            }
        }
    };
    _Util.prototype.Assert = function (assertion, message, isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        var result = true;
        ;
        if (!assertion) {
            if (this.HasConsole) {
                result = false;
                this._window.console.error("Assertion failed: " + message);
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
        return md5_1.Md5.hashStr(str);
    };
    return _Util;
}());
exports._Util = _Util;
if (typeof (window) === "undefined") {
    var window = null;
    var console = null;
}
exports.Util = new _Util();
//# sourceMappingURL=Util.js.map