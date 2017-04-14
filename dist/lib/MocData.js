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
//# sourceMappingURL=MocData.js.map