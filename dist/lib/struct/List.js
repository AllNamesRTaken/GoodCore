import { Arr } from "../Arr";
import { Obj } from "../Obj";
var List = (function () {
    function List(arr) {
        if (arr === undefined) {
            this._array = new Array();
        }
        else {
            if (arr instanceof (List)) {
                this._array = Arr.ShallowCopy(arr._array);
            }
            else {
                this._array = Arr.ShallowCopy(arr);
            }
        }
    }
    Object.defineProperty(List.prototype, "Values", {
        get: function () {
            return this._array;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.Get = function (pos) {
        return this._array[pos];
    };
    Object.defineProperty(List.prototype, "Count", {
        get: function () {
            return this._array.length;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.Clear = function () {
        this._array.length = 0;
        return this;
    };
    List.prototype.Add = function (v) {
        this._array.push(v);
        return this;
    };
    List.prototype.InsertAt = function (pos, v) {
        Arr.InsertAt(this._array, pos, v);
        return this;
    };
    List.prototype.Push = function (v) {
        return this._array.push(v);
    };
    List.prototype.Pop = function () {
        return this._array.pop();
    };
    List.prototype.Shift = function () {
        return this._array.shift();
    };
    List.prototype.Concat = function (v) {
        var arr;
        if (v instanceof List) {
            arr = Arr.Concat(this._array, v._array);
        }
        else {
            arr = Arr.Concat(this._array, v);
        }
        return new List(arr);
    };
    List.prototype.Append = function (v) {
        if (v instanceof List) {
            Arr.Append(this._array, v._array);
        }
        else {
            Arr.Append(this._array, v);
        }
        return this;
    };
    List.prototype.Copy = function (src) {
        if (src instanceof List) {
            Arr.DeepCopyInto(src._array, this._array);
        }
        else {
            Arr.DeepCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.ShallowCopy = function (src) {
        if (src instanceof List) {
            Arr.ShallowCopyInto(src._array, this._array);
        }
        else {
            Arr.ShallowCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.Clone = function () {
        var arr = Arr.DeepCopy(this._array);
        return new List(arr);
    };
    List.prototype.Remove = function (v) {
        Arr.RemoveOneByElement(this._array, v);
        return this;
    };
    List.prototype.RemoveAt = function (n) {
        Arr.RemoveOneAt(this._array, n);
        return this;
    };
    List.prototype.ForEach = function (fn) {
        Arr.ForEach(this._array, fn);
        return this;
    };
    List.prototype.Until = function (fn) {
        Arr.Until(this._array, fn);
        return this;
    };
    List.prototype.Some = function (filter, fn) {
        Arr.Some(this._array, filter, fn);
        return this;
    };
    List.prototype.IndexOf = function (v) {
        return Arr.IndexOfElement(this._array, v);
    };
    List.prototype.Contains = function (v) {
        return Arr.IndexOfElement(this._array, v) !== -1;
    };
    List.prototype.Reverse = function () {
        Arr.Reverse(this._array);
        return this;
    };
    List.prototype.Select = function (fn) {
        return new List(Arr.Filter(this._array, fn));
    };
    List.prototype.SelectInto = function (src, fn) {
        if (src instanceof List) {
            Arr.FilterInto(src._array, this._array, fn);
        }
        else {
            Arr.FilterInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.OrderBy = function (fn) {
        this._array.sort(fn);
        return this;
    };
    List.prototype.Map = function (fn) {
        return new List(Arr.Map(this._array, fn));
    };
    List.prototype.MapInto = function (src, fn) {
        if (src instanceof List) {
            Arr.MapInto(src._array, this._array, fn);
        }
        else {
            Arr.MapInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.Reduce = function (fn, start) {
        return Arr.Reduce(this._array, fn, start);
    };
    List.prototype.Equals = function (b) {
        var result = Obj.Equals(this._array, b.Values);
        return result;
    };
    return List;
}());
export { List };
//# sourceMappingURL=List.js.map