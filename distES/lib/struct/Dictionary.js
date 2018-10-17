import { forEach } from "../Arr";
import { clone, setProperties, wipe } from "../Obj";
import { isFunction, isNotUndefined, isNotNullOrUndefined } from "../Test";
export class Dictionary {
    constructor() {
        this._lookup = Object.create(null);
        this._list = new Array();
        this._isDirty = false;
    }
    create() {
        return new (this.constructor)();
    }
    has(key) {
        return this._lookup[key] !== undefined;
    }
    contains(key) {
        return this.has(key);
    }
    get(key) {
        return this._lookup[key];
    }
    set(key, value) {
        this._isDirty = this._isDirty || this.has(key);
        if (value !== undefined) {
            this._lookup[key] = value;
            if (!this._isDirty) {
                this._list.push(value);
            }
        }
        return this;
    }
    delete(key) {
        if (this.has(key)) {
            delete this._lookup[key];
            this._isDirty = true;
        }
        return this;
    }
    clear() {
        wipe(this._lookup);
        this._list.length = 0;
        return this;
    }
    get values() {
        this.cleanList();
        return this._list;
    }
    get keys() {
        return Object.keys(this._lookup);
    }
    get count() {
        let result = 0;
        if (this._isDirty) {
            result = this.keys.length;
        }
        else {
            result = this._list.length;
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
        list.length = 0;
        while (++i < keys.length) {
            list.push(lookup[keys[i]]);
        }
        this._isDirty = false;
    }
    clone() {
        let result = this.create();
        result._isDirty = true;
        result._lookup = clone(this._lookup);
        result.reCreateList();
        return result;
    }
    toJSON() {
        return this._lookup;
    }
    serialize() {
        let obj = Object.create(null);
        forEach(this.keys, (key) => {
            let v = this.get(key);
            obj[key] = isNotNullOrUndefined(v) && isFunction(v.serialize) ? v.serialize() : v;
        });
        return obj;
    }
    deserialize(obj, ...types) {
        let T;
        let passthroughT;
        T = types.shift();
        passthroughT = types;
        this.clear();
        if (isNotUndefined(T)) {
            if (isNotUndefined(T.prototype.deserialize)) {
                for (let key of Object.keys(obj)) {
                    let t = (new T());
                    this.set(key, t.deserialize.apply(t, [obj[key]].concat(passthroughT)));
                }
            }
            else {
                for (let key of Object.keys(obj)) {
                    let newT = new T();
                    setProperties(newT, obj[key]);
                    this.set(key, newT);
                }
            }
        }
        else {
            for (let key of Object.keys(obj)) {
                this.set(key, obj[key]);
            }
        }
        this.reCreateList();
        return this;
    }
}
//# sourceMappingURL=Dictionary.js.map