export declare class _Obj {
    constructor();
    Destroy(obj: any): void;
    Wipe(obj: any): void;
    Null(obj: any): void;
    IsNullOrUndefined(...args: any[]): boolean;
    IsNotNullOrUndefined(...args: any[]): boolean;
    IsClassOf(a: any, b: any): boolean;
    IsSameClass(a: any, b: any): boolean;
    Inherits(a: any, b: any): boolean;
    Equals(a: any, b: any): boolean;
    IsDifferent(a: any, b: any): boolean;
    ShallowCopy(obj: any): any;
    Clone<T>(obj: T): T;
    CloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    Mixin(target: any, exclude: any, ...sources: any[]): any;
    SetProperties(target: any, values: any): void;
}
export declare let Obj: _Obj;
