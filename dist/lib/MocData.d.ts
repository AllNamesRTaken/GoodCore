export declare enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export declare const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export declare class MocData {
    constructor();
    static randomString(length?: number): string;
    static randomInt(): number;
    static randomNumber(): number;
    static numericArray(length: number, type?: MocDataType): number[];
    static stringArray(arrayLength: number, stringLength?: number): string[];
}
