import { Arr } from "../Arr";
import { List } from "./List";
export class Stack {
    constructor(size) {
        this.DEFAULT_SIZE = 100;
        this._pos = 0;
        if (!size) {
            size = this.DEFAULT_SIZE;
        }
        this._array = new Array(size);
    }
    get values() {
        return Arr.slice(this._array, 0, this._pos);
    }
    get depth() {
        return this._pos;
    }
    push(obj) {
        this._array[this._pos] = obj;
        this._pos++;
    }
    pop() {
        let result = null;
        if (this._pos !== 0) {
            result = this._array[--this._pos];
        }
        return result;
    }
    toList() {
        const result = new List();
        return new List(this.values);
    }
}
//# sourceMappingURL=Stack.js.map