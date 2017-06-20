export declare enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export declare const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export declare function randomString(length?: number): string;
export declare function randomInt(): number;
export declare function randomNumber(): number;
export declare function numericArray(length: number, type?: MocDataType): number[];
export declare function stringArray(arrayLength: number, stringLength?: number): string[];
