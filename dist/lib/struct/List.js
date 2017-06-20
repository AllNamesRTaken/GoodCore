import * as Arr from "../Arr";
import { equals } from "../Obj";
export class List {
    constructor(arr) {
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
    get values() {
        return this._array;
    }
    get(pos) {
        return this._array[pos];
    }
    get count() {
        return this._array.length;
    }
    clear() {
        this._array.length = 0;
        return this;
    }
    add(v) {
        this._array.push(v);
        return this;
    }
    insertAt(pos, v) {
        Arr.insertAt(this._array, pos, v);
        return this;
    }
    push(v) {
        return this._array.push(v);
    }
    pop() {
        return this._array.pop();
    }
    shift() {
        return this._array.shift();
    }
    concat(v) {
        let arr;
        if (v instanceof List) {
            arr = Arr.concat(this._array, v._array);
        }
        else {
            arr = Arr.concat(this._array, v);
        }
        return new List(arr);
    }
    append(v) {
        if (v instanceof List) {
            Arr.append(this._array, v._array);
        }
        else {
            Arr.append(this._array, v);
        }
        return this;
    }
    copy(src) {
        if (src instanceof List) {
            Arr.deepCopyInto(src._array, this._array);
        }
        else {
            Arr.deepCopyInto(src, this._array);
        }
        return this;
    }
    shallowCopy(src) {
        if (src instanceof List) {
            Arr.shallowCopyInto(src._array, this._array);
        }
        else {
            Arr.shallowCopyInto(src, this._array);
        }
        return this;
    }
    clone() {
        const arr = Arr.deepCopy(this._array);
        return new List(arr);
    }
    remove(v) {
        Arr.remove(this._array, v);
        return this;
    }
    removeAt(n) {
        Arr.removeAt(this._array, n);
        return this;
    }
    forEach(fn) {
        Arr.forEach(this._array, fn);
        return this;
    }
    until(test, fn) {
        Arr.until(this._array, test, fn);
        return this;
    }
    reverseForEach(fn) {
        Arr.reverseForEach(this._array, fn);
        return this;
    }
    reverseUntil(test, fn) {
        Arr.reverseUntil(this._array, test, fn);
        return this;
    }
    some(filter, fn) {
        Arr.some(this._array, filter, fn);
        return this;
    }
    indexOf(v) {
        return Arr.indexOfElement(this._array, v);
    }
    contains(v) {
        return Arr.indexOfElement(this._array, v) !== -1;
    }
    reverse() {
        Arr.reverse(this._array);
        return this;
    }
    select(fn) {
        return new List(Arr.filter(this._array, fn));
    }
    selectInto(src, fn) {
        if (src instanceof List) {
            Arr.filterInto(src._array, this._array, fn);
        }
        else {
            Arr.filterInto(src, this._array, fn);
        }
        return this;
    }
    orderBy(fn) {
        this._array.sort(fn);
        return this;
    }
    map(fn) {
        return new List(Arr.map(this._array, fn));
    }
    mapInto(src, fn) {
        if (src instanceof List) {
            Arr.mapInto(src._array, this._array, fn);
        }
        else {
            Arr.mapInto(src, this._array, fn);
        }
        return this;
    }
    reduce(fn, start) {
        return Arr.reduce(this._array, fn, start);
    }
    equals(b) {
        const result = equals(this._array, b.values);
        return result;
    }
}
//# sourceMappingURL=List.js.map