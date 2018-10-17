import { areNotNullOrUndefined, isArray, isFunction, isObject } from "./Test";
export function destroy(obj) {
    if (obj.constructor.prototype.destroy !== undefined) {
        obj.destroy();
    }
    else {
        setNull(obj);
    }
}
export function wipe(obj) {
    const keys = Object.keys(obj);
    let i = -1;
    const len = keys.length;
    while (++i < len) {
        delete obj[keys[i]];
    }
}
export function setNull(obj) {
    if (obj.constructor.prototype.clear !== undefined) {
        obj.clear();
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
export function isClassOf(a, b) {
    return areNotNullOrUndefined(a, b) && a instanceof b.constructor;
}
export function isSameClass(a, b) {
    return areNotNullOrUndefined(a, b) && a.constructor === b.constructor;
}
export function inherits(a, b) {
    return isClassOf(a, b) && !isSameClass(a, b);
}
export function equals(a, b) {
    let result = a === b;
    if (a !== b && (a instanceof Object) && isSameClass(a, b)) {
        if (isArray(a)) {
            const len = a.length;
            let i = 0;
            result = len === b.length;
            if (result) {
                for (; i < len; i += 1) {
                    result = equals(a[i], b[i]);
                    if (result === false) {
                        break;
                    }
                }
            }
        }
        else if (a.constructor.prototype.equals) {
            result = a.equals(b);
        }
        else {
            const keys = Object.keys(a);
            let key = null;
            result = true;
            let i = -1;
            const len = keys.length;
            while (++i < len) {
                key = keys[i];
                result = equals(a[key], b[key]);
                if (!result) {
                    if (isFunction(a[key])) {
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
export function isDifferent(a, b) {
    return !equals(a, b);
}
export function shallowCopy(obj) {
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
export function clone(obj) {
    let result;
    if (!(obj instanceof Object)) {
        result = obj;
    }
    else if (obj.constructor.prototype.clone !== undefined) {
        result = obj.clone();
    }
    else if (isArray(obj)) {
        let i = -1;
        const len = obj.length;
        result = new Array(len);
        while (++i < len) {
            result[i] = (clone(obj[i]));
        }
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
            result[key] = clone(obj[key]);
        }
    }
    return result;
}
export function cloneInto(src, target) {
    if (isArray(target)) {
        const arrS = src;
        const arrT = target;
        const len = arrS.length;
        arrT.length = len;
        let i = -1;
        while (++i < len) {
            if (arrS[i] instanceof Object) {
                cloneInto(arrS[i], arrT[i]);
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
                    if (isArray(a)) {
                        b = target[key] = [];
                    }
                    else {
                        b = target[key] = {};
                    }
                }
                if (isDifferent(a, b)) {
                    cloneInto(a, b);
                }
            }
            else {
                target[key] = a;
            }
        }
    }
    return target;
}
export function mixin(target = {}, exclude, ...sources) {
    const result = target, len = sources ? sources.length : 0;
    let i = 0;
    for (; i < len; i++) {
        let src = sources[i];
        if (isFunction(src)) {
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
export function setProperties(target, values, mapping) {
    const keys = Object.keys(values);
    let key;
    let i = -1;
    const len = keys.length;
    while (++i < len) {
        key = keys[i];
        if (mapping && key in mapping) {
            key = mapping[key];
        }
        if (key in target) {
            target[key] = values[keys[i]];
        }
    }
}
export function forEach(target, fn) {
    if (isArray(target)) {
        let i = -1;
        const len = target.length;
        while (++i < len && false !== fn(target[i], i)) {
        }
    }
    else {
        const keys = Object.keys(target);
        let key;
        let i = -1;
        const len = keys.length;
        let run = true;
        while (run && ++i < len) {
            key = keys[i];
            run = false !== fn(target[key], key);
        }
    }
}
export function transform(target, fn, accumulator) {
    if (accumulator === undefined) {
        accumulator = Object.create(target);
    }
    forEach(target, (value, key) => {
        return fn(accumulator, value, key);
    });
    return accumulator;
}
export function difference(target, base) {
    function changes(target, base) {
        return transform(target, function (result, value, key) {
            if (isDifferent(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(target, base);
}
//# sourceMappingURL=Obj.js.map