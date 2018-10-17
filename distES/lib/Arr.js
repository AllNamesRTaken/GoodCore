import { clone, setProperties } from "./Obj";
import { isArray, isNullOrUndefined, isNumber, isUndefined, isNotUndefined, isNotNullOrUndefined, Env } from "./Test";
class ArrayState {
}
export function flatten(src) {
    return flattenInner(src);
}
function flattenInner(src, result = []) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
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
    let left = null;
    let right = null;
    const length = isNullOrUndefined(array) ? 0 : array.length;
    for (left = 0; left < length / 2; left += 1) {
        right = length - 1 - left;
        const temporary = array[left];
        array[left] = array[right];
        array[right] = temporary;
    }
    return array;
}
export function concat(...arrs) {
    const result = Array.prototype.concat.apply([], arrs);
    return result;
}
export function slice(src, from = 0, count = Infinity) {
    let result;
    if (isNotNullOrUndefined(src)) {
        let len = Math.min(src.length - from, count);
        if (Env.hasFastNativeArrays()) {
            result = src.slice(from, from + count);
        }
        else {
            let len = Math.min(src.length - from, count);
            if (len <= 0) {
                len = 0;
            }
            result = new Array(len);
            let i = -1;
            while (++i < len) {
                result[i] = src[i + from];
            }
        }
    }
    else {
        result = [];
    }
    return result;
}
export function splice(src, pos = 0, remove = Infinity, insert = []) {
    if (isNullOrUndefined(src)) {
        throw new Error("Unable to splice on null or undefined");
    }
    let srcLen = src.length;
    pos = Math.max(0, pos);
    pos = Math.min(pos, srcLen);
    remove = Math.max(0, remove);
    remove = Math.min(remove, srcLen - pos);
    if (Env.hasFastNativeArrays() && (insert.length !== remove || pos + insert.length >= src.length)) {
        src.splice.bind(src, pos, remove).apply(src, insert);
    }
    else {
        let insertLen = insert.length;
        let newLen = srcLen - remove + insertLen;
        let delta = remove - insertLen;
        if (delta < 0) {
            src.length = newLen;
            let i = newLen;
            while (--i >= pos + remove) {
                src[i] = src[i + delta];
            }
        }
        let i = pos - 1;
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
    let index = -1;
    const offset = arr.length;
    const length = isNullOrUndefined(values) ? 0 : values.length;
    while (++index < length) {
        arr[offset + index] = values[index];
    }
}
export function removeAt(arr, index) {
    let result;
    if (isNotNullOrUndefined(arr) && index >= 0) {
        if (Env.hasFastNativeArrays()) {
            result = arr.splice(index, 1)[0];
        }
        else {
            let len = arr.length;
            index = Math.max(0, index);
            index = Math.min(index, len);
            let i = index;
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
    let result = -1;
    if (isNotNullOrUndefined(src)) {
        if (Env.hasFastNativeArrays()) {
            result = src.indexOf(el);
        }
        else {
            const len = isNullOrUndefined(src) ? 0 : src.length;
            let i = -1;
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
    const start = indexOfElement(arr, el);
    removeAt(arr, start);
}
export function indexOf(src, fn) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        if (fn(src[i])) {
            return i;
        }
    }
    return -1;
}
export function find(src, fn) {
    let i = indexOf(src, fn);
    let result;
    if (i !== -1) {
        result = src[i];
    }
    return result;
}
export function removeOneByFn(arr, fn) {
    const start = indexOf(arr, fn);
    removeAt(arr, start);
}
export function shallowCopy(src) {
    let i = -1;
    let result;
    if (isNotNullOrUndefined(src)) {
        if (Env.hasFastNativeArrays()) {
            result = src.slice();
        }
        else {
            const len = src.length;
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
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = src[i];
    }
}
export function shallowFill(src, target, at = 0) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = src[i];
    }
}
export function deepCopy(src) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    const result = new Array(len);
    while (++i < len) {
        result[i] = (clone(src[i]));
    }
    return result;
}
export function deepCopyInto(src, target) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = (clone(src[i]));
    }
}
export function deepFill(src, target, at = 0) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = (clone(src[i]));
    }
}
export function filter(src, fn) {
    let result;
    result = [];
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        const el = src[i];
        if (fn(el, i) === true) {
            result.push(el);
        }
    }
    return result;
}
export function filterInto(src, target, fn) {
    let i = -1;
    let j = 0;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    const space = target.length;
    while (++i < len) {
        const el = src[i];
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
    let result;
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    result = new Array(len);
    while (++i < len) {
        result[i] = fn(src[i], i);
    }
    return result;
}
export function mapInto(src, target, fn) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    target.length = len;
    while (++i < len) {
        target[i] = fn(src[i], i);
    }
}
export function reduce(src, fn, start, from, to) {
    let acc = start;
    if (isNotNullOrUndefined(src)) {
        from = Math.min(Math.max(0, isUndefined(from) ? 0 : from), src.length - 1);
        to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to), src.length - 1);
        let i = from - 1;
        while (++i < to + 1) {
            acc = fn(acc, src[i]);
        }
    }
    return acc;
}
export function reduceUntil(src, fn, test, start, from, to) {
    let acc = start;
    if (isNotNullOrUndefined(src)) {
        from = Math.min(Math.max(0, isUndefined(from) ? 0 : from), src.length - 1);
        to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to), src.length - 1);
        let i = from - 1;
        while (++i < to + 1 && !test(acc, src[i])) {
            acc = fn(acc, src[i]);
        }
    }
    return acc;
}
export function reverseReduce(src, fn, start) {
    let i = isNullOrUndefined(src) ? 0 : src.length;
    let acc = start;
    while (--i >= 0) {
        acc = fn(acc, src[i]);
    }
    return acc;
}
export function reverseReduceUntil(src, fn, test, start) {
    let i = isNullOrUndefined(src) ? 0 : src.length;
    let acc = start;
    while (--i >= 0 && !test(acc, src[i])) {
        acc = fn(acc, src[i]);
    }
    return acc;
}
export function forEach(src, fn, startIndex = 0) {
    let i = startIndex - 1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        fn(src[i], i);
    }
}
export function forSome(src, filter, fn) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len) {
        const el = src[i];
        if (filter(el, i)) {
            fn(el, i);
        }
    }
}
export function until(src, fnOrTest, fn, startIndex) {
    let isCombined = isUndefined(fn) || isNumber(fn);
    startIndex = isCombined ? fn : startIndex;
    let i = isUndefined(startIndex) || startIndex < 0 ? -1 : startIndex - 1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len && (isCombined ?
        !fnOrTest(src[i], i) :
        !(fnOrTest(src[i], i) || (fn(src[i], i), false)))) {
    }
}
export function reverseForEach(src, fn) {
    let i = isNullOrUndefined(src) ? 0 : src.length;
    while (--i >= 0) {
        fn(src[i], i);
    }
}
export function reverseUntil(src, fnOrTest, fn) {
    let i = isNullOrUndefined(src) ? 0 : src.length;
    let combined = isUndefined(fn);
    while (--i >= 0 && (combined ? !fnOrTest(src[i], i) : !(fnOrTest(src[i], i) || (fn(src[i], i), false)))) {
    }
}
export function some(src, fn) {
    let result = false;
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    while (++i < len && !(result = fn(src[i]))) {
    }
    return result;
}
export function all(src, fn) {
    let result = true;
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
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
        let i = src.length;
        while (--i >= pos) {
            src[i + 1] = src[i];
        }
        src[i + 1] = v;
    }
}
export function binarySearch(src, cmp, closest = false) {
    let lo = 0, hi = isNullOrUndefined(src) ? -1 : src.length - 1, mid, element;
    while (lo <= hi) {
        mid = ((lo + hi) >> 1);
        element = src[mid];
        let val = cmp(element);
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
    let arr = new Array(length);
    let i = -1;
    while (++i < length) {
        arr[i] = populator(i, arr);
    }
    return arr;
}
export function zip(a, b, fn = (a, b) => [a, b]) {
    let i = -1;
    let max = Math.max(a.length, b.length);
    let u;
    let result = [];
    while (++i < max && (u = fn(a[i], b[i], i)) !== undefined) {
        result.push(u);
    }
    return result;
}
export function unzip(arr, fn = (u, i, out) => (out[0] = u[0], out[1] = u[1], out)) {
    let i = -1;
    let len = arr.length;
    let split = [undefined, undefined];
    let result = [
        new Array(),
        new Array()
    ];
    while (++i < len && (split = fn(arr[i], i, split))) {
        result[0].push(split[0]);
        result[1].push(split[1]);
    }
    return result;
}
export function deserialize(array, target, ...types) {
    let T;
    let passthroughT;
    T = types.shift();
    passthroughT = types;
    if (isNotUndefined(T)) {
        if (isNotUndefined(T.prototype.deserialize)) {
            mapInto(array, target, (el) => {
                let t = new T();
                return t.deserialize.apply(t, [el].concat(passthroughT));
            });
        }
        else {
            mapInto(array, target, (el, i) => {
                let newT = new T();
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