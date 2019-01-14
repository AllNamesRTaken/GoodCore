export function destroy(obj: any): void;
export function wipe(obj: any): void;
export function setNull(obj: any): void;
export function isClassOf(a: any, b: any): boolean;
export function isSameClass(a: any, b: any): boolean;
export function inherits(a: any, b: any): boolean;
export function equals(a: any, b: any): boolean;
export function isDifferent(a: any, b: any): boolean;
export function shallowCopy(obj: any): any;
export function clone<T>(obj: T): T;
export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
export function mixin(target: any, exclude: any, ...sources: any[]): any;
export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting?: boolean): void;
export function forEach<T>(
    target: Indexable<T> | T[],
    fn: (value: T, key: string | number) => boolean | void
): void;
export function transform<T extends {[index: string]: any}, S = T, U = any>(target: T | Array<U>, fn: (result: S, value: any, key: string | number) => boolean | void, accumulator?: S): S;
export function difference<T extends {[index: string]: any}, S extends {[index: string]: any} = T>(target: T, base: S): S;
