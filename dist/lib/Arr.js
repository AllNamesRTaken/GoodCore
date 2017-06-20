import { clone } from "./Obj";
import { isArray } from "./Test";
class ArrayState {
}
export function flatten(src) {
    return flattenInner(src);
}
function flattenInner(src, result = []) {
    let i = -1;
    const len = src.length;
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
    const length = array.length;
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
    let len = Math.min(src.length - from, count);
    if (len < 0) {
        len = 0;
    }
    let i = -1;
    const result = new Array(len);
    while (++i < len) {
        result[i] = src[i + from];
    }
    return result;
}
export function append(arr, values) {
    let index = -1;
    const offset = arr.length;
    const length = values.length;
    while (++index < length) {
        arr[offset + index] = values[index];
    }
}
export function removeAt(arr, index) {
    if (index !== -1 && index < arr.length) {
        const len = arr.length;
        let i = index;
        while (++i < len) {
            arr[i - 1] = arr[i];
        }
        arr.length -= 1;
    }
}
export function indexOfElement(src, el) {
    let i = -1;
    const len = src.length;
    while (++i < len) {
        if (src[i] === el) {
            return i;
        }
    }
    return -1;
}
export function remove(arr, el) {
    const start = indexOfElement(arr, el);
    removeAt(arr, start);
}
export function indexOf(src, fn) {
    let i = -1;
    const len = src.length;
    while (++i < len) {
        if (fn(src[i])) {
            return i;
        }
    }
    return -1;
}
export function removeOneByFn(arr, fn) {
    const start = indexOf(arr, fn);
    removeAt(arr, start);
}
export function shallowCopy(src) {
    let i = -1;
    const len = src.length;
    const result = new Array(len);
    while (++i < len) {
        result[i] = src[i];
    }
    return result;
}
export function shallowCopyInto(src, target) {
    let i = -1;
    const len = src.length;
    target.length = len;
    while (++i < len) {
        target[i] = src[i];
    }
}
export function shallowFill(src, target, at = 0) {
    let i = -1;
    const len = src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = src[i];
    }
}
export function deepCopy(src) {
    let i = -1;
    const len = src.length;
    const result = new Array(len);
    while (++i < len) {
        result[i] = (clone(src[i]));
    }
    return result;
}
export function deepCopyInto(src, target) {
    let i = -1;
    const len = src.length;
    target.length = len;
    while (++i < len) {
        target[i] = (clone(src[i]));
    }
}
export function deepFill(src, target, at = 0) {
    let i = -1;
    const len = src.length;
    if (target.length < len + at) {
        target.length = len + at;
    }
    while (++i < len) {
        target[at + i] = (clone(src[i]));
    }
}
export function filter(src, fn) {
    const result = [];
    let i = -1;
    const len = src.length;
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
    const len = src.length;
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
    let i = -1;
    const len = src.length;
    const result = new Array(len);
    while (++i < len) {
        result[i] = fn(src[i], i);
    }
    return result;
}
export function mapInto(src, target, fn) {
    let i = -1;
    const len = src.length;
    target.length = len;
    while (++i < len) {
        target[i] = fn(src[i], i);
    }
}
export function reduce(src, fn, start = 0) {
    let i = -1;
    const len = src.length;
    let acc = start;
    while (++i < len) {
        acc = fn(acc, src[i]);
    }
    return acc;
}
export function forEach(src, fn) {
    let i = -1;
    const len = src.length;
    while (++i < len) {
        fn(src[i], i);
    }
}
export function until(src, test, fn) {
    let i = -1;
    const len = src.length;
    while (++i < len) {
        if (test(src[i], i)) {
            return;
        }
        fn(src[i], i);
    }
}
export function reverseForEach(src, fn) {
    let i = src.length;
    while (--i >= 0) {
        fn(src[i], i);
    }
}
export function reverseUntil(src, test, fn) {
    let i = src.length;
    while (--i >= 0) {
        if (test(src[i], i)) {
            return;
        }
        fn(src[i], i);
    }
}
export function some(src, filter, fn) {
    let i = -1;
    const len = src.length;
    while (++i < len) {
        const el = src[i];
        if (filter(el, i)) {
            fn(el, i);
        }
    }
}
export function insertAt(src, pos, v) {
    if (pos > 0) {
        let i = src.length;
        while (--i >= pos) {
            src[i + 1] = src[i];
        }
        src[i + 1] = v;
    }
}
export function binarySearch(src, cmp) {
    let lo = 0, hi = src.length - 1, mid, element;
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
    return -1;
}
//# sourceMappingURL=Arr.js.map