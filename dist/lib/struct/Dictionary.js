import { Obj } from "../Obj";
import { List } from "./List";
var Dictionary = (function () {
    function Dictionary() {
        this._lookup = {};
        this._index = {};
        this._list = new List();
    }
    Dictionary.prototype.Has = function (key) {
        return this._lookup.hasOwnProperty(key);
    };
    Dictionary.prototype.Get = function (key) {
        return this._lookup[key];
    };
    Dictionary.prototype.Set = function (key, value) {
        var list = this._list;
        var index = this._index;
        if (this.Has(key)) {
            list.RemoveAt(index[key]);
        }
        this._lookup[key] = value;
        var pos = list.Push(value);
        index[key] = pos - 1;
        return this;
    };
    Dictionary.prototype.Delete = function (key) {
        if (this.Has(key)) {
            var i = this._index[key];
            delete this._index[key];
            delete this._lookup[key];
            this._list.RemoveAt(i);
        }
        return this;
    };
    Dictionary.prototype.Clear = function () {
        Obj.Wipe(this._lookup);
        Obj.Wipe(this._index);
        this._list.Clear();
        return this;
    };
    Object.defineProperty(Dictionary.prototype, "Values", {
        get: function () {
            return this._list.Values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "Keys", {
        get: function () {
            return Object.keys(this._lookup);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "List", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    return Dictionary;
}());
export { Dictionary };
//# sourceMappingURL=Dictionary.js.map