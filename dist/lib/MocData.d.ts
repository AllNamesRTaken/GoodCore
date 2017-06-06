export declare enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export declare class _MocData {
    Type: typeof MocDataType;
    constructor();
    static VALID_CHARS: string;
    randomString(length?: number): string;
    randomInt(): number;
    randomNumber(): number;
    numericArray(length: number, type?: MocDataType): number[];
    stringArray(arrayLength: number, stringLength?: number): string[];
}
export declare let MocData: _MocData;
