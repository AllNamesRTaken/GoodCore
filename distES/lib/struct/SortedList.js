import { binarySearch } from "../Arr";
import { equals } from "../Obj";
import { isFunction, hasWindow } from "../Test";
import { List } from "./List";
if (hasWindow() && !window.Symbol) {
    window.Symbol = { iterator: "iterator" };
}
export class Comparer {
}
Comparer.StringAsc = function (a, b) { return a < b ? -1 : a === b ? 0 : 1; };
Comparer.StringDesc = function (a, b) { return a < b ? 1 : a === b ? 0 : -1; };
Comparer.NumberAsc = function (a, b) { return a < b ? -1 : a === b ? 0 : 1; };
Comparer.NumberDesc = function (a, b) { return a < b ? 1 : a === b ? 0 : -1; };
export class SortedList {
    constructor(comparer = ((a, b) => a < b ? -1 : a === b ? 0 : 1), arr) {
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
    [Symbol.iterator]() {
        return this;
    }
    next(value) {
        return {
            done: this._pointer >= this.length,
            value: this._pointer < this.length ? this.values[this._pointer++] : (this._pointer = 0, undefined)
        };
    }
    create(comparer, arr) {
        return new (this.constructor)(comparer, arr);
    }
    get values() {
        return this._list.values;
    }
    get(pos) {
        return this._list.get(pos);
    }
    get count() {
        return this._list.length;
    }
    get length() {
        return this._list.length;
    }
    get comparer() {
        return this._cmp;
    }
    set comparer(v) {
        this._cmp = v;
        this.sort();
    }
    sort() {
        this._list.orderBy(this._cmp);
    }
    truncate(size = 0) {
        this._list.truncate(size);
        return this;
    }
    fill(size, populator) {
        this._list.fill(size, populator);
        this.sort();
        return this;
    }
    clear() {
        this._list.clear();
        return this;
    }
    add(v) {
        let index = this.getInsertIndex(v);
        this._list.insertAt(index, v);
        return this;
    }
    pop() {
        return this._list.pop();
    }
    shift() {
        return this._list.shift();
    }
    bulkAdd(v) {
        if (v instanceof List || v instanceof SortedList) {
            this._list.append(v.values);
        }
        else {
            this._list.append(v);
        }
        this.sort();
        return this;
    }
    copy(src) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.copy(src.values);
        }
        else {
            this._list.copy(src);
        }
        this.sort();
        return this;
    }
    clone() {
        return this.create(this._cmp, this._list.clone());
    }
    remove(v) {
        let index = this.indexOf(v);
        if (index !== -1) {
            this._list.removeAt(index);
        }
        return this;
    }
    removeAt(n) {
        return this._list.removeAt(n);
    }
    removeFirst(fn) {
        return this._list.removeFirst(fn);
    }
    forEach(fn, startIndex = 0) {
        this._list.forEach(fn, startIndex);
        return this;
    }
    forSome(filter, fn) {
        this._list.forSome(filter, fn);
        return this;
    }
    until(fnOrTest, fn, startIndex) {
        this._list.until(fnOrTest, fn, startIndex);
        return this;
    }
    reverseForEach(fn) {
        this._list.reverseForEach(fn);
        return this;
    }
    reverseUntil(fnOrTest, fn) {
        this._list.reverseUntil(fnOrTest, fn);
        return this;
    }
    some(fn) {
        return this._list.some(fn);
    }
    all(fn) {
        return this._list.all(fn);
    }
    getInsertIndex(v) {
        return binarySearch(this._list.values, (el) => this._cmp(el, v), true);
    }
    indexOf(v) {
        let result = -1;
        if (v instanceof Function) {
            result = this._list.indexOf(v);
        }
        else {
            result = binarySearch(this._list.values, (el) => this._cmp(el, v), false);
        }
        return result;
    }
    contains(v) {
        return this.indexOf(v) !== -1;
    }
    first(fn) {
        return this._list.first(fn);
    }
    find(fn) {
        return this._list.find(fn);
    }
    last() {
        return this._list.last();
    }
    filter(fn) {
        return this.create(this._cmp, this._list.filter(fn));
    }
    select(fn) {
        return this.create(this._cmp, this._list.filter(fn));
    }
    selectInto(src, fn) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.selectInto(src.values, fn);
        }
        else {
            this._list.selectInto(src, fn);
        }
        this.sort();
        return this;
    }
    head(count = 1) {
        return this.create(this.comparer, this._list.head(count));
    }
    tail(count = 1) {
        return this.create(this.comparer, this._list.tail(count));
    }
    map(fn) {
        return this._list.map(fn);
    }
    mapInto(src, fn) {
        if (src instanceof List || src instanceof SortedList) {
            this._list.mapInto(src.values, fn);
        }
        else {
            this._list.mapInto(src, fn);
        }
        this.sort();
        return this;
    }
    reduce(fn, start) {
        return this._list.reduce(fn, start);
    }
    reduceUntil(fn, test, start) {
        return this._list.reduceUntil(fn, test, start);
    }
    reverseReduce(fn, start) {
        return this._list.reverseReduce(fn, start);
    }
    reverseReduceUntil(fn, test, start) {
        return this._list.reverseReduceUntil(fn, test, start);
    }
    equals(b) {
        const result = equals(this._list.values, b.values);
        return result;
    }
    same(b) {
        return this.equals(b);
    }
    intersect(b) {
        let result = this.create(this.comparer);
        let long;
        let short;
        if (this.length > 0 && b.length > 0) {
            if (this.length < b.length) {
                short = this, long = b;
            }
            else {
                long = this, short = b;
            }
            if (b instanceof SortedList && this.comparer === b.comparer) {
                let longPos = long.getInsertIndex(short.get(0)) - 1;
                let lastPos = long.getInsertIndex(short.last()) - 1;
                let i = -1;
                let shortLen = short.length;
                while (longPos < lastPos && ++i < shortLen) {
                    let el = short.get(i);
                    let aVsB;
                    while (++longPos < lastPos && (aVsB = this.comparer(long.get(longPos), el)) < 0) {
                        void (0);
                    }
                    if (longPos < lastPos && aVsB === 0) {
                        result.add(el);
                    }
                }
            }
            else if (long instanceof SortedList || (long instanceof List && long.indexer !== null)) {
                short.forEach((el) => {
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
    }
    union(b) {
        let result;
        let long;
        let short;
        if (this.length > 0 || b.length > 0) {
            if (this.length < b.length) {
                short = this, long = b;
            }
            else {
                long = this, short = b;
            }
            if (b instanceof SortedList && this.comparer === b.comparer) {
                result = this.create(this.comparer, long.values);
                let longPos = long.getInsertIndex(short.get(0)) - 1;
                let lastPos = long.getInsertIndex(short.last()) - 1;
                let i = -1;
                let shortLen = short.length;
                while (++i < shortLen && longPos < lastPos) {
                    let el = short.get(i);
                    let aVsB = -1;
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
                short.forEach((el) => {
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
    }
    toList() {
        return new List(this.values);
    }
    toJSON() {
        return this.values;
    }
    serialize() {
        return this.values.map((el) => isFunction(el.serialize) ? el.serialize() : el);
    }
    deserialize(array, ...types) {
        this._list.deserialize.apply(this._list, [array].concat(types));
        this.sort();
        return this;
    }
}
//# sourceMappingURL=SortedList.js.map