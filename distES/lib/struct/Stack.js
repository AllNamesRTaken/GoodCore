import { deepCopy, slice, deserialize } from "../Arr";
import { isFunction } from "../Test";
import { List } from "./List";
export class Stack {
    constructor(size) {
        this.DEFAULT_SIZE = 100;
        this._pos = 0;
        this._limit = 0;
        if (!size) {
            size = this.DEFAULT_SIZE;
        }
        this.DEFAULT_SIZE = size;
        this._array = new Array(size);
        this.push = this.fastPush;
    }
    get values() {
        return slice(this._array, 0, this._pos);
    }
    get depth() {
        return this._pos;
    }
    get size() {
        return this._pos;
    }
    get isEmpty() {
        return this.size === 0;
    }
    get limit() {
        return this._limit;
    }
    set limit(value) {
        if (value < 0) {
            value = 0;
        }
        this._limit = value;
        if (value === 0) {
            this.push = this.fastPush;
        }
        else {
            this.push = this.limitedPush;
            this.limitObjects();
        }
    }
    create(size) {
        return new (this.constructor)(size);
    }
    push(obj) {
    }
    fastPush(obj) {
        this._array[this._pos++] = obj;
    }
    limitedPush(obj) {
        this._array[this._pos] = obj;
        ++this._pos;
        this.limitObjects();
    }
    pop() {
        let result = undefined;
        if (this._pos !== 0) {
            result = this._array[--this._pos];
        }
        return result;
    }
    peek() {
        return this._array[this._pos - 1];
    }
    peekAt(index) {
        return index < 0 || index >= this._pos ? undefined : this._array[this._pos - index - 1];
    }
    toList() {
        const result = new List();
        return new List(this.values);
    }
    clear() {
        this._pos = 0;
        this._array.length = this.DEFAULT_SIZE;
        return this;
    }
    clone() {
        const arr = deepCopy(this._array);
        let result = this.create(this.DEFAULT_SIZE);
        result._array = arr;
        result._limit = this._limit;
        result._pos = this._pos;
        return result;
    }
    limitObjects() {
        while (this._pos > this._limit) {
            this._array.shift();
            --this._pos;
        }
    }
    toJSON() {
        return slice(this.values, 0, this._pos);
    }
    serialize() {
        return slice(this.values, 0, this._pos).map((el) => isFunction(el.serialize) ? el.serialize() : el);
    }
    deserialize(array, ...types) {
        deserialize.apply(this, [array, this._array].concat(types));
        this._pos = array.length;
        return this;
    }
}
//# sourceMappingURL=Stack.js.map