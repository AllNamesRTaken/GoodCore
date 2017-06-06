import { Obj } from "../Obj";
import { List } from "./List";
var Dictionary = (function () {
    function Dictionary() {
        this._lookup = {};
        this._list = new List();
        this._isDirty = false;
    }
    Dictionary.prototype.has = function (key) {
        return this._lookup.hasOwnProperty("" + key);
    };
    Dictionary.prototype.contains = function (key) {
        return this.has(key);
    };
    Dictionary.prototype.get = function (key) {
        return this._lookup["" + key];
    };
    Dictionary.prototype.set = function (key, value) {
        var k = "" + key;
        this._isDirty = this._isDirty || this.has(key);
        this._lookup[k] = value;
        if (!this._isDirty) {
            this._list.push(value);
        }
        return this;
    };
    Dictionary.prototype.delete = function (key) {
        var k = "" + key;
        if (this.has(k)) {
            delete this._lookup[k];
            this._isDirty = true;
        }
        return this;
    };
    Dictionary.prototype.clear = function () {
        Obj.wipe(this._lookup);
        this._list.clear();
        return this;
    };
    Object.defineProperty(Dictionary.prototype, "values", {
        get: function () {
            this.cleanList();
            return this._list.values;
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
    Object.defineProperty(Dictionary.prototype, "list", {
        get: function () {
            this.cleanList();
            return this._list;
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
                result = this._list.count;
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
        list.clear();
        while (++i < keys.length) {
            list.add(lookup[keys[i]]);
        }
    };
    return Dictionary;
}());
export { Dictionary };
//# sourceMappingURL=Dictionary.js.map