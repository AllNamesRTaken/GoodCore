import { Arr } from "./Arr";
import { Test } from "./Test";
var _Obj = (function () {
    function _Obj() {
    }
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
            if (Test.IsArray(a)) {
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
                        if (Test.IsFunction(a[key])) {
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
        else if (Test.IsArray(obj)) {
            result = Arr.DeepCopy(obj);
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
        if (Test.IsArray(target)) {
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
                        if (Test.IsArray(a)) {
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
        var result = target, len = sources ? sources.length : 0;
        var i = 0;
        sources = Arr.Flatten(sources);
        for (; i < len; i++) {
            var src = sources[i];
            if (Test.IsFunction(src)) {
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
export { _Obj };
export var Obj = new _Obj();
//# sourceMappingURL=Obj.js.map