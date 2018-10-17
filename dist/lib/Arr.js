import { clone, setProperties } from "./Obj";
import { isArray, isNullOrUndefined, isNumber, isUndefined, isNotUndefined, isNotNullOrUndefined, Env } from "./Test";
var ArrayState = (function () {
    function ArrayState() {
    }
    return ArrayState;
}());
export function flatten(src) {
    return flattenInner(src);
}
function flattenInner(src, result) {
    if (result === void 0) { result = []; }
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        if (isArray(src[i])) {
            flattenInner(src[i], result);
        }
        else {
            result.push(src[i]);
        }
    }
    return result;
}
export function reverse(array) {
    var left = null;
    var right = null;
    var length = isNullOrUndefined(array) ? 0 : array.length;
    for (left = 0; left < length / 2; left += 1) {
        right = length - 1 - left;
        var temporary = array[left];
        array[left] = array[right];
        array[right] = temporary;
    }
    return array;
}
export function concat() {
    var arrs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrs[_i] = arguments[_i];
    }
    var result = Array.prototype.concat.apply([], arrs);
    return result;
}
export function slice(src, from, count) {
    if (from === void 0) { from = 0; }
    if (count === void 0) { count = Infinity; }
    var result;
    if (isNotNullOrUndefined(src)) {
        var len = Math.min(src.length - from, count);
        if (Env.hasFastNativeArrays()) {
            result = src.slice(from, from + count);
        }
        else {
            var len_1 = Math.min(src.length - from, count);
            if (len_1 <= 0) {
                len_1 = 0;
            }
            result = new Array(len_1);
            var i = -1;
            while (++i < len_1) {
                result[i] = src[i + from];
            }
        }
    }
    else {
        result = [];
    }
    return result;
}
export function splice(src, pos, remove, insert) {
    if (pos === void 0) { pos = 0; }
    if (remove === void 0) { remove = Infinity; }
    if (insert === void 0) { insert = []; }
    if (isNullOrUndefined(src)) {
        throw new Error("Unable to splice on null or undefined");
    }
    var srcLen = src.length;
    pos = Math.max(0, pos);
    pos = Math.min(pos, srcLen);
    remove = Math.max(0, remove);
    remove = Math.min(remove, srcLen - pos);
    if (Env.hasFastNativeArrays() && (insert.length !== remove || pos + insert.length >= src.length)) {
        src.splice.bind(src, pos, remove).apply(src, insert);
    }
    else {
        var insertLen = insert.length;
        var newLen = srcLen - remove + insertLen;
        var delta = remove - insertLen;
        if (delta < 0) {
            src.length = newLen;
            var i_1 = newLen;
            while (--i_1 >= pos + remove) {
                src[i_1] = src[i_1 + delta];
            }
        }
        var i = pos - 1;
        while (++i < pos + insertLen) {
            src[i] = insert[i - pos];
        }
        if (delta > 0) {
            --i;
            while (++i < srcLen - delta) {
                src[i] = src[i + delta];
            }
            src.length = newLen;
        }
    }
}
export function append(arr, values) {
    var index = -1;
    var offset = arr.length;
    var length = isNullOrUndefined(values) ? 0 : values.length;
    while (++index < length) {
        arr[offset + index] = values[index];
    }
}
export function removeAt(arr, index) {
    var result;
    if (isNotNullOrUndefined(arr) && index >= 0) {
        if (Env.hasFastNativeArrays()) {
            result = arr.splice(index, 1)[0];
        }
        else {
            var len = arr.length;
            index = Math.max(0, index);
            index = Math.min(index, len);
            var i = index;
            result = arr[i];
            while (++i < len) {
                arr[i - 1] = arr[i];
            }
            arr.length -= 1;
        }
    }
    return result;
}
export function indexOfElement(src, el) {
    var result = -1;
    if (isNotNullOrUndefined(src)) {
        if (Env.hasFastNativeArrays()) {
            result = src.indexOf(el);
        }
        else {
            var len = isNullOrUndefined(src) ? 0 : src.length;
            var i = -1;
            while (++i < len) {
                if (src[i] === el) {
                    result = i;
                    break;
                }
            }
        }
    }
    return result;
}
export function remove(arr, el) {
    var start = indexOfElement(arr, el);
    removeAt(arr, start);
}
export function indexOf(src, fn) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        if (fn(src[i])) {
            return i;
        }
    }
    return -1;
}
export function find(src, fn) {
    var i = indexOf(src, fn);
    var result;
    if (i !== -1) {
        result = src[i];
    }
    return result;
}
export function removeOneByFn(arr, fn) {
    var start = indexOf(arr, fn);
    removeAt(arr, start);
}
export function shallowCopy(src) {
    var i = -1;
    var result;
    if (isNotNullOrUndefined(src)) {
        if (Env.hasFastNativeArrays()) {
            result = src.slice();
        }
        else {
            var len = src.length;
            result = new Array(len);
            while (++i < len) {
                result[i] = src[i];
            }
        }
    }
    else {
        result = [];
    }
    return result;
}
export function shallowCopyInto(src, target) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = src[i];
    }
}
export function shallowFill(src, target, at) {
    if (at === void 0) { at = 0; }
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = src[i];
    }
}
export function deepCopy(src) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    var result = new Array(len);
    while (++i < len) {
        result[i] = (clone(src[i]));
    }
    return result;
}
export function deepCopyInto(src, target) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = (clone(src[i]));
    }
}
export function deepFill(src, target, at) {
    if (at === void 0) { at = 0; }
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = (clone(src[i]));
    }
}
export function filter(src, fn) {
    var result;
    result = [];
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        var el = src[i];
        if (fn(el, i) === true) {
            result.push(el);
        }
    }
    return result;
}
export function filterInto(src, target, fn) {
    var i = -1;
    var j = 0;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    var space = target.length;
    while (++i < len) {
        var el = src[i];
        if (fn(el, i) === true) {
            if (j < space) {
                target[j++] = el;
            }
            else {
                ++j;
                target.push(el);
            }
        }
    }
    target.length = j;
}
export function map(src, fn) {
    var result;
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    result = new Array(len);
    while (++i < len) {
        result[i] = fn(src[i], i);
    }
    return result;
}
export function mapInto(src, target, fn) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = fn(src[i], i);
    }
}
export function reduce(src, fn, start, from, to) {
    var acc = start;
    if (isNotNullOrUndefined(src)) {
        from = Math.min(Math.max(0, isUndefined(from) ? 0 : from), src.length - 1);
        to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to), src.length - 1);
        var i = from - 1;
        while (++i < to + 1) {
            acc = fn(acc, src[i]);
        }
    }
    return acc;
}
export function reduceUntil(src, fn, test, start, from, to) {
    var acc = start;
    if (isNotNullOrUndefined(src)) {
        from = Math.min(Math.max(0, isUndefined(from) ? 0 : from), src.length - 1);
        to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to), src.length - 1);
        var i = from - 1;
        while (++i < to + 1 && !test(acc, src[i])) {
            acc = fn(acc, src[i]);
        }
    }
    return acc;
}
export function reverseReduce(src, fn, start) {
    var i = isNullOrUndefined(src) ? 0 : src.length;
    var acc = start;
    while (--i >= 0) {
        acc = fn(acc, src[i]);
    }
    return acc;
}
export function reverseReduceUntil(src, fn, test, start) {
    var i = isNullOrUndefined(src) ? 0 : src.length;
    var acc = start;
    while (--i >= 0 && !test(acc, src[i])) {
        acc = fn(acc, src[i]);
    }
    return acc;
}
export function forEach(src, fn, startIndex) {
    if (startIndex === void 0) { startIndex = 0; }
    var i = startIndex - 1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        fn(src[i], i);
    }
}
export function forSome(src, filter, fn) {
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        var el = src[i];
        if (filter(el, i)) {
            fn(el, i);
        }
    }
}
export function until(src, fnOrTest, fn, startIndex) {
    var isCombined = isUndefined(fn) || isNumber(fn);
    startIndex = isCombined ? fn : startIndex;
    var i = isUndefined(startIndex) || startIndex < 0 ? -1 : startIndex - 1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len && (isCombined ?
        !fnOrTest(src[i], i) :
        !(fnOrTest(src[i], i) || (fn(src[i], i), false)))) {
    }
}
export function reverseForEach(src, fn) {
    var i = isNullOrUndefined(src) ? 0 : src.length;
    while (--i >= 0) {
        fn(src[i], i);
    }
}
export function reverseUntil(src, fnOrTest, fn) {
    var i = isNullOrUndefined(src) ? 0 : src.length;
    var combined = isUndefined(fn);
    while (--i >= 0 && (combined ? !fnOrTest(src[i], i) : !(fnOrTest(src[i], i) || (fn(src[i], i), false)))) {
    }
}
export function some(src, fn) {
    var result = false;
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len && !(result = fn(src[i]))) {
    }
    return result;
}
export function all(src, fn) {
    var result = true;
    var i = -1;
    var len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len && (result = fn(src[i]))) {
    }
    return result;
}
export function insertAt(src, pos, v) {
    if (isNullOrUndefined(src)) {
        throw new Error("Unable to insertAt on null or undefined");
    }
    if (pos === 0) {
        src.unshift(v);
    }
    else if (pos > 0) {
        var i = src.length;
        while (--i >= pos) {
            src[i + 1] = src[i];
        }
        src[i + 1] = v;
    }
}
export function binarySearch(src, cmp, closest) {
    if (closest === void 0) { closest = false; }
    var lo = 0, hi = isNullOrUndefined(src) ? -1 : src.length - 1, mid, element;
    while (lo <= hi) {
        mid = ((lo + hi) >> 1);
        element = src[mid];
        var val = cmp(element);
        if (val < 0) {
            lo = mid + 1;
        }
        else if (val > 0) {
            hi = mid - 1;
        }
        else {
            return mid;
        }
    }
    return closest ? lo : -1;
}
export function create(length, populator) {
    if ((length || -1) < 0) {
        length = 0;
    }
    var arr = new Array(length);
    var i = -1;
    while (++i < length) {
        arr[i] = populator(i, arr);
    }
    return arr;
}
export function zip(a, b, fn) {
    if (fn === void 0) { fn = function (a, b) { return [a, b]; }; }
    var i = -1;
    var max = Math.max(a.length, b.length);
    var u;
    var result = [];
    while (++i < max && (u = fn(a[i], b[i], i)) !== undefined) {
        result.push(u);
    }
    return result;
}
export function unzip(arr, fn) {
    if (fn === void 0) { fn = function (u, i, out) { return (out[0] = u[0], out[1] = u[1], out); }; }
    var i = -1;
    var len = arr.length;
    var split = [undefined, undefined];
    var result = [
        new Array(),
        new Array()
    ];
    while (++i < len && (split = fn(arr[i], i, split))) {
        result[0].push(split[0]);
        result[1].push(split[1]);
    }
    return result;
}
export function deserialize(array, target) {
    var types = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        types[_i - 2] = arguments[_i];
    }
    var T;
    var passthroughT;
    T = types.shift();
    passthroughT = types;
    if (isNotUndefined(T)) {
        if (isNotUndefined(T.prototype.deserialize)) {
            mapInto(array, target, function (el) {
                var t = new T();
                return t.deserialize.apply(t, [el].concat(passthroughT));
            });
        }
        else {
            mapInto(array, target, function (el, i) {
                var newT = new T();
                setProperties(newT, el);
                return newT;
            });
        }
    }
    else {
        deepCopyInto(array, target);
    }
}
//# sourceMappingURL=Arr.js.map