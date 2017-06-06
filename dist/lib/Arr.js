import { Obj } from "./Obj";
import { Test } from "./Test";
var _Array = (function () {
    function _Array() {
    }
    _Array.prototype.flatten = function (src) {
        return this.flattenInner(src);
    };
    _Array.prototype.flattenInner = function (src, result) {
        if (result === void 0) { result = []; }
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (Test.isArray(src[i])) {
                this.flattenInner(src[i], result);
            }
            else {
                result.push(src[i]);
            }
        }
        return result;
    };
    _Array.prototype.reverse = function (array) {
        var left = null;
        var right = null;
        var length = array.length;
        for (left = 0; left < length / 2; left += 1) {
            right = length - 1 - left;
            var temporary = array[left];
            array[left] = array[right];
            array[right] = temporary;
        }
        return array;
    };
    _Array.prototype.concat = function () {
        var arrs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrs[_i] = arguments[_i];
        }
        var result = Array.prototype.concat.apply([], arrs);
        return result;
    };
    _Array.prototype.slice = function (src, from, count) {
        if (from === void 0) { from = 0; }
        if (count === void 0) { count = Infinity; }
        var len = Math.min(src.length - from, count);
        if (len < 0) {
            len = 0;
        }
        var i = -1;
        var result = new Array(len);
        while (++i < len) {
            result[i] = src[i + from];
        }
        return result;
    };
    _Array.prototype.append = function (arr, values) {
        var index = -1;
        var length = values.length, offset = arr.length;
        arr.length = length + offset;
        while (++index < length) {
            arr[offset + index] = values[index];
        }
    };
    _Array.prototype.removeAt = function (arr, index) {
        if (index !== -1 && index < arr.length) {
            var len = arr.length;
            var i = index;
            while (++i < len) {
                arr[i - 1] = arr[i];
            }
            arr.length -= 1;
        }
    };
    _Array.prototype.indexOfElement = function (src, el) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (src[i] === el) {
                return i;
            }
        }
        return -1;
    };
    _Array.prototype.remove = function (arr, el) {
        var start = this.indexOfElement(arr, el);
        this.removeAt(arr, start);
    };
    _Array.prototype.indexOf = function (src, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (fn(src[i])) {
                return i;
            }
        }
        return -1;
    };
    _Array.prototype.removeOneByFn = function (arr, fn) {
        var start = this.indexOf(arr, fn);
        this.removeAt(arr, start);
    };
    _Array.prototype.shallowCopy = function (src) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = src[i];
        }
        return result;
    };
    _Array.prototype.shallowCopyInto = function (src, target) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = src[i];
        }
    };
    _Array.prototype.shallowFill = function (src, target, at) {
        if (at === void 0) { at = 0; }
        var i = -1;
        var len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = src[i];
        }
    };
    _Array.prototype.deepCopy = function (src) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = (Obj.clone(src[i]));
        }
        return result;
    };
    _Array.prototype.deepCopyInto = function (src, target) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = (Obj.clone(src[i]));
        }
    };
    _Array.prototype.deepFill = function (src, target, at) {
        if (at === void 0) { at = 0; }
        var i = -1;
        var len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = (Obj.clone(src[i]));
        }
    };
    _Array.prototype.filter = function (src, fn) {
        var result = [];
        var i = -1;
        var len = src.length;
        while (++i < len) {
            var el = src[i];
            if (fn(el, i) === true) {
                result.push(el);
            }
        }
        return result;
    };
    _Array.prototype.filterInto = function (src, target, fn) {
        var i = -1;
        var j = 0;
        var len = src.length;
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
    };
    _Array.prototype.map = function (src, fn) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = fn(src[i], i);
        }
        return result;
    };
    _Array.prototype.mapInto = function (src, target, fn) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = fn(src[i], i);
        }
    };
    _Array.prototype.reduce = function (src, fn, start) {
        if (start === void 0) { start = 0; }
        var i = -1;
        var len = src.length;
        var acc = start;
        while (++i < len) {
            acc = fn(acc, src[i]);
        }
        return acc;
    };
    _Array.prototype.forEach = function (src, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            fn(src[i], i);
        }
    };
    _Array.prototype.until = function (src, test, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (test(src[i], i)) {
                return;
            }
            fn(src[i], i);
        }
    };
    _Array.prototype.reverseForEach = function (src, fn) {
        var i = src.length;
        while (--i >= 0) {
            fn(src[i], i);
        }
    };
    _Array.prototype.reverseUntil = function (src, test, fn) {
        var i = src.length;
        while (--i >= 0) {
            if (test(src[i], i)) {
                return;
            }
            fn(src[i], i);
        }
    };
    _Array.prototype.some = function (src, filter, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            var el = src[i];
            if (filter(el, i)) {
                fn(el, i);
            }
        }
    };
    _Array.prototype.insertAt = function (src, pos, v) {
        if (pos > 0) {
            var i = src.length;
            while (--i >= pos) {
                src[i + 1] = src[i];
            }
            src[i + 1] = v;
        }
    };
    _Array.prototype.binarySearch = function (src, cmp) {
        var lo = 0, hi = src.length - 1, mid, element;
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
        return -1;
    };
    return _Array;
}());
export { _Array };
export var Arr = new _Array();
//# sourceMappingURL=Arr.js.map