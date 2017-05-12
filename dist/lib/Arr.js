"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Obj_1 = require("./Obj");
var Util_1 = require("./Util");
var _Array = (function () {
    function _Array() {
    }
    _Array.prototype._ = function () {
        return new _Array();
    };
    _Array.prototype.Flatten = function (src) {
        return this.FlattenInner(src);
    };
    _Array.prototype.FlattenInner = function (src, result) {
        if (result === void 0) { result = []; }
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (Util_1.Util.IsArray(src[i])) {
                this.FlattenInner(src[i], result);
            }
            else {
                result.push(src[i]);
            }
        }
        return result;
    };
    _Array.prototype.Reverse = function (array) {
        var left = null;
        var right = null;
        var length = array.length;
        for (left = 0; left < length / 2; left += 1) {
            right = length - 1 - left;
            var temporary = array[left];
            array[left] = array[right];
            array[right] = temporary;
        }
    };
    _Array.prototype.Concat = function () {
        var arrs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrs[_i] = arguments[_i];
        }
        var result = Array.prototype.concat.apply([], arrs);
        return result;
    };
    _Array.prototype.Slice = function (src, from, count) {
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
    _Array.prototype.Append = function (arr, values) {
        var index = -1;
        var length = values.length, offset = arr.length;
        arr.length = length + offset;
        while (++index < length) {
            arr[offset + index] = values[index];
        }
    };
    _Array.prototype.RemoveOneAt = function (arr, index) {
        if (index !== -1 && index < arr.length) {
            var len = arr.length;
            var i = index;
            while (++i < len) {
                arr[i - 1] = arr[i];
            }
            arr.length -= 1;
        }
    };
    _Array.prototype.IndexOfElement = function (src, el) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (src[i] === el) {
                return i;
            }
        }
        return -1;
    };
    _Array.prototype.RemoveOneByElement = function (arr, el) {
        var start = this.IndexOfElement(arr, el);
        this.RemoveOneAt(arr, start);
    };
    _Array.prototype.IndexOf = function (src, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            if (fn(src[i])) {
                return i;
            }
        }
        return -1;
    };
    _Array.prototype.RemoveOneByFn = function (arr, fn) {
        var start = this.IndexOf(arr, fn);
        this.RemoveOneAt(arr, start);
    };
    _Array.prototype.ShallowCopy = function (src) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = src[i];
        }
        return result;
    };
    _Array.prototype.ShallowCopyInto = function (src, target) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = src[i];
        }
    };
    _Array.prototype.ShallowFill = function (src, target, at) {
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
    _Array.prototype.DeepCopy = function (src) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = (Obj_1.Obj.Clone(src[i]));
        }
        return result;
    };
    _Array.prototype.DeepCopyInto = function (src, target) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = (Obj_1.Obj.Clone(src[i]));
        }
    };
    _Array.prototype.DeepFill = function (src, target, at) {
        if (at === void 0) { at = 0; }
        var i = -1;
        var len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = (Obj_1.Obj.Clone(src[i]));
        }
    };
    _Array.prototype.Filter = function (src, fn) {
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
    _Array.prototype.FilterInto = function (src, target, fn) {
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
    _Array.prototype.Map = function (src, fn) {
        var i = -1;
        var len = src.length;
        var result = new Array(len);
        while (++i < len) {
            result[i] = fn(src[i], i);
        }
        return result;
    };
    _Array.prototype.MapInto = function (src, target, fn) {
        var i = -1;
        var len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = fn(src[i], i);
        }
    };
    _Array.prototype.Reduce = function (src, fn, start) {
        if (start === void 0) { start = 0; }
        var i = -1;
        var len = src.length;
        var acc = start;
        while (++i < len) {
            acc = fn(acc, src[i]);
        }
        return acc;
    };
    _Array.prototype.ForEach = function (src, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            fn(src[i], i);
        }
    };
    _Array.prototype.Until = function (src, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            var brk = fn(src[i], i);
            if (brk) {
                return;
            }
        }
    };
    _Array.prototype.Some = function (src, filter, fn) {
        var i = -1;
        var len = src.length;
        while (++i < len) {
            var el = src[i];
            if (filter(el, i)) {
                fn(el, i);
            }
        }
    };
    _Array.prototype.InsertAt = function (src, pos, v) {
        if (pos > 0) {
            var i = src.length;
            while (--i >= pos) {
                src[i + 1] = src[i];
            }
            src[i + 1] = v;
        }
    };
    return _Array;
}());
exports._Array = _Array;
exports.Arr = new _Array();
//# sourceMappingURL=Arr.js.map