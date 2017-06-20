import { wipe } from "../Obj";
import { List } from "./List";
export class Dictionary {
    constructor() {
        this._lookup = {};
        this._list = new List();
        this._isDirty = false;
    }
    has(key) {
        return this._lookup.hasOwnProperty("" + key);
    }
    contains(key) {
        return this.has(key);
    }
    get(key) {
        return this._lookup["" + key];
    }
    set(key, value) {
        const k = "" + key;
        this._isDirty = this._isDirty || this.has(key);
        this._lookup[k] = value;
        if (!this._isDirty) {
            this._list.push(value);
        }
        return this;
    }
    delete(key) {
        const k = "" + key;
        if (this.has(k)) {
            delete this._lookup[k];
            this._isDirty = true;
        }
        return this;
    }
    clear() {
        wipe(this._lookup);
        this._list.clear();
        return this;
    }
    get values() {
        this.cleanList();
        return this._list.values;
    }
    get keys() {
        return Object.keys(this._lookup);
    }
    get list() {
        this.cleanList();
        return this._list;
    }
    get count() {
        let result = 0;
        if (this._isDirty) {
            result = this.keys.length;
        }
        else {
            result = this._list.count;
        }
        return result;
    }
    cleanList() {
        if (this._isDirty) {
            this.reCreateList();
        }
    }
    reCreateList() {
        let lookup = this._lookup;
        let keys = Object.keys(this._lookup);
        let i = -1;
        let list = this._list;
        list.clear();
        while (++i < keys.length) {
            list.add(lookup[keys[i]]);
        }
    }
}
//# sourceMappingURL=Dictionary.js.map