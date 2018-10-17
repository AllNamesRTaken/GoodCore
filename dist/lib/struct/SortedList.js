import { binarySearch } from "../Arr";
import { equals } from "../Obj";
import { isFunction, hasWindow } from "../Test";
import { List } from "./List";
if (hasWindow() && !window.Symbol) {
    window.Symbol = { iterator: "iterator" };
}
var Comparer = (function () {
    function Comparer() {
    }
    Comparer.StringAsc = function (a, b) { return a < b ? -1 : a === b ? 0 : 1; };
    Comparer.StringDesc = function (a, b) { return a < b ? 1 : a === b ? 0 : -1; };
    Comparer.NumberAsc = function (a, b) { return a < b ? -1 : a === b ? 0 : 1; };
    Comparer.NumberDesc = function (a, b) { return a < b ? 1 : a === b ? 0 : -1; };
    return Comparer;
}());
export { Comparer };
var SortedList = (function () {
    function SortedList(comparer, arr) {
        if (comparer === void 0) { comparer = (function (a, b) { return a < b ? -1 : a === b ? 0 : 1; }); }
        this._list = new List();
        this._pointer = 0;
        this._cmp = comparer;
        if (arr === undefined) {
            this._list = new List();
        }
        else {
            if (arr instanceof (List) || arr instanceof (SortedList)) {
                this.copy(arr.values);
            }
            else {
                this.copy(arr);
            }
        }
    }
    SortedList.prototype[Symbol.iterator] = function () {
        return this;
    };
    SortedList.prototype.next = function (value) {
        return {
            done: this._pointer >= this.length,
            value: this._pointer < this.length ? this.values[this._pointer++] : (this._pointer = 0, undefined)
        };
    };
    SortedList.prototype.create = function (comparer, arr) {
        return new (this.constructor)(comparer, arr);
    };
    Object.defineProperty(SortedList.prototype, "values", {
        get: function () {
            return this._list.values;
        },
        enumerable: true,
        configurable: true
    });
    SortedList.prototype.get = function (pos) {
        return this._list.get(pos);
    };
    Object.defineProperty(SortedList.prototype, "count", {
        get: function () {
            return this._list.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortedList.prototype, "length", {
        get: function () {
            return this._list.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortedList.prototype, "comparer", {
        get: function () {
            return this._cmp;
        },
        set: function (v) {
            this._cmp = v;
            this.sort();
        },
        enumerable: true,
        configurable: true
    });
    SortedList.prototype.sort = function () {
        this._list.orderBy(this._cmp);
    };
    SortedList.prototype.truncate = function (size) {
        if (size === void 0) { size = 0; }
        this._list.truncate(size);
        return this;
    };
    SortedList.prototype.fill = function (size, populator) {
        this._list.fill(size, populator);
        this.sort();
        return this;
    };
    SortedList.prototype.clear = function () {
        this._list.clear();
        return this;
    };
    SortedList.prototype.add = function (v) {
        var index = this.getInsertIndex(v);
        this._list.insertAt(index, v);
        return this;
    };
    SortedList.prototype.pop = function () {
        return this._list.pop();
    };
    SortedList.prototype.shift = function () {
        return this._list.shift();
    };
    SortedList.prototype.bulkAdd = function (v) {
        if (v instanceof List || v instanceof SortedList) {
            this._list.append(v.values);
        }
        else {
            this._list.append(v);
        }
        this.sort();
        return this;
    };
    SortedList.prototype.copy = function (src) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.copy(src.values);
        }
        else {
            this._list.copy(src);
        }
        this.sort();
        return this;
    };
    SortedList.prototype.clone = function () {
        return this.create(this._cmp, this._list.clone());
    };
    SortedList.prototype.remove = function (v) {
        var index = this.indexOf(v);
        if (index !== -1) {
            this._list.removeAt(index);
        }
        return this;
    };
    SortedList.prototype.removeAt = function (n) {
        return this._list.removeAt(n);
    };
    SortedList.prototype.removeFirst = function (fn) {
        return this._list.removeFirst(fn);
    };
    SortedList.prototype.forEach = function (fn, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        this._list.forEach(fn, startIndex);
        return this;
    };
    SortedList.prototype.forSome = function (filter, fn) {
        this._list.forSome(filter, fn);
        return this;
    };
    SortedList.prototype.until = function (fnOrTest, fn, startIndex) {
        this._list.until(fnOrTest, fn, startIndex);
        return this;
    };
    SortedList.prototype.reverseForEach = function (fn) {
        this._list.reverseForEach(fn);
        return this;
    };
    SortedList.prototype.reverseUntil = function (fnOrTest, fn) {
        this._list.reverseUntil(fnOrTest, fn);
        return this;
    };
    SortedList.prototype.some = function (fn) {
        return this._list.some(fn);
    };
    SortedList.prototype.all = function (fn) {
        return this._list.all(fn);
    };
    SortedList.prototype.getInsertIndex = function (v) {
        var _this = this;
        return binarySearch(this._list.values, function (el) { return _this._cmp(el, v); }, true);
    };
    SortedList.prototype.indexOf = function (v) {
        var _this = this;
        var result = -1;
        if (v instanceof Function) {
            result = this._list.indexOf(v);
        }
        else {
            result = binarySearch(this._list.values, function (el) { return _this._cmp(el, v); }, false);
        }
        return result;
    };
    SortedList.prototype.contains = function (v) {
        return this.indexOf(v) !== -1;
    };
    SortedList.prototype.first = function (fn) {
        return this._list.first(fn);
    };
    SortedList.prototype.find = function (fn) {
        return this._list.find(fn);
    };
    SortedList.prototype.last = function () {
        return this._list.last();
    };
    SortedList.prototype.filter = function (fn) {
        return this.create(this._cmp, this._list.filter(fn));
    };
    SortedList.prototype.select = function (fn) {
        return this.create(this._cmp, this._list.filter(fn));
    };
    SortedList.prototype.selectInto = function (src, fn) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.selectInto(src.values, fn);
        }
        else {
            this._list.selectInto(src, fn);
        }
        this.sort();
        return this;
    };
    SortedList.prototype.head = function (count) {
        if (count === void 0) { count = 1; }
        return this.create(this.comparer, this._list.head(count));
    };
    SortedList.prototype.tail = function (count) {
        if (count === void 0) { count = 1; }
        return this.create(this.comparer, this._list.tail(count));
    };
    SortedList.prototype.map = function (fn) {
        return this._list.map(fn);
    };
    SortedList.prototype.mapInto = function (src, fn) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.mapInto(src.values, fn);
        }
        else {
            this._list.mapInto(src, fn);
        }
        this.sort();
        return this;
    };
    SortedList.prototype.reduce = function (fn, start) {
        return this._list.reduce(fn, start);
    };
    SortedList.prototype.reduceUntil = function (fn, test, start) {
        return this._list.reduceUntil(fn, test, start);
    };
    SortedList.prototype.reverseReduce = function (fn, start) {
        return this._list.reverseReduce(fn, start);
    };
    SortedList.prototype.reverseReduceUntil = function (fn, test, start) {
        return this._list.reverseReduceUntil(fn, test, start);
    };
    SortedList.prototype.equals = function (b) {
        var result = equals(this._list.values, b.values);
        return result;
    };
    SortedList.prototype.same = function (b) {
        return this.equals(b);
    };
    SortedList.prototype.intersect = function (b) {
        var result = this.create(this.comparer);
        var long;
        var short;
        if (this.length > 0 && b.length > 0) {
            if (this.length < b.length) {
                short = this, long = b;
            }
            else {
                long = this, short = b;
            }
            if (b instanceof SortedList && this.comparer === b.comparer) {
                var longPos = long.getInsertIndex(short.get(0)) - 1;
                var lastPos = long.getInsertIndex(short.last()) - 1;
                var i = -1;
                var shortLen = short.length;
                while (longPos < lastPos && ++i < shortLen) {
                    var el = short.get(i);
                    var aVsB = void 0;
                    while (++longPos < lastPos && (aVsB = this.comparer(long.get(longPos), el)) < 0) {
                        void (0);
                    }
                    if (longPos < lastPos && aVsB === 0) {
                        result.add(el);
                    }
                }
            }
            else if (long instanceof SortedList || (long instanceof List && long.indexer !== null)) {
                short.forEach(function (el) {
                    if (long.contains(el)) {
                        result.add(el);
                    }
                });
            }
            else {
                result = result.bulkAdd(short.toList().intersect(long));
            }
        }
        return result;
    };
    SortedList.prototype.union = function (b) {
        var result;
        var long;
        var short;
        if (this.length > 0 || b.length > 0) {
            if (this.length < b.length) {
                short = this, long = b;
            }
            else {
                long = this, short = b;
            }
            if (b instanceof SortedList && this.comparer === b.comparer) {
                result = this.create(this.comparer, long.values);
                var longPos = long.getInsertIndex(short.get(0)) - 1;
                var lastPos = long.getInsertIndex(short.last()) - 1;
                var i = -1;
                var shortLen = short.length;
                while (++i < shortLen && longPos < lastPos) {
                    var el = short.get(i);
                    var aVsB = -1;
                    while (++longPos < lastPos && (aVsB = this.comparer(long.get(longPos), el)) < 0) {
                        void (0);
                    }
                    if ((aVsB > 0 && longPos < lastPos) || longPos === lastPos) {
                        result.add(el);
                    }
                }
                if (i < shortLen) {
                    --i;
                    while (++i < shortLen) {
                        result.add(short.get(i));
                    }
                }
            }
            else if (long instanceof SortedList || (long instanceof List && long.indexer !== null)) {
                result = this.create(this.comparer, long.values);
                short.forEach(function (el) {
                    if (!long.contains(el)) {
                        result.add(el);
                    }
                });
            }
            else {
                result = this.create(this.comparer, short.toList().union(long));
            }
        }
        else {
            result = this.create(this.comparer);
        }
        return result;
    };
    SortedList.prototype.toList = function () {
        return new List(this.values);
    };
    SortedList.prototype.toJSON = function () {
        return this.values;
    };
    SortedList.prototype.serialize = function () {
        return this.values.map(function (el) { return isFunction(el.serialize) ? el.serialize() : el; });
    };
    SortedList.prototype.deserialize = function (array) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        this._list.deserialize.apply(this._list, [array].concat(types));
        this.sort();
        return this;
    };
    return SortedList;
}());
export { SortedList };
//# sourceMappingURL=SortedList.js.map