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
import { Arr } from "../Arr";
import { Dictionary } from "../struct/Dictionary";
import { List } from "../struct/List";
import { Util } from "../Util";
import { Initable } from "./mixins/Initable";
var BaseCacheObject = (function () {
    function BaseCacheObject() {
        this.Key = null;
        this.Data = null;
    }
    return BaseCacheObject;
}());
export { BaseCacheObject };
export var _InitableCacheObject = Initable(BaseCacheObject);
var CacheObject = (function (_super) {
    __extends(CacheObject, _super);
    function CacheObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CacheObject;
}(_InitableCacheObject));
export { CacheObject };
var Cache = (function () {
    function Cache(size) {
        if (size === void 0) { size = Cache.DEFAULT_FIFO_SIZE; }
        this._size = Cache.DEFAULT_FIFO_SIZE;
        this._order = new List();
        this._data = new Dictionary();
        this._stage = new Dictionary();
        this._size = size;
    }
    Object.defineProperty(Cache.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            if ((value !== this._size)
                && (value >= 0)) {
                this._size = value;
                this.trim();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "count", {
        get: function () {
            return this._order.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "stageCount", {
        get: function () {
            return this._stage.list.count;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.hit = function (key) {
        return this._data.has(key);
    };
    Cache.prototype.get = function (key) {
        var result;
        result = this.hit(key) ? this._data.get(key).Data : null;
        return result;
    };
    Cache.prototype.push = function (key, data) {
        this.add(key, data);
    };
    Cache.prototype.getStaged = function (key) {
        var result;
        result = this._stage.has(key) ? this._stage.get(key).Data : null;
        return result;
    };
    Cache.prototype.stage = function (key, data) {
        this._stage.set(key, new CacheObject().init({ Key: key, Data: data }));
    };
    Cache.prototype.publish = function (key) {
        if (this._stage.has(key)) {
            this.add(key, this._stage.get(key).Data);
            this._stage.delete(key);
        }
    };
    Cache.prototype.remove = function (key) {
        if (this.hit(key)) {
            this._data.delete(key);
            this._order.remove(key);
        }
    };
    Cache.prototype.cache = function (obj, fnName, keyFn) {
        var _this = this;
        if (keyFn === undefined) {
            keyFn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Util.md5(Arr.reduce(args, function (acc, cur) { return acc += JSON.stringify(cur); }));
            };
        }
        var proxyFn = function (superFn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var key = keyFn.apply(void 0, args);
            if (key !== null && _this.hit(key)) {
                return _this.get(key);
            }
            var result = superFn.apply(void 0, args);
            if (key !== null) {
                _this.add(key, result);
            }
            return result;
        };
        Util.proxyFn(obj, fnName, proxyFn, false);
    };
    Cache.prototype.clear = function () {
        this._data.clear();
        this._order.clear();
        this._stage.clear();
    };
    Cache.prototype.add = function (key, data) {
        if (this.hit(key)) {
            this._order.remove(key);
        }
        this._data.set(key, new CacheObject().init({ Key: key, Data: data }));
        this._order.add(key);
        this.trim();
    };
    Cache.prototype.trim = function () {
        while ((this._order.count > this._size)) {
            this._data.delete(this._order.get(0));
            this._order.shift();
        }
    };
    return Cache;
}());
export { Cache };
Cache.DEFAULT_FIFO_SIZE = 100;
//# sourceMappingURL=Cache.js.map