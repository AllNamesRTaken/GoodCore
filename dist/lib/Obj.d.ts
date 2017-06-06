export declare class _Obj {
    constructor();
    destroy(obj: any): void;
    wipe(obj: any): void;
    null(obj: any): void;
    isNullOrUndefined(...args: any[]): boolean;
    isNotNullOrUndefined(...args: any[]): boolean;
    isClassOf(a: any, b: any): boolean;
    isSameClass(a: any, b: any): boolean;
    inherits(a: any, b: any): boolean;
    equals(a: any, b: any): boolean;
    isDifferent(a: any, b: any): boolean;
    shallowCopy(obj: any): any;
    clone<T>(obj: T): T;
    cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    mixin(target: any, exclude: any, ...sources: any[]): any;
    setProperties(target: any, values: any): void;
}
export declare let Obj: _Obj;
