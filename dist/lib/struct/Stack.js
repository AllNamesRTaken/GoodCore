import { deepCopy, slice, deserialize } from "../Arr";
import { isFunction } from "../Test";
import { List } from "./List";
var Stack = (function () {
    function Stack(size) {
        this.DEFAULT_SIZE = 100;
        this._pos = 0;
        this._limit = 0;
        if (!size) {
            size = this.DEFAULT_SIZE;
        }
        this.DEFAULT_SIZE = size;
        this._array = new Array(size);
        this.push = this.fastPush;
    }
    Object.defineProperty(Stack.prototype, "values", {
        get: function () {
            return slice(this._array, 0, this._pos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "depth", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "size", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "isEmpty", {
        get: function () {
            return this.size === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stack.prototype, "limit", {
        get: function () {
            return this._limit;
        },
        set: function (value) {
            if (value < 0) {
                value = 0;
            }
            this._limit = value;
            if (value === 0) {
                this.push = this.fastPush;
            }
            else {
                this.push = this.limitedPush;
                this.limitObjects();
            }
        },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.create = function (size) {
        return new (this.constructor)(size);
    };
    Stack.prototype.push = function (obj) {
    };
    Stack.prototype.fastPush = function (obj) {
        this._array[this._pos++] = obj;
    };
    Stack.prototype.limitedPush = function (obj) {
        this._array[this._pos] = obj;
        ++this._pos;
        this.limitObjects();
    };
    Stack.prototype.pop = function () {
        var result = undefined;
        if (this._pos !== 0) {
            result = this._array[--this._pos];
        }
        return result;
    };
    Stack.prototype.peek = function () {
        return this._array[this._pos - 1];
    };
    Stack.prototype.peekAt = function (index) {
        return index < 0 || index >= this._pos ? undefined : this._array[this._pos - index - 1];
    };
    Stack.prototype.toList = function () {
        var result = new List();
        return new List(this.values);
    };
    Stack.prototype.clear = function () {
        this._pos = 0;
        this._array.length = this.DEFAULT_SIZE;
        return this;
    };
    Stack.prototype.clone = function () {
        var arr = deepCopy(this._array);
        var result = this.create(this.DEFAULT_SIZE);
        result._array = arr;
        result._limit = this._limit;
        result._pos = this._pos;
        return result;
    };
    Stack.prototype.limitObjects = function () {
        while (this._pos > this._limit) {
            this._array.shift();
            --this._pos;
        }
    };
    Stack.prototype.toJSON = function () {
        return slice(this.values, 0, this._pos);
    };
    Stack.prototype.serialize = function () {
        return slice(this.values, 0, this._pos).map(function (el) { return isFunction(el.serialize) ? el.serialize() : el; });
    };
    Stack.prototype.deserialize = function (array) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        deserialize.apply(this, [array, this._array].concat(types));
        this._pos = array.length;
        return this;
    };
    return Stack;
}());
export { Stack };
//# sourceMappingURL=Stack.js.map