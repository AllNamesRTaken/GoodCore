export var MocDataType;
(function (MocDataType) {
    MocDataType[MocDataType["LinearInt"] = 0] = "LinearInt";
    MocDataType[MocDataType["RandomInt"] = 1] = "RandomInt";
    MocDataType[MocDataType["LinearFloat"] = 2] = "LinearFloat";
    MocDataType[MocDataType["RandomFloat"] = 3] = "RandomFloat";
})(MocDataType || (MocDataType = {}));
var _MocData = (function () {
    function _MocData() {
        this.Type = MocDataType;
    }
    _MocData.prototype.randomString = function (length) {
        if (length === void 0) { length = 25; }
        var result = "";
        for (var i = 0; i < length; i += 1) {
            result += _MocData.VALID_CHARS.charAt(Math.floor(Math.random() * _MocData.VALID_CHARS.length));
        }
        return result;
    };
    _MocData.prototype.randomInt = function () {
        return this.randomNumber() | 0;
    };
    _MocData.prototype.randomNumber = function () {
        return Math.random() * 2147483647;
    };
    _MocData.prototype.numericArray = function (length, type) {
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
                    result[i] = this.randomInt();
                }
                break;
            case MocDataType.LinearFloat:
                for (var i = 0; i < length; i += 1) {
                    result[i] = i + 0.5;
                }
                break;
            case MocDataType.RandomFloat:
                for (var i = 0; i < length; i += 1) {
                    result[i] = this.randomNumber();
                }
                break;
        }
        return result;
    };
    _MocData.prototype.stringArray = function (arrayLength, stringLength) {
        var result = new Array(arrayLength);
        var i = -1;
        while (++i < arrayLength) {
            result[i] = this.randomString(stringLength);
        }
        return result;
    };
    return _MocData;
}());
export { _MocData };
_MocData.VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export var MocData = new _MocData();
//# sourceMappingURL=MocData.js.map