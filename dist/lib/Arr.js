import { Obj } from "./Obj";
import { Test } from "./Test";
class ArrayState {
}
export class Arr {
    constructor() {
    }
    static flatten(src) {
        return Arr.flattenInner(src);
    }
    static flattenInner(src, result = []) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            if (Test.isArray(src[i])) {
                Arr.flattenInner(src[i], result);
            }
            else {
                result.push(src[i]);
            }
        }
        return result;
    }
    static reverse(array) {
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
    static concat(...arrs) {
        const result = Array.prototype.concat.apply([], arrs);
        return result;
    }
    static slice(src, from = 0, count = Infinity) {
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
    static append(arr, values) {
        let index = -1;
        const length = values.length, offset = arr.length;
        arr.length = length + offset;
        while (++index < length) {
            arr[offset + index] = values[index];
        }
    }
    static removeAt(arr, index) {
        if (index !== -1 && index < arr.length) {
            const len = arr.length;
            let i = index;
            while (++i < len) {
                arr[i - 1] = arr[i];
            }
            arr.length -= 1;
        }
    }
    static indexOfElement(src, el) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            if (src[i] === el) {
                return i;
            }
        }
        return -1;
    }
    static remove(arr, el) {
        const start = Arr.indexOfElement(arr, el);
        Arr.removeAt(arr, start);
    }
    static indexOf(src, fn) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            if (fn(src[i])) {
                return i;
            }
        }
        return -1;
    }
    static removeOneByFn(arr, fn) {
        const start = Arr.indexOf(arr, fn);
        Arr.removeAt(arr, start);
    }
    static shallowCopy(src) {
        let i = -1;
        const len = src.length;
        const result = new Array(len);
        while (++i < len) {
            result[i] = src[i];
        }
        return result;
    }
    static shallowCopyInto(src, target) {
        let i = -1;
        const len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = src[i];
        }
    }
    static shallowFill(src, target, at = 0) {
        let i = -1;
        const len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = src[i];
        }
    }
    static deepCopy(src) {
        let i = -1;
        const len = src.length;
        const result = new Array(len);
        while (++i < len) {
            result[i] = (Obj.clone(src[i]));
        }
        return result;
    }
    static deepCopyInto(src, target) {
        let i = -1;
        const len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = (Obj.clone(src[i]));
        }
    }
    static deepFill(src, target, at = 0) {
        let i = -1;
        const len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = (Obj.clone(src[i]));
        }
    }
    static filter(src, fn) {
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
    static filterInto(src, target, fn) {
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
    static map(src, fn) {
        let i = -1;
        const len = src.length;
        const result = new Array(len);
        while (++i < len) {
            result[i] = fn(src[i], i);
        }
        return result;
    }
    static mapInto(src, target, fn) {
        let i = -1;
        const len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = fn(src[i], i);
        }
    }
    static reduce(src, fn, start = 0) {
        let i = -1;
        const len = src.length;
        let acc = start;
        while (++i < len) {
            acc = fn(acc, src[i]);
        }
        return acc;
    }
    static forEach(src, fn) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            fn(src[i], i);
        }
    }
    static until(src, test, fn) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            if (test(src[i], i)) {
                return;
            }
            fn(src[i], i);
        }
    }
    static reverseForEach(src, fn) {
        let i = src.length;
        while (--i >= 0) {
            fn(src[i], i);
        }
    }
    static reverseUntil(src, test, fn) {
        let i = src.length;
        while (--i >= 0) {
            if (test(src[i], i)) {
                return;
            }
            fn(src[i], i);
        }
    }
    static some(src, filter, fn) {
        let i = -1;
        const len = src.length;
        while (++i < len) {
            const el = src[i];
            if (filter(el, i)) {
                fn(el, i);
            }
        }
    }
    static insertAt(src, pos, v) {
        if (pos > 0) {
            let i = src.length;
            while (--i >= pos) {
                src[i + 1] = src[i];
            }
            src[i + 1] = v;
        }
    }
    static binarySearch(src, cmp) {
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
}
//# sourceMappingURL=Arr.js.map