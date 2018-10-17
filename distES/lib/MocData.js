export var MocDataType;
(function (MocDataType) {
    MocDataType[MocDataType["LinearInt"] = 0] = "LinearInt";
    MocDataType[MocDataType["RandomInt"] = 1] = "RandomInt";
    MocDataType[MocDataType["LinearFloat"] = 2] = "LinearFloat";
    MocDataType[MocDataType["RandomFloat"] = 3] = "RandomFloat";
})(MocDataType || (MocDataType = {}));
const LARGEST_INT = 2147483647;
export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length = 25) {
    let result = "";
    for (let i = 0; i < length; i += 1) {
        result += VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));
    }
    return result;
}
export function randomInt(min = 0, max = LARGEST_INT) {
    return randomNumber(min, max) | 0;
}
export function randomNumber(min = 0, max = LARGEST_INT) {
    return (Math.random() * (max - min)) + min;
}
export function numericArray(length, type = MocDataType.LinearInt, min = 0, max = LARGEST_INT) {
    const result = new Array(length);
    switch (type) {
        case MocDataType.RandomInt:
            for (let i = 0; i < length; i += 1) {
                result[i] = randomInt(min, max);
            }
            break;
        case MocDataType.LinearFloat:
            for (let i = 0; i < length; i += 1) {
                result[i] = i + 0.5;
            }
            break;
        case MocDataType.RandomFloat:
            for (let i = 0; i < length; i += 1) {
                result[i] = randomNumber(min, max);
            }
            break;
        default:
            for (let i = 0; i < length; i += 1) {
                result[i] = i;
            }
            break;
    }
    return result;
}
export function stringArray(arrayLength, stringLength) {
    const result = new Array(arrayLength);
    let i = -1;
    while (++i < arrayLength) {
        result[i] = randomString(stringLength);
    }
    return result;
}
//# sourceMappingURL=MocData.js.map