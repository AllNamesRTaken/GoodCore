"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Arr_1 = require("../Arr");
var Dictionary_1 = require("../struct/Dictionary");
var List_1 = require("../struct/List");
var Util_1 = require("../Util");
var Initable_1 = require("./mixins/Initable");
var BaseCacheObject = (function () {
    function BaseCacheObject() {
        this.Key = null;
        this.Data = null;
    }
    return BaseCacheObject;
}());
exports.BaseCacheObject = BaseCacheObject;
exports._InitableCacheObject = Initable_1.default(BaseCacheObject);
var CacheObject = (function (_super) {
    __extends(CacheObject, _super);
    function CacheObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CacheObject;
}(exports._InitableCacheObject));
exports.CacheObject = CacheObject;
var Cache = (function () {
    function Cache(size) {
        if (size === void 0) { size = Cache.DEFAULT_FIFO_SIZE; }
        this._size = Cache.DEFAULT_FIFO_SIZE;
        this._order = new List_1.default();
        this._data = new Dictionary_1.default();
        this._stage = new Dictionary_1.default();
        this._size = size;
    }
    Object.defineProperty(Cache.prototype, "Size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            if ((value !== this._size)
                && (value >= 0)) {
                this._size = value;
                this.Trim();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "Count", {
        get: function () {
            return this._order.Count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "StageCount", {
        get: function () {
            return this._stage.List.Count;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.Hit = function (key) {
        return this._data.Has(key);
    };
    Cache.prototype.Get = function (key) {
        var result;
        result = this.Hit(key) ? this._data.Get(key).Data : null;
        return result;
    };
    Cache.prototype.Push = function (key, data) {
        this.Add(key, data);
    };
    Cache.prototype.GetStaged = function (key) {
        var result;
        result = this._stage.Has(key) ? this._stage.Get(key).Data : null;
        return result;
    };
    Cache.prototype.Stage = function (key, data) {
        this._stage.Set(key, new CacheObject().Init({ Key: key, Data: data }));
    };
    Cache.prototype.Publish = function (key) {
        if (this._stage.Has(key)) {
            this.Add(key, this._stage.Get(key).Data);
            this._stage.Delete(key);
        }
    };
    Cache.prototype.Remove = function (key) {
        if (this.Hit(key)) {
            this._data.Delete(key);
            this._order.Remove(key);
        }
    };
    Cache.prototype.Cache = function (obj, fnName, keyFn) {
        var _this = this;
        if (keyFn === undefined) {
            keyFn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Util_1.Util.Md5(Arr_1.Arr.Reduce(args, function (acc, cur) { return acc += JSON.stringify(cur); }));
            };
        }
        var proxyFn = function (superFn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var key = keyFn.apply(void 0, args);
            if (key !== null && _this.Hit(key)) {
                return _this.Get(key);
            }
            var result = superFn.apply(void 0, args);
            if (key !== null) {
                _this.Add(key, result);
            }
            return result;
        };
        Util_1.Util.ProxyFn(obj, fnName, proxyFn, false);
    };
    Cache.prototype.Clear = function () {
        this._data.Clear();
        this._order.Clear();
        this._stage.Clear();
    };
    Cache.prototype.Add = function (key, data) {
        if (this.Hit(key)) {
            this._order.Remove(key);
        }
        this._data.Set(key, new CacheObject().Init({ Key: key, Data: data }));
        this._order.Add(key);
        this.Trim();
    };
    Cache.prototype.Trim = function () {
        while ((this._order.Count > this._size)) {
            this._data.Delete(this._order.Get(0));
            this._order.Shift();
        }
    };
    return Cache;
}());
Cache.DEFAULT_FIFO_SIZE = 100;
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map