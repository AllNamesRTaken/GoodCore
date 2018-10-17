export var MocDataType;
(function (MocDataType) {
    MocDataType[MocDataType["LinearInt"] = 0] = "LinearInt";
    MocDataType[MocDataType["RandomInt"] = 1] = "RandomInt";
    MocDataType[MocDataType["LinearFloat"] = 2] = "LinearFloat";
    MocDataType[MocDataType["RandomFloat"] = 3] = "RandomFloat";
})(MocDataType || (MocDataType = {}));
var LARGEST_INT = 2147483647;
export var VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length) {
    if (length === void 0) { length = 25; }
    var result = "";
    for (var i = 0; i < length; i += 1) {
        result += VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));
    }
    return result;
}
export function randomInt(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = LARGEST_INT; }
    return randomNumber(min, max) | 0;
}
export function randomNumber(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = LARGEST_INT; }
    return (Math.random() * (max - min)) + min;
}
export function numericArray(length, type, min, max) {
    if (type === void 0) { type = MocDataType.LinearInt; }
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = LARGEST_INT; }
    var result = new Array(length);
    switch (type) {
        case MocDataType.RandomInt:
            for (var i = 0; i < length; i += 1) {
                result[i] = randomInt(min, max);
            }
            break;
        case MocDataType.LinearFloat:
            for (var i = 0; i < length; i += 1) {
                result[i] = i + 0.5;
            }
            break;
        case MocDataType.RandomFloat:
            for (var i = 0; i < length; i += 1) {
                result[i] = randomNumber(min, max);
            }
            break;
        default:
            for (var i = 0; i < length; i += 1) {
                result[i] = i;
            }
            break;
    }
    return result;
}
export function stringArray(arrayLength, stringLength) {
    var result = new Array(arrayLength);
    var i = -1;
    while (++i < arrayLength) {
        result[i] = randomString(stringLength);
    }
    return result;
}
//# sourceMappingURL=MocData.js.map