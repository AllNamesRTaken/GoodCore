export var MocDataType;
(function (MocDataType) {
    MocDataType[MocDataType["LinearInt"] = 0] = "LinearInt";
    MocDataType[MocDataType["RandomInt"] = 1] = "RandomInt";
    MocDataType[MocDataType["LinearFloat"] = 2] = "LinearFloat";
    MocDataType[MocDataType["RandomFloat"] = 3] = "RandomFloat";
})(MocDataType || (MocDataType = {}));
export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length = 25) {
    let result = "";
    for (let i = 0; i < length; i += 1) {
        result += VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));
    }
    return result;
}
export function randomInt() {
    return this.randomNumber() | 0;
}
export function randomNumber() {
    return Math.random() * 2147483647;
}
export function numericArray(length, type = MocDataType.LinearInt) {
    const result = new Array(length);
    switch (type) {
        case MocDataType.LinearInt:
            for (let i = 0; i < length; i += 1) {
                result[i] = i;
            }
            break;
        case MocDataType.RandomInt:
            for (let i = 0; i < length; i += 1) {
                result[i] = this.randomInt();
            }
            break;
        case MocDataType.LinearFloat:
            for (let i = 0; i < length; i += 1) {
                result[i] = i + 0.5;
            }
            break;
        case MocDataType.RandomFloat:
            for (let i = 0; i < length; i += 1) {
                result[i] = this.randomNumber();
            }
            break;
    }
    return result;
}
export function stringArray(arrayLength, stringLength) {
    const result = new Array(arrayLength);
    let i = -1;
    while (++i < arrayLength) {
        result[i] = this.randomString(stringLength);
    }
    return result;
}
//# sourceMappingURL=MocData.js.map