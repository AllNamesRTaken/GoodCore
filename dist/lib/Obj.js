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
    var keys = Object.keys(obj);
    var i = -1;
    var len = keys.length;
    while (++i < len) {
        delete obj[keys[i]];
    }
}
export function setNull(obj) {
    if (obj.constructor.prototype.clear !== undefined) {
        obj.clear();
    }
    else {
        var keys = Object.keys(obj);
        var key = null;
        var i = -1;
        var len = keys.length;
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
    var result = a === b;
    if (a !== b && (a instanceof Object) && isSameClass(a, b)) {
        if (isArray(a)) {
            var len = a.length;
            var i = 0;
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
            var keys = Object.keys(a);
            var key = null;
            result = true;
            var i = -1;
            var len = keys.length;
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
    var keys = Object.keys(obj);
    var result = {};
    var i = -1;
    var len = keys.length;
    while (++i < len) {
        var key = keys[i];
        result[key] = obj[key];
    }
    return result;
}
export function clone(obj) {
    var result;
    if (!(obj instanceof Object)) {
        result = obj;
    }
    else if (obj.constructor.prototype.clone !== undefined) {
        result = obj.clone();
    }
    else if (isArray(obj)) {
        var i = -1;
        var len = obj.length;
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
        var keys = Object.keys(obj);
        var key = null;
        var i = -1;
        var len = keys.length;
        while (++i < len) {
            key = keys[i];
            result[key] = clone(obj[key]);
        }
    }
    return result;
}
export function cloneInto(src, target) {
    if (isArray(target)) {
        var arrS = src;
        var arrT = target;
        var len = arrS.length;
        arrT.length = len;
        var i = -1;
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
        var keys = Object.keys(src);
        var key = null;
        var i = -1;
        var len = keys.length;
        while (++i < len) {
            key = keys[i];
            var a = src[key];
            if (a instanceof Object) {
                var b = target[key];
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
export function mixin(target, exclude) {
    if (target === void 0) { target = {}; }
    var sources = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        sources[_i - 2] = arguments[_i];
    }
    var result = target, len = sources ? sources.length : 0;
    var i = 0;
    for (; i < len; i++) {
        var src = sources[i];
        if (isFunction(src)) {
            src = src.prototype;
        }
        if (src === undefined) {
            continue;
        }
        var keys = Object.keys(src);
        var key = null;
        if (exclude) {
            var i_1 = -1;
            var len_1 = keys.length;
            while (++i_1 < len_1) {
                key = keys[i_1];
                if (exclude.hasOwnProperty(key)) {
                    continue;
                }
                target[key] = src[key];
            }
        }
        else {
            var i_2 = -1;
            var len_2 = keys.length;
            while (++i_2 < len_2) {
                key = keys[i_2];
                target[key] = src[key];
            }
        }
    }
    return result;
}
export function setProperties(target, values, mapping) {
    var keys = Object.keys(values);
    var key;
    var i = -1;
    var len = keys.length;
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
        var i = -1;
        var len = target.length;
        while (++i < len && false !== fn(target[i], i)) {
        }
    }
    else {
        var keys = Object.keys(target);
        var key = void 0;
        var i = -1;
        var len = keys.length;
        var run_1 = true;
        while (run_1 && ++i < len) {
            key = keys[i];
            run_1 = false !== fn(target[key], key);
        }
    }
}
export function transform(target, fn, accumulator) {
    if (accumulator === undefined) {
        accumulator = Object.create(target);
    }
    forEach(target, function (value, key) {
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