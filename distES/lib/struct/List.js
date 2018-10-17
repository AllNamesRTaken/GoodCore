import { shallowCopy, create, insertAt, concat, forEach, append, deepCopy, deepCopyInto, shallowCopyInto, remove, removeAt, forSome, until, reverseForEach, indexOfElement, map, reverseUntil, some, all, reverse, indexOf, filterInto, slice, splice, filter, mapInto, reduce, reduceUntil, reverseReduce, reverseReduceUntil, deserialize } from "../Arr";
import { clone, equals, wipe } from "../Obj";
import { isArray, isFunction, isNotNullOrUndefined, isNotUndefined, hasWindow, isNotNull } from "../Test";
if (hasWindow() && !window.Symbol) {
    window.Symbol = { iterator: "iterator" };
}
export class List {
    constructor(arr) {
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
    [Symbol.iterator]() {
        return this;
    }
    next(value) {
        return {
            done: this._pointer >= this.length,
            value: this._pointer < this.length ? this._array[this._pointer++] : (this._pointer = 0, undefined)
        };
    }
    create(arr) {
        return new (this.constructor)(arr);
    }
    get values() {
        return this._array;
    }
    get(pos) {
        return this._array[pos];
    }
    getByIndex(key) {
        let result;
        return isNotNullOrUndefined(this._index) ? this._index[key] : undefined;
    }
    set(pos, v) {
        if (pos >= 0 && pos < this.length) {
            this._array[pos | 0] = v;
            if (this._indexer !== null) {
                this._index[this._indexer(v)] = v;
            }
        }
        else {
            throw new Error(`index out of bounds on <List>.set(${pos}, ${v.toString()})`);
        }
        return this;
    }
    get count() {
        return this._array.length;
    }
    get length() {
        return this._array.length;
    }
    get indexer() {
        return this._indexer;
    }
    set indexer(fn) {
        this._indexer = fn;
        this._reindex();
    }
    _reindex() {
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
            this.forEach((el) => this._index[this._indexer(el)] = el);
        }
    }
    truncate(size = 0) {
        if (size < 0) {
            let arr = this._array;
            let len = arr.length;
            size = Math.min(len, -1 * size);
            let i = len - size - 1;
            let j = -1;
            while (++i < len) {
                arr[++j] = arr[i];
            }
        }
        this._array.length = Math.max(0, Math.min(this._array.length, size));
        this._reindex();
        return this;
    }
    fill(size, populator) {
        size = Math.max(0, size || 0);
        if (isFunction(populator)) {
            this._array = create(size, populator);
        }
        else if (!(populator instanceof Object)) {
            this._array = create(size, () => populator);
        }
        else {
            this._array = create(size, () => clone(populator));
        }
        this._reindex();
        return this;
    }
    clear() {
        this._array.length = 0;
        if (this._index !== null) {
            wipe(this._index);
        }
        return this;
    }
    add(v) {
        this._array.push(v);
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this;
    }
    insertAt(pos, v) {
        insertAt(this._array, pos, v);
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this;
    }
    push(v) {
        if (this._indexer !== null) {
            this._index[this._indexer(v)] = v;
        }
        return this._array.push(v);
    }
    pop() {
        let result = this._array.pop();
        if (result !== undefined && this._indexer !== null) {
            delete this._index[this._indexer(result)];
        }
        return result;
    }
    shift() {
        let result = this._array.shift();
        if (result !== undefined && this._indexer !== null) {
            delete this._index[this._indexer(result)];
        }
        return result;
    }
    concat(v) {
        let arr;
        let arr2 = v instanceof List ? v.values : v;
        arr = concat(this._array, arr2);
        return this.create(arr);
    }
    index(arr) {
        if (this._indexer !== null) {
            forEach(arr, (el) => {
                this._index[this._indexer(el)] = el;
            });
        }
    }
    unindexEl(el) {
        if (isNotUndefined(el) && isNotNull(this._indexer)) {
            delete this._index[this._indexer(el)];
        }
    }
    append(v) {
        let arr2 = v instanceof List ? v.values : v;
        append(this._array, arr2);
        this.index(arr2);
        return this;
    }
    copy(src) {
        let arr2 = src instanceof List ? src.values : src;
        deepCopyInto(arr2, this._array);
        this.index(arr2);
        return this;
    }
    shallowCopy(src) {
        let arr2 = src instanceof List ? src.values : src;
        shallowCopyInto(arr2, this._array);
        this.index(arr2);
        return this;
    }
    clone() {
        const arr = deepCopy(this._array);
        let result = this.create(arr);
        if (this._indexer !== null) {
            result._indexer = this._indexer;
            result._index = clone(this._index);
        }
        return result;
    }
    remove(v) {
        remove(this._array, v);
        this.unindexEl(v);
        return this;
    }
    removeFirst(fn) {
        let result = this.removeAt(this.indexOf(fn));
        this.unindexEl(result);
        return result;
    }
    removeAt(n) {
        let result = removeAt(this._array, n);
        this.unindexEl(result);
        return result;
    }
    forEach(fn, startIndex = 0) {
        forEach(this._array, fn, startIndex);
        return this;
    }
    forSome(filter, fn) {
        forSome(this._array, filter, fn);
        return this;
    }
    until(fnOrTest, fn, startIndex) {
        until(this._array, fnOrTest, fn, startIndex);
        return this;
    }
    reverseForEach(fn) {
        reverseForEach(this._array, fn);
        return this;
    }
    reverseUntil(fnOrTest, fn) {
        reverseUntil(this._array, fnOrTest, fn);
        return this;
    }
    some(fn) {
        return some(this._array, fn);
    }
    all(fn) {
        return all(this._array, fn);
    }
    indexOf(v) {
        let result = -1;
        if (isFunction(v)) {
            result = indexOf(this._array, v);
        }
        else {
            result = indexOfElement(this._array, v);
        }
        return result;
    }
    contains(v) {
        let result = false;
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
    }
    reverse() {
        reverse(this._array);
        return this;
    }
    first(fn) {
        let index = -1;
        let result;
        if (fn === undefined) {
            index = 0;
        }
        else {
            index = indexOf(this._array, fn);
        }
        return index === -1 ? undefined : this.get(index);
    }
    find(fn) {
        return this.first(fn);
    }
    last() {
        return this.length === 0 ? undefined : this.get(this.length - 1);
    }
    filter(fn) {
        return this.create(filter(this._array, fn));
    }
    select(fn) {
        return this.create(filter(this._array, fn));
    }
    selectInto(src, fn) {
        let arr = src instanceof List ? src.values : src;
        filterInto(arr, this._array, fn);
        this.index(arr);
        return this;
    }
    head(count = 1) {
        count = Math.max(0, count);
        return this.create(slice(this._array, 0, count));
    }
    tail(count = 1) {
        count = Math.min(this._array.length, count);
        return this.create(slice(this._array, Math.max(0, this._array.length - count)));
    }
    splice(pos = 0, remove = Infinity, insert = []) {
        splice(this._array, pos, remove, isArray(insert) ? insert : insert.values);
        this._reindex();
        return this;
    }
    orderBy(fn) {
        this._array.sort(fn);
        return this;
    }
    map(fn) {
        return this.create(map(this._array, fn));
    }
    mapInto(src, fn) {
        let arr = src instanceof List ? src.values : src;
        mapInto(arr, this._array, fn);
        this._reindex();
        return this;
    }
    reduce(fn, start) {
        return reduce(this._array, fn, start);
    }
    reduceUntil(fn, test, start) {
        return reduceUntil(this._array, fn, test, start);
    }
    reverseReduce(fn, start) {
        return reverseReduce(this._array, fn, start);
    }
    reverseReduceUntil(fn, test, start) {
        return reverseReduceUntil(this._array, fn, test, start);
    }
    equals(b) {
        const result = equals(this._array, b.values);
        return result;
    }
    same(b) {
        let a = this;
        let count = 0;
        if (a.length === b.length) {
            if (a.indexer !== null) {
                b.until((el) => !a.contains(el), (el, i) => ++count);
            }
            else {
                a.until((el) => !b.contains(el), (el, i) => ++count);
            }
        }
        return count === a.length;
    }
    intersect(b) {
        let result = this.create();
        let long;
        let short;
        result.indexer = this.indexer;
        if (this.length < b.length) {
            short = this, long = b;
        }
        else {
            long = this, short = b;
        }
        if (long.indexer !== null) {
            short.forEach((el) => {
                if (long.contains(el)) {
                    result.push(el);
                }
            });
        }
        else {
            long.forEach((el) => {
                if (short.contains(el)) {
                    result.push(el);
                }
            });
        }
        return result;
    }
    union(b) {
        let result = this.create();
        let long;
        let short;
        result.indexer = this.indexer;
        if (this.length < b.length) {
            short = this, long = b;
        }
        else {
            long = this, short = b;
        }
        if (long.indexer !== null) {
            result = long.clone();
            short.forEach((el) => {
                if (!long.contains(el)) {
                    result.push(el);
                }
            });
        }
        else {
            result = short.clone();
            long.forEach((el) => {
                if (!short.contains(el)) {
                    result.push(el);
                }
            });
        }
        return result;
    }
    subtract(b) {
        let result = this.create();
        result.indexer = this.indexer;
        result = this.select((el) => !b.contains(el));
        return result;
    }
    zip(list, fn = (t, u) => [t, u]) {
        let result = this.create();
        let length = list.length;
        this.until(function (el, i) {
            return i >= length;
        }, function (el, i) {
            result.push(fn(el, list.get(i)));
        });
        return result;
    }
    unzip(fn = (el) => [el[0], el[1]]) {
        let result = [this.create(), this.create()];
        this.forEach(function (el) {
            let tuple = fn(el);
            result[0].push(tuple[0]);
            result[1].push(tuple[1]);
        });
        return result;
    }
    flatten(maxDepth = Infinity) {
        return this.create(maxDepth < 1 ? this.values : this._flattenInner(this.values, maxDepth));
    }
    _flattenInner(src, maxDepth, depth = -1, result = []) {
        let i = -1;
        const len = src.length;
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
    }
    toJSON() {
        return this.values;
    }
    serialize() {
        return this.values.map((el) => isFunction(el.serialize) ? el.serialize() : el);
    }
    deserialize(array, ...types) {
        deserialize.apply(this, [array, this._array].concat(types));
        return this;
    }
}
//# sourceMappingURL=List.js.map