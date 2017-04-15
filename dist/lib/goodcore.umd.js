(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.listComponent = f()
    }
})(function() {
        var define, module, exports;
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        var index = -1, length = values.length, offset = arr.length;
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

},{"./Obj":6,"./Util":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _Calc = (function () {
    function _Calc() {
    }
    _Calc.prototype._ = function () {
        return new _Calc();
    };
    _Calc.prototype.Sign = function (x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };
    _Calc.prototype.RotationDeg = function (rotation) {
        var rot = (rotation * _Calc.ROTATION_DEGREE_PRECISION) | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return _Calc.ROTATION_LOOKUP[rot];
    };
    _Calc.prototype.RotationRad = function (rotation) {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        return this.RotationDeg(rot / _Calc.ROTATION_DEGREE_PRECISION);
    };
    _Calc.prototype.ClosestRadianRotation = function (rotation) {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return rot * _Calc.RADIAN_FACTOR / _Calc.ROTATION_DEGREE_PRECISION;
    };
    return _Calc;
}());
_Calc.ROTATION_DEGREE_PRECISION = 1;
_Calc.RADIAN_FACTOR = (1 / 360) * (2 * Math.PI);
_Calc.DEGREE_FACTOR = (1 / (2 * Math.PI) * 360);
_Calc.DEG360 = 360 * _Calc.ROTATION_DEGREE_PRECISION;
_Calc.ROTATION_LOOKUP = (function () {
    var lookup = [];
    for (var i = 0; i < 360 * _Calc.ROTATION_DEGREE_PRECISION; i++) {
        lookup.push([Math.cos(i * _Calc.RADIAN_FACTOR), Math.sin(i * _Calc.RADIAN_FACTOR)]);
    }
    return lookup;
})();
exports.default = _Calc;
exports.Calc = new _Calc();

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sides;
(function (Sides) {
    Sides[Sides["Top"] = 0] = "Top";
    Sides[Sides["Bottom"] = 1] = "Bottom";
    Sides[Sides["Left"] = 2] = "Left";
    Sides[Sides["Right"] = 3] = "Right";
})(Sides = exports.Sides || (exports.Sides = {}));
var _Dom = (function () {
    function _Dom(win) {
        this.Sides = Sides;
        this.Init(win);
    }
    _Dom.prototype._ = function (win) {
        return new _Dom(win);
    };
    _Dom.prototype.Init = function (win) {
        if (win !== undefined) {
            this._window = win;
            this._document = this._window.document;
            this._el = this._document.createElement("div");
        }
    };
    _Dom.prototype.ToArray = function (a) {
        return Array.prototype.slice.call(a);
    };
    _Dom.prototype.Create = function (html, attr) {
        var result, keys, i, k, styles, styleKeys;
        this._el.innerHTML = html;
        result = this._el.children[0];
        this.SetAttr(result, attr);
        this.Clear(this._el);
        return result;
    };
    _Dom.prototype.OuterHTML = function (el) {
        this._el.appendChild(el);
        var result = this._el.innerHTML;
        this.Clear(this._el);
        return result;
    };
    _Dom.prototype.SetAttr = function (_el, attr) {
        var el;
        if (typeof (_el) === "string") {
            el = this.Get(_el);
        }
        else {
            el = _el;
        }
        var keys, i, k, styles, styleKeys, style;
        if (attr !== undefined && typeof (attr) === "object") {
            keys = Object.keys(attr);
            for (i = 0; i < keys.length; i++) {
                if (keys[i] === "style") {
                    styles = attr[keys[i]];
                    styleKeys = Object.keys(styles);
                    for (k = 0; k < styleKeys.length; k++) {
                        style = styles[styleKeys[k]];
                        if (typeof (style) === "string") {
                            el.style.setProperty(styleKeys[k], style);
                        }
                        else {
                            el.style.setProperty(styleKeys[k], style[0], style[1]);
                        }
                    }
                }
                else if (keys[i] === "classes" && attr[keys[i]] !== undefined && attr[keys[i]].join) {
                    el.setAttribute("className", attr[keys[i]].join(" "));
                }
                else {
                    el.setAttribute(keys[i], attr[keys[i]]);
                }
            }
        }
    };
    _Dom.prototype.Remove = function (element) {
        return element.parentNode === undefined ? null : element.parentNode.removeChild(element);
    };
    _Dom.prototype.Replace = function (src, target) {
        var result;
        if (src.parentNode) {
            src.parentNode.replaceChild(target, src);
        }
        return result;
    };
    _Dom.prototype.Clear = function (element) {
        var i = element.children.length;
        ;
        while (i--) {
            element.removeChild(element.children[i]);
        }
    };
    _Dom.prototype.Get = function (id) {
        var result = this._document.getElementById(id);
        if (result === null) {
            switch (id) {
                case "body":
                    result = this._document.body;
                    break;
            }
        }
        return result;
    };
    _Dom.prototype.Find = function (selector) {
        return this._document.querySelector(selector);
    };
    _Dom.prototype.FindAll = function (selector, root) {
        return this.ToArray((root || this._document).querySelectorAll(selector));
    };
    _Dom.prototype.Children = function (root, selector) {
        var children = this.ToArray((root || this._document).children);
        return selector === undefined ? children : children.filter(this.Is.bind(this, selector));
    };
    _Dom.prototype.Position = function (el, x, y) {
        el.style.top = y + "px";
        el.style.left = x + "px";
    };
    _Dom.prototype.Is = function (selector, element) {
        var result = false;
        if (element.matches) {
            result = element.matches(selector);
        }
        else if (element.msMatchesSelector) {
            result = element.msMatchesSelector(selector);
        }
        else if (element.webkitMatchesSelector) {
            result = element.webkitMatchesSelector(selector);
        }
        else {
            if (element.id !== "") {
                result = element.parentElement.querySelector("#" + element.id) !== null;
            }
            else {
                result = this.ToArray(element.parentElement.querySelectorAll(selector)).indexOf(element) !== -1;
            }
        }
        return result;
    };
    _Dom.prototype.SetStylesExplicitly = function (element) {
        var styles = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            styles[_i - 1] = arguments[_i];
        }
        var comp = this._window.getComputedStyle(element);
        for (var style in styles) {
            element.style[style] = comp[style];
        }
    };
    return _Dom;
}());
exports._Dom = _Dom;
exports.Dom = new _Dom(typeof (window) === "undefined" ? undefined : window);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Good = require("./index");
function Integrate(alias, win) {
    if (win === void 0) { win = window; }
    if (alias !== undefined) {
        win[alias] = {};
    }
    for (var stuff in Good) {
        if (Good[stuff]._) {
            if (alias !== undefined) {
                win[alias][stuff] = Good[stuff]._;
            }
            else {
                win[stuff] = Good[stuff]._;
            }
        }
        else {
            if (alias !== undefined) {
                win[alias][stuff] = Good[stuff];
            }
            else {
                win[stuff] = Good[stuff];
            }
        }
    }
}
exports.default = Integrate;

},{"./index":"typescript-collections"}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MocDataType;
(function (MocDataType) {
    MocDataType[MocDataType["LinearInt"] = 0] = "LinearInt";
    MocDataType[MocDataType["RandomInt"] = 1] = "RandomInt";
    MocDataType[MocDataType["LinearFloat"] = 2] = "LinearFloat";
    MocDataType[MocDataType["RandomFloat"] = 3] = "RandomFloat";
})(MocDataType = exports.MocDataType || (exports.MocDataType = {}));
var _MocData = (function () {
    function _MocData() {
        this.Type = MocDataType;
    }
    _MocData.prototype._ = function () {
        return new _MocData();
    };
    _MocData.prototype.RandomString = function (length) {
        if (length === void 0) { length = 25; }
        var result = "";
        for (var i = 0; i < length; i += 1) {
            result += _MocData.VALID_CHARS.charAt(Math.floor(Math.random() * _MocData.VALID_CHARS.length));
        }
        return result;
    };
    _MocData.prototype.RandomInt = function () {
        return this.RandomNumber() | 0;
    };
    _MocData.prototype.RandomNumber = function () {
        return Math.random() * 2147483647;
    };
    _MocData.prototype.NumericArray = function (length, type) {
        if (type === void 0) { type = MocDataType.LinearInt; }
        var result = new Array(length);
        switch (type) {
            case MocDataType.LinearInt:
                for (var i = 0; i < length; i += 1) {
                    result[i] = i;
                }
                break;
            case MocDataType.RandomInt:
                for (var i = 0; i < length; i += 1) {
                    result[i] = this.RandomInt();
                }
                break;
            case MocDataType.LinearFloat:
                for (var i = 0; i < length; i += 1) {
                    result[i] = i + 0.5;
                }
                break;
            case MocDataType.RandomFloat:
                for (var i = 0; i < length; i += 1) {
                    result[i] = this.RandomNumber();
                }
                break;
        }
        return result;
    };
    _MocData.prototype.StringArray = function (arrayLength, stringLength) {
        var result = new Array(arrayLength);
        var i = -1;
        while (++i < arrayLength) {
            result[i] = this.RandomString(stringLength);
        }
        return result;
    };
    return _MocData;
}());
_MocData.VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
exports._MocData = _MocData;
exports.MocData = new _MocData();

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Arr_1 = require("./Arr");
var _Obj = (function () {
    function _Obj() {
    }
    _Obj.prototype._ = function () {
        return new _Obj;
    };
    _Obj.prototype.Destroy = function (obj) {
        if (obj.Destroy !== undefined) {
            obj.Destroy();
        }
        else {
            this.Null(obj);
        }
    };
    _Obj.prototype.Wipe = function (obj) {
        var keys = Object.keys(obj);
        var i = -1;
        var len = keys.length;
        while (++i < len) {
            delete obj[keys[i]];
        }
    };
    _Obj.prototype.Null = function (obj) {
        if (obj.constructor.prototype.Clear !== undefined) {
            obj.Clear();
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
    };
    _Obj.prototype.IsNullOrUndefined = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var i = -1;
        var a;
        var result = false;
        while (!result && ++i < len) {
            a = args[i];
            result = a === undefined || a === null;
        }
        return result;
    };
    _Obj.prototype.IsNotNullOrUndefined = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return !this.IsNullOrUndefined.apply(this, args);
    };
    _Obj.prototype.IsClassOf = function (a, b) {
        return this.IsNotNullOrUndefined(a, b) && a instanceof b.constructor;
    };
    _Obj.prototype.IsSameClass = function (a, b) {
        return this.IsNotNullOrUndefined(a, b) && a.constructor === b.constructor;
    };
    _Obj.prototype.Inherits = function (a, b) {
        return this.IsClassOf(a, b) && !this.IsSameClass(a, b);
    };
    _Obj.prototype.Equals = function (a, b) {
        var result = a === b;
        if (a !== b && (a instanceof Object) && this.IsSameClass(a, b)) {
            if (Util_1.Util.IsArray(a)) {
                var len = a.length;
                var i = 0;
                result = len === b.length;
                if (result) {
                    for (; i < len; i += 1) {
                        result = this.Equals(a[i], b[i]);
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
                var keys = Object.keys(a);
                var key = null;
                result = true;
                var i = -1;
                var len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    result = this.Equals(a[key], b[key]);
                    if (!result) {
                        if (Util_1.Util.IsFunction(a[key])) {
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
    };
    _Obj.prototype.IsDifferent = function (a, b) {
        return !this.Equals(a, b);
    };
    _Obj.prototype.ShallowCopy = function (obj) {
        var keys = Object.keys(obj);
        var result = {};
        var i = -1;
        var len = keys.length;
        while (++i < len) {
            var key = keys[i];
            result[key] = obj[key];
        }
        return result;
    };
    _Obj.prototype.Clone = function (obj) {
        var result;
        if (!(obj instanceof Object)) {
            result = obj;
        }
        else if (obj.constructor.prototype.Clone !== undefined) {
            result = obj.Clone();
        }
        else if (Util_1.Util.IsArray(obj)) {
            result = Arr_1.Arr.DeepCopy(obj);
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
                result[key] = this.Clone(obj[key]);
            }
        }
        return result;
    };
    _Obj.prototype.CloneInto = function (src, target) {
        if (Util_1.Util.IsArray(target)) {
            var arrS = src;
            var arrT = target;
            var len = arrS.length;
            arrT.length = len;
            var i = -1;
            while (++i < len) {
                if (arrS[i] instanceof Object) {
                    this.CloneInto(arrS[i], arrT[i]);
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
                        if (Util_1.Util.IsArray(a)) {
                            b = target[key] = [];
                        }
                        else {
                            b = target[key] = {};
                        }
                    }
                    if (this.IsDifferent(a, b)) {
                        this.CloneInto(a, b);
                    }
                }
                else {
                    target[key] = a;
                }
            }
        }
        return target;
    };
    _Obj.prototype.Mixin = function (target, exclude) {
        if (target === void 0) { target = {}; }
        var sources = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            sources[_i - 2] = arguments[_i];
        }
        var result = target, i = 0, len = sources ? sources.length : 0;
        sources = Arr_1.Arr.Flatten(sources);
        for (; i < len; i++) {
            var src = sources[i];
            if (Util_1.Util.IsFunction(src)) {
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
    };
    _Obj.prototype.SetProperties = function (target, values) {
        var keys = Object.keys(values);
        var key;
        var i = -1;
        var len = keys.length;
        while (++i < len) {
            key = keys[i];
            if (target.hasOwnProperty(key)) {
                target[key] = values[key];
            }
        }
    };
    return _Obj;
}());
exports._Obj = _Obj;
exports.Obj = new _Obj();

},{"./Arr":1,"./Util":9}],7:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _Timer = (function () {
    function _Timer() {
        this._hasPerformance = typeof (performance) !== "undefined";
        this.Start();
    }
    _Timer.prototype._ = function () {
        return new _Timer();
    };
    Object.defineProperty(_Timer.prototype, "Time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    _Timer.prototype.Now = function () {
        if (this._hasPerformance) {
            return performance.now();
        }
        else {
            var hrTime = process.hrtime();
            return hrTime[0] * 1000 + (hrTime[1] / 1e6);
        }
    };
    _Timer.prototype.Start = function () {
        var now = this.Now();
        this._start = this._last = now;
        return this._time = 0;
    };
    _Timer.prototype.Stop = function () {
        var start = this._start;
        var now = this.Now();
        this._last = now;
        return this._time = now - start;
    };
    return _Timer;
}());
exports._Timer = _Timer;
exports.Timer = new _Timer();

}).call(this,require('_process'))

},{"_process":21}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _Uri = (function () {
    function _Uri(win) {
        this._window = window;
        this._a = document.createElement("a");
        this.hash = "";
        this.pathName = "";
        this.port = "";
        this.hostName = "";
        this.protocol = "";
        this.origin = "";
        this.full = "";
        this.args = {};
        this.Init(win);
    }
    _Uri.prototype._ = function (win) {
        return new _Uri(win);
    };
    _Uri.prototype.Init = function (win) {
        if (win !== undefined) {
            this._window = win;
            this._a = this._window.document.createElement("a");
            this._a.setAttribute("href", this._window.location.href);
            var args_1 = this.args;
            this._a.search.substring(1).split("&").forEach(function (arg) {
                var p = arg.split("=");
                args_1[p[0]] = p[1];
            });
            this.hash = this._a.hash;
            this.pathName = this._a.pathname;
            this.port = this._a.port;
            this.hostName = this._a.hostname;
            this.protocol = this._a.protocol;
            this.origin = this._a.origin;
            this.full = this._a.href;
        }
    };
    return _Uri;
}());
exports._Uri = _Uri;
exports.Uri = new _Uri(window);

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = require("ts-md5/dist/md5");
var _Util = (function () {
    function _Util(win) {
        this._window = null;
        this._int = 0;
        this.Init(win);
    }
    _Util.prototype._ = function (win) {
        return new _Util(win);
    };
    _Util.prototype.Init = function (win) {
        var _this = this;
        if (win === undefined && typeof (window) !== undefined) {
            win = window;
        }
        if (win !== undefined) {
            this._window = win;
        }
        this.Async = (function () {
            var timeouts = [];
            var messageName = "zero-timeout-message";
            function setZeroTimeout(fn) {
                timeouts.push(fn);
                this._window.postMessage(messageName, "*");
            }
            function handleMessage(event) {
                if (((event.source) === undefined || (event.source) === this._window) && event.data == messageName) {
                    event.stopPropagation();
                    if (timeouts.length > (0 | 0)) {
                        var fn = timeouts.shift();
                        fn();
                    }
                }
            }
            if (_this.HasWindow) {
                _this._window.addEventListener("message", handleMessage, true);
                return setZeroTimeout;
            }
            else {
                return setTimeout;
            }
        })();
    };
    Object.defineProperty(_Util.prototype, "HasWindow", {
        get: function () {
            return this._window !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_Util.prototype, "HasConsole", {
        get: function () {
            return this.HasWindow && this._window.console !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    _Util.prototype.ToArray = function (arr) {
        return Array.prototype.slice.call(arr);
    };
    _Util.prototype.IsArray = function (it) {
        return it && (it instanceof Array || typeof (it) === "array");
    };
    _Util.prototype.IsElement = function (target) {
        return target !== undefined && target.nodeType === 1 ? true : false;
    };
    _Util.prototype.IsFunction = function (it) {
        return Object.prototype.toString.call(it) === "[object Function]";
    };
    _Util.prototype.GetFunctionName = function (fn) {
        var result;
        if (fn.hasOwnProperty("name") !== undefined) {
            result = fn.name;
        }
        else {
            var fnString = fn.toString();
            result = fnString.substring(9, fnString.indexOf("("));
        }
        return result;
    };
    _Util.prototype.GetFunctionCode = function (fn) {
        var result;
        var fnString = fn.toString();
        result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
        return result;
    };
    _Util.prototype.NewUUID = function () {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    _Util.prototype.NewInt = function () {
        return this._int++;
    };
    _Util.prototype.Debugger = function () {
        debugger;
    };
    _Util.prototype.PipeOut = function (log, warn, error) {
        if (this.HasConsole) {
            this.ProxyFn(this._window.console, "log", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                log.apply(void 0, args);
            });
            this.ProxyFn(this._window.console, "warn", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                warn.apply(void 0, args);
            });
            this.ProxyFn(this._window.console, "error", function (superfn) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                superfn.apply(void 0, args);
                error.apply(void 0, args);
            });
        }
        else {
            console = {
                log: log,
                warn: warn,
                error: error
            };
            if (!this.HasWindow) {
                window = {
                    console: console
                };
                this._window = window;
            }
            else {
                window.console = console;
            }
        }
    };
    _Util.prototype.Assert = function (assertion, message, isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        var result = true;
        ;
        if (!assertion) {
            if (this.HasConsole) {
                result = false;
                this._window.console.error("Assertion failed: " + message);
            }
            if (isDebug) {
                this.Debugger();
            }
        }
        return result;
    };
    _Util.prototype.ProxyFn = function (that, fnName, proxyFn, onPrototype) {
        if (onPrototype === void 0) { onPrototype = false; }
        var fn = that[fnName];
        var _superFn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length !== 0) {
                return fn.apply(that, args);
            }
            else {
                return fn.call(that);
            }
        };
        if (onPrototype && that.prototype && that.prototype[fnName]) {
            that.prototype[fnName] = proxyFn.bind(_superFn);
        }
        else {
            that[fnName] = proxyFn.bind(that, _superFn);
        }
    };
    _Util.prototype.Md5 = function (str) {
        return md5_1.Md5.hashStr(str);
    };
    return _Util;
}());
exports._Util = _Util;
if (typeof (window) === "undefined") {
    var window = null;
    var console = null;
}
exports.Util = new _Util();

},{"ts-md5/dist/md5":22}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = require("../struct/List");
var Dictionary_1 = require("../struct/Dictionary");
var Util_1 = require("../Util");
var Arr_1 = require("../Arr");
var Initable_1 = require("./mixins/Initable");
var BaseCacheObject = (function () {
    function BaseCacheObject() {
        this.Key = null;
        this.Data = null;
    }
    return BaseCacheObject;
}());
exports.BaseCacheObject = BaseCacheObject;
exports._InitableCacheObject = Initable_1.default(BaseCacheObject);
var CacheObject = (function (_super) {
    __extends(CacheObject, _super);
    function CacheObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CacheObject;
}(exports._InitableCacheObject));
exports.CacheObject = CacheObject;
var Cache = (function () {
    function Cache(size) {
        if (size === void 0) { size = Cache.DEFAULT_FIFO_SIZE; }
        this._size = Cache.DEFAULT_FIFO_SIZE;
        this._order = new List_1.default();
        this._data = new Dictionary_1.default();
        this._stage = new Dictionary_1.default();
        this._size = size;
    }
    Object.defineProperty(Cache.prototype, "Size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            if ((value !== this._size)
                && (value >= 0)) {
                this._size = value;
                this.Trim();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "Count", {
        get: function () {
            return this._order.Count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "StageCount", {
        get: function () {
            return this._stage.List.Count;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.Hit = function (key) {
        return this._data.Has(key);
    };
    Cache.prototype.Get = function (key) {
        var result;
        result = this.Hit(key) ? this._data.Get(key).Data : null;
        return result;
    };
    Cache.prototype.Push = function (key, data) {
        this.Add(key, data);
    };
    Cache.prototype.GetStaged = function (key) {
        var result;
        result = this._stage.Has(key) ? this._stage.Get(key).Data : null;
        return result;
    };
    Cache.prototype.Stage = function (key, data) {
        this._stage.Set(key, new CacheObject().Init({ Key: key, Data: data }));
    };
    Cache.prototype.Publish = function (key) {
        if (this._stage.Has(key)) {
            this.Add(key, this._stage.Get(key).Data);
            this._stage.Delete(key);
        }
    };
    Cache.prototype.Remove = function (key) {
        if (this.Hit(key)) {
            this._data.Delete(key);
            this._order.Remove(key);
        }
    };
    Cache.prototype.Cache = function (obj, fnName, keyFn) {
        var _this = this;
        if (keyFn === undefined) {
            keyFn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Util_1.Util.Md5(Arr_1.Arr.Reduce(args, function (acc, cur) { return acc += JSON.stringify(cur); }));
            };
        }
        var proxyFn = function (superFn) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var key = keyFn.apply(void 0, args);
            if (key !== null && _this.Hit(key)) {
                return _this.Get(key);
            }
            var result = superFn.apply(void 0, args);
            if (key !== null) {
                _this.Add(key, result);
            }
            return result;
        };
        Util_1.Util.ProxyFn(obj, fnName, proxyFn, false);
    };
    Cache.prototype.Clear = function () {
        this._data.Clear();
        this._order.Clear();
        this._stage.Clear();
    };
    Cache.prototype.Add = function (key, data) {
        if (this.Hit(key)) {
            this._order.Remove(key);
        }
        this._data.Set(key, new CacheObject().Init({ Key: key, Data: data }));
        this._order.Add(key);
        this.Trim();
    };
    Cache.prototype.Trim = function () {
        while ((this._order.Count > this._size)) {
            this._data.Delete(this._order.Get(0));
            this._order.Shift();
        }
    };
    return Cache;
}());
Cache.DEFAULT_FIFO_SIZE = 100;
exports.Cache = Cache;

},{"../Arr":1,"../Util":9,"../struct/Dictionary":14,"../struct/List":15,"./mixins/Initable":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pool = (function () {
    function Pool(cls, growthStep) {
        if (growthStep === void 0) { growthStep = 10; }
        this.pool = [];
        this.available = 0;
        this.size = 0;
        this.cls = cls;
        this.growthStep = growthStep;
        this.Create();
    }
    Object.defineProperty(Pool.prototype, "Available", {
        get: function () {
            return this.available;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "Size", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    Pool.prototype.Create = function () {
        var i = 0;
        for (; i < this.growthStep; i++) {
            this.pool.push(new this.cls());
        }
        this.size += this.growthStep;
        this.available += this.growthStep;
    };
    Pool.prototype.Get = function () {
        var result;
        if (this.pool.length === 0) {
            this.Create();
        }
        result = this.pool.pop();
        --this.available;
        result.InitPool(this);
        return result;
    };
    Pool.prototype.Release = function (obj) {
        this.pool.push(obj);
        ++this.available;
    };
    return Pool;
}());
exports.default = Pool;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Obj_1 = require("../../Obj");
function Initable(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.Init = function (obj) {
            Obj_1.Obj.SetProperties(this, obj);
            return this;
        };
        return class_1;
    }(Base));
}
exports.default = Initable;

},{"../../Obj":6}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function Poolable(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _super.apply(this, args) || this;
        }
        class_1.prototype.Release = function () {
            this.__pool__.Release(this);
        };
        class_1.prototype.InitPool = function (pool) {
            this.__pool__ = pool;
        };
        return class_1;
    }(Base));
}
exports.default = Poolable;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = require("./List");
var Obj_1 = require("../Obj");
var Dictionary = (function () {
    function Dictionary() {
        this._lookup = {};
        this._index = {};
        this._list = new List_1.default();
    }
    Dictionary.prototype.Has = function (key) {
        return this._lookup.hasOwnProperty(key);
    };
    Dictionary.prototype.Get = function (key) {
        return this._lookup[key];
    };
    Dictionary.prototype.Set = function (key, value) {
        var list = this._list;
        var index = this._index;
        if (this.Has(key)) {
            list.RemoveAt(index[key]);
        }
        this._lookup[key] = value;
        var pos = list.Push(value);
        index[key] = pos - 1;
        return this;
    };
    Dictionary.prototype.Delete = function (key) {
        if (this.Has(key)) {
            var i = this._index[key];
            delete this._index[key];
            delete this._lookup[key];
            this._list.RemoveAt(i);
        }
        return this;
    };
    Dictionary.prototype.Clear = function () {
        Obj_1.Obj.Wipe(this._lookup);
        Obj_1.Obj.Wipe(this._index);
        this._list.Clear();
        return this;
    };
    Object.defineProperty(Dictionary.prototype, "Values", {
        get: function () {
            return this._list.Values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "Keys", {
        get: function () {
            return Object.keys(this._lookup);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "List", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    return Dictionary;
}());
exports.default = Dictionary;

},{"../Obj":6,"./List":15}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arr_1 = require("../Arr");
var Obj_1 = require("../Obj");
var List = (function () {
    function List(arr) {
        if (arr === undefined) {
            this._array = new Array();
        }
        else {
            if (arr instanceof (List)) {
                this._array = Arr_1.Arr.ShallowCopy(arr._array);
            }
            else {
                this._array = Arr_1.Arr.ShallowCopy(arr);
            }
        }
    }
    Object.defineProperty(List.prototype, "Values", {
        get: function () {
            return this._array;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.Get = function (pos) {
        return this._array[pos];
    };
    Object.defineProperty(List.prototype, "Count", {
        get: function () {
            return this._array.length;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.Clear = function () {
        this._array.length = 0;
        return this;
    };
    List.prototype.Add = function (v) {
        this._array.push(v);
        return this;
    };
    List.prototype.InsertAt = function (pos, v) {
        Arr_1.Arr.InsertAt(this._array, pos, v);
        return this;
    };
    List.prototype.Push = function (v) {
        return this._array.push(v);
    };
    List.prototype.Pop = function () {
        return this._array.pop();
    };
    List.prototype.Shift = function () {
        return this._array.shift();
    };
    List.prototype.Concat = function (v) {
        var arr;
        if (v instanceof List) {
            arr = Arr_1.Arr.Concat(this._array, v._array);
        }
        else {
            arr = Arr_1.Arr.Concat(this._array, v);
        }
        return new List(arr);
    };
    List.prototype.Append = function (v) {
        if (v instanceof List) {
            Arr_1.Arr.Append(this._array, v._array);
        }
        else {
            Arr_1.Arr.Append(this._array, v);
        }
        return this;
    };
    List.prototype.Copy = function (src) {
        if (src instanceof List) {
            Arr_1.Arr.DeepCopyInto(src._array, this._array);
        }
        else {
            Arr_1.Arr.DeepCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.ShallowCopy = function (src) {
        if (src instanceof List) {
            Arr_1.Arr.ShallowCopyInto(src._array, this._array);
        }
        else {
            Arr_1.Arr.ShallowCopyInto(src, this._array);
        }
        return this;
    };
    List.prototype.Clone = function () {
        var arr = Arr_1.Arr.DeepCopy(this._array);
        return new List(arr);
    };
    List.prototype.Remove = function (v) {
        Arr_1.Arr.RemoveOneByElement(this._array, v);
        return this;
    };
    List.prototype.RemoveAt = function (n) {
        Arr_1.Arr.RemoveOneAt(this._array, n);
        return this;
    };
    List.prototype.ForEach = function (fn) {
        Arr_1.Arr.ForEach(this._array, fn);
        return this;
    };
    List.prototype.Until = function (fn) {
        Arr_1.Arr.Until(this._array, fn);
        return this;
    };
    List.prototype.Some = function (filter, fn) {
        Arr_1.Arr.Some(this._array, filter, fn);
        return this;
    };
    List.prototype.IndexOf = function (v) {
        return Arr_1.Arr.IndexOfElement(this._array, v);
    };
    List.prototype.Contains = function (v) {
        return Arr_1.Arr.IndexOfElement(this._array, v) !== -1;
    };
    List.prototype.Reverse = function () {
        Arr_1.Arr.Reverse(this._array);
        return this;
    };
    List.prototype.Select = function (fn) {
        return new List(Arr_1.Arr.Filter(this._array, fn));
    };
    List.prototype.SelectInto = function (src, fn) {
        if (src instanceof List) {
            Arr_1.Arr.FilterInto(src._array, this._array, fn);
        }
        else {
            Arr_1.Arr.FilterInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.OrderBy = function (fn) {
        this._array.sort(fn);
        return this;
    };
    List.prototype.Map = function (fn) {
        return new List(Arr_1.Arr.Map(this._array, fn));
    };
    List.prototype.MapInto = function (src, fn) {
        if (src instanceof List) {
            Arr_1.Arr.MapInto(src._array, this._array, fn);
        }
        else {
            Arr_1.Arr.MapInto(src, this._array, fn);
        }
        return this;
    };
    List.prototype.Reduce = function (fn, start) {
        return Arr_1.Arr.Reduce(this._array, fn, start);
    };
    List.prototype.Equals = function (b) {
        var result = Obj_1.Obj.Equals(this._array, b.Values);
        return result;
    };
    return List;
}());
exports.default = List;

},{"../Arr":1,"../Obj":6}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vec2_1 = require("./Vec2");
var Rect_1 = require("./Rect");
var Calc_1 = require("../Calc");
var Range2 = (function () {
    function Range2(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.pos = new Vec2_1.default(x, y);
        this.size = new Vec2_1.default(w, h);
    }
    Range2.prototype.Set = function (src) {
        this.pos.Set(src.pos);
        this.size.Set(src.size);
        return this;
    };
    Range2.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    };
    Range2.prototype.ToRect = function (endInclusive) {
        if (endInclusive === void 0) { endInclusive = false; }
        return new Rect_1.default(this.pos.x, this.pos.y, this.pos.x - (endInclusive ? Calc_1.Calc.Sign(this.size.x) : 0) + this.size.x, this.pos.y - (endInclusive ? Calc_1.Calc.Sign(this.size.y) : 0) + this.size.y, endInclusive);
    };
    Range2.prototype.Scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var org;
        if (keepCenter) {
            org = this.size.Clone();
        }
        this.size.Scale(factor);
        if (keepCenter) {
            this.pos.Add(org.Subtract(this.size).Multiply(0.5));
        }
        return this;
    };
    Range2.prototype.Translate = function (system) {
        this.Set(this.ToRect(false).Translate(system).ToRange2());
        return this;
    };
    Range2.prototype.ToInt = function () {
        this.pos.ToInt();
        this.size.ToInt();
        return this;
    };
    Range2.prototype.ToDecimal = function () {
        this.pos.ToDecimal();
        this.size.ToDecimal();
        return this;
    };
    Range2.prototype.Contains = function (vec) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    };
    Range2.prototype.First = function (fn) {
        var p = new Vec2_1.default();
        for (var i = this.pos.x; i < this.pos.x + this.size.x; i++) {
            for (var j = this.pos.y; j < this.pos.y + this.size.y; j++) {
                p.x = i, p.y = j;
                if (fn(p)) {
                    return p;
                }
            }
        }
        return null;
    };
    Range2.prototype.ForEach = function (fn, start) {
        if (start === void 0) { start = null; }
        var pos = new Vec2_1.default();
        var begin = this.pos.Clone().ToInt();
        if (start === null || !this.Contains(start)) {
            start = begin;
        }
        var end = this.pos.Clone().Add(this.size).ToInt();
        for (var y = begin.y; y < end.y; y += 1) {
            for (var x = begin.x; x < end.x; x += 1) {
                if (y < start.y || (y === start.y && x < start.x)) {
                    continue;
                }
                pos.x = x;
                pos.y = y;
                var brk = fn(pos);
                if (brk) {
                    return;
                }
            }
        }
    };
    Range2.prototype.Equals = function (range) {
        return this.pos.Equals(range.pos) && this.size.Equals(range.size);
    };
    return Range2;
}());
exports.default = Range2;

},{"../Calc":2,"./Rect":17,"./Vec2":20}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vec2_1 = require("./Vec2");
var Range2_1 = require("./Range2");
var Calc_1 = require("../Calc");
var Sign = Calc_1.Calc.Sign;
var Rect = (function () {
    function Rect(x1, y1, x2, y2, endInclusive) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        if (endInclusive === void 0) { endInclusive = false; }
        this.start = new Vec2_1.default(x1, y1);
        this.stop = new Vec2_1.default(x2, y2);
        this.endInclusive = endInclusive;
    }
    Rect.prototype.Set = function (src) {
        this.start.Set(src.start);
        this.stop.Set(src.stop);
        return this;
    };
    Rect.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Rect(this.start.x, this.start.y, this.stop.x, this.stop.y);
        return result;
    };
    Rect.prototype.ToRange2 = function () {
        return new Range2_1.default(this.start.x, this.start.y, this.stop.x + (this.endInclusive ? Calc_1.Calc.Sign(this.stop.x) : 0) - this.start.x, this.stop.y + (this.endInclusive ? Calc_1.Calc.Sign(this.stop.y) : 0) - this.start.y);
    };
    Rect.prototype.Scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var ow = this.stop.x - this.start.x;
        var oh = this.stop.y - this.start.y;
        var w = ow;
        var h = oh;
        w *= factor.x;
        h *= factor.y;
        if (keepCenter) {
            this.start.x -= (w - ow) / 2;
            this.start.y -= (h - oh) / 2;
        }
        this.stop.x = this.start.x + w;
        this.stop.y = this.start.y + h;
        return this;
    };
    Rect.prototype.Translate = function (system) {
        this.start.Scale(system);
        this.stop.Scale(system);
        return this;
    };
    Rect.prototype.Equals = function (rect) {
        return this.start.Equals(rect.start) && this.stop.Equals(rect.stop);
    };
    Rect.prototype.ToInt = function () {
        this.start.ToInt();
        this.stop.ToInt();
        return this;
    };
    Rect.prototype.ToDecimal = function () {
        this.start.ToDecimal();
        this.stop.ToDecimal();
        return this;
    };
    Rect.prototype.Area = function () {
        var x = this.stop.x - this.start.x;
        var y = this.stop.y - this.start.y;
        return x * y;
    };
    Rect.prototype.Move = function (vec) {
        this.start.Add(vec);
        this.stop.Add(vec);
        return this;
    };
    return Rect;
}());
exports.default = Rect;

},{"../Calc":2,"./Range2":16,"./Vec2":20}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = require("./List");
var Arr_1 = require("../Arr");
var DEFAULT_SIZE = 100;
var Stack = (function () {
    function Stack(size) {
        if (size === void 0) { size = DEFAULT_SIZE; }
        this._pos = 0;
        this._array = new Array(size);
    }
    Object.defineProperty(Stack.prototype, "Values", {
        get: function () {
            return Arr_1.Arr.Slice(this._array, 0, this._pos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "Depth", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.Push = function (obj) {
        this._array[this._pos] = obj;
        this._pos++;
    };
    Stack.prototype.Pop = function () {
        var result = null;
        if (this._pos !== 0) {
            result = this._array[--this._pos];
        }
        return result;
    };
    Stack.prototype.ToList = function () {
        var result = new List_1.default();
        return new List_1.default(this.Values);
    };
    return Stack;
}());
exports.default = Stack;

},{"../Arr":1,"./List":15}],19:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = require("./List");
var Stack_1 = require("./Stack");
var Arr_1 = require("../Arr");
var Util_1 = require("../Util");
var Obj_1 = require("../Obj");
var Initable_1 = require("../standard/mixins/Initable");
var BaseTree = (function () {
    function BaseTree() {
        this.Id = null;
        this.Parent = null;
        this.Children = null;
        this.Data = null;
    }
    return BaseTree;
}());
exports.BaseTree = BaseTree;
exports._InitableTree = Initable_1.default(BaseTree);
var Tree = (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super.call(this) || this;
        _this.Id = _this.NewId();
        return _this;
    }
    Tree.FromObject = function (obj) {
        var parent = (this instanceof Tree) ? this : null;
        var root = new Tree().Init({ Data: obj.data !== undefined ? obj.data : null, Parent: parent });
        if (obj.children !== undefined && Util_1.Util.IsArray(obj.children)) {
            root.Children = new List_1.default(Arr_1.Arr.Map(obj.children, Tree.FromObject.bind(root)));
        }
        return root;
    };
    Tree.prototype.NewId = function () {
        return Util_1.Util.NewUUID();
    };
    Tree.prototype.InsertAt = function (pos, data) {
        if (this.Children === null || this.Children.Count <= pos) {
            this.Add(data);
        }
        else {
            this.Children.InsertAt(pos, new Tree().Init({ Data: data, Parent: this }));
        }
    };
    Tree.prototype.Add = function (data) {
        if (this.Children === null) {
            this.Children = new List_1.default();
        }
        this.Children.Add((new Tree()).Init({ Data: data, Parent: this }));
    };
    Tree.prototype.Remove = function () {
        if (this.Parent !== null) {
            this.Parent.Children.Remove(this);
        }
    };
    Tree.prototype.Prune = function () {
        if (this.Children !== null) {
            this.Children
                .ForEach(function (el, i) {
                el.Parent = null;
            })
                .Clear();
        }
        this.Children = null;
        return this;
    };
    Tree.prototype.Reduce = function (fn, start) {
        var stack = new Stack_1.default();
        var acc = start;
        if (start === undefined)
            acc = 0;
        var cur;
        var i;
        stack.Push(this);
        while (cur = stack.Pop()) {
            acc = fn(acc, cur.Data);
            i = (cur.Children && cur.Children.Count) || 0;
            while (i--) {
                stack.Push(cur.Children.Get(i));
            }
        }
        return acc;
    };
    Tree.prototype.Clone = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children === null ? null : this.Children.Clone();
        result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj_1.Obj.Clone(this.Data);
        return result;
    };
    Tree.prototype.DuplicateNode = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children;
        result.Data = this.Data;
        return result;
    };
    Tree.prototype.Filter = function (condition) {
        var root = this.DuplicateNode();
        var children = this.Children;
        if (children !== null) {
            root.Children =
                root.Children
                    .Select(condition)
                    .Map(function (el, i) {
                    return el.Filter(condition);
                });
        }
        return root;
    };
    Tree.prototype.Select = function (condition, acc) {
        if (acc === void 0) { acc = new List_1.default(); }
        var result = acc;
        var children = this.Children;
        if (condition === undefined || condition(this)) {
            result.Add(this);
        }
        else {
            children.Reduce(function (acc, cur) {
                return cur.Select(condition, acc);
            }, result);
        }
        return result;
    };
    Tree.prototype.Find = function (condition) {
        var result = null;
        var children = this.Children;
        if (children !== null) {
            var i = -1;
            var len = this.Children.Count;
            var val = this.Children.Values;
            while (++i < len) {
                if (condition(val[i].Data)) {
                    result = val[i];
                    break;
                }
                else {
                    result = val[i].Children !== null ? val[i].Find(condition) : null;
                    if (result !== null) {
                        break;
                    }
                }
            }
        }
        return result;
    };
    Tree.prototype.Contains = function (condition) {
        return this.Find(condition) !== null;
    };
    return Tree;
}(exports._InitableTree));
exports.Tree = Tree;

},{"../Arr":1,"../Obj":6,"../Util":9,"../standard/mixins/Initable":12,"./List":15,"./Stack":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calc_1 = require("../Calc");
var Vec2 = (function () {
    function Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.Angle = this.HorizontalAngle;
        this.Direction = this.HorizontalAngle;
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.Set = function (src) {
        this.x = src.x;
        this.y = src.y;
        return this;
    };
    Vec2.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Vec2(this.x, this.y);
        return result;
    };
    Vec2.prototype.ToInt = function () {
        this.x |= 0;
        this.y |= 0;
        return this;
    };
    Vec2.prototype.Ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vec2.prototype.ToDecimal = function () {
        this.x += Vec2.EPSILON;
        this.y += Vec2.EPSILON;
        return this;
    };
    Vec2.prototype.LengthSq = function () { return (this.x * this.x + this.y * this.y); };
    Vec2.prototype.Length = function () { return Math.sqrt(this.LengthSq()); };
    Vec2.prototype.HorizontalAngle = function () { return Math.atan2(this.y, this.x); };
    Vec2.prototype.Rotate = function (angle) {
        var rot = Calc_1.Calc.RotationRad(angle);
        var nx = (this.x * rot[0]) - (this.y * rot[1]);
        var ny = (this.x * rot[1]) + (this.y * rot[0]);
        this.x = nx;
        this.y = ny;
        return this;
    };
    Vec2.prototype.RotateAround = function (center, angle) {
        return this.Subtract(center).Rotate(angle).Add(center);
    };
    Vec2.prototype.Normalize = function () {
        var len = this.Length();
        if (len === 0) {
            this.x = 1;
            this.y = 0;
        }
        else {
            this.x = this.x / len;
            this.y = this.y / len;
        }
        return this;
    };
    Vec2.prototype.Scale = function (vectorB) {
        this.x = this.x * vectorB.x;
        this.y = this.y * vectorB.y;
        return this;
    };
    Vec2.prototype.Relate = function (vectorB) {
        this.x = this.x / vectorB.x;
        this.y = this.y / vectorB.y;
        return this;
    };
    Vec2.prototype.Multiply = function (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    };
    Vec2.prototype.Add = function (vectorB) {
        this.x = this.x + vectorB.x;
        this.y = this.y + vectorB.y;
        return this;
    };
    Vec2.prototype.Subtract = function (vectorB) {
        this.x = this.x - vectorB.x;
        this.y = this.y - vectorB.y;
        return this;
    };
    Vec2.prototype.Invert = function () {
        this.x = -this.x;
        this.y = -this.y;
    };
    Vec2.prototype.Equals = function (target) {
        return this.x === target.x && this.y === target.y;
    };
    Vec2.prototype.AlmostEquals = function (target) {
        return Math.abs(this.x - target.x) < Vec2.EPSILON && Math.abs(this.y - target.y) < Vec2.EPSILON;
    };
    Vec2.prototype.GetNormal = function (isNormalized) {
        var result = this.Clone();
        if (!isNormalized) {
            result.Set(this).Normalize();
        }
        var temp = result.x;
        result.x = result.y;
        result.y = -temp;
        return result;
    };
    Vec2.prototype.Dot = function (vectorB) { return (this.x * vectorB.x + this.y * vectorB.y); };
    Vec2.prototype.Cross = function (vectorB) { return ((this.x * vectorB.y) - (this.y * vectorB.x)); };
    Vec2.prototype.ProjectOnto = function (vectorB) {
        var coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
        this.x = coeff * vectorB.x;
        this.y = coeff * vectorB.y;
        return this;
    };
    Vec2.prototype.VerticalAngle = function () { return Math.atan2(this.x, this.y); };
    Vec2.prototype.RotateBy = function (rotation) {
        var angle = -this.HorizontalAngle() + rotation;
        return this.Rotate(angle);
    };
    return Vec2;
}());
Vec2.EPSILON = 1e-8;
Vec2.IDENTITY = new Vec2(1, 1);
Vec2.X_DIM = new Vec2(1, 0);
Vec2.Y_DIM = new Vec2(0, 1);
exports.default = Vec2;

},{"../Calc":2}],21:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],22:[function(require,module,exports){
/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
  

*/
var Md5 = (function () {
    function Md5() {
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    // One time hashing functions
    Md5.hashStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    };
    ;
    Md5.hashAsciiStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    };
    ;
    Md5.prototype.start = function () {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    };
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    Md5.prototype.appendStr = function (str) {
        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, code, i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw 'Unicode standard supports code points up to U+10FFFF';
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendAsciiStr = function (str) {
        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, i, j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendByteArray = function (input) {
        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, i, j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.getState = function () {
        var self = this, s = self._state;
        return {
            buffer: String.fromCharCode.apply(null, self._buffer8),
            buflen: self._bufferLength,
            length: self._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    };
    Md5.prototype.setState = function (state) {
        var buf = state.buffer, x = state.state, s = this._state, i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    };
    Md5.prototype.end = function (raw) {
        if (raw === void 0) { raw = false; }
        var bufLen = this._bufferLength, buf8 = this._buffer8, buf32 = this._buffer32, i = (bufLen >> 2) + 1, dataBitsLen;
        this._dataLength += bufLen;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        dataBitsLen = this._dataLength * 8;
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(matches[2], 16), hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    };
    Md5._hex = function (x) {
        var hc = Md5.hexChars, ho = Md5.hexOut, n, offset, j, i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    };
    Md5._md5cycle = function (x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    };
    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Md5.hexChars = '0123456789abcdef';
    Md5.hexOut = [];
    // Permanent instance is to use for one-call hashing
    Md5.onePassHasher = new Md5();
    return Md5;
})();
exports.Md5 = Md5;
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    console.error('Md5 self test failed.');
}

},{}],"typescript-collections":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vec2_1 = require("./struct/Vec2");
exports.Vec2 = Vec2_1.default;
var Range2_1 = require("./struct/Range2");
exports.Range2 = Range2_1.default;
var Rect_1 = require("./struct/Rect");
exports.Rect = Rect_1.default;
var List_1 = require("./struct/List");
exports.List = List_1.default;
var Dictionary_1 = require("./struct/Dictionary");
exports.Dictionary = Dictionary_1.default;
var Stack_1 = require("./struct/Stack");
exports.Stack = Stack_1.default;
var Tree_1 = require("./struct/Tree");
exports.Tree = Tree_1.Tree;
var Calc_1 = require("./Calc");
exports.Calc = Calc_1.default;
var Dom_1 = require("./Dom");
exports.Dom = Dom_1.Dom;
var Arr_1 = require("./Arr");
exports.Arr = Arr_1.Arr;
var Obj_1 = require("./Obj");
exports.Obj = Obj_1.Obj;
var Util_1 = require("./Util");
exports.Util = Util_1.Util;
var Timer_1 = require("./Timer");
exports.Timer = Timer_1.Timer;
var Uri_1 = require("./Uri");
exports.Uri = Uri_1.Uri;
var Poolable_1 = require("./standard/mixins/Poolable");
exports.Poolable = Poolable_1.default;
var Initable_1 = require("./standard/mixins/Initable");
exports.Initable = Initable_1.default;
var Pool_1 = require("./standard/Pool");
exports.Pool = Pool_1.default;
var Integration_1 = require("./Integration");
exports.Integrate = Integration_1.default;
var MocData_1 = require("./MocData");
exports.MocData = MocData_1.MocData;
var Cache_1 = require("./standard/Cache");
exports.Cache = Cache_1.Cache;

},{"./Arr":1,"./Calc":2,"./Dom":3,"./Integration":4,"./MocData":5,"./Obj":6,"./Timer":7,"./Uri":8,"./Util":9,"./standard/Cache":10,"./standard/Pool":11,"./standard/mixins/Initable":12,"./standard/mixins/Poolable":13,"./struct/Dictionary":14,"./struct/List":15,"./struct/Range2":16,"./struct/Rect":17,"./struct/Stack":18,"./struct/Tree":19,"./struct/Vec2":20}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2xpYi9BcnIuanMiLCJkaXN0L2xpYi9DYWxjLmpzIiwiZGlzdC9saWIvRG9tLmpzIiwiZGlzdC9saWIvSW50ZWdyYXRpb24uanMiLCJkaXN0L2xpYi9Nb2NEYXRhLmpzIiwiZGlzdC9saWIvT2JqLmpzIiwiZGlzdC9saWIvVGltZXIuanMiLCJkaXN0L2xpYi9VcmkuanMiLCJkaXN0L2xpYi9VdGlsLmpzIiwiZGlzdC9saWIvc3RhbmRhcmQvQ2FjaGUuanMiLCJkaXN0L2xpYi9zdGFuZGFyZC9Qb29sLmpzIiwiZGlzdC9saWIvc3RhbmRhcmQvbWl4aW5zL0luaXRhYmxlLmpzIiwiZGlzdC9saWIvc3RhbmRhcmQvbWl4aW5zL1Bvb2xhYmxlLmpzIiwiZGlzdC9saWIvc3RydWN0L0RpY3Rpb25hcnkuanMiLCJkaXN0L2xpYi9zdHJ1Y3QvTGlzdC5qcyIsImRpc3QvbGliL3N0cnVjdC9SYW5nZTIuanMiLCJkaXN0L2xpYi9zdHJ1Y3QvUmVjdC5qcyIsImRpc3QvbGliL3N0cnVjdC9TdGFjay5qcyIsImRpc3QvbGliL3N0cnVjdC9UcmVlLmpzIiwiZGlzdC9saWIvc3RydWN0L1ZlYzIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RzLW1kNS9kaXN0L21kNS5qcyIsImRpc3QvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBPYmpfMSA9IHJlcXVpcmUoXCIuL09ialwiKTtcclxudmFyIFV0aWxfMSA9IHJlcXVpcmUoXCIuL1V0aWxcIik7XHJcbnZhciBfQXJyYXkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gX0FycmF5KCkge1xyXG4gICAgfVxyXG4gICAgX0FycmF5LnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgX0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5GbGF0dGVuID0gZnVuY3Rpb24gKHNyYykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkZsYXR0ZW5Jbm5lcihzcmMpO1xyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuRmxhdHRlbklubmVyID0gZnVuY3Rpb24gKHNyYywgcmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSB7IHJlc3VsdCA9IFtdOyB9XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIGlmIChVdGlsXzEuVXRpbC5Jc0FycmF5KHNyY1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuRmxhdHRlbklubmVyKHNyY1tpXSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNyY1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLlJldmVyc2UgPSBmdW5jdGlvbiAoYXJyYXkpIHtcclxuICAgICAgICB2YXIgbGVmdCA9IG51bGw7XHJcbiAgICAgICAgdmFyIHJpZ2h0ID0gbnVsbDtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGVmdCA9IDA7IGxlZnQgPCBsZW5ndGggLyAyOyBsZWZ0ICs9IDEpIHtcclxuICAgICAgICAgICAgcmlnaHQgPSBsZW5ndGggLSAxIC0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHRlbXBvcmFyeSA9IGFycmF5W2xlZnRdO1xyXG4gICAgICAgICAgICBhcnJheVtsZWZ0XSA9IGFycmF5W3JpZ2h0XTtcclxuICAgICAgICAgICAgYXJyYXlbcmlnaHRdID0gdGVtcG9yYXJ5O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLkNvbmNhdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFycnNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGFycnMpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5TbGljZSA9IGZ1bmN0aW9uIChzcmMsIGZyb20sIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGZyb20gPT09IHZvaWQgMCkgeyBmcm9tID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gSW5maW5pdHk7IH1cclxuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oc3JjLmxlbmd0aCAtIGZyb20sIGNvdW50KTtcclxuICAgICAgICBpZiAobGVuIDwgMCkge1xyXG4gICAgICAgICAgICBsZW4gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkobGVuKTtcclxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHNyY1tpICsgZnJvbV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5BcHBlbmQgPSBmdW5jdGlvbiAoYXJyLCB2YWx1ZXMpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMSwgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCwgb2Zmc2V0ID0gYXJyLmxlbmd0aDtcclxuICAgICAgICBhcnIubGVuZ3RoID0gbGVuZ3RoICsgb2Zmc2V0O1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFycltvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLlJlbW92ZU9uZUF0ID0gZnVuY3Rpb24gKGFyciwgaW5kZXgpIHtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xICYmIGluZGV4IDwgYXJyLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGkgPSBpbmRleDtcclxuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICAgICAgYXJyW2kgLSAxXSA9IGFycltpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhcnIubGVuZ3RoIC09IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuSW5kZXhPZkVsZW1lbnQgPSBmdW5jdGlvbiAoc3JjLCBlbCkge1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICBpZiAoc3JjW2ldID09PSBlbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuUmVtb3ZlT25lQnlFbGVtZW50ID0gZnVuY3Rpb24gKGFyciwgZWwpIHtcclxuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLkluZGV4T2ZFbGVtZW50KGFyciwgZWwpO1xyXG4gICAgICAgIHRoaXMuUmVtb3ZlT25lQXQoYXJyLCBzdGFydCk7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5JbmRleE9mID0gZnVuY3Rpb24gKHNyYywgZm4pIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgaWYgKGZuKHNyY1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLlJlbW92ZU9uZUJ5Rm4gPSBmdW5jdGlvbiAoYXJyLCBmbikge1xyXG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuSW5kZXhPZihhcnIsIGZuKTtcclxuICAgICAgICB0aGlzLlJlbW92ZU9uZUF0KGFyciwgc3RhcnQpO1xyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuU2hhbGxvd0NvcHkgPSBmdW5jdGlvbiAoc3JjKSB7XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICByZXN1bHRbaV0gPSBzcmNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5TaGFsbG93Q29weUludG8gPSBmdW5jdGlvbiAoc3JjLCB0YXJnZXQpIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHRhcmdldC5sZW5ndGggPSBsZW47XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICB0YXJnZXRbaV0gPSBzcmNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuU2hhbGxvd0ZpbGwgPSBmdW5jdGlvbiAoc3JjLCB0YXJnZXQsIGF0KSB7XHJcbiAgICAgICAgaWYgKGF0ID09PSB2b2lkIDApIHsgYXQgPSAwOyB9XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICBpZiAodGFyZ2V0Lmxlbmd0aCA8IGxlbiArIGF0KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5sZW5ndGggPSBsZW4gKyBhdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICB0YXJnZXRbYXQgKyBpXSA9IHNyY1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5EZWVwQ29weSA9IGZ1bmN0aW9uIChzcmMpIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkobGVuKTtcclxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IChPYmpfMS5PYmouQ2xvbmUoc3JjW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5EZWVwQ29weUludG8gPSBmdW5jdGlvbiAoc3JjLCB0YXJnZXQpIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHRhcmdldC5sZW5ndGggPSBsZW47XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICB0YXJnZXRbaV0gPSAoT2JqXzEuT2JqLkNsb25lKHNyY1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLkRlZXBGaWxsID0gZnVuY3Rpb24gKHNyYywgdGFyZ2V0LCBhdCkge1xyXG4gICAgICAgIGlmIChhdCA9PT0gdm9pZCAwKSB7IGF0ID0gMDsgfVxyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHRhcmdldC5sZW5ndGggPCBsZW4gKyBhdCkge1xyXG4gICAgICAgICAgICB0YXJnZXQubGVuZ3RoID0gbGVuICsgYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2F0ICsgaV0gPSAoT2JqXzEuT2JqLkNsb25lKHNyY1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLkZpbHRlciA9IGZ1bmN0aW9uIChzcmMsIGZuKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBzcmNbaV07XHJcbiAgICAgICAgICAgIGlmIChmbihlbCwgaSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIF9BcnJheS5wcm90b3R5cGUuRmlsdGVySW50byA9IGZ1bmN0aW9uIChzcmMsIHRhcmdldCwgZm4pIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBqID0gMDtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICB2YXIgc3BhY2UgPSB0YXJnZXQubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gc3JjW2ldO1xyXG4gICAgICAgICAgICBpZiAoZm4oZWwsIGkpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaiA8IHNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2orK10gPSBlbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICsrajtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0Lmxlbmd0aCA9IGo7XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5NYXAgPSBmdW5jdGlvbiAoc3JjLCBmbikge1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShsZW4pO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgcmVzdWx0W2ldID0gZm4oc3JjW2ldLCBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLk1hcEludG8gPSBmdW5jdGlvbiAoc3JjLCB0YXJnZXQsIGZuKSB7XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICB0YXJnZXQubGVuZ3RoID0gbGVuO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2ldID0gZm4oc3JjW2ldLCBpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX0FycmF5LnByb3RvdHlwZS5SZWR1Y2UgPSBmdW5jdGlvbiAoc3JjLCBmbiwgc3RhcnQpIHtcclxuICAgICAgICBpZiAoc3RhcnQgPT09IHZvaWQgMCkgeyBzdGFydCA9IDA7IH1cclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBhY2MgPSBzdGFydDtcclxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIGFjYyA9IGZuKGFjYywgc3JjW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLkZvckVhY2ggPSBmdW5jdGlvbiAoc3JjLCBmbikge1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICBmbihzcmNbaV0sIGkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLlVudGlsID0gZnVuY3Rpb24gKHNyYywgZm4pIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW4gPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgdmFyIGJyayA9IGZuKHNyY1tpXSwgaSk7XHJcbiAgICAgICAgICAgIGlmIChicmspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLlNvbWUgPSBmdW5jdGlvbiAoc3JjLCBmaWx0ZXIsIGZuKSB7XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0gc3JjLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IHNyY1tpXTtcclxuICAgICAgICAgICAgaWYgKGZpbHRlcihlbCwgaSkpIHtcclxuICAgICAgICAgICAgICAgIGZuKGVsLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfQXJyYXkucHJvdG90eXBlLkluc2VydEF0ID0gZnVuY3Rpb24gKHNyYywgcG9zLCB2KSB7XHJcbiAgICAgICAgaWYgKHBvcyA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGkgPSBzcmMubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IHBvcykge1xyXG4gICAgICAgICAgICAgICAgc3JjW2kgKyAxXSA9IHNyY1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcmNbaSArIDFdID0gdjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9BcnJheTtcclxufSgpKTtcclxuZXhwb3J0cy5fQXJyYXkgPSBfQXJyYXk7XHJcbmV4cG9ydHMuQXJyID0gbmV3IF9BcnJheSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BcnIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIF9DYWxjID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIF9DYWxjKCkge1xyXG4gICAgfVxyXG4gICAgX0NhbGMucHJvdG90eXBlLl8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBfQ2FsYygpO1xyXG4gICAgfTtcclxuICAgIF9DYWxjLnByb3RvdHlwZS5TaWduID0gZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdudW1iZXInID8geCA/IHggPCAwID8gLTEgOiAxIDogeCA9PT0geCA/IDAgOiBOYU4gOiBOYU47XHJcbiAgICB9O1xyXG4gICAgX0NhbGMucHJvdG90eXBlLlJvdGF0aW9uRGVnID0gZnVuY3Rpb24gKHJvdGF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IChyb3RhdGlvbiAqIF9DYWxjLlJPVEFUSU9OX0RFR1JFRV9QUkVDSVNJT04pIHwgMDtcclxuICAgICAgICB3aGlsZSAocm90IDwgMCkge1xyXG4gICAgICAgICAgICByb3QgKz0gX0NhbGMuREVHMzYwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAocm90ID49IF9DYWxjLkRFRzM2MCkge1xyXG4gICAgICAgICAgICByb3QgLT0gX0NhbGMuREVHMzYwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX0NhbGMuUk9UQVRJT05fTE9PS1VQW3JvdF07XHJcbiAgICB9O1xyXG4gICAgX0NhbGMucHJvdG90eXBlLlJvdGF0aW9uUmFkID0gZnVuY3Rpb24gKHJvdGF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IHJvdGF0aW9uICogX0NhbGMuREVHUkVFX0ZBQ1RPUiAqIF9DYWxjLlJPVEFUSU9OX0RFR1JFRV9QUkVDSVNJT04gfCAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzLlJvdGF0aW9uRGVnKHJvdCAvIF9DYWxjLlJPVEFUSU9OX0RFR1JFRV9QUkVDSVNJT04pO1xyXG4gICAgfTtcclxuICAgIF9DYWxjLnByb3RvdHlwZS5DbG9zZXN0UmFkaWFuUm90YXRpb24gPSBmdW5jdGlvbiAocm90YXRpb24pIHtcclxuICAgICAgICB2YXIgcm90ID0gcm90YXRpb24gKiBfQ2FsYy5ERUdSRUVfRkFDVE9SICogX0NhbGMuUk9UQVRJT05fREVHUkVFX1BSRUNJU0lPTiB8IDA7XHJcbiAgICAgICAgd2hpbGUgKHJvdCA8IDApIHtcclxuICAgICAgICAgICAgcm90ICs9IF9DYWxjLkRFRzM2MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKHJvdCA+PSBfQ2FsYy5ERUczNjApIHtcclxuICAgICAgICAgICAgcm90IC09IF9DYWxjLkRFRzM2MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvdCAqIF9DYWxjLlJBRElBTl9GQUNUT1IgLyBfQ2FsYy5ST1RBVElPTl9ERUdSRUVfUFJFQ0lTSU9OO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfQ2FsYztcclxufSgpKTtcclxuX0NhbGMuUk9UQVRJT05fREVHUkVFX1BSRUNJU0lPTiA9IDE7XHJcbl9DYWxjLlJBRElBTl9GQUNUT1IgPSAoMSAvIDM2MCkgKiAoMiAqIE1hdGguUEkpO1xyXG5fQ2FsYy5ERUdSRUVfRkFDVE9SID0gKDEgLyAoMiAqIE1hdGguUEkpICogMzYwKTtcclxuX0NhbGMuREVHMzYwID0gMzYwICogX0NhbGMuUk9UQVRJT05fREVHUkVFX1BSRUNJU0lPTjtcclxuX0NhbGMuUk9UQVRJT05fTE9PS1VQID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBsb29rdXAgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzYwICogX0NhbGMuUk9UQVRJT05fREVHUkVFX1BSRUNJU0lPTjsgaSsrKSB7XHJcbiAgICAgICAgbG9va3VwLnB1c2goW01hdGguY29zKGkgKiBfQ2FsYy5SQURJQU5fRkFDVE9SKSwgTWF0aC5zaW4oaSAqIF9DYWxjLlJBRElBTl9GQUNUT1IpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbG9va3VwO1xyXG59KSgpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBfQ2FsYztcclxuZXhwb3J0cy5DYWxjID0gbmV3IF9DYWxjKCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNhbGMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFNpZGVzO1xyXG4oZnVuY3Rpb24gKFNpZGVzKSB7XHJcbiAgICBTaWRlc1tTaWRlc1tcIlRvcFwiXSA9IDBdID0gXCJUb3BcIjtcclxuICAgIFNpZGVzW1NpZGVzW1wiQm90dG9tXCJdID0gMV0gPSBcIkJvdHRvbVwiO1xyXG4gICAgU2lkZXNbU2lkZXNbXCJMZWZ0XCJdID0gMl0gPSBcIkxlZnRcIjtcclxuICAgIFNpZGVzW1NpZGVzW1wiUmlnaHRcIl0gPSAzXSA9IFwiUmlnaHRcIjtcclxufSkoU2lkZXMgPSBleHBvcnRzLlNpZGVzIHx8IChleHBvcnRzLlNpZGVzID0ge30pKTtcclxudmFyIF9Eb20gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gX0RvbSh3aW4pIHtcclxuICAgICAgICB0aGlzLlNpZGVzID0gU2lkZXM7XHJcbiAgICAgICAgdGhpcy5Jbml0KHdpbik7XHJcbiAgICB9XHJcbiAgICBfRG9tLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKHdpbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgX0RvbSh3aW4pO1xyXG4gICAgfTtcclxuICAgIF9Eb20ucHJvdG90eXBlLkluaXQgPSBmdW5jdGlvbiAod2luKSB7XHJcbiAgICAgICAgaWYgKHdpbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdyA9IHdpbjtcclxuICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQgPSB0aGlzLl93aW5kb3cuZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX0RvbS5wcm90b3R5cGUuVG9BcnJheSA9IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEpO1xyXG4gICAgfTtcclxuICAgIF9Eb20ucHJvdG90eXBlLkNyZWF0ZSA9IGZ1bmN0aW9uIChodG1sLCBhdHRyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCwga2V5cywgaSwgaywgc3R5bGVzLCBzdHlsZUtleXM7XHJcbiAgICAgICAgdGhpcy5fZWwuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLl9lbC5jaGlsZHJlblswXTtcclxuICAgICAgICB0aGlzLlNldEF0dHIocmVzdWx0LCBhdHRyKTtcclxuICAgICAgICB0aGlzLkNsZWFyKHRoaXMuX2VsKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIF9Eb20ucHJvdG90eXBlLk91dGVySFRNTCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHRoaXMuX2VsLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fZWwuaW5uZXJIVE1MO1xyXG4gICAgICAgIHRoaXMuQ2xlYXIodGhpcy5fZWwpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0RvbS5wcm90b3R5cGUuU2V0QXR0ciA9IGZ1bmN0aW9uIChfZWwsIGF0dHIpIHtcclxuICAgICAgICB2YXIgZWw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoX2VsKSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbCA9IHRoaXMuR2V0KF9lbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbCA9IF9lbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGtleXMsIGksIGssIHN0eWxlcywgc3R5bGVLZXlzLCBzdHlsZTtcclxuICAgICAgICBpZiAoYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiAoYXR0cikgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKGF0dHIpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleXNbaV0gPT09IFwic3R5bGVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlcyA9IGF0dHJba2V5c1tpXV07XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVLZXlzID0gT2JqZWN0LmtleXMoc3R5bGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgc3R5bGVLZXlzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0gc3R5bGVzW3N0eWxlS2V5c1trXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHN0eWxlKSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoc3R5bGVLZXlzW2tdLCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShzdHlsZUtleXNba10sIHN0eWxlWzBdLCBzdHlsZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChrZXlzW2ldID09PSBcImNsYXNzZXNcIiAmJiBhdHRyW2tleXNbaV1dICE9PSB1bmRlZmluZWQgJiYgYXR0cltrZXlzW2ldXS5qb2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIsIGF0dHJba2V5c1tpXV0uam9pbihcIiBcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleXNbaV0sIGF0dHJba2V5c1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIF9Eb20ucHJvdG90eXBlLlJlbW92ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH07XHJcbiAgICBfRG9tLnByb3RvdHlwZS5SZXBsYWNlID0gZnVuY3Rpb24gKHNyYywgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICBpZiAoc3JjLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgc3JjLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRhcmdldCwgc3JjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfRG9tLnByb3RvdHlwZS5DbGVhciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIGkgPSBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICA7XHJcbiAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfRG9tLnByb3RvdHlwZS5HZXQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChpZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImJvZHlcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0RvbS5wcm90b3R5cGUuRmluZCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBfRG9tLnByb3RvdHlwZS5GaW5kQWxsID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuVG9BcnJheSgocm9vdCB8fCB0aGlzLl9kb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xyXG4gICAgfTtcclxuICAgIF9Eb20ucHJvdG90eXBlLkNoaWxkcmVuID0gZnVuY3Rpb24gKHJvb3QsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5Ub0FycmF5KChyb290IHx8IHRoaXMuX2RvY3VtZW50KS5jaGlsZHJlbik7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yID09PSB1bmRlZmluZWQgPyBjaGlsZHJlbiA6IGNoaWxkcmVuLmZpbHRlcih0aGlzLklzLmJpbmQodGhpcywgc2VsZWN0b3IpKTtcclxuICAgIH07XHJcbiAgICBfRG9tLnByb3RvdHlwZS5Qb3NpdGlvbiA9IGZ1bmN0aW9uIChlbCwgeCwgeSkge1xyXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XHJcbiAgICAgICAgZWwuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XHJcbiAgICB9O1xyXG4gICAgX0RvbS5wcm90b3R5cGUuSXMgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3Rvcikge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pZCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyBlbGVtZW50LmlkKSAhPT0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuVG9BcnJheShlbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLmluZGV4T2YoZWxlbWVudCkgIT09IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX0RvbS5wcm90b3R5cGUuU2V0U3R5bGVzRXhwbGljaXRseSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHN0eWxlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHN0eWxlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbXAgPSB0aGlzLl93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcclxuICAgICAgICBmb3IgKHZhciBzdHlsZSBpbiBzdHlsZXMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtzdHlsZV0gPSBjb21wW3N0eWxlXTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9Eb207XHJcbn0oKSk7XHJcbmV4cG9ydHMuX0RvbSA9IF9Eb207XHJcbmV4cG9ydHMuRG9tID0gbmV3IF9Eb20odHlwZW9mICh3aW5kb3cpID09PSBcInVuZGVmaW5lZFwiID8gdW5kZWZpbmVkIDogd2luZG93KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RG9tLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBHb29kID0gcmVxdWlyZShcIi4vaW5kZXhcIik7XHJcbmZ1bmN0aW9uIEludGVncmF0ZShhbGlhcywgd2luKSB7XHJcbiAgICBpZiAod2luID09PSB2b2lkIDApIHsgd2luID0gd2luZG93OyB9XHJcbiAgICBpZiAoYWxpYXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHdpblthbGlhc10gPSB7fTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIHN0dWZmIGluIEdvb2QpIHtcclxuICAgICAgICBpZiAoR29vZFtzdHVmZl0uXykge1xyXG4gICAgICAgICAgICBpZiAoYWxpYXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgd2luW2FsaWFzXVtzdHVmZl0gPSBHb29kW3N0dWZmXS5fO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luW3N0dWZmXSA9IEdvb2Rbc3R1ZmZdLl87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChhbGlhcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5bYWxpYXNdW3N0dWZmXSA9IEdvb2Rbc3R1ZmZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luW3N0dWZmXSA9IEdvb2Rbc3R1ZmZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVncmF0ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SW50ZWdyYXRpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIE1vY0RhdGFUeXBlO1xyXG4oZnVuY3Rpb24gKE1vY0RhdGFUeXBlKSB7XHJcbiAgICBNb2NEYXRhVHlwZVtNb2NEYXRhVHlwZVtcIkxpbmVhckludFwiXSA9IDBdID0gXCJMaW5lYXJJbnRcIjtcclxuICAgIE1vY0RhdGFUeXBlW01vY0RhdGFUeXBlW1wiUmFuZG9tSW50XCJdID0gMV0gPSBcIlJhbmRvbUludFwiO1xyXG4gICAgTW9jRGF0YVR5cGVbTW9jRGF0YVR5cGVbXCJMaW5lYXJGbG9hdFwiXSA9IDJdID0gXCJMaW5lYXJGbG9hdFwiO1xyXG4gICAgTW9jRGF0YVR5cGVbTW9jRGF0YVR5cGVbXCJSYW5kb21GbG9hdFwiXSA9IDNdID0gXCJSYW5kb21GbG9hdFwiO1xyXG59KShNb2NEYXRhVHlwZSA9IGV4cG9ydHMuTW9jRGF0YVR5cGUgfHwgKGV4cG9ydHMuTW9jRGF0YVR5cGUgPSB7fSkpO1xyXG52YXIgX01vY0RhdGEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gX01vY0RhdGEoKSB7XHJcbiAgICAgICAgdGhpcy5UeXBlID0gTW9jRGF0YVR5cGU7XHJcbiAgICB9XHJcbiAgICBfTW9jRGF0YS5wcm90b3R5cGUuXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IF9Nb2NEYXRhKCk7XHJcbiAgICB9O1xyXG4gICAgX01vY0RhdGEucHJvdG90eXBlLlJhbmRvbVN0cmluZyA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcclxuICAgICAgICBpZiAobGVuZ3RoID09PSB2b2lkIDApIHsgbGVuZ3RoID0gMjU7IH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBfTW9jRGF0YS5WQUxJRF9DSEFSUy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogX01vY0RhdGEuVkFMSURfQ0hBUlMubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX01vY0RhdGEucHJvdG90eXBlLlJhbmRvbUludCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5SYW5kb21OdW1iZXIoKSB8IDA7XHJcbiAgICB9O1xyXG4gICAgX01vY0RhdGEucHJvdG90eXBlLlJhbmRvbU51bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIDIxNDc0ODM2NDc7XHJcbiAgICB9O1xyXG4gICAgX01vY0RhdGEucHJvdG90eXBlLk51bWVyaWNBcnJheSA9IGZ1bmN0aW9uIChsZW5ndGgsIHR5cGUpIHtcclxuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBNb2NEYXRhVHlwZS5MaW5lYXJJbnQ7IH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KGxlbmd0aCk7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTW9jRGF0YVR5cGUuTGluZWFySW50OlxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBNb2NEYXRhVHlwZS5SYW5kb21JbnQ6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gdGhpcy5SYW5kb21JbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1vY0RhdGFUeXBlLkxpbmVhckZsb2F0OlxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGkgKyAwLjU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBNb2NEYXRhVHlwZS5SYW5kb21GbG9hdDpcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSB0aGlzLlJhbmRvbU51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX01vY0RhdGEucHJvdG90eXBlLlN0cmluZ0FycmF5ID0gZnVuY3Rpb24gKGFycmF5TGVuZ3RoLCBzdHJpbmdMZW5ndGgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KGFycmF5TGVuZ3RoKTtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBhcnJheUxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXN1bHRbaV0gPSB0aGlzLlJhbmRvbVN0cmluZyhzdHJpbmdMZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfTW9jRGF0YTtcclxufSgpKTtcclxuX01vY0RhdGEuVkFMSURfQ0hBUlMgPSBcIiBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG5leHBvcnRzLl9Nb2NEYXRhID0gX01vY0RhdGE7XHJcbmV4cG9ydHMuTW9jRGF0YSA9IG5ldyBfTW9jRGF0YSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Nb2NEYXRhLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsXzEgPSByZXF1aXJlKFwiLi9VdGlsXCIpO1xyXG52YXIgQXJyXzEgPSByZXF1aXJlKFwiLi9BcnJcIik7XHJcbnZhciBfT2JqID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIF9PYmooKSB7XHJcbiAgICB9XHJcbiAgICBfT2JqLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgX09iajtcclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5EZXN0cm95ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIGlmIChvYmouRGVzdHJveSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9iai5EZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLk51bGwob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX09iai5wcm90b3R5cGUuV2lwZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICBkZWxldGUgb2JqW2tleXNbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5OdWxsID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIGlmIChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLkNsZWFyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JqLkNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgICAgIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX09iai5wcm90b3R5cGUuSXNOdWxsT3JVbmRlZmluZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBhO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICB3aGlsZSAoIXJlc3VsdCAmJiArK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgYSA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGEgPT09IHVuZGVmaW5lZCB8fCBhID09PSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIF9PYmoucHJvdG90eXBlLklzTm90TnVsbE9yVW5kZWZpbmVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gIXRoaXMuSXNOdWxsT3JVbmRlZmluZWQuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9O1xyXG4gICAgX09iai5wcm90b3R5cGUuSXNDbGFzc09mID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Jc05vdE51bGxPclVuZGVmaW5lZChhLCBiKSAmJiBhIGluc3RhbmNlb2YgYi5jb25zdHJ1Y3RvcjtcclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5Jc1NhbWVDbGFzcyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNOb3ROdWxsT3JVbmRlZmluZWQoYSwgYikgJiYgYS5jb25zdHJ1Y3RvciA9PT0gYi5jb25zdHJ1Y3RvcjtcclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5Jbmhlcml0cyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNDbGFzc09mKGEsIGIpICYmICF0aGlzLklzU2FtZUNsYXNzKGEsIGIpO1xyXG4gICAgfTtcclxuICAgIF9PYmoucHJvdG90eXBlLkVxdWFscyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGEgPT09IGI7XHJcbiAgICAgICAgaWYgKGEgIT09IGIgJiYgKGEgaW5zdGFuY2VvZiBPYmplY3QpICYmIHRoaXMuSXNTYW1lQ2xhc3MoYSwgYikpIHtcclxuICAgICAgICAgICAgaWYgKFV0aWxfMS5VdGlsLklzQXJyYXkoYSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSBhLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxlbiA9PT0gYi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLkVxdWFscyhhW2ldLCBiW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGEuY29uc3RydWN0b3IucHJvdG90eXBlLkVxdWFscykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYS5FcXVhbHMoYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuRXF1YWxzKGFba2V5XSwgYltrZXldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVXRpbF8xLlV0aWwuSXNGdW5jdGlvbihhW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5Jc0RpZmZlcmVudCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLkVxdWFscyhhLCBiKTtcclxuICAgIH07XHJcbiAgICBfT2JqLnByb3RvdHlwZS5TaGFsbG93Q29weSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX09iai5wcm90b3R5cGUuQ2xvbmUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5DbG9uZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iai5DbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChVdGlsXzEuVXRpbC5Jc0FycmF5KG9iaikpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyXzEuQXJyLkRlZXBDb3B5KG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG9iai5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBvYmouY29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGkgPSAtMTtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLkNsb25lKG9ialtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIF9PYmoucHJvdG90eXBlLkNsb25lSW50byA9IGZ1bmN0aW9uIChzcmMsIHRhcmdldCkge1xyXG4gICAgICAgIGlmIChVdGlsXzEuVXRpbC5Jc0FycmF5KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgdmFyIGFyclMgPSBzcmM7XHJcbiAgICAgICAgICAgIHZhciBhcnJUID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gYXJyUy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGFyclQubGVuZ3RoID0gbGVuO1xyXG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyU1tpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2xvbmVJbnRvKGFyclNbaV0sIGFyclRbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyVFtpXSA9IGFyclNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3JjKTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gdGFyZ2V0W2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChVdGlsXzEuVXRpbC5Jc0FycmF5KGEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gdGFyZ2V0W2tleV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB0YXJnZXRba2V5XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLklzRGlmZmVyZW50KGEsIGIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ2xvbmVJbnRvKGEsIGIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gYTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfTtcclxuICAgIF9PYmoucHJvdG90eXBlLk1peGluID0gZnVuY3Rpb24gKHRhcmdldCwgZXhjbHVkZSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgeyB0YXJnZXQgPSB7fTsgfVxyXG4gICAgICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc291cmNlc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldCwgaSA9IDAsIGxlbiA9IHNvdXJjZXMgPyBzb3VyY2VzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgc291cmNlcyA9IEFycl8xLkFyci5GbGF0dGVuKHNvdXJjZXMpO1xyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNyYyA9IHNvdXJjZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChVdGlsXzEuVXRpbC5Jc0Z1bmN0aW9uKHNyYykpIHtcclxuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZXhjbHVkZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlfMSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlbl8xID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKytpXzEgPCBsZW5fMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGtleXNbaV8xXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhjbHVkZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlfMiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlbl8yID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKytpXzIgPCBsZW5fMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGtleXNbaV8yXTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgX09iai5wcm90b3R5cGUuU2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uICh0YXJnZXQsIHZhbHVlcykge1xyXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWVzKTtcclxuICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBfT2JqO1xyXG59KCkpO1xyXG5leHBvcnRzLl9PYmogPSBfT2JqO1xyXG5leHBvcnRzLk9iaiA9IG5ldyBfT2JqKCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU9iai5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgX1RpbWVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIF9UaW1lcigpIHtcclxuICAgICAgICB0aGlzLl9oYXNQZXJmb3JtYW5jZSA9IHR5cGVvZiAocGVyZm9ybWFuY2UpICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIHRoaXMuU3RhcnQoKTtcclxuICAgIH1cclxuICAgIF9UaW1lci5wcm90b3R5cGUuXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IF9UaW1lcigpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfVGltZXIucHJvdG90eXBlLCBcIlRpbWVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGltZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIF9UaW1lci5wcm90b3R5cGUuTm93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oYXNQZXJmb3JtYW5jZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaHJUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhyVGltZVswXSAqIDEwMDAgKyAoaHJUaW1lWzFdIC8gMWU2KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX1RpbWVyLnByb3RvdHlwZS5TdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbm93ID0gdGhpcy5Ob3coKTtcclxuICAgICAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2xhc3QgPSBub3c7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWUgPSAwO1xyXG4gICAgfTtcclxuICAgIF9UaW1lci5wcm90b3R5cGUuU3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLl9zdGFydDtcclxuICAgICAgICB2YXIgbm93ID0gdGhpcy5Ob3coKTtcclxuICAgICAgICB0aGlzLl9sYXN0ID0gbm93O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lID0gbm93IC0gc3RhcnQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9UaW1lcjtcclxufSgpKTtcclxuZXhwb3J0cy5fVGltZXIgPSBfVGltZXI7XHJcbmV4cG9ydHMuVGltZXIgPSBuZXcgX1RpbWVyKCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRpbWVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBfVXJpID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIF9Vcmkod2luKSB7XHJcbiAgICAgICAgdGhpcy5fd2luZG93ID0gd2luZG93O1xyXG4gICAgICAgIHRoaXMuX2EgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICB0aGlzLmhhc2ggPSBcIlwiO1xyXG4gICAgICAgIHRoaXMucGF0aE5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMucG9ydCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5ob3N0TmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZnVsbCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5hcmdzID0ge307XHJcbiAgICAgICAgdGhpcy5Jbml0KHdpbik7XHJcbiAgICB9XHJcbiAgICBfVXJpLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKHdpbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgX1VyaSh3aW4pO1xyXG4gICAgfTtcclxuICAgIF9VcmkucHJvdG90eXBlLkluaXQgPSBmdW5jdGlvbiAod2luKSB7XHJcbiAgICAgICAgaWYgKHdpbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdyA9IHdpbjtcclxuICAgICAgICAgICAgdGhpcy5fYSA9IHRoaXMuX3dpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgdGhpcy5fYS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHRoaXMuX3dpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgdmFyIGFyZ3NfMSA9IHRoaXMuYXJncztcclxuICAgICAgICAgICAgdGhpcy5fYS5zZWFyY2guc3Vic3RyaW5nKDEpLnNwbGl0KFwiJlwiKS5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gYXJnLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICAgIGFyZ3NfMVtwWzBdXSA9IHBbMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLl9hLmhhc2g7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aE5hbWUgPSB0aGlzLl9hLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLnBvcnQgPSB0aGlzLl9hLnBvcnQ7XHJcbiAgICAgICAgICAgIHRoaXMuaG9zdE5hbWUgPSB0aGlzLl9hLmhvc3RuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gdGhpcy5fYS5wcm90b2NvbDtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLl9hLm9yaWdpbjtcclxuICAgICAgICAgICAgdGhpcy5mdWxsID0gdGhpcy5fYS5ocmVmO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gX1VyaTtcclxufSgpKTtcclxuZXhwb3J0cy5fVXJpID0gX1VyaTtcclxuZXhwb3J0cy5VcmkgPSBuZXcgX1VyaSh3aW5kb3cpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1VcmkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG1kNV8xID0gcmVxdWlyZShcInRzLW1kNS9kaXN0L21kNVwiKTtcclxudmFyIF9VdGlsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIF9VdGlsKHdpbikge1xyXG4gICAgICAgIHRoaXMuX3dpbmRvdyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faW50ID0gMDtcclxuICAgICAgICB0aGlzLkluaXQod2luKTtcclxuICAgIH1cclxuICAgIF9VdGlsLnByb3RvdHlwZS5fID0gZnVuY3Rpb24gKHdpbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgX1V0aWwod2luKTtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuSW5pdCA9IGZ1bmN0aW9uICh3aW4pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh3aW4gPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgKHdpbmRvdykgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB3aW4gPSB3aW5kb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93aW5kb3cgPSB3aW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuQXN5bmMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGltZW91dHMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2VOYW1lID0gXCJ6ZXJvLXRpbWVvdXQtbWVzc2FnZVwiO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRaZXJvVGltZW91dChmbikge1xyXG4gICAgICAgICAgICAgICAgdGltZW91dHMucHVzaChmbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93aW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZU5hbWUsIFwiKlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKChldmVudC5zb3VyY2UpID09PSB1bmRlZmluZWQgfHwgKGV2ZW50LnNvdXJjZSkgPT09IHRoaXMuX3dpbmRvdykgJiYgZXZlbnQuZGF0YSA9PSBtZXNzYWdlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0cy5sZW5ndGggPiAoMCB8IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHRpbWVvdXRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5IYXNXaW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaGFuZGxlTWVzc2FnZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0WmVyb1RpbWVvdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9VdGlsLnByb3RvdHlwZSwgXCJIYXNXaW5kb3dcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93ICE9PSBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9VdGlsLnByb3RvdHlwZSwgXCJIYXNDb25zb2xlXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGFzV2luZG93ICYmIHRoaXMuX3dpbmRvdy5jb25zb2xlICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuVG9BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuSXNBcnJheSA9IGZ1bmN0aW9uIChpdCkge1xyXG4gICAgICAgIHJldHVybiBpdCAmJiAoaXQgaW5zdGFuY2VvZiBBcnJheSB8fCB0eXBlb2YgKGl0KSA9PT0gXCJhcnJheVwiKTtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuSXNFbGVtZW50ID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXQubm9kZVR5cGUgPT09IDEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgX1V0aWwucHJvdG90eXBlLklzRnVuY3Rpb24gPSBmdW5jdGlvbiAoaXQpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0KSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xyXG4gICAgfTtcclxuICAgIF9VdGlsLnByb3RvdHlwZS5HZXRGdW5jdGlvbk5hbWUgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIGlmIChmbi5oYXNPd25Qcm9wZXJ0eShcIm5hbWVcIikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBmbi5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGZuU3RyaW5nID0gZm4udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZm5TdHJpbmcuc3Vic3RyaW5nKDksIGZuU3RyaW5nLmluZGV4T2YoXCIoXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuR2V0RnVuY3Rpb25Db2RlID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICB2YXIgZm5TdHJpbmcgPSBmbi50b1N0cmluZygpO1xyXG4gICAgICAgIHJlc3VsdCA9IGZuU3RyaW5nLnN1YnN0cmluZyhmblN0cmluZy5pbmRleE9mKFwie1wiKSArIDEsIGZuU3RyaW5nLmxhc3RJbmRleE9mKFwifVwiKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuTmV3VVVJRCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgZCArPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XHJcbiAgICAgICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XHJcbiAgICAgICAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIF9VdGlsLnByb3RvdHlwZS5OZXdJbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludCsrO1xyXG4gICAgfTtcclxuICAgIF9VdGlsLnByb3RvdHlwZS5EZWJ1Z2dlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuUGlwZU91dCA9IGZ1bmN0aW9uIChsb2csIHdhcm4sIGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuSGFzQ29uc29sZSkge1xyXG4gICAgICAgICAgICB0aGlzLlByb3h5Rm4odGhpcy5fd2luZG93LmNvbnNvbGUsIFwibG9nXCIsIGZ1bmN0aW9uIChzdXBlcmZuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3VwZXJmbi5hcHBseSh2b2lkIDAsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgbG9nLmFwcGx5KHZvaWQgMCwgYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLlByb3h5Rm4odGhpcy5fd2luZG93LmNvbnNvbGUsIFwid2FyblwiLCBmdW5jdGlvbiAoc3VwZXJmbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1cGVyZm4uYXBwbHkodm9pZCAwLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIHdhcm4uYXBwbHkodm9pZCAwLCBhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuUHJveHlGbih0aGlzLl93aW5kb3cuY29uc29sZSwgXCJlcnJvclwiLCBmdW5jdGlvbiAoc3VwZXJmbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1cGVyZm4uYXBwbHkodm9pZCAwLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIGVycm9yLmFwcGx5KHZvaWQgMCwgYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZSA9IHtcclxuICAgICAgICAgICAgICAgIGxvZzogbG9nLFxyXG4gICAgICAgICAgICAgICAgd2Fybjogd2FybixcclxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuSGFzV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZTogY29uc29sZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpbmRvdyA9IHdpbmRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlID0gY29uc29sZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuQXNzZXJ0ID0gZnVuY3Rpb24gKGFzc2VydGlvbiwgbWVzc2FnZSwgaXNEZWJ1Zykge1xyXG4gICAgICAgIGlmIChpc0RlYnVnID09PSB2b2lkIDApIHsgaXNEZWJ1ZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIGlmICghYXNzZXJ0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkhhc0NvbnNvbGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2luZG93LmNvbnNvbGUuZXJyb3IoXCJBc3NlcnRpb24gZmFpbGVkOiBcIiArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc0RlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRlYnVnZ2VyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuUHJveHlGbiA9IGZ1bmN0aW9uICh0aGF0LCBmbk5hbWUsIHByb3h5Rm4sIG9uUHJvdG90eXBlKSB7XHJcbiAgICAgICAgaWYgKG9uUHJvdG90eXBlID09PSB2b2lkIDApIHsgb25Qcm90b3R5cGUgPSBmYWxzZTsgfVxyXG4gICAgICAgIHZhciBmbiA9IHRoYXRbZm5OYW1lXTtcclxuICAgICAgICB2YXIgX3N1cGVyRm4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGF0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG9uUHJvdG90eXBlICYmIHRoYXQucHJvdG90eXBlICYmIHRoYXQucHJvdG90eXBlW2ZuTmFtZV0pIHtcclxuICAgICAgICAgICAgdGhhdC5wcm90b3R5cGVbZm5OYW1lXSA9IHByb3h5Rm4uYmluZChfc3VwZXJGbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGF0W2ZuTmFtZV0gPSBwcm94eUZuLmJpbmQodGhhdCwgX3N1cGVyRm4pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfVXRpbC5wcm90b3R5cGUuTWQ1ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICAgIHJldHVybiBtZDVfMS5NZDUuaGFzaFN0cihzdHIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfVXRpbDtcclxufSgpKTtcclxuZXhwb3J0cy5fVXRpbCA9IF9VdGlsO1xyXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICB2YXIgd2luZG93ID0gbnVsbDtcclxuICAgIHZhciBjb25zb2xlID0gbnVsbDtcclxufVxyXG5leHBvcnRzLlV0aWwgPSBuZXcgX1V0aWwoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VXRpbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExpc3RfMSA9IHJlcXVpcmUoXCIuLi9zdHJ1Y3QvTGlzdFwiKTtcclxudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoXCIuLi9zdHJ1Y3QvRGljdGlvbmFyeVwiKTtcclxudmFyIFV0aWxfMSA9IHJlcXVpcmUoXCIuLi9VdGlsXCIpO1xyXG52YXIgQXJyXzEgPSByZXF1aXJlKFwiLi4vQXJyXCIpO1xyXG52YXIgSW5pdGFibGVfMSA9IHJlcXVpcmUoXCIuL21peGlucy9Jbml0YWJsZVwiKTtcclxudmFyIEJhc2VDYWNoZU9iamVjdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCYXNlQ2FjaGVPYmplY3QoKSB7XHJcbiAgICAgICAgdGhpcy5LZXkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQmFzZUNhY2hlT2JqZWN0O1xyXG59KCkpO1xyXG5leHBvcnRzLkJhc2VDYWNoZU9iamVjdCA9IEJhc2VDYWNoZU9iamVjdDtcclxuZXhwb3J0cy5fSW5pdGFibGVDYWNoZU9iamVjdCA9IEluaXRhYmxlXzEuZGVmYXVsdChCYXNlQ2FjaGVPYmplY3QpO1xyXG52YXIgQ2FjaGVPYmplY3QgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKENhY2hlT2JqZWN0LCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQ2FjaGVPYmplY3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIENhY2hlT2JqZWN0O1xyXG59KGV4cG9ydHMuX0luaXRhYmxlQ2FjaGVPYmplY3QpKTtcclxuZXhwb3J0cy5DYWNoZU9iamVjdCA9IENhY2hlT2JqZWN0O1xyXG52YXIgQ2FjaGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ2FjaGUoc2l6ZSkge1xyXG4gICAgICAgIGlmIChzaXplID09PSB2b2lkIDApIHsgc2l6ZSA9IENhY2hlLkRFRkFVTFRfRklGT19TSVpFOyB9XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IENhY2hlLkRFRkFVTFRfRklGT19TSVpFO1xyXG4gICAgICAgIHRoaXMuX29yZGVyID0gbmV3IExpc3RfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBEaWN0aW9uYXJ5XzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX3N0YWdlID0gbmV3IERpY3Rpb25hcnlfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2FjaGUucHJvdG90eXBlLCBcIlNpemVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICgodmFsdWUgIT09IHRoaXMuX3NpemUpXHJcbiAgICAgICAgICAgICAgICAmJiAodmFsdWUgPj0gMCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuVHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2FjaGUucHJvdG90eXBlLCBcIkNvdW50XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29yZGVyLkNvdW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENhY2hlLnByb3RvdHlwZSwgXCJTdGFnZUNvdW50XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YWdlLkxpc3QuQ291bnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuSGl0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLkhhcyhrZXkpO1xyXG4gICAgfTtcclxuICAgIENhY2hlLnByb3RvdHlwZS5HZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLkhpdChrZXkpID8gdGhpcy5fZGF0YS5HZXQoa2V5KS5EYXRhIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIENhY2hlLnByb3RvdHlwZS5QdXNoID0gZnVuY3Rpb24gKGtleSwgZGF0YSkge1xyXG4gICAgICAgIHRoaXMuQWRkKGtleSwgZGF0YSk7XHJcbiAgICB9O1xyXG4gICAgQ2FjaGUucHJvdG90eXBlLkdldFN0YWdlZCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX3N0YWdlLkhhcyhrZXkpID8gdGhpcy5fc3RhZ2UuR2V0KGtleSkuRGF0YSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuU3RhZ2UgPSBmdW5jdGlvbiAoa2V5LCBkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhZ2UuU2V0KGtleSwgbmV3IENhY2hlT2JqZWN0KCkuSW5pdCh7IEtleToga2V5LCBEYXRhOiBkYXRhIH0pKTtcclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuUHVibGlzaCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3RhZ2UuSGFzKGtleSkpIHtcclxuICAgICAgICAgICAgdGhpcy5BZGQoa2V5LCB0aGlzLl9zdGFnZS5HZXQoa2V5KS5EYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhZ2UuRGVsZXRlKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIENhY2hlLnByb3RvdHlwZS5SZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuSGl0KGtleSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YS5EZWxldGUoa2V5KTtcclxuICAgICAgICAgICAgdGhpcy5fb3JkZXIuUmVtb3ZlKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIENhY2hlLnByb3RvdHlwZS5DYWNoZSA9IGZ1bmN0aW9uIChvYmosIGZuTmFtZSwga2V5Rm4pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChrZXlGbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGtleUZuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxfMS5VdGlsLk1kNShBcnJfMS5BcnIuUmVkdWNlKGFyZ3MsIGZ1bmN0aW9uIChhY2MsIGN1cikgeyByZXR1cm4gYWNjICs9IEpTT04uc3RyaW5naWZ5KGN1cik7IH0pKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb3h5Rm4gPSBmdW5jdGlvbiAoc3VwZXJGbikge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5Rm4uYXBwbHkodm9pZCAwLCBhcmdzKTtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gbnVsbCAmJiBfdGhpcy5IaXQoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLkdldChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBzdXBlckZuLmFwcGx5KHZvaWQgMCwgYXJncyk7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLkFkZChrZXksIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFV0aWxfMS5VdGlsLlByb3h5Rm4ob2JqLCBmbk5hbWUsIHByb3h5Rm4sIGZhbHNlKTtcclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuQ2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YS5DbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX29yZGVyLkNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fc3RhZ2UuQ2xlYXIoKTtcclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuQWRkID0gZnVuY3Rpb24gKGtleSwgZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLkhpdChrZXkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29yZGVyLlJlbW92ZShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kYXRhLlNldChrZXksIG5ldyBDYWNoZU9iamVjdCgpLkluaXQoeyBLZXk6IGtleSwgRGF0YTogZGF0YSB9KSk7XHJcbiAgICAgICAgdGhpcy5fb3JkZXIuQWRkKGtleSk7XHJcbiAgICAgICAgdGhpcy5UcmltKCk7XHJcbiAgICB9O1xyXG4gICAgQ2FjaGUucHJvdG90eXBlLlRyaW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2hpbGUgKCh0aGlzLl9vcmRlci5Db3VudCA+IHRoaXMuX3NpemUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEuRGVsZXRlKHRoaXMuX29yZGVyLkdldCgwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX29yZGVyLlNoaWZ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBDYWNoZTtcclxufSgpKTtcclxuQ2FjaGUuREVGQVVMVF9GSUZPX1NJWkUgPSAxMDA7XHJcbmV4cG9ydHMuQ2FjaGUgPSBDYWNoZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2FjaGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFBvb2wgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUG9vbChjbHMsIGdyb3d0aFN0ZXApIHtcclxuICAgICAgICBpZiAoZ3Jvd3RoU3RlcCA9PT0gdm9pZCAwKSB7IGdyb3d0aFN0ZXAgPSAxMDsgfVxyXG4gICAgICAgIHRoaXMucG9vbCA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gMDtcclxuICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgICAgIHRoaXMuY2xzID0gY2xzO1xyXG4gICAgICAgIHRoaXMuZ3Jvd3RoU3RlcCA9IGdyb3d0aFN0ZXA7XHJcbiAgICAgICAgdGhpcy5DcmVhdGUoKTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQb29sLnByb3RvdHlwZSwgXCJBdmFpbGFibGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdmFpbGFibGU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUG9vbC5wcm90b3R5cGUsIFwiU2l6ZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpemU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBQb29sLnByb3RvdHlwZS5DcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy5ncm93dGhTdGVwOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wb29sLnB1c2gobmV3IHRoaXMuY2xzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNpemUgKz0gdGhpcy5ncm93dGhTdGVwO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IHRoaXMuZ3Jvd3RoU3RlcDtcclxuICAgIH07XHJcbiAgICBQb29sLnByb3RvdHlwZS5HZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICBpZiAodGhpcy5wb29sLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQgPSB0aGlzLnBvb2wucG9wKCk7XHJcbiAgICAgICAgLS10aGlzLmF2YWlsYWJsZTtcclxuICAgICAgICByZXN1bHQuSW5pdFBvb2wodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBQb29sLnByb3RvdHlwZS5SZWxlYXNlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHRoaXMucG9vbC5wdXNoKG9iaik7XHJcbiAgICAgICAgKyt0aGlzLmF2YWlsYWJsZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUG9vbDtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUG9vbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UG9vbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIE9ial8xID0gcmVxdWlyZShcIi4uLy4uL09ialwiKTtcclxuZnVuY3Rpb24gSW5pdGFibGUoQmFzZSkge1xyXG4gICAgcmV0dXJuIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKGNsYXNzXzEsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gY2xhc3NfMSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5Jbml0ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICBPYmpfMS5PYmouU2V0UHJvcGVydGllcyh0aGlzLCBvYmopO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBjbGFzc18xO1xyXG4gICAgfShCYXNlKSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW5pdGFibGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUluaXRhYmxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5mdW5jdGlvbiBQb29sYWJsZShCYXNlKSB7XHJcbiAgICByZXR1cm4gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoY2xhc3NfMSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBjbGFzc18xKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJncykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuUmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3Bvb2xfXy5SZWxlYXNlKHRoaXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuSW5pdFBvb2wgPSBmdW5jdGlvbiAocG9vbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9fcG9vbF9fID0gcG9vbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBjbGFzc18xO1xyXG4gICAgfShCYXNlKSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gUG9vbGFibGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvb2xhYmxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMaXN0XzEgPSByZXF1aXJlKFwiLi9MaXN0XCIpO1xyXG52YXIgT2JqXzEgPSByZXF1aXJlKFwiLi4vT2JqXCIpO1xyXG52YXIgRGljdGlvbmFyeSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEaWN0aW9uYXJ5KCkge1xyXG4gICAgICAgIHRoaXMuX2xvb2t1cCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2luZGV4ID0ge307XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuSGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb29rdXAuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICAgIH07XHJcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5HZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvb2t1cFtrZXldO1xyXG4gICAgfTtcclxuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLlNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLl9saXN0O1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2luZGV4O1xyXG4gICAgICAgIGlmICh0aGlzLkhhcyhrZXkpKSB7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQoaW5kZXhba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvb2t1cFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIHBvcyA9IGxpc3QuUHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgaW5kZXhba2V5XSA9IHBvcyAtIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuRGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmICh0aGlzLkhhcyhrZXkpKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5faW5kZXhba2V5XTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2luZGV4W2tleV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9sb29rdXBba2V5XTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdC5SZW1vdmVBdChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuQ2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgT2JqXzEuT2JqLldpcGUodGhpcy5fbG9va3VwKTtcclxuICAgICAgICBPYmpfMS5PYmouV2lwZSh0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5DbGVhcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaWN0aW9uYXJ5LnByb3RvdHlwZSwgXCJWYWx1ZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdC5WYWx1ZXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGljdGlvbmFyeS5wcm90b3R5cGUsIFwiS2V5c1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9sb29rdXApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpY3Rpb25hcnkucHJvdG90eXBlLCBcIkxpc3RcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBEaWN0aW9uYXJ5O1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEaWN0aW9uYXJ5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBBcnJfMSA9IHJlcXVpcmUoXCIuLi9BcnJcIik7XHJcbnZhciBPYmpfMSA9IHJlcXVpcmUoXCIuLi9PYmpcIik7XHJcbnZhciBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpc3QoYXJyKSB7XHJcbiAgICAgICAgaWYgKGFyciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FycmF5ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoYXJyIGluc3RhbmNlb2YgKExpc3QpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hcnJheSA9IEFycl8xLkFyci5TaGFsbG93Q29weShhcnIuX2FycmF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FycmF5ID0gQXJyXzEuQXJyLlNoYWxsb3dDb3B5KGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGlzdC5wcm90b3R5cGUsIFwiVmFsdWVzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FycmF5O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgTGlzdC5wcm90b3R5cGUuR2V0ID0gZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcnJheVtwb3NdO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXN0LnByb3RvdHlwZSwgXCJDb3VudFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcnJheS5sZW5ndGg7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBMaXN0LnByb3RvdHlwZS5DbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9hcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLkFkZCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy5fYXJyYXkucHVzaCh2KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5JbnNlcnRBdCA9IGZ1bmN0aW9uIChwb3MsIHYpIHtcclxuICAgICAgICBBcnJfMS5BcnIuSW5zZXJ0QXQodGhpcy5fYXJyYXksIHBvcywgdik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuUHVzaCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FycmF5LnB1c2godik7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuUG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcnJheS5wb3AoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5TaGlmdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXJyYXkuc2hpZnQoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5Db25jYXQgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciBhcnI7XHJcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBMaXN0KSB7XHJcbiAgICAgICAgICAgIGFyciA9IEFycl8xLkFyci5Db25jYXQodGhpcy5fYXJyYXksIHYuX2FycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFyciA9IEFycl8xLkFyci5Db25jYXQodGhpcy5fYXJyYXksIHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IExpc3QoYXJyKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5BcHBlbmQgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgTGlzdCkge1xyXG4gICAgICAgICAgICBBcnJfMS5BcnIuQXBwZW5kKHRoaXMuX2FycmF5LCB2Ll9hcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBBcnJfMS5BcnIuQXBwZW5kKHRoaXMuX2FycmF5LCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuQ29weSA9IGZ1bmN0aW9uIChzcmMpIHtcclxuICAgICAgICBpZiAoc3JjIGluc3RhbmNlb2YgTGlzdCkge1xyXG4gICAgICAgICAgICBBcnJfMS5BcnIuRGVlcENvcHlJbnRvKHNyYy5fYXJyYXksIHRoaXMuX2FycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIEFycl8xLkFyci5EZWVwQ29weUludG8oc3JjLCB0aGlzLl9hcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLlNoYWxsb3dDb3B5ID0gZnVuY3Rpb24gKHNyYykge1xyXG4gICAgICAgIGlmIChzcmMgaW5zdGFuY2VvZiBMaXN0KSB7XHJcbiAgICAgICAgICAgIEFycl8xLkFyci5TaGFsbG93Q29weUludG8oc3JjLl9hcnJheSwgdGhpcy5fYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgQXJyXzEuQXJyLlNoYWxsb3dDb3B5SW50byhzcmMsIHRoaXMuX2FycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuQ2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IEFycl8xLkFyci5EZWVwQ29weSh0aGlzLl9hcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGFycik7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuUmVtb3ZlID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBBcnJfMS5BcnIuUmVtb3ZlT25lQnlFbGVtZW50KHRoaXMuX2FycmF5LCB2KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5SZW1vdmVBdCA9IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgICAgQXJyXzEuQXJyLlJlbW92ZU9uZUF0KHRoaXMuX2FycmF5LCBuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5Gb3JFYWNoID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgQXJyXzEuQXJyLkZvckVhY2godGhpcy5fYXJyYXksIGZuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5VbnRpbCA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgIEFycl8xLkFyci5VbnRpbCh0aGlzLl9hcnJheSwgZm4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLlNvbWUgPSBmdW5jdGlvbiAoZmlsdGVyLCBmbikge1xyXG4gICAgICAgIEFycl8xLkFyci5Tb21lKHRoaXMuX2FycmF5LCBmaWx0ZXIsIGZuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5JbmRleE9mID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gQXJyXzEuQXJyLkluZGV4T2ZFbGVtZW50KHRoaXMuX2FycmF5LCB2KTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5Db250YWlucyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIEFycl8xLkFyci5JbmRleE9mRWxlbWVudCh0aGlzLl9hcnJheSwgdikgIT09IC0xO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLlJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgQXJyXzEuQXJyLlJldmVyc2UodGhpcy5fYXJyYXkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLlNlbGVjdCA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChBcnJfMS5BcnIuRmlsdGVyKHRoaXMuX2FycmF5LCBmbikpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLlNlbGVjdEludG8gPSBmdW5jdGlvbiAoc3JjLCBmbikge1xyXG4gICAgICAgIGlmIChzcmMgaW5zdGFuY2VvZiBMaXN0KSB7XHJcbiAgICAgICAgICAgIEFycl8xLkFyci5GaWx0ZXJJbnRvKHNyYy5fYXJyYXksIHRoaXMuX2FycmF5LCBmbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBBcnJfMS5BcnIuRmlsdGVySW50byhzcmMsIHRoaXMuX2FycmF5LCBmbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLk9yZGVyQnkgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICB0aGlzLl9hcnJheS5zb3J0KGZuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5NYXAgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3QoQXJyXzEuQXJyLk1hcCh0aGlzLl9hcnJheSwgZm4pKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5NYXBJbnRvID0gZnVuY3Rpb24gKHNyYywgZm4pIHtcclxuICAgICAgICBpZiAoc3JjIGluc3RhbmNlb2YgTGlzdCkge1xyXG4gICAgICAgICAgICBBcnJfMS5BcnIuTWFwSW50byhzcmMuX2FycmF5LCB0aGlzLl9hcnJheSwgZm4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgQXJyXzEuQXJyLk1hcEludG8oc3JjLCB0aGlzLl9hcnJheSwgZm4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5SZWR1Y2UgPSBmdW5jdGlvbiAoZm4sIHN0YXJ0KSB7XHJcbiAgICAgICAgcmV0dXJuIEFycl8xLkFyci5SZWR1Y2UodGhpcy5fYXJyYXksIGZuLCBzdGFydCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuRXF1YWxzID0gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gT2JqXzEuT2JqLkVxdWFscyh0aGlzLl9hcnJheSwgYi5WYWx1ZXMpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpc3Q7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpc3Q7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFZlYzJfMSA9IHJlcXVpcmUoXCIuL1ZlYzJcIik7XHJcbnZhciBSZWN0XzEgPSByZXF1aXJlKFwiLi9SZWN0XCIpO1xyXG52YXIgQ2FsY18xID0gcmVxdWlyZShcIi4uL0NhbGNcIik7XHJcbnZhciBSYW5nZTIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUmFuZ2UyKHgsIHksIHcsIGgpIHtcclxuICAgICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7IHggPSAwOyB9XHJcbiAgICAgICAgaWYgKHkgPT09IHZvaWQgMCkgeyB5ID0gMDsgfVxyXG4gICAgICAgIGlmICh3ID09PSB2b2lkIDApIHsgdyA9IDA7IH1cclxuICAgICAgICBpZiAoaCA9PT0gdm9pZCAwKSB7IGggPSAwOyB9XHJcbiAgICAgICAgdGhpcy5wb3MgPSBuZXcgVmVjMl8xLmRlZmF1bHQoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFZlYzJfMS5kZWZhdWx0KHcsIGgpO1xyXG4gICAgfVxyXG4gICAgUmFuZ2UyLnByb3RvdHlwZS5TZXQgPSBmdW5jdGlvbiAoc3JjKSB7XHJcbiAgICAgICAgdGhpcy5wb3MuU2V0KHNyYy5wb3MpO1xyXG4gICAgICAgIHRoaXMuc2l6ZS5TZXQoc3JjLnNpemUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFJhbmdlMi5wcm90b3R5cGUuQ2xvbmUgPSBmdW5jdGlvbiAob3V0KSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG91dCA/IG91dC5TZXQodGhpcykgOiBuZXcgUmFuZ2UyKHRoaXMucG9zLngsIHRoaXMucG9zLnksIHRoaXMuc2l6ZS54LCB0aGlzLnNpemUueSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBSYW5nZTIucHJvdG90eXBlLlRvUmVjdCA9IGZ1bmN0aW9uIChlbmRJbmNsdXNpdmUpIHtcclxuICAgICAgICBpZiAoZW5kSW5jbHVzaXZlID09PSB2b2lkIDApIHsgZW5kSW5jbHVzaXZlID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gbmV3IFJlY3RfMS5kZWZhdWx0KHRoaXMucG9zLngsIHRoaXMucG9zLnksIHRoaXMucG9zLnggLSAoZW5kSW5jbHVzaXZlID8gQ2FsY18xLkNhbGMuU2lnbih0aGlzLnNpemUueCkgOiAwKSArIHRoaXMuc2l6ZS54LCB0aGlzLnBvcy55IC0gKGVuZEluY2x1c2l2ZSA/IENhbGNfMS5DYWxjLlNpZ24odGhpcy5zaXplLnkpIDogMCkgKyB0aGlzLnNpemUueSwgZW5kSW5jbHVzaXZlKTtcclxuICAgIH07XHJcbiAgICBSYW5nZTIucHJvdG90eXBlLlNjYWxlID0gZnVuY3Rpb24gKGZhY3Rvciwga2VlcENlbnRlcikge1xyXG4gICAgICAgIGlmIChrZWVwQ2VudGVyID09PSB2b2lkIDApIHsga2VlcENlbnRlciA9IHRydWU7IH1cclxuICAgICAgICB2YXIgb3JnO1xyXG4gICAgICAgIGlmIChrZWVwQ2VudGVyKSB7XHJcbiAgICAgICAgICAgIG9yZyA9IHRoaXMuc2l6ZS5DbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNpemUuU2NhbGUoZmFjdG9yKTtcclxuICAgICAgICBpZiAoa2VlcENlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5BZGQob3JnLlN1YnRyYWN0KHRoaXMuc2l6ZSkuTXVsdGlwbHkoMC41KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFJhbmdlMi5wcm90b3R5cGUuVHJhbnNsYXRlID0gZnVuY3Rpb24gKHN5c3RlbSkge1xyXG4gICAgICAgIHRoaXMuU2V0KHRoaXMuVG9SZWN0KGZhbHNlKS5UcmFuc2xhdGUoc3lzdGVtKS5Ub1JhbmdlMigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBSYW5nZTIucHJvdG90eXBlLlRvSW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9zLlRvSW50KCk7XHJcbiAgICAgICAgdGhpcy5zaXplLlRvSW50KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgUmFuZ2UyLnByb3RvdHlwZS5Ub0RlY2ltYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wb3MuVG9EZWNpbWFsKCk7XHJcbiAgICAgICAgdGhpcy5zaXplLlRvRGVjaW1hbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFJhbmdlMi5wcm90b3R5cGUuQ29udGFpbnMgPSBmdW5jdGlvbiAodmVjKSB7XHJcbiAgICAgICAgcmV0dXJuIHZlYy54ID49IHRoaXMucG9zLnggJiYgdmVjLnggPD0gdGhpcy5wb3MueCArIHRoaXMuc2l6ZS54IC0gMVxyXG4gICAgICAgICAgICAmJiB2ZWMueSA+PSB0aGlzLnBvcy55ICYmIHZlYy55IDw9IHRoaXMucG9zLnkgKyB0aGlzLnNpemUueSAtIDE7XHJcbiAgICB9O1xyXG4gICAgUmFuZ2UyLnByb3RvdHlwZS5GaXJzdCA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgIHZhciBwID0gbmV3IFZlYzJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMucG9zLng7IGkgPCB0aGlzLnBvcy54ICsgdGhpcy5zaXplLng7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5wb3MueTsgaiA8IHRoaXMucG9zLnkgKyB0aGlzLnNpemUueTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBwLnggPSBpLCBwLnkgPSBqO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZuKHApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUmFuZ2UyLnByb3RvdHlwZS5Gb3JFYWNoID0gZnVuY3Rpb24gKGZuLCBzdGFydCkge1xyXG4gICAgICAgIGlmIChzdGFydCA9PT0gdm9pZCAwKSB7IHN0YXJ0ID0gbnVsbDsgfVxyXG4gICAgICAgIHZhciBwb3MgPSBuZXcgVmVjMl8xLmRlZmF1bHQoKTtcclxuICAgICAgICB2YXIgYmVnaW4gPSB0aGlzLnBvcy5DbG9uZSgpLlRvSW50KCk7XHJcbiAgICAgICAgaWYgKHN0YXJ0ID09PSBudWxsIHx8ICF0aGlzLkNvbnRhaW5zKHN0YXJ0KSkge1xyXG4gICAgICAgICAgICBzdGFydCA9IGJlZ2luO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZW5kID0gdGhpcy5wb3MuQ2xvbmUoKS5BZGQodGhpcy5zaXplKS5Ub0ludCgpO1xyXG4gICAgICAgIGZvciAodmFyIHkgPSBiZWdpbi55OyB5IDwgZW5kLnk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gYmVnaW4ueDsgeCA8IGVuZC54OyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGlmICh5IDwgc3RhcnQueSB8fCAoeSA9PT0gc3RhcnQueSAmJiB4IDwgc3RhcnQueCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBvcy54ID0geDtcclxuICAgICAgICAgICAgICAgIHBvcy55ID0geTtcclxuICAgICAgICAgICAgICAgIHZhciBicmsgPSBmbihwb3MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJyaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBSYW5nZTIucHJvdG90eXBlLkVxdWFscyA9IGZ1bmN0aW9uIChyYW5nZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvcy5FcXVhbHMocmFuZ2UucG9zKSAmJiB0aGlzLnNpemUuRXF1YWxzKHJhbmdlLnNpemUpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSYW5nZTI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFJhbmdlMjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFuZ2UyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBWZWMyXzEgPSByZXF1aXJlKFwiLi9WZWMyXCIpO1xyXG52YXIgUmFuZ2UyXzEgPSByZXF1aXJlKFwiLi9SYW5nZTJcIik7XHJcbnZhciBDYWxjXzEgPSByZXF1aXJlKFwiLi4vQ2FsY1wiKTtcclxudmFyIFNpZ24gPSBDYWxjXzEuQ2FsYy5TaWduO1xyXG52YXIgUmVjdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSZWN0KHgxLCB5MSwgeDIsIHkyLCBlbmRJbmNsdXNpdmUpIHtcclxuICAgICAgICBpZiAoeDEgPT09IHZvaWQgMCkgeyB4MSA9IDA7IH1cclxuICAgICAgICBpZiAoeTEgPT09IHZvaWQgMCkgeyB5MSA9IDA7IH1cclxuICAgICAgICBpZiAoeDIgPT09IHZvaWQgMCkgeyB4MiA9IDA7IH1cclxuICAgICAgICBpZiAoeTIgPT09IHZvaWQgMCkgeyB5MiA9IDA7IH1cclxuICAgICAgICBpZiAoZW5kSW5jbHVzaXZlID09PSB2b2lkIDApIHsgZW5kSW5jbHVzaXZlID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLnN0YXJ0ID0gbmV3IFZlYzJfMS5kZWZhdWx0KHgxLCB5MSk7XHJcbiAgICAgICAgdGhpcy5zdG9wID0gbmV3IFZlYzJfMS5kZWZhdWx0KHgyLCB5Mik7XHJcbiAgICAgICAgdGhpcy5lbmRJbmNsdXNpdmUgPSBlbmRJbmNsdXNpdmU7XHJcbiAgICB9XHJcbiAgICBSZWN0LnByb3RvdHlwZS5TZXQgPSBmdW5jdGlvbiAoc3JjKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydC5TZXQoc3JjLnN0YXJ0KTtcclxuICAgICAgICB0aGlzLnN0b3AuU2V0KHNyYy5zdG9wKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBSZWN0LnByb3RvdHlwZS5DbG9uZSA9IGZ1bmN0aW9uIChvdXQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gb3V0ID8gb3V0LlNldCh0aGlzKSA6IG5ldyBSZWN0KHRoaXMuc3RhcnQueCwgdGhpcy5zdGFydC55LCB0aGlzLnN0b3AueCwgdGhpcy5zdG9wLnkpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgUmVjdC5wcm90b3R5cGUuVG9SYW5nZTIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZTJfMS5kZWZhdWx0KHRoaXMuc3RhcnQueCwgdGhpcy5zdGFydC55LCB0aGlzLnN0b3AueCArICh0aGlzLmVuZEluY2x1c2l2ZSA/IENhbGNfMS5DYWxjLlNpZ24odGhpcy5zdG9wLngpIDogMCkgLSB0aGlzLnN0YXJ0LngsIHRoaXMuc3RvcC55ICsgKHRoaXMuZW5kSW5jbHVzaXZlID8gQ2FsY18xLkNhbGMuU2lnbih0aGlzLnN0b3AueSkgOiAwKSAtIHRoaXMuc3RhcnQueSk7XHJcbiAgICB9O1xyXG4gICAgUmVjdC5wcm90b3R5cGUuU2NhbGUgPSBmdW5jdGlvbiAoZmFjdG9yLCBrZWVwQ2VudGVyKSB7XHJcbiAgICAgICAgaWYgKGtlZXBDZW50ZXIgPT09IHZvaWQgMCkgeyBrZWVwQ2VudGVyID0gdHJ1ZTsgfVxyXG4gICAgICAgIHZhciBvdyA9IHRoaXMuc3RvcC54IC0gdGhpcy5zdGFydC54O1xyXG4gICAgICAgIHZhciBvaCA9IHRoaXMuc3RvcC55IC0gdGhpcy5zdGFydC55O1xyXG4gICAgICAgIHZhciB3ID0gb3c7XHJcbiAgICAgICAgdmFyIGggPSBvaDtcclxuICAgICAgICB3ICo9IGZhY3Rvci54O1xyXG4gICAgICAgIGggKj0gZmFjdG9yLnk7XHJcbiAgICAgICAgaWYgKGtlZXBDZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydC54IC09ICh3IC0gb3cpIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5zdGFydC55IC09IChoIC0gb2gpIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9wLnggPSB0aGlzLnN0YXJ0LnggKyB3O1xyXG4gICAgICAgIHRoaXMuc3RvcC55ID0gdGhpcy5zdGFydC55ICsgaDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBSZWN0LnByb3RvdHlwZS5UcmFuc2xhdGUgPSBmdW5jdGlvbiAoc3lzdGVtKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydC5TY2FsZShzeXN0ZW0pO1xyXG4gICAgICAgIHRoaXMuc3RvcC5TY2FsZShzeXN0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFJlY3QucHJvdG90eXBlLkVxdWFscyA9IGZ1bmN0aW9uIChyZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuRXF1YWxzKHJlY3Quc3RhcnQpICYmIHRoaXMuc3RvcC5FcXVhbHMocmVjdC5zdG9wKTtcclxuICAgIH07XHJcbiAgICBSZWN0LnByb3RvdHlwZS5Ub0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0LlRvSW50KCk7XHJcbiAgICAgICAgdGhpcy5zdG9wLlRvSW50KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgUmVjdC5wcm90b3R5cGUuVG9EZWNpbWFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc3RhcnQuVG9EZWNpbWFsKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wLlRvRGVjaW1hbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFJlY3QucHJvdG90eXBlLkFyZWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLnN0b3AueCAtIHRoaXMuc3RhcnQueDtcclxuICAgICAgICB2YXIgeSA9IHRoaXMuc3RvcC55IC0gdGhpcy5zdGFydC55O1xyXG4gICAgICAgIHJldHVybiB4ICogeTtcclxuICAgIH07XHJcbiAgICBSZWN0LnByb3RvdHlwZS5Nb3ZlID0gZnVuY3Rpb24gKHZlYykge1xyXG4gICAgICAgIHRoaXMuc3RhcnQuQWRkKHZlYyk7XHJcbiAgICAgICAgdGhpcy5zdG9wLkFkZCh2ZWMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSZWN0O1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWN0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMaXN0XzEgPSByZXF1aXJlKFwiLi9MaXN0XCIpO1xyXG52YXIgQXJyXzEgPSByZXF1aXJlKFwiLi4vQXJyXCIpO1xyXG52YXIgREVGQVVMVF9TSVpFID0gMTAwO1xyXG52YXIgU3RhY2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3RhY2soc2l6ZSkge1xyXG4gICAgICAgIGlmIChzaXplID09PSB2b2lkIDApIHsgc2l6ZSA9IERFRkFVTFRfU0laRTsgfVxyXG4gICAgICAgIHRoaXMuX3BvcyA9IDA7XHJcbiAgICAgICAgdGhpcy5fYXJyYXkgPSBuZXcgQXJyYXkoc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhY2sucHJvdG90eXBlLCBcIlZhbHVlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJfMS5BcnIuU2xpY2UodGhpcy5fYXJyYXksIDAsIHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhY2sucHJvdG90eXBlLCBcIkRlcHRoXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5QdXNoID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHRoaXMuX2FycmF5W3RoaXMuX3Bvc10gPSBvYmo7XHJcbiAgICAgICAgdGhpcy5fcG9zKys7XHJcbiAgICB9O1xyXG4gICAgU3RhY2sucHJvdG90eXBlLlBvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5fcG9zICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX2FycmF5Wy0tdGhpcy5fcG9zXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUuVG9MaXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgTGlzdF8xLmRlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3RfMS5kZWZhdWx0KHRoaXMuVmFsdWVzKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RhY2s7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YWNrO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdGFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExpc3RfMSA9IHJlcXVpcmUoXCIuL0xpc3RcIik7XHJcbnZhciBTdGFja18xID0gcmVxdWlyZShcIi4vU3RhY2tcIik7XHJcbnZhciBBcnJfMSA9IHJlcXVpcmUoXCIuLi9BcnJcIik7XHJcbnZhciBVdGlsXzEgPSByZXF1aXJlKFwiLi4vVXRpbFwiKTtcclxudmFyIE9ial8xID0gcmVxdWlyZShcIi4uL09ialwiKTtcclxudmFyIEluaXRhYmxlXzEgPSByZXF1aXJlKFwiLi4vc3RhbmRhcmQvbWl4aW5zL0luaXRhYmxlXCIpO1xyXG52YXIgQmFzZVRyZWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmFzZVRyZWUoKSB7XHJcbiAgICAgICAgdGhpcy5JZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5QYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuQ2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQmFzZVRyZWU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuQmFzZVRyZWUgPSBCYXNlVHJlZTtcclxuZXhwb3J0cy5fSW5pdGFibGVUcmVlID0gSW5pdGFibGVfMS5kZWZhdWx0KEJhc2VUcmVlKTtcclxudmFyIFRyZWUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRyZWUsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUcmVlKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuSWQgPSBfdGhpcy5OZXdJZCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFRyZWUuRnJvbU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gKHRoaXMgaW5zdGFuY2VvZiBUcmVlKSA/IHRoaXMgOiBudWxsO1xyXG4gICAgICAgIHZhciByb290ID0gbmV3IFRyZWUoKS5Jbml0KHsgRGF0YTogb2JqLmRhdGEgIT09IHVuZGVmaW5lZCA/IG9iai5kYXRhIDogbnVsbCwgUGFyZW50OiBwYXJlbnQgfSk7XHJcbiAgICAgICAgaWYgKG9iai5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIFV0aWxfMS5VdGlsLklzQXJyYXkob2JqLmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICByb290LkNoaWxkcmVuID0gbmV3IExpc3RfMS5kZWZhdWx0KEFycl8xLkFyci5NYXAob2JqLmNoaWxkcmVuLCBUcmVlLkZyb21PYmplY3QuYmluZChyb290KSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH07XHJcbiAgICBUcmVlLnByb3RvdHlwZS5OZXdJZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gVXRpbF8xLlV0aWwuTmV3VVVJRCgpO1xyXG4gICAgfTtcclxuICAgIFRyZWUucHJvdG90eXBlLkluc2VydEF0ID0gZnVuY3Rpb24gKHBvcywgZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLkNoaWxkcmVuID09PSBudWxsIHx8IHRoaXMuQ2hpbGRyZW4uQ291bnQgPD0gcG9zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5DaGlsZHJlbi5JbnNlcnRBdChwb3MsIG5ldyBUcmVlKCkuSW5pdCh7IERhdGE6IGRhdGEsIFBhcmVudDogdGhpcyB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFRyZWUucHJvdG90eXBlLkFkZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQ2hpbGRyZW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5DaGlsZHJlbiA9IG5ldyBMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkNoaWxkcmVuLkFkZCgobmV3IFRyZWUoKSkuSW5pdCh7IERhdGE6IGRhdGEsIFBhcmVudDogdGhpcyB9KSk7XHJcbiAgICB9O1xyXG4gICAgVHJlZS5wcm90b3R5cGUuUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLlBhcmVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLlBhcmVudC5DaGlsZHJlbi5SZW1vdmUodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFRyZWUucHJvdG90eXBlLlBydW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLkNoaWxkcmVuICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQ2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5Gb3JFYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xyXG4gICAgICAgICAgICAgICAgZWwuUGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5DbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBUcmVlLnByb3RvdHlwZS5SZWR1Y2UgPSBmdW5jdGlvbiAoZm4sIHN0YXJ0KSB7XHJcbiAgICAgICAgdmFyIHN0YWNrID0gbmV3IFN0YWNrXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBhY2MgPSBzdGFydDtcclxuICAgICAgICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgYWNjID0gMDtcclxuICAgICAgICB2YXIgY3VyO1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHN0YWNrLlB1c2godGhpcyk7XHJcbiAgICAgICAgd2hpbGUgKGN1ciA9IHN0YWNrLlBvcCgpKSB7XHJcbiAgICAgICAgICAgIGFjYyA9IGZuKGFjYywgY3VyLkRhdGEpO1xyXG4gICAgICAgICAgICBpID0gKGN1ci5DaGlsZHJlbiAmJiBjdXIuQ2hpbGRyZW4uQ291bnQpIHx8IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgICAgICAgIHN0YWNrLlB1c2goY3VyLkNoaWxkcmVuLkdldChpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgIH07XHJcbiAgICBUcmVlLnByb3RvdHlwZS5DbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IHRoaXMuY29uc3RydWN0b3IoKTtcclxuICAgICAgICByZXN1bHQuSWQgPSB0aGlzLklkO1xyXG4gICAgICAgIHJlc3VsdC5QYXJlbnQgPSB0aGlzLlBhcmVudDtcclxuICAgICAgICByZXN1bHQuQ2hpbGRyZW4gPSB0aGlzLkNoaWxkcmVuID09PSBudWxsID8gbnVsbCA6IHRoaXMuQ2hpbGRyZW4uQ2xvbmUoKTtcclxuICAgICAgICByZXN1bHQuRGF0YSA9IHRoaXMuRGF0YSA9PT0gbnVsbCB8fCB0aGlzLkRhdGEgPT09IHVuZGVmaW5lZCA/IHRoaXMuRGF0YSA6IE9ial8xLk9iai5DbG9uZSh0aGlzLkRhdGEpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgVHJlZS5wcm90b3R5cGUuRHVwbGljYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IHRoaXMuY29uc3RydWN0b3IoKTtcclxuICAgICAgICByZXN1bHQuSWQgPSB0aGlzLklkO1xyXG4gICAgICAgIHJlc3VsdC5QYXJlbnQgPSB0aGlzLlBhcmVudDtcclxuICAgICAgICByZXN1bHQuQ2hpbGRyZW4gPSB0aGlzLkNoaWxkcmVuO1xyXG4gICAgICAgIHJlc3VsdC5EYXRhID0gdGhpcy5EYXRhO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgVHJlZS5wcm90b3R5cGUuRmlsdGVyID0gZnVuY3Rpb24gKGNvbmRpdGlvbikge1xyXG4gICAgICAgIHZhciByb290ID0gdGhpcy5EdXBsaWNhdGVOb2RlKCk7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5DaGlsZHJlbjtcclxuICAgICAgICBpZiAoY2hpbGRyZW4gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcm9vdC5DaGlsZHJlbiA9XHJcbiAgICAgICAgICAgICAgICByb290LkNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgLlNlbGVjdChjb25kaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgLk1hcChmdW5jdGlvbiAoZWwsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuRmlsdGVyKGNvbmRpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9O1xyXG4gICAgVHJlZS5wcm90b3R5cGUuU2VsZWN0ID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgYWNjKSB7XHJcbiAgICAgICAgaWYgKGFjYyA9PT0gdm9pZCAwKSB7IGFjYyA9IG5ldyBMaXN0XzEuZGVmYXVsdCgpOyB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFjYztcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLkNoaWxkcmVuO1xyXG4gICAgICAgIGlmIChjb25kaXRpb24gPT09IHVuZGVmaW5lZCB8fCBjb25kaXRpb24odGhpcykpIHtcclxuICAgICAgICAgICAgcmVzdWx0LkFkZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLlJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXIuU2VsZWN0KGNvbmRpdGlvbiwgYWNjKTtcclxuICAgICAgICAgICAgfSwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBUcmVlLnByb3RvdHlwZS5GaW5kID0gZnVuY3Rpb24gKGNvbmRpdGlvbikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuQ2hpbGRyZW47XHJcbiAgICAgICAgaWYgKGNoaWxkcmVuICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSB0aGlzLkNoaWxkcmVuLkNvdW50O1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5DaGlsZHJlbi5WYWx1ZXM7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24odmFsW2ldLkRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsW2ldLkNoaWxkcmVuICE9PSBudWxsID8gdmFsW2ldLkZpbmQoY29uZGl0aW9uKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBUcmVlLnByb3RvdHlwZS5Db250YWlucyA9IGZ1bmN0aW9uIChjb25kaXRpb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5GaW5kKGNvbmRpdGlvbikgIT09IG51bGw7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFRyZWU7XHJcbn0oZXhwb3J0cy5fSW5pdGFibGVUcmVlKSk7XHJcbmV4cG9ydHMuVHJlZSA9IFRyZWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIENhbGNfMSA9IHJlcXVpcmUoXCIuLi9DYWxjXCIpO1xyXG52YXIgVmVjMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWMyKHgsIHkpIHtcclxuICAgICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7IHggPSAwOyB9XHJcbiAgICAgICAgaWYgKHkgPT09IHZvaWQgMCkgeyB5ID0gMDsgfVxyXG4gICAgICAgIHRoaXMuQW5nbGUgPSB0aGlzLkhvcml6b250YWxBbmdsZTtcclxuICAgICAgICB0aGlzLkRpcmVjdGlvbiA9IHRoaXMuSG9yaXpvbnRhbEFuZ2xlO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuICAgIFZlYzIucHJvdG90eXBlLlNldCA9IGZ1bmN0aW9uIChzcmMpIHtcclxuICAgICAgICB0aGlzLnggPSBzcmMueDtcclxuICAgICAgICB0aGlzLnkgPSBzcmMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWMyLnByb3RvdHlwZS5DbG9uZSA9IGZ1bmN0aW9uIChvdXQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gb3V0ID8gb3V0LlNldCh0aGlzKSA6IG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLlRvSW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMueCB8PSAwO1xyXG4gICAgICAgIHRoaXMueSB8PSAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLkNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5jZWlsKHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5jZWlsKHRoaXMueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuVG9EZWNpbWFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMueCArPSBWZWMyLkVQU0lMT047XHJcbiAgICAgICAgdGhpcy55ICs9IFZlYzIuRVBTSUxPTjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWMyLnByb3RvdHlwZS5MZW5ndGhTcSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpOyB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuTGVuZ3RoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuTGVuZ3RoU3EoKSk7IH07XHJcbiAgICBWZWMyLnByb3RvdHlwZS5Ib3Jpem9udGFsQW5nbGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTsgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLlJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSkge1xyXG4gICAgICAgIHZhciByb3QgPSBDYWxjXzEuQ2FsYy5Sb3RhdGlvblJhZChhbmdsZSk7XHJcbiAgICAgICAgdmFyIG54ID0gKHRoaXMueCAqIHJvdFswXSkgLSAodGhpcy55ICogcm90WzFdKTtcclxuICAgICAgICB2YXIgbnkgPSAodGhpcy54ICogcm90WzFdKSArICh0aGlzLnkgKiByb3RbMF0pO1xyXG4gICAgICAgIHRoaXMueCA9IG54O1xyXG4gICAgICAgIHRoaXMueSA9IG55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLlJvdGF0ZUFyb3VuZCA9IGZ1bmN0aW9uIChjZW50ZXIsIGFuZ2xlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuU3VidHJhY3QoY2VudGVyKS5Sb3RhdGUoYW5nbGUpLkFkZChjZW50ZXIpO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLk5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGVuID0gdGhpcy5MZW5ndGgoKTtcclxuICAgICAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnggLyBsZW47XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHRoaXMueSAvIGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuU2NhbGUgPSBmdW5jdGlvbiAodmVjdG9yQikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHZlY3RvckIueDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKiB2ZWN0b3JCLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuUmVsYXRlID0gZnVuY3Rpb24gKHZlY3RvckIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLyB2ZWN0b3JCLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55IC8gdmVjdG9yQi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLk11bHRpcGx5ID0gZnVuY3Rpb24gKHNjYWxhcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKiBzY2FsYXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuQWRkID0gZnVuY3Rpb24gKHZlY3RvckIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggKyB2ZWN0b3JCLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICsgdmVjdG9yQi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLlN1YnRyYWN0ID0gZnVuY3Rpb24gKHZlY3RvckIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSB2ZWN0b3JCLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55IC0gdmVjdG9yQi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLkludmVydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuRXF1YWxzID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHRhcmdldC54ICYmIHRoaXMueSA9PT0gdGFyZ2V0Lnk7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuQWxtb3N0RXF1YWxzID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLnggLSB0YXJnZXQueCkgPCBWZWMyLkVQU0lMT04gJiYgTWF0aC5hYnModGhpcy55IC0gdGFyZ2V0LnkpIDwgVmVjMi5FUFNJTE9OO1xyXG4gICAgfTtcclxuICAgIFZlYzIucHJvdG90eXBlLkdldE5vcm1hbCA9IGZ1bmN0aW9uIChpc05vcm1hbGl6ZWQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5DbG9uZSgpO1xyXG4gICAgICAgIGlmICghaXNOb3JtYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5TZXQodGhpcykuTm9ybWFsaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0ZW1wID0gcmVzdWx0Lng7XHJcbiAgICAgICAgcmVzdWx0LnggPSByZXN1bHQueTtcclxuICAgICAgICByZXN1bHQueSA9IC10ZW1wO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuRG90ID0gZnVuY3Rpb24gKHZlY3RvckIpIHsgcmV0dXJuICh0aGlzLnggKiB2ZWN0b3JCLnggKyB0aGlzLnkgKiB2ZWN0b3JCLnkpOyB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuQ3Jvc3MgPSBmdW5jdGlvbiAodmVjdG9yQikgeyByZXR1cm4gKCh0aGlzLnggKiB2ZWN0b3JCLnkpIC0gKHRoaXMueSAqIHZlY3RvckIueCkpOyB9O1xyXG4gICAgVmVjMi5wcm90b3R5cGUuUHJvamVjdE9udG8gPSBmdW5jdGlvbiAodmVjdG9yQikge1xyXG4gICAgICAgIHZhciBjb2VmZiA9ICgodGhpcy54ICogdmVjdG9yQi54KSArICh0aGlzLnkgKiB2ZWN0b3JCLnkpKSAvICgodmVjdG9yQi54ICogdmVjdG9yQi54KSArICh2ZWN0b3JCLnkgKiB2ZWN0b3JCLnkpKTtcclxuICAgICAgICB0aGlzLnggPSBjb2VmZiAqIHZlY3RvckIueDtcclxuICAgICAgICB0aGlzLnkgPSBjb2VmZiAqIHZlY3RvckIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWMyLnByb3RvdHlwZS5WZXJ0aWNhbEFuZ2xlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gTWF0aC5hdGFuMih0aGlzLngsIHRoaXMueSk7IH07XHJcbiAgICBWZWMyLnByb3RvdHlwZS5Sb3RhdGVCeSA9IGZ1bmN0aW9uIChyb3RhdGlvbikge1xyXG4gICAgICAgIHZhciBhbmdsZSA9IC10aGlzLkhvcml6b250YWxBbmdsZSgpICsgcm90YXRpb247XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUm90YXRlKGFuZ2xlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjMjtcclxufSgpKTtcclxuVmVjMi5FUFNJTE9OID0gMWUtODtcclxuVmVjMi5JREVOVElUWSA9IG5ldyBWZWMyKDEsIDEpO1xyXG5WZWMyLlhfRElNID0gbmV3IFZlYzIoMSwgMCk7XHJcblZlYzIuWV9ESU0gPSBuZXcgVmVjMigwLCAxKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gVmVjMjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VmVjMi5qcy5tYXAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLypcblxuVHlwZVNjcmlwdCBNZDVcbj09PT09PT09PT09PT09XG5cbkJhc2VkIG9uIHdvcmsgYnlcbiogSm9zZXBoIE15ZXJzOiBodHRwOi8vd3d3Lm15ZXJzZGFpbHkub3JnL2pvc2VwaC9qYXZhc2NyaXB0L21kNS10ZXh0Lmh0bWxcbiogQW5kcsOpIENydXo6IGh0dHBzOi8vZ2l0aHViLmNvbS9zYXRhem9yL1NwYXJrTUQ1XG4qIFJheW1vbmQgSGlsbDogaHR0cHM6Ly9naXRodWIuY29tL2dvcmhpbGwveWFtZDUuanNcblxuRWZmZWN0aXZlbHkgYSBUeXBlU2NyeXB0IHJlLXdyaXRlIG9mIFJheW1vbmQgSGlsbCBKUyBMaWJyYXJ5XG5cblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKEMpIDIwMTQgUmF5bW9uZCBIaWxsXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuXG5cbiAgICAgICAgICAgIERPIFdIQVQgVEhFIEZVQ0sgWU9VIFdBTlQgVE8gUFVCTElDIExJQ0VOU0VcbiAgICAgICAgICAgICAgICAgICAgVmVyc2lvbiAyLCBEZWNlbWJlciAyMDA0XG5cbiBDb3B5cmlnaHQgKEMpIDIwMTUgQW5kcsOpIENydXogPGFtZGZjcnV6QGdtYWlsLmNvbT5cblxuIEV2ZXJ5b25lIGlzIHBlcm1pdHRlZCB0byBjb3B5IGFuZCBkaXN0cmlidXRlIHZlcmJhdGltIG9yIG1vZGlmaWVkXG4gY29waWVzIG9mIHRoaXMgbGljZW5zZSBkb2N1bWVudCwgYW5kIGNoYW5naW5nIGl0IGlzIGFsbG93ZWQgYXMgbG9uZ1xuIGFzIHRoZSBuYW1lIGlzIGNoYW5nZWQuXG5cbiAgICAgICAgICAgIERPIFdIQVQgVEhFIEZVQ0sgWU9VIFdBTlQgVE8gUFVCTElDIExJQ0VOU0VcbiAgIFRFUk1TIEFORCBDT05ESVRJT05TIEZPUiBDT1BZSU5HLCBESVNUUklCVVRJT04gQU5EIE1PRElGSUNBVElPTlxuXG4gIDAuIFlvdSBqdXN0IERPIFdIQVQgVEhFIEZVQ0sgWU9VIFdBTlQgVE8uXG4gIFxuXG4qL1xudmFyIE1kNSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWQ1KCkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBJbnQzMkFycmF5KDQpO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNjgpO1xuICAgICAgICB0aGlzLl9idWZmZXI4ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fYnVmZmVyLCAwLCA2OCk7XG4gICAgICAgIHRoaXMuX2J1ZmZlcjMyID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuX2J1ZmZlciwgMCwgMTcpO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICAgIC8vIE9uZSB0aW1lIGhhc2hpbmcgZnVuY3Rpb25zXG4gICAgTWQ1Lmhhc2hTdHIgPSBmdW5jdGlvbiAoc3RyLCByYXcpIHtcbiAgICAgICAgaWYgKHJhdyA9PT0gdm9pZCAwKSB7IHJhdyA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiB0aGlzLm9uZVBhc3NIYXNoZXJcbiAgICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgICAuYXBwZW5kU3RyKHN0cilcbiAgICAgICAgICAgIC5lbmQocmF3KTtcbiAgICB9O1xuICAgIDtcbiAgICBNZDUuaGFzaEFzY2lpU3RyID0gZnVuY3Rpb24gKHN0ciwgcmF3KSB7XG4gICAgICAgIGlmIChyYXcgPT09IHZvaWQgMCkgeyByYXcgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gdGhpcy5vbmVQYXNzSGFzaGVyXG4gICAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAgICAgLmFwcGVuZEFzY2lpU3RyKHN0cilcbiAgICAgICAgICAgIC5lbmQocmF3KTtcbiAgICB9O1xuICAgIDtcbiAgICBNZDUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9kYXRhTGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fYnVmZmVyTGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fc3RhdGUuc2V0KE1kNS5zdGF0ZUlkZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvLyBDaGFyIHRvIGNvZGUgcG9pbnQgdG8gdG8gYXJyYXkgY29udmVyc2lvbjpcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvY2hhckNvZGVBdFxuICAgIC8vICNFeGFtcGxlLjNBX0ZpeGluZ19jaGFyQ29kZUF0X3RvX2hhbmRsZV9ub24tQmFzaWMtTXVsdGlsaW5ndWFsLVBsYW5lX2NoYXJhY3RlcnNfaWZfdGhlaXJfcHJlc2VuY2VfZWFybGllcl9pbl90aGVfc3RyaW5nX2lzX3Vua25vd25cbiAgICBNZDUucHJvdG90eXBlLmFwcGVuZFN0ciA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgdmFyIGJ1ZjggPSB0aGlzLl9idWZmZXI4LCBidWYzMiA9IHRoaXMuX2J1ZmZlcjMyLCBidWZMZW4gPSB0aGlzLl9idWZmZXJMZW5ndGgsIGNvZGUsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSBjb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA8IDB4ODAwKSB7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSAoY29kZSA+Pj4gNikgKyAweEMwO1xuICAgICAgICAgICAgICAgIGJ1ZjhbYnVmTGVuKytdID0gY29kZSAmIDB4M0YgfCAweDgwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA8IDB4RDgwMCB8fCBjb2RlID4gMHhEQkZGKSB7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSAoY29kZSA+Pj4gMTIpICsgMHhFMDtcbiAgICAgICAgICAgICAgICBidWY4W2J1ZkxlbisrXSA9IChjb2RlID4+PiA2ICYgMHgzRikgfCAweDgwO1xuICAgICAgICAgICAgICAgIGJ1ZjhbYnVmTGVuKytdID0gKGNvZGUgJiAweDNGKSB8IDB4ODA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb2RlID0gKChjb2RlIC0gMHhEODAwKSAqIDB4NDAwKSArIChzdHIuY2hhckNvZGVBdCgrK2kpIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPiAweDEwRkZGRikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnVW5pY29kZSBzdGFuZGFyZCBzdXBwb3J0cyBjb2RlIHBvaW50cyB1cCB0byBVKzEwRkZGRic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJ1ZjhbYnVmTGVuKytdID0gKGNvZGUgPj4+IDE4KSArIDB4RjA7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSAoY29kZSA+Pj4gMTIgJiAweDNGKSB8IDB4ODA7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSAoY29kZSA+Pj4gNiAmIDB4M0YpIHwgMHg4MDtcbiAgICAgICAgICAgICAgICBidWY4W2J1ZkxlbisrXSA9IChjb2RlICYgMHgzRikgfCAweDgwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1ZkxlbiA+PSA2NCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFMZW5ndGggKz0gNjQ7XG4gICAgICAgICAgICAgICAgTWQ1Ll9tZDVjeWNsZSh0aGlzLl9zdGF0ZSwgYnVmMzIpO1xuICAgICAgICAgICAgICAgIGJ1ZkxlbiAtPSA2NDtcbiAgICAgICAgICAgICAgICBidWYzMlswXSA9IGJ1ZjMyWzE2XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBidWZMZW47XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTWQ1LnByb3RvdHlwZS5hcHBlbmRBc2NpaVN0ciA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgdmFyIGJ1ZjggPSB0aGlzLl9idWZmZXI4LCBidWYzMiA9IHRoaXMuX2J1ZmZlcjMyLCBidWZMZW4gPSB0aGlzLl9idWZmZXJMZW5ndGgsIGksIGogPSAwO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBpID0gTWF0aC5taW4oc3RyLmxlbmd0aCAtIGosIDY0IC0gYnVmTGVuKTtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBidWY4W2J1ZkxlbisrXSA9IHN0ci5jaGFyQ29kZUF0KGorKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVmTGVuIDwgNjQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2RhdGFMZW5ndGggKz0gNjQ7XG4gICAgICAgICAgICBNZDUuX21kNWN5Y2xlKHRoaXMuX3N0YXRlLCBidWYzMik7XG4gICAgICAgICAgICBidWZMZW4gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IGJ1ZkxlbjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBNZDUucHJvdG90eXBlLmFwcGVuZEJ5dGVBcnJheSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICB2YXIgYnVmOCA9IHRoaXMuX2J1ZmZlcjgsIGJ1ZjMyID0gdGhpcy5fYnVmZmVyMzIsIGJ1ZkxlbiA9IHRoaXMuX2J1ZmZlckxlbmd0aCwgaSwgaiA9IDA7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGkgPSBNYXRoLm1pbihpbnB1dC5sZW5ndGggLSBqLCA2NCAtIGJ1Zkxlbik7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgYnVmOFtidWZMZW4rK10gPSBpbnB1dFtqKytdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1ZkxlbiA8IDY0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9kYXRhTGVuZ3RoICs9IDY0O1xuICAgICAgICAgICAgTWQ1Ll9tZDVjeWNsZSh0aGlzLl9zdGF0ZSwgYnVmMzIpO1xuICAgICAgICAgICAgYnVmTGVuID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBidWZMZW47XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTWQ1LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBzID0gc2VsZi5fc3RhdGU7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBidWZmZXI6IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgc2VsZi5fYnVmZmVyOCksXG4gICAgICAgICAgICBidWZsZW46IHNlbGYuX2J1ZmZlckxlbmd0aCxcbiAgICAgICAgICAgIGxlbmd0aDogc2VsZi5fZGF0YUxlbmd0aCxcbiAgICAgICAgICAgIHN0YXRlOiBbc1swXSwgc1sxXSwgc1syXSwgc1szXV1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIE1kNS5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGJ1ZiA9IHN0YXRlLmJ1ZmZlciwgeCA9IHN0YXRlLnN0YXRlLCBzID0gdGhpcy5fc3RhdGUsIGk7XG4gICAgICAgIHRoaXMuX2RhdGFMZW5ndGggPSBzdGF0ZS5sZW5ndGg7XG4gICAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IHN0YXRlLmJ1ZmxlbjtcbiAgICAgICAgc1swXSA9IHhbMF07XG4gICAgICAgIHNbMV0gPSB4WzFdO1xuICAgICAgICBzWzJdID0geFsyXTtcbiAgICAgICAgc1szXSA9IHhbM107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlcjhbaV0gPSBidWYuY2hhckNvZGVBdChpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWQ1LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAocmF3KSB7XG4gICAgICAgIGlmIChyYXcgPT09IHZvaWQgMCkgeyByYXcgPSBmYWxzZTsgfVxuICAgICAgICB2YXIgYnVmTGVuID0gdGhpcy5fYnVmZmVyTGVuZ3RoLCBidWY4ID0gdGhpcy5fYnVmZmVyOCwgYnVmMzIgPSB0aGlzLl9idWZmZXIzMiwgaSA9IChidWZMZW4gPj4gMikgKyAxLCBkYXRhQml0c0xlbjtcbiAgICAgICAgdGhpcy5fZGF0YUxlbmd0aCArPSBidWZMZW47XG4gICAgICAgIGJ1ZjhbYnVmTGVuXSA9IDB4ODA7XG4gICAgICAgIGJ1ZjhbYnVmTGVuICsgMV0gPSBidWY4W2J1ZkxlbiArIDJdID0gYnVmOFtidWZMZW4gKyAzXSA9IDA7XG4gICAgICAgIGJ1ZjMyLnNldChNZDUuYnVmZmVyMzJJZGVudGl0eS5zdWJhcnJheShpKSwgaSk7XG4gICAgICAgIGlmIChidWZMZW4gPiA1NSkge1xuICAgICAgICAgICAgTWQ1Ll9tZDVjeWNsZSh0aGlzLl9zdGF0ZSwgYnVmMzIpO1xuICAgICAgICAgICAgYnVmMzIuc2V0KE1kNS5idWZmZXIzMklkZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyB0aGUgZmluYWwgY29tcHV0YXRpb24gYmFzZWQgb24gdGhlIHRhaWwgYW5kIGxlbmd0aFxuICAgICAgICAvLyBCZXdhcmUgdGhhdCB0aGUgZmluYWwgbGVuZ3RoIG1heSBub3QgZml0IGluIDMyIGJpdHMgc28gd2UgdGFrZSBjYXJlIG9mIHRoYXRcbiAgICAgICAgZGF0YUJpdHNMZW4gPSB0aGlzLl9kYXRhTGVuZ3RoICogODtcbiAgICAgICAgaWYgKGRhdGFCaXRzTGVuIDw9IDB4RkZGRkZGRkYpIHtcbiAgICAgICAgICAgIGJ1ZjMyWzE0XSA9IGRhdGFCaXRzTGVuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBkYXRhQml0c0xlbi50b1N0cmluZygxNikubWF0Y2goLyguKj8pKC57MCw4fSkkLyksIGxvID0gcGFyc2VJbnQobWF0Y2hlc1syXSwgMTYpLCBoaSA9IHBhcnNlSW50KG1hdGNoZXNbMV0sIDE2KSB8fCAwO1xuICAgICAgICAgICAgYnVmMzJbMTRdID0gbG87XG4gICAgICAgICAgICBidWYzMlsxNV0gPSBoaTtcbiAgICAgICAgfVxuICAgICAgICBNZDUuX21kNWN5Y2xlKHRoaXMuX3N0YXRlLCBidWYzMik7XG4gICAgICAgIHJldHVybiByYXcgPyB0aGlzLl9zdGF0ZSA6IE1kNS5faGV4KHRoaXMuX3N0YXRlKTtcbiAgICB9O1xuICAgIE1kNS5faGV4ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGhjID0gTWQ1LmhleENoYXJzLCBobyA9IE1kNS5oZXhPdXQsIG4sIG9mZnNldCwgaiwgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gaSAqIDg7XG4gICAgICAgICAgICBuID0geFtpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA4OyBqICs9IDIpIHtcbiAgICAgICAgICAgICAgICBob1tvZmZzZXQgKyAxICsgal0gPSBoYy5jaGFyQXQobiAmIDB4MEYpO1xuICAgICAgICAgICAgICAgIG4gPj4+PSA0O1xuICAgICAgICAgICAgICAgIGhvW29mZnNldCArIDAgKyBqXSA9IGhjLmNoYXJBdChuICYgMHgwRik7XG4gICAgICAgICAgICAgICAgbiA+Pj49IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhvLmpvaW4oJycpO1xuICAgIH07XG4gICAgTWQ1Ll9tZDVjeWNsZSA9IGZ1bmN0aW9uICh4LCBrKSB7XG4gICAgICAgIHZhciBhID0geFswXSwgYiA9IHhbMV0sIGMgPSB4WzJdLCBkID0geFszXTtcbiAgICAgICAgLy8gZmYoKVxuICAgICAgICBhICs9IChiICYgYyB8IH5iICYgZCkgKyBrWzBdIC0gNjgwODc2OTM2IHwgMDtcbiAgICAgICAgYSA9IChhIDw8IDcgfCBhID4+PiAyNSkgKyBiIHwgMDtcbiAgICAgICAgZCArPSAoYSAmIGIgfCB+YSAmIGMpICsga1sxXSAtIDM4OTU2NDU4NiB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMiB8IGQgPj4+IDIwKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkICYgYSB8IH5kICYgYikgKyBrWzJdICsgNjA2MTA1ODE5IHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE3IHwgYyA+Pj4gMTUpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGMgJiBkIHwgfmMgJiBhKSArIGtbM10gLSAxMDQ0NTI1MzMwIHwgMDtcbiAgICAgICAgYiA9IChiIDw8IDIyIHwgYiA+Pj4gMTApICsgYyB8IDA7XG4gICAgICAgIGEgKz0gKGIgJiBjIHwgfmIgJiBkKSArIGtbNF0gLSAxNzY0MTg4OTcgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNyB8IGEgPj4+IDI1KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhICYgYiB8IH5hICYgYykgKyBrWzVdICsgMTIwMDA4MDQyNiB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMiB8IGQgPj4+IDIwKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkICYgYSB8IH5kICYgYikgKyBrWzZdIC0gMTQ3MzIzMTM0MSB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNyB8IGMgPj4+IDE1KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjICYgZCB8IH5jICYgYSkgKyBrWzddIC0gNDU3MDU5ODMgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjIgfCBiID4+PiAxMCkgKyBjIHwgMDtcbiAgICAgICAgYSArPSAoYiAmIGMgfCB+YiAmIGQpICsga1s4XSArIDE3NzAwMzU0MTYgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNyB8IGEgPj4+IDI1KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhICYgYiB8IH5hICYgYykgKyBrWzldIC0gMTk1ODQxNDQxNyB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMiB8IGQgPj4+IDIwKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkICYgYSB8IH5kICYgYikgKyBrWzEwXSAtIDQyMDYzIHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE3IHwgYyA+Pj4gMTUpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGMgJiBkIHwgfmMgJiBhKSArIGtbMTFdIC0gMTk5MDQwNDE2MiB8IDA7XG4gICAgICAgIGIgPSAoYiA8PCAyMiB8IGIgPj4+IDEwKSArIGMgfCAwO1xuICAgICAgICBhICs9IChiICYgYyB8IH5iICYgZCkgKyBrWzEyXSArIDE4MDQ2MDM2ODIgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNyB8IGEgPj4+IDI1KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhICYgYiB8IH5hICYgYykgKyBrWzEzXSAtIDQwMzQxMTAxIHwgMDtcbiAgICAgICAgZCA9IChkIDw8IDEyIHwgZCA+Pj4gMjApICsgYSB8IDA7XG4gICAgICAgIGMgKz0gKGQgJiBhIHwgfmQgJiBiKSArIGtbMTRdIC0gMTUwMjAwMjI5MCB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNyB8IGMgPj4+IDE1KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjICYgZCB8IH5jICYgYSkgKyBrWzE1XSArIDEyMzY1MzUzMjkgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjIgfCBiID4+PiAxMCkgKyBjIHwgMDtcbiAgICAgICAgLy8gZ2coKVxuICAgICAgICBhICs9IChiICYgZCB8IGMgJiB+ZCkgKyBrWzFdIC0gMTY1Nzk2NTEwIHwgMDtcbiAgICAgICAgYSA9IChhIDw8IDUgfCBhID4+PiAyNykgKyBiIHwgMDtcbiAgICAgICAgZCArPSAoYSAmIGMgfCBiICYgfmMpICsga1s2XSAtIDEwNjk1MDE2MzIgfCAwO1xuICAgICAgICBkID0gKGQgPDwgOSB8IGQgPj4+IDIzKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkICYgYiB8IGEgJiB+YikgKyBrWzExXSArIDY0MzcxNzcxMyB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNCB8IGMgPj4+IDE4KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjICYgYSB8IGQgJiB+YSkgKyBrWzBdIC0gMzczODk3MzAyIHwgMDtcbiAgICAgICAgYiA9IChiIDw8IDIwIHwgYiA+Pj4gMTIpICsgYyB8IDA7XG4gICAgICAgIGEgKz0gKGIgJiBkIHwgYyAmIH5kKSArIGtbNV0gLSA3MDE1NTg2OTEgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNSB8IGEgPj4+IDI3KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhICYgYyB8IGIgJiB+YykgKyBrWzEwXSArIDM4MDE2MDgzIHwgMDtcbiAgICAgICAgZCA9IChkIDw8IDkgfCBkID4+PiAyMykgKyBhIHwgMDtcbiAgICAgICAgYyArPSAoZCAmIGIgfCBhICYgfmIpICsga1sxNV0gLSA2NjA0NzgzMzUgfCAwO1xuICAgICAgICBjID0gKGMgPDwgMTQgfCBjID4+PiAxOCkgKyBkIHwgMDtcbiAgICAgICAgYiArPSAoYyAmIGEgfCBkICYgfmEpICsga1s0XSAtIDQwNTUzNzg0OCB8IDA7XG4gICAgICAgIGIgPSAoYiA8PCAyMCB8IGIgPj4+IDEyKSArIGMgfCAwO1xuICAgICAgICBhICs9IChiICYgZCB8IGMgJiB+ZCkgKyBrWzldICsgNTY4NDQ2NDM4IHwgMDtcbiAgICAgICAgYSA9IChhIDw8IDUgfCBhID4+PiAyNykgKyBiIHwgMDtcbiAgICAgICAgZCArPSAoYSAmIGMgfCBiICYgfmMpICsga1sxNF0gLSAxMDE5ODAzNjkwIHwgMDtcbiAgICAgICAgZCA9IChkIDw8IDkgfCBkID4+PiAyMykgKyBhIHwgMDtcbiAgICAgICAgYyArPSAoZCAmIGIgfCBhICYgfmIpICsga1szXSAtIDE4NzM2Mzk2MSB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNCB8IGMgPj4+IDE4KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjICYgYSB8IGQgJiB+YSkgKyBrWzhdICsgMTE2MzUzMTUwMSB8IDA7XG4gICAgICAgIGIgPSAoYiA8PCAyMCB8IGIgPj4+IDEyKSArIGMgfCAwO1xuICAgICAgICBhICs9IChiICYgZCB8IGMgJiB+ZCkgKyBrWzEzXSAtIDE0NDQ2ODE0NjcgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNSB8IGEgPj4+IDI3KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhICYgYyB8IGIgJiB+YykgKyBrWzJdIC0gNTE0MDM3ODQgfCAwO1xuICAgICAgICBkID0gKGQgPDwgOSB8IGQgPj4+IDIzKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkICYgYiB8IGEgJiB+YikgKyBrWzddICsgMTczNTMyODQ3MyB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNCB8IGMgPj4+IDE4KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjICYgYSB8IGQgJiB+YSkgKyBrWzEyXSAtIDE5MjY2MDc3MzQgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjAgfCBiID4+PiAxMikgKyBjIHwgMDtcbiAgICAgICAgLy8gaGgoKVxuICAgICAgICBhICs9IChiIF4gYyBeIGQpICsga1s1XSAtIDM3ODU1OCB8IDA7XG4gICAgICAgIGEgPSAoYSA8PCA0IHwgYSA+Pj4gMjgpICsgYiB8IDA7XG4gICAgICAgIGQgKz0gKGEgXiBiIF4gYykgKyBrWzhdIC0gMjAyMjU3NDQ2MyB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMSB8IGQgPj4+IDIxKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkIF4gYSBeIGIpICsga1sxMV0gKyAxODM5MDMwNTYyIHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE2IHwgYyA+Pj4gMTYpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGMgXiBkIF4gYSkgKyBrWzE0XSAtIDM1MzA5NTU2IHwgMDtcbiAgICAgICAgYiA9IChiIDw8IDIzIHwgYiA+Pj4gOSkgKyBjIHwgMDtcbiAgICAgICAgYSArPSAoYiBeIGMgXiBkKSArIGtbMV0gLSAxNTMwOTkyMDYwIHwgMDtcbiAgICAgICAgYSA9IChhIDw8IDQgfCBhID4+PiAyOCkgKyBiIHwgMDtcbiAgICAgICAgZCArPSAoYSBeIGIgXiBjKSArIGtbNF0gKyAxMjcyODkzMzUzIHwgMDtcbiAgICAgICAgZCA9IChkIDw8IDExIHwgZCA+Pj4gMjEpICsgYSB8IDA7XG4gICAgICAgIGMgKz0gKGQgXiBhIF4gYikgKyBrWzddIC0gMTU1NDk3NjMyIHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE2IHwgYyA+Pj4gMTYpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGMgXiBkIF4gYSkgKyBrWzEwXSAtIDEwOTQ3MzA2NDAgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjMgfCBiID4+PiA5KSArIGMgfCAwO1xuICAgICAgICBhICs9IChiIF4gYyBeIGQpICsga1sxM10gKyA2ODEyNzkxNzQgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNCB8IGEgPj4+IDI4KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhIF4gYiBeIGMpICsga1swXSAtIDM1ODUzNzIyMiB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMSB8IGQgPj4+IDIxKSArIGEgfCAwO1xuICAgICAgICBjICs9IChkIF4gYSBeIGIpICsga1szXSAtIDcyMjUyMTk3OSB8IDA7XG4gICAgICAgIGMgPSAoYyA8PCAxNiB8IGMgPj4+IDE2KSArIGQgfCAwO1xuICAgICAgICBiICs9IChjIF4gZCBeIGEpICsga1s2XSArIDc2MDI5MTg5IHwgMDtcbiAgICAgICAgYiA9IChiIDw8IDIzIHwgYiA+Pj4gOSkgKyBjIHwgMDtcbiAgICAgICAgYSArPSAoYiBeIGMgXiBkKSArIGtbOV0gLSA2NDAzNjQ0ODcgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNCB8IGEgPj4+IDI4KSArIGIgfCAwO1xuICAgICAgICBkICs9IChhIF4gYiBeIGMpICsga1sxMl0gLSA0MjE4MTU4MzUgfCAwO1xuICAgICAgICBkID0gKGQgPDwgMTEgfCBkID4+PiAyMSkgKyBhIHwgMDtcbiAgICAgICAgYyArPSAoZCBeIGEgXiBiKSArIGtbMTVdICsgNTMwNzQyNTIwIHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE2IHwgYyA+Pj4gMTYpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGMgXiBkIF4gYSkgKyBrWzJdIC0gOTk1MzM4NjUxIHwgMDtcbiAgICAgICAgYiA9IChiIDw8IDIzIHwgYiA+Pj4gOSkgKyBjIHwgMDtcbiAgICAgICAgLy8gaWkoKVxuICAgICAgICBhICs9IChjIF4gKGIgfCB+ZCkpICsga1swXSAtIDE5ODYzMDg0NCB8IDA7XG4gICAgICAgIGEgPSAoYSA8PCA2IHwgYSA+Pj4gMjYpICsgYiB8IDA7XG4gICAgICAgIGQgKz0gKGIgXiAoYSB8IH5jKSkgKyBrWzddICsgMTEyNjg5MTQxNSB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMCB8IGQgPj4+IDIyKSArIGEgfCAwO1xuICAgICAgICBjICs9IChhIF4gKGQgfCB+YikpICsga1sxNF0gLSAxNDE2MzU0OTA1IHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE1IHwgYyA+Pj4gMTcpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGQgXiAoYyB8IH5hKSkgKyBrWzVdIC0gNTc0MzQwNTUgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjEgfCBiID4+PiAxMSkgKyBjIHwgMDtcbiAgICAgICAgYSArPSAoYyBeIChiIHwgfmQpKSArIGtbMTJdICsgMTcwMDQ4NTU3MSB8IDA7XG4gICAgICAgIGEgPSAoYSA8PCA2IHwgYSA+Pj4gMjYpICsgYiB8IDA7XG4gICAgICAgIGQgKz0gKGIgXiAoYSB8IH5jKSkgKyBrWzNdIC0gMTg5NDk4NjYwNiB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMCB8IGQgPj4+IDIyKSArIGEgfCAwO1xuICAgICAgICBjICs9IChhIF4gKGQgfCB+YikpICsga1sxMF0gLSAxMDUxNTIzIHwgMDtcbiAgICAgICAgYyA9IChjIDw8IDE1IHwgYyA+Pj4gMTcpICsgZCB8IDA7XG4gICAgICAgIGIgKz0gKGQgXiAoYyB8IH5hKSkgKyBrWzFdIC0gMjA1NDkyMjc5OSB8IDA7XG4gICAgICAgIGIgPSAoYiA8PCAyMSB8IGIgPj4+IDExKSArIGMgfCAwO1xuICAgICAgICBhICs9IChjIF4gKGIgfCB+ZCkpICsga1s4XSArIDE4NzMzMTMzNTkgfCAwO1xuICAgICAgICBhID0gKGEgPDwgNiB8IGEgPj4+IDI2KSArIGIgfCAwO1xuICAgICAgICBkICs9IChiIF4gKGEgfCB+YykpICsga1sxNV0gLSAzMDYxMTc0NCB8IDA7XG4gICAgICAgIGQgPSAoZCA8PCAxMCB8IGQgPj4+IDIyKSArIGEgfCAwO1xuICAgICAgICBjICs9IChhIF4gKGQgfCB+YikpICsga1s2XSAtIDE1NjAxOTgzODAgfCAwO1xuICAgICAgICBjID0gKGMgPDwgMTUgfCBjID4+PiAxNykgKyBkIHwgMDtcbiAgICAgICAgYiArPSAoZCBeIChjIHwgfmEpKSArIGtbMTNdICsgMTMwOTE1MTY0OSB8IDA7XG4gICAgICAgIGIgPSAoYiA8PCAyMSB8IGIgPj4+IDExKSArIGMgfCAwO1xuICAgICAgICBhICs9IChjIF4gKGIgfCB+ZCkpICsga1s0XSAtIDE0NTUyMzA3MCB8IDA7XG4gICAgICAgIGEgPSAoYSA8PCA2IHwgYSA+Pj4gMjYpICsgYiB8IDA7XG4gICAgICAgIGQgKz0gKGIgXiAoYSB8IH5jKSkgKyBrWzExXSAtIDExMjAyMTAzNzkgfCAwO1xuICAgICAgICBkID0gKGQgPDwgMTAgfCBkID4+PiAyMikgKyBhIHwgMDtcbiAgICAgICAgYyArPSAoYSBeIChkIHwgfmIpKSArIGtbMl0gKyA3MTg3ODcyNTkgfCAwO1xuICAgICAgICBjID0gKGMgPDwgMTUgfCBjID4+PiAxNykgKyBkIHwgMDtcbiAgICAgICAgYiArPSAoZCBeIChjIHwgfmEpKSArIGtbOV0gLSAzNDM0ODU1NTEgfCAwO1xuICAgICAgICBiID0gKGIgPDwgMjEgfCBiID4+PiAxMSkgKyBjIHwgMDtcbiAgICAgICAgeFswXSA9IGEgKyB4WzBdIHwgMDtcbiAgICAgICAgeFsxXSA9IGIgKyB4WzFdIHwgMDtcbiAgICAgICAgeFsyXSA9IGMgKyB4WzJdIHwgMDtcbiAgICAgICAgeFszXSA9IGQgKyB4WzNdIHwgMDtcbiAgICB9O1xuICAgIE1kNS5zdGF0ZUlkZW50aXR5ID0gbmV3IEludDMyQXJyYXkoWzE3MzI1ODQxOTMsIC0yNzE3MzM4NzksIC0xNzMyNTg0MTk0LCAyNzE3MzM4NzhdKTtcbiAgICBNZDUuYnVmZmVyMzJJZGVudGl0eSA9IG5ldyBJbnQzMkFycmF5KFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSk7XG4gICAgTWQ1LmhleENoYXJzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuICAgIE1kNS5oZXhPdXQgPSBbXTtcbiAgICAvLyBQZXJtYW5lbnQgaW5zdGFuY2UgaXMgdG8gdXNlIGZvciBvbmUtY2FsbCBoYXNoaW5nXG4gICAgTWQ1Lm9uZVBhc3NIYXNoZXIgPSBuZXcgTWQ1KCk7XG4gICAgcmV0dXJuIE1kNTtcbn0pKCk7XG5leHBvcnRzLk1kNSA9IE1kNTtcbmlmIChNZDUuaGFzaFN0cignaGVsbG8nKSAhPT0gJzVkNDE0MDJhYmM0YjJhNzZiOTcxOWQ5MTEwMTdjNTkyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ01kNSBzZWxmIHRlc3QgZmFpbGVkLicpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWQ1LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBWZWMyXzEgPSByZXF1aXJlKFwiLi9zdHJ1Y3QvVmVjMlwiKTtcclxuZXhwb3J0cy5WZWMyID0gVmVjMl8xLmRlZmF1bHQ7XHJcbnZhciBSYW5nZTJfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdC9SYW5nZTJcIik7XHJcbmV4cG9ydHMuUmFuZ2UyID0gUmFuZ2UyXzEuZGVmYXVsdDtcclxudmFyIFJlY3RfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdC9SZWN0XCIpO1xyXG5leHBvcnRzLlJlY3QgPSBSZWN0XzEuZGVmYXVsdDtcclxudmFyIExpc3RfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdC9MaXN0XCIpO1xyXG5leHBvcnRzLkxpc3QgPSBMaXN0XzEuZGVmYXVsdDtcclxudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdC9EaWN0aW9uYXJ5XCIpO1xyXG5leHBvcnRzLkRpY3Rpb25hcnkgPSBEaWN0aW9uYXJ5XzEuZGVmYXVsdDtcclxudmFyIFN0YWNrXzEgPSByZXF1aXJlKFwiLi9zdHJ1Y3QvU3RhY2tcIik7XHJcbmV4cG9ydHMuU3RhY2sgPSBTdGFja18xLmRlZmF1bHQ7XHJcbnZhciBUcmVlXzEgPSByZXF1aXJlKFwiLi9zdHJ1Y3QvVHJlZVwiKTtcclxuZXhwb3J0cy5UcmVlID0gVHJlZV8xLlRyZWU7XHJcbnZhciBDYWxjXzEgPSByZXF1aXJlKFwiLi9DYWxjXCIpO1xyXG5leHBvcnRzLkNhbGMgPSBDYWxjXzEuZGVmYXVsdDtcclxudmFyIERvbV8xID0gcmVxdWlyZShcIi4vRG9tXCIpO1xyXG5leHBvcnRzLkRvbSA9IERvbV8xLkRvbTtcclxudmFyIEFycl8xID0gcmVxdWlyZShcIi4vQXJyXCIpO1xyXG5leHBvcnRzLkFyciA9IEFycl8xLkFycjtcclxudmFyIE9ial8xID0gcmVxdWlyZShcIi4vT2JqXCIpO1xyXG5leHBvcnRzLk9iaiA9IE9ial8xLk9iajtcclxudmFyIFV0aWxfMSA9IHJlcXVpcmUoXCIuL1V0aWxcIik7XHJcbmV4cG9ydHMuVXRpbCA9IFV0aWxfMS5VdGlsO1xyXG52YXIgVGltZXJfMSA9IHJlcXVpcmUoXCIuL1RpbWVyXCIpO1xyXG5leHBvcnRzLlRpbWVyID0gVGltZXJfMS5UaW1lcjtcclxudmFyIFVyaV8xID0gcmVxdWlyZShcIi4vVXJpXCIpO1xyXG5leHBvcnRzLlVyaSA9IFVyaV8xLlVyaTtcclxudmFyIFBvb2xhYmxlXzEgPSByZXF1aXJlKFwiLi9zdGFuZGFyZC9taXhpbnMvUG9vbGFibGVcIik7XHJcbmV4cG9ydHMuUG9vbGFibGUgPSBQb29sYWJsZV8xLmRlZmF1bHQ7XHJcbnZhciBJbml0YWJsZV8xID0gcmVxdWlyZShcIi4vc3RhbmRhcmQvbWl4aW5zL0luaXRhYmxlXCIpO1xyXG5leHBvcnRzLkluaXRhYmxlID0gSW5pdGFibGVfMS5kZWZhdWx0O1xyXG52YXIgUG9vbF8xID0gcmVxdWlyZShcIi4vc3RhbmRhcmQvUG9vbFwiKTtcclxuZXhwb3J0cy5Qb29sID0gUG9vbF8xLmRlZmF1bHQ7XHJcbnZhciBJbnRlZ3JhdGlvbl8xID0gcmVxdWlyZShcIi4vSW50ZWdyYXRpb25cIik7XHJcbmV4cG9ydHMuSW50ZWdyYXRlID0gSW50ZWdyYXRpb25fMS5kZWZhdWx0O1xyXG52YXIgTW9jRGF0YV8xID0gcmVxdWlyZShcIi4vTW9jRGF0YVwiKTtcclxuZXhwb3J0cy5Nb2NEYXRhID0gTW9jRGF0YV8xLk1vY0RhdGE7XHJcbnZhciBDYWNoZV8xID0gcmVxdWlyZShcIi4vc3RhbmRhcmQvQ2FjaGVcIik7XHJcbmV4cG9ydHMuQ2FjaGUgPSBDYWNoZV8xLkNhY2hlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXX0=
return require('typescript-collections');
});