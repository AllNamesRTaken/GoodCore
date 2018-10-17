import { shallowCopy, create, insertAt, concat, forEach, append, deepCopy, deepCopyInto, shallowCopyInto, remove, removeAt, forSome, until, reverseForEach, indexOfElement, map, reverseUntil, some, all, reverse, indexOf, filterInto, slice, splice, filter, mapInto, reduce, reduceUntil, reverseReduce, reverseReduceUntil, deserialize } from "../Arr";
import { clone, equals, wipe } from "../Obj";
import { isArray, isFunction, isNotNullOrUndefined, isNotUndefined, hasWindow, isNotNull } from "../Test";
if (hasWindow() && !window.Symbol) {
    window.Symbol = { iterator: "iterator" };
}
var List = (function () {
    function List(arr) {
        this._array = [];
        this._index = Object.create(null);
        this._indexer = null;
        this._pointer = 0;
        if (arr === undefined) {
            this._array = new Array();
        }
        else {
            if (arr instanceof (List)) {
                this._array = shallowCopy(arr._array);
            }
            else {
                this._array = shallowCopy(arr);
            }
        }
    }
    List.prototype[Symbol.iterator] = function () {
        return this;
    };
    List.prototype.next = function (value) {
        return {
            done: this._pointer >= this.length,
            value: this._pointer < this.length ? this._array[this._pointer++] : (this._pointer = 0, undefined)
        };
    };
    List.prototype.create = function (arr) {
        return new (this.constructor)(arr);
    };
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
    List.prototype.getByIndex = function (key) {
        var result;
        return isNotNullOrUndefined(this._index) ? this._index[key] : undefined;
    };
    List.prototype.set = function (pos, v) {
        if (pos >= 0 && pos < this.length) {
            this._array[pos | 0] = v;
            if (this._indexer !== null) {
                this._index[this._indexer(v)] = v;
            }
        }
        else {
            throw new Error("index out of bounds on <List>.set(" + pos + ", " + v.toString() + ")");
        }
        return this;
    };
    Object.defineProperty(List.prototype, "count", {
        get: function () {
            return this._array.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this._array.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "indexer", {
        get: function () {
            return this._indexer;
        },
        set: function (fn) {
            this._indexer = fn;
            this._reindex();
        },
        enumerable: true,
        configurable: true
    });
    List.prototype._reindex = function () {
        var _this = this;
        if (this._indexer === null) {
            this._index = null;
        }
        else {
            if (this._index === null) {
                this._index = Object.create(null);
            }
            else {
                wipe(this._index);
            }
            this.forEach(function (el) { return _this._index[_this._indexer(el)] = el; });
        }
    };
    List.prototype.truncate = function (size) {
        if (size === void 0) { size = 0; }
        if (size < 0) {
            var arr = this._array;
            var len = arr.length;
            size = Math.min(len, -1 * size);
            var i = len - size - 1;
            var j = -1;
            while (++i < len) {
                arr[++j] = arr[i];
            }
        }
        this._array.length = Math.max(0, Math.min(this._array.length, size));
        this._reindex();
        return this;
    };
    List.prototype.fill = function (size, populator) {
        size = Math.max(0, size || 0);
        if (isFunction(populator)) {
            this._array = create(size, populator);
        }
        else if (!(populator instanceof Object)) {
            this._array = create(size, function () { return populator; });
        }
        else {
            this._array = create(size, function () { return clone(populator); });
        }
        this._reindex();
        return this;
    };
    List.prototype.clear = function () {
        this._array.length = 0;
        if (this._index !== null) {
            wipe(this._index);
        }
        return this;
    };
    List.prototype.add = function (v) {
        this._array.push(v);
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this;
    };
    List.prototype.insertAt = function (pos, v) {
        insertAt(this._array, pos, v);
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this;
    };
    List.prototype.push = function (v) {
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this._array.push(v);
    };
    List.prototype.pop = function () {
        var result = this._array.pop();
        if (result !== undefined && this._indexer !== null) {
            delete this._index[this._indexer(result)];
        }
        return result;
    };
    List.prototype.shift = function () {
        var result = this._array.shift();
        if (result !== undefined && this._indexer !== null) {
            delete this._index[this._indexer(result)];
        }
        return result;
    };
    List.prototype.concat = function (v) {
        var arr;
        var arr2 = v instanceof List ? v.values : v;
        arr = concat(this._array, arr2);
        return this.create(arr);
    };
    List.prototype.index = function (arr) {
        var _this = this;
        if (this._indexer !== null) {
            forEach(arr, function (el) {
                _this._index[_this._indexer(el)] = el;
            });
        }
    };
    List.prototype.unindexEl = function (el) {
        if (isNotUndefined(el) && isNotNull(this._indexer)) {
            delete this._index[this._indexer(el)];
        }
    };
    List.prototype.append = function (v) {
        var arr2 = v instanceof List ? v.values : v;
        append(this._array, arr2);
        this.index(arr2);
        return this;
    };
    List.prototype.copy = function (src) {
        var arr2 = src instanceof List ? src.values : src;
        deepCopyInto(arr2, this._array);
        this.index(arr2);
        return this;
    };
    List.prototype.shallowCopy = function (src) {
        var arr2 = src instanceof List ? src.values : src;
        shallowCopyInto(arr2, this._array);
        this.index(arr2);
        return this;
    };
    List.prototype.clone = function () {
        var arr = deepCopy(this._array);
        var result = this.create(arr);
        if (this._indexer !== null) {
            result._indexer = this._indexer;
            result._index = clone(this._index);
        }
        return result;
    };
    List.prototype.remove = function (v) {
        remove(this._array, v);
        this.unindexEl(v);
        return this;
    };
    List.prototype.removeFirst = function (fn) {
        var result = this.removeAt(this.indexOf(fn));
        this.unindexEl(result);
        return result;
    };
    List.prototype.removeAt = function (n) {
        var result = removeAt(this._array, n);
        this.unindexEl(result);
        return result;
    };
    List.prototype.forEach = function (fn, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        forEach(this._array, fn, startIndex);
        return this;
    };
    List.prototype.forSome = function (filter, fn) {
        forSome(this._array, filter, fn);
        return this;
    };
    List.prototype.until = function (fnOrTest, fn, startIndex) {
        until(this._array, fnOrTest, fn, startIndex);
        return this;
    };
    List.prototype.reverseForEach = function (fn) {
        reverseForEach(this._array, fn);
        return this;
    };
    List.prototype.reverseUntil = function (fnOrTest, fn) {
        reverseUntil(this._array, fnOrTest, fn);
        return this;
    };
    List.prototype.some = function (fn) {
        return some(this._array, fn);
    };
    List.prototype.all = function (fn) {
        return all(this._array, fn);
    };
    List.prototype.indexOf = function (v) {
        var result = -1;
        if (isFunction(v)) {
            result = indexOf(this._array, v);
        }
        else {
            result = indexOfElement(this._array, v);
        }
        return result;
    };
    List.prototype.contains = function (v) {
        var result = false;
        if (isFunction(v)) {
            result = this.find(v) !== undefined;
        }
        else {
            if (this._indexer !== null) {
                result = this._index[this._indexer(v)] !== undefined;
            }
            else {
                result = indexOfElement(this._array, v) !== -1;
            }
        }
        return result;
    };
    List.prototype.reverse = function () {
        reverse(this._array);
        return this;
    };
    List.prototype.first = function (fn) {
        var index = -1;
        var result;
        if (fn === undefined) {
            index = 0;
        }
        else {
            index = indexOf(this._array, fn);
        }
        return index === -1 ? undefined : this.get(index);
    };
    List.prototype.find = function (fn) {
        return this.first(fn);
    };
    List.prototype.last = function () {
        return this.length === 0 ? undefined : this.get(this.length - 1);
    };
    List.prototype.filter = function (fn) {
        return this.create(filter(this._array, fn));
    };
    List.prototype.select = function (fn) {
        return this.create(filter(this._array, fn));
    };
    List.prototype.selectInto = function (src, fn) {
        var arr = src instanceof List ? src.values : src;
        filterInto(arr, this._array, fn);
        this.index(arr);
        return this;
    };
    List.prototype.head = function (count) {
        if (count === void 0) { count = 1; }
        count = Math.max(0, count);
        return this.create(slice(this._array, 0, count));
    };
    List.prototype.tail = function (count) {
        if (count === void 0) { count = 1; }
        count = Math.min(this._array.length, count);
        return this.create(slice(this._array, Math.max(0, this._array.length - count)));
    };
    List.prototype.splice = function (pos, remove, insert) {
        if (pos === void 0) { pos = 0; }
        if (remove === void 0) { remove = Infinity; }
        if (insert === void 0) { insert = []; }
        splice(this._array, pos, remove, isArray(insert) ? insert : insert.values);
        this._reindex();
        return this;
    };
    List.prototype.orderBy = function (fn) {
        this._array.sort(fn);
        return this;
    };
    List.prototype.map = function (fn) {
        return this.create(map(this._array, fn));
    };
    List.prototype.mapInto = function (src, fn) {
        var arr = src instanceof List ? src.values : src;
        mapInto(arr, this._array, fn);
        this._reindex();
        return this;
    };
    List.prototype.reduce = function (fn, start) {
        return reduce(this._array, fn, start);
    };
    List.prototype.reduceUntil = function (fn, test, start) {
        return reduceUntil(this._array, fn, test, start);
    };
    List.prototype.reverseReduce = function (fn, start) {
        return reverseReduce(this._array, fn, start);
    };
    List.prototype.reverseReduceUntil = function (fn, test, start) {
        return reverseReduceUntil(this._array, fn, test, start);
    };
    List.prototype.equals = function (b) {
        var result = equals(this._array, b.values);
        return result;
    };
    List.prototype.same = function (b) {
        var a = this;
        var count = 0;
        if (a.length === b.length) {
            if (a.indexer !== null) {
                b.until(function (el) { return !a.contains(el); }, function (el, i) { return ++count; });
            }
            else {
                a.until(function (el) { return !b.contains(el); }, function (el, i) { return ++count; });
            }
        }
        return count === a.length;
    };
    List.prototype.intersect = function (b) {
        var result = this.create();
        var long;
        var short;
        result.indexer = this.indexer;
        if (this.length < b.length) {
            short = this, long = b;
        }
        else {
            long = this, short = b;
        }
        if (long.indexer !== null) {
            short.forEach(function (el) {
                if (long.contains(el)) {
                    result.push(el);
                }
            });
        }
        else {
            long.forEach(function (el) {
                if (short.contains(el)) {
                    result.push(el);
                }
            });
        }
        return result;
    };
    List.prototype.union = function (b) {
        var result = this.create();
        var long;
        var short;
        result.indexer = this.indexer;
        if (this.length < b.length) {
            short = this, long = b;
        }
        else {
            long = this, short = b;
        }
        if (long.indexer !== null) {
            result = long.clone();
            short.forEach(function (el) {
                if (!long.contains(el)) {
                    result.push(el);
                }
            });
        }
        else {
            result = short.clone();
            long.forEach(function (el) {
                if (!short.contains(el)) {
                    result.push(el);
                }
            });
        }
        return result;
    };
    List.prototype.subtract = function (b) {
        var result = this.create();
        result.indexer = this.indexer;
        result = this.select(function (el) { return !b.contains(el); });
        return result;
    };
    List.prototype.zip = function (list, fn) {
        if (fn === void 0) { fn = function (t, u) { return [t, u]; }; }
        var result = this.create();
        var length = list.length;
        this.until(function (el, i) {
            return i >= length;
        }, function (el, i) {
            result.push(fn(el, list.get(i)));
        });
        return result;
    };
    List.prototype.unzip = function (fn) {
        if (fn === void 0) { fn = function (el) { return [el[0], el[1]]; }; }
        var result = [this.create(), this.create()];
        this.forEach(function (el) {
            var tuple = fn(el);
            result[0].push(tuple[0]);
            result[1].push(tuple[1]);
        });
        return result;
    };
    List.prototype.flatten = function (maxDepth) {
        if (maxDepth === void 0) { maxDepth = Infinity; }
        return this.create(maxDepth < 1 ? this.values : this._flattenInner(this.values, maxDepth));
    };
    List.prototype._flattenInner = function (src, maxDepth, depth, result) {
        if (depth === void 0) { depth = -1; }
        if (result === void 0) { result = []; }
        var i = -1;
        var len = src.length;
        if (++depth > maxDepth) {
            result.push(src);
        }
        else {
            while (++i < len) {
                if (isArray(src[i])) {
                    this._flattenInner(src[i], maxDepth, depth, result);
                }
                else if (src[i] instanceof List) {
                    this._flattenInner(src[i].values, maxDepth, depth, result);
                }
                else {
                    result.push(src[i]);
                }
            }
        }
        return result;
    };
    List.prototype.toJSON = function () {
        return this.values;
    };
    List.prototype.serialize = function () {
        return this.values.map(function (el) { return isFunction(el.serialize) ? el.serialize() : el; });
    };
    List.prototype.deserialize = function (array) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        deserialize.apply(this, [array, this._array].concat(types));
        return this;
    };
    return List;
}());
export { List };
//# sourceMappingURL=List.js.map