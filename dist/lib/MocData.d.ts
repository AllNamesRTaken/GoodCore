export declare enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export declare class _MocData {
    Type: typeof MocDataType;
    _(): _MocData;
    constructor();
    static VALID_CHARS: string;
    RandomString(length?: number): string;
    RandomInt(): number;
    RandomNumber(): number;
    NumericArray(length: number, type?: MocDataType): number[];
    StringArray(arrayLength: number, stringLength?: number): string[];
}
export declare var MocData: _MocData;
