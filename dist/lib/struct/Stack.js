"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arr_1 = require("../Arr");
var List_1 = require("./List");
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
        var result = new List_1.List();
        return new List_1.List(this.Values);
    };
    return Stack;
}());
exports.Stack = Stack;
//# sourceMappingURL=Stack.js.map