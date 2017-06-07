import { Arr } from "./Arr";
import { Test } from "./Test";
export class Obj {
    constructor() {
    }
    static destroy(obj) {
        if (obj.Destroy !== undefined) {
            obj.Destroy();
        }
        else {
            this.null(obj);
        }
    }
    static wipe(obj) {
        const keys = Object.keys(obj);
        let i = -1;
        const len = keys.length;
        while (++i < len) {
            delete obj[keys[i]];
        }
    }
    static null(obj) {
        if (obj.constructor.prototype.Clear !== undefined) {
            obj.Clear();
        }
        else {
            const keys = Object.keys(obj);
            let key = null;
            let i = -1;
            const len = keys.length;
            while (++i < len) {
                key = keys[i];
                obj[key] = null;
            }
        }
    }
    static isNullOrUndefined(...args) {
        const len = args.length;
        let i = -1;
        let a;
        let result = false;
        while (!result && ++i < len) {
            a = args[i];
            result = a === undefined || a === null;
        }
        return result;
    }
    static isNotNullOrUndefined(...args) {
        return !this.isNullOrUndefined(...args);
    }
    static isClassOf(a, b) {
        return this.isNotNullOrUndefined(a, b) && a instanceof b.constructor;
    }
    static isSameClass(a, b) {
        return this.isNotNullOrUndefined(a, b) && a.constructor === b.constructor;
    }
    static inherits(a, b) {
        return this.isClassOf(a, b) && !this.isSameClass(a, b);
    }
    static equals(a, b) {
        let result = a === b;
        if (a !== b && (a instanceof Object) && this.isSameClass(a, b)) {
            if (Test.isArray(a)) {
                const len = a.length;
                let i = 0;
                result = len === b.length;
                if (result) {
                    for (; i < len; i += 1) {
                        result = this.equals(a[i], b[i]);
                        if (result === false) {
                            break;
                        }
                    }
                }
            }
            else if (a.constructor.prototype.Equals) {
                result = a.Equals(b);
            }
            else {
                const keys = Object.keys(a);
                let key = null;
                result = true;
                let i = -1;
                const len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    result = this.equals(a[key], b[key]);
                    if (!result) {
                        if (Test.isFunction(a[key])) {
                            result = true;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
    static isDifferent(a, b) {
        return !this.equals(a, b);
    }
    static shallowCopy(obj) {
        const keys = Object.keys(obj);
        const result = {};
        let i = -1;
        const len = keys.length;
        while (++i < len) {
            const key = keys[i];
            result[key] = obj[key];
        }
        return result;
    }
    static clone(obj) {
        let result;
        if (!(obj instanceof Object)) {
            result = obj;
        }
        else if (obj.constructor.prototype.clone !== undefined) {
            result = obj.clone();
        }
        else if (Test.isArray(obj)) {
            result = Arr.deepCopy(obj);
        }
        else if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        else if (obj instanceof RegExp) {
            return new RegExp(obj);
        }
        else {
            result = new obj.constructor();
            const keys = Object.keys(obj);
            let key = null;
            let i = -1;
            const len = keys.length;
            while (++i < len) {
                key = keys[i];
                result[key] = this.clone(obj[key]);
            }
        }
        return result;
    }
    static cloneInto(src, target) {
        if (Test.isArray(target)) {
            const arrS = src;
            const arrT = target;
            const len = arrS.length;
            arrT.length = len;
            let i = -1;
            while (++i < len) {
                if (arrS[i] instanceof Object) {
                    this.cloneInto(arrS[i], arrT[i]);
                }
                else {
                    arrT[i] = arrS[i];
                }
            }
        }
        else {
            const keys = Object.keys(src);
            let key = null;
            let i = -1;
            const len = keys.length;
            while (++i < len) {
                key = keys[i];
                const a = src[key];
                if (a instanceof Object) {
                    let b = target[key];
                    if (b === undefined || b === null) {
                        if (Test.isArray(a)) {
                            b = target[key] = [];
                        }
                        else {
                            b = target[key] = {};
                        }
                    }
                    if (this.isDifferent(a, b)) {
                        this.cloneInto(a, b);
                    }
                }
                else {
                    target[key] = a;
                }
            }
        }
        return target;
    }
    static mixin(target = {}, exclude, ...sources) {
        const result = target, len = sources ? sources.length : 0;
        let i = 0;
        sources = Arr.flatten(sources);
        for (; i < len; i++) {
            let src = sources[i];
            if (Test.isFunction(src)) {
                src = src.prototype;
            }
            if (src === undefined) {
                continue;
            }
            const keys = Object.keys(src);
            let key = null;
            if (exclude) {
                let i = -1;
                const len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    if (exclude.hasOwnProperty(key)) {
                        continue;
                    }
                    target[key] = src[key];
                }
            }
            else {
                let i = -1;
                const len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    target[key] = src[key];
                }
            }
        }
        return result;
    }
    static setProperties(target, values) {
        const keys = Object.keys(values);
        let key;
        let i = -1;
        const len = keys.length;
        while (++i < len) {
            key = keys[i];
            if (key in target) {
                target[key] = values[key];
            }
        }
    }
}
//# sourceMappingURL=Obj.js.map