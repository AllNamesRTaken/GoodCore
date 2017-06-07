export declare class Obj {
    constructor();
    static destroy(obj: any): void;
    static wipe(obj: any): void;
    static null(obj: any): void;
    static isNullOrUndefined(...args: any[]): boolean;
    static isNotNullOrUndefined(...args: any[]): boolean;
    static isClassOf(a: any, b: any): boolean;
    static isSameClass(a: any, b: any): boolean;
    static inherits(a: any, b: any): boolean;
    static equals(a: any, b: any): boolean;
    static isDifferent(a: any, b: any): boolean;
    static shallowCopy(obj: any): any;
    static clone<T>(obj: T): T;
    static cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    static mixin(target: any, exclude: any, ...sources: any[]): any;
    static setProperties(target: any, values: any): void;
}
