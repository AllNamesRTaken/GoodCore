var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { forEach } from "../Arr";
import { clone, setProperties, wipe } from "../Obj";
import { isFunction, isNotUndefined, isNotNullOrUndefined } from "../Test";
var Dictionary = (function () {
    function Dictionary() {
        this._lookup = Object.create(null);
        this._list = new Array();
        this._isDirty = false;
    }
    Dictionary.prototype.create = function () {
        return new (this.constructor)();
    };
    Dictionary.prototype.has = function (key) {
        return this._lookup[key] !== undefined;
    };
    Dictionary.prototype.contains = function (key) {
        return this.has(key);
    };
    Dictionary.prototype.get = function (key) {
        return this._lookup[key];
    };
    Dictionary.prototype.set = function (key, value) {
        this._isDirty = this._isDirty || this.has(key);
        if (value !== undefined) {
            this._lookup[key] = value;
            if (!this._isDirty) {
                this._list.push(value);
            }
        }
        return this;
    };
    Dictionary.prototype.delete = function (key) {
        if (this.has(key)) {
            delete this._lookup[key];
            this._isDirty = true;
        }
        return this;
    };
    Dictionary.prototype.clear = function () {
        wipe(this._lookup);
        this._list.length = 0;
        return this;
    };
    Object.defineProperty(Dictionary.prototype, "values", {
        get: function () {
            this.cleanList();
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "keys", {
        get: function () {
            return Object.keys(this._lookup);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "count", {
        get: function () {
            var result = 0;
            if (this._isDirty) {
                result = this.keys.length;
            }
            else {
                result = this._list.length;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Dictionary.prototype.cleanList = function () {
        if (this._isDirty) {
            this.reCreateList();
        }
    };
    Dictionary.prototype.reCreateList = function () {
        var lookup = this._lookup;
        var keys = Object.keys(this._lookup);
        var i = -1;
        var list = this._list;
        list.length = 0;
        while (++i < keys.length) {
            list.push(lookup[keys[i]]);
        }
        this._isDirty = false;
    };
    Dictionary.prototype.clone = function () {
        var result = this.create();
        result._isDirty = true;
        result._lookup = clone(this._lookup);
        result.reCreateList();
        return result;
    };
    Dictionary.prototype.toJSON = function () {
        return this._lookup;
    };
    Dictionary.prototype.serialize = function () {
        var _this = this;
        var obj = Object.create(null);
        forEach(this.keys, function (key) {
            var v = _this.get(key);
            obj[key] = isNotNullOrUndefined(v) && isFunction(v.serialize) ? v.serialize() : v;
        });
        return obj;
    };
    Dictionary.prototype.deserialize = function (obj) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        var e_1, _a, e_2, _b, e_3, _c;
        var T;
        var passthroughT;
        T = types.shift();
        passthroughT = types;
        this.clear();
        if (isNotUndefined(T)) {
            if (isNotUndefined(T.prototype.deserialize)) {
                try {
                    for (var _d = __values(Object.keys(obj)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var key = _e.value;
                        var t = (new T());
                        this.set(key, t.deserialize.apply(t, [obj[key]].concat(passthroughT)));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                try {
                    for (var _f = __values(Object.keys(obj)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var key = _g.value;
                        var newT = new T();
                        setProperties(newT, obj[key]);
                        this.set(key, newT);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        else {
            try {
                for (var _h = __values(Object.keys(obj)), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var key = _j.value;
                    this.set(key, obj[key]);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        this.reCreateList();
        return this;
    };
    return Dictionary;
}());
export { Dictionary };
//# sourceMappingURL=Dictionary.js.map