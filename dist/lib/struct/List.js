import { Arr } from "../Arr";
import { Obj } from "../Obj";
var List = (function () {
    function List(arr) {
        if (arr === undefined) {
            this._array = new Array();
        }
        else {
            if (arr instanceof (List)) {
                this._array = Arr.shallowCopy(arr._array);
            }
            else {
                this._array = Arr.shallowCopy(arr);
            }
        }
    }
    Object.defineProperty(List.prototype, "values", {
        get: function () {
            return this._array;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.get = function (pos) {
        return this._array[pos];
    };
    Object.defineProperty(List.prototype, "count", {
        get: function () {
            return this._array.length;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.clear = function () {
        this._array.length = 0;
        return this;
    };
    List.prototype.add = function (v) {
        this._array.push(v);
        return this;
    };
    List.prototype.insertAt = function (pos, v) {
        Arr.insertAt(this._array, pos, v);
        return this;
    };
    List.prototype.push = function (v) {
        return this._array.push(v);
    };
    List.prototype.pop = function () {
        return this._array.pop();
    };
    List.prototype.shift = function () {
        return this._array.shift();
    };
    List.prototype.concat = function (v) {
        var arr;
        if (v instanceof List) {
            arr = Arr.concat(this._array, v._array);
        }
        else {
            arr = Arr.concat(this._array, v);
        }
        return new List(arr);
    };
    List.prototype.append = function (v) {
        if (v instanceof List) {
            Arr.append(this._array, v._array);
        }
        else {
            Arr.append(this._array, v);
        }
        return this;
    };
    List.prototype.copy = function (src) {
        if (src instanceof List) {
            Arr.deepCopyInto(src._array, this._array);
        }
        else {
            Arr.deepCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.shallowCopy = function (src) {
        if (src instanceof List) {
            Arr.shallowCopyInto(src._array, this._array);
        }
        else {
            Arr.shallowCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.clone = function () {
        var arr = Arr.deepCopy(this._array);
        return new List(arr);
    };
    List.prototype.remove = function (v) {
        Arr.remove(this._array, v);
        return this;
    };
    List.prototype.removeAt = function (n) {
        Arr.removeAt(this._array, n);
        return this;
    };
    List.prototype.forEach = function (fn) {
        Arr.forEach(this._array, fn);
        return this;
    };
    List.prototype.until = function (test, fn) {
        Arr.until(this._array, test, fn);
        return this;
    };
    List.prototype.reverseForEach = function (fn) {
        Arr.reverseForEach(this._array, fn);
        return this;
    };
    List.prototype.reverseUntil = function (test, fn) {
        Arr.reverseUntil(this._array, test, fn);
        return this;
    };
    List.prototype.some = function (filter, fn) {
        Arr.some(this._array, filter, fn);
        return this;
    };
    List.prototype.indexOf = function (v) {
        return Arr.indexOfElement(this._array, v);
    };
    List.prototype.contains = function (v) {
        return Arr.indexOfElement(this._array, v) !== -1;
    };
    List.prototype.reverse = function () {
        Arr.reverse(this._array);
        return this;
    };
    List.prototype.select = function (fn) {
        return new List(Arr.filter(this._array, fn));
    };
    List.prototype.selectInto = function (src, fn) {
        if (src instanceof List) {
            Arr.filterInto(src._array, this._array, fn);
        }
        else {
            Arr.filterInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.orderBy = function (fn) {
        this._array.sort(fn);
        return this;
    };
    List.prototype.map = function (fn) {
        return new List(Arr.map(this._array, fn));
    };
    List.prototype.mapInto = function (src, fn) {
        if (src instanceof List) {
            Arr.mapInto(src._array, this._array, fn);
        }
        else {
            Arr.mapInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.reduce = function (fn, start) {
        return Arr.reduce(this._array, fn, start);
    };
    List.prototype.equals = function (b) {
        var result = Obj.equals(this._array, b.values);
        return result;
    };
    return List;
}());
export { List };
//# sourceMappingURL=List.js.map