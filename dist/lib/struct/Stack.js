import { Arr } from "../Arr";
import { List } from "./List";
var DEFAULT_SIZE = 100;
var Stack = (function () {
    function Stack(size) {
        if (size === void 0) { size = DEFAULT_SIZE; }
        this._pos = 0;
        this._array = new Array(size);
    }
    Object.defineProperty(Stack.prototype, "values", {
        get: function () {
            return Arr.slice(this._array, 0, this._pos);
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
    Stack.prototype.push = function (obj) {
        this._array[this._pos] = obj;
        this._pos++;
    };
    Stack.prototype.pop = function () {
        var result = null;
        if (this._pos !== 0) {
            result = this._array[--this._pos];
        }
        return result;
    };
    Stack.prototype.toList = function () {
        var result = new List();
        return new List(this.values);
    };
    return Stack;
}());
export { Stack };
//# sourceMappingURL=Stack.js.map