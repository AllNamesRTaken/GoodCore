type Constructor<T> = new (...args: any[]) => T;
type ICtor<T> = new(...args: any[]) => T;
// tslint:disable-next-line:max-line-length
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type PickKeysOfType<T, KT> = ({ [P in keyof T]: T[P] extends KT ? P : never })[keyof T];
type PickType<T, KT> = Pick<T, PickKeysOfType<T, KT>>;
type PickFunctions<T> = PickType<T, () => any>;
type ExcludeType<T, KT> = Omit<T, PickKeysOfType<T, KT>>;
type ExcludeFunctions<T> = ExcludeType<T, () => any>;

// tslint:disable-next-line:interface-name
interface Indexable<T> {
    [key: string]: T;
}
interface IObject extends Indexable<any> {}
interface IInstance<T> extends IObject {
    // tslint:disable-next-line:no-reserved-keywords
    constructor?: ICtor<T>;
}
type ArgTypes<T> = T extends (...a: infer A) => unknown ? A : [];
type ResultType<T> = T extends (...a: unknown[]) => infer S ? S : never;
interface IPool<T extends IPoolable> {
    get(): T;
    release(obj: T): void;
}
interface IPoolable {
    __pool__: IPool<IPoolable>;
    release(): void;
    initPool(pool: IPool<IPoolable>): void;
}
interface ICloneable<T> {
    clone(): T;
}
interface IInitable {
    init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this;
}
type TInitable<T> = T & IInitable;
interface ISerializable<T> {
    toJSON(): any;
    serialize(): T;
}
interface IDeserializable<T> {
    deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
interface IRevivable<T> {
    revive(data: any, ...types: Array<Constructor<any>>): T;
    deserialize(array: any, ...types: Array<Constructor<any>>): T;
}
interface IDebounceOptions {
    leading: boolean;
}
declare const Global: {
    window: Window | null;
    hasNativeWindow: boolean;
    global: Window; // has to exclude Node since this is browser only
};

declare namespace Arr {
    export function flatten<T>(src: any[]): T[];
    export function reverse<T>(array: T[]): T[];
    export function concat(...arrs: any[]): any[];
    export function slice<T>(src: T[], pos?: number, count?: number): T[];
    export function splice<T>(src: T[], pos?: number, remove?: number, insert?: T[]): void;
    export function append<T>(arr: T[], values: T[]): void;
    export function removeAt<T>(arr: T[], index: number): T | undefined;
    export function indexOfElement(src: any[], el: any): number;
    export function remove(arr: any[], el: any): void;
    export function indexOf<T>(src: any[], fn: (el: T) => boolean): number;
    export function find<T>(src: T[], fn: (el: T) => boolean): T | undefined;
    export function removeOneByFn<T>(arr: T[], fn: (el: T) => boolean): void;
    export function shallowCopy<T>(src: T[]): T[];
    export function shallowCopyInto<T>(src: T[], target: T[]): void;
    export function shallowFill<T>(src: T[], target: T[], at?: number): void;
    export function deepCopy<T>(src: T[]): T[];
    export function deepCopyInto<T>(src: T[], target: T[]): void;
    export function deepFill<T>(src: T[], target: T[], at?: number): void;
    export function filter<T>(src: T[], fn: (el: T, i: number) => boolean): T[];
    export function filterInto<T>(src: T[], target: T[], fn: (el: T, i: number) => boolean): void;
    export function map<S, T>(src: S[], fn: (el: S, i: number) => T, startIndex?: number): T[];
    export function mapAsync<S, T>(src: S[], fn: (el: S, i: number) => PromiseLike<T>, inParallel?: boolean): Promise<T[]>;
    export function mapInto<S, T>(src: S[], target: T[], fn: (el: S, i: number) => T, startIndex?: number): void;
    export function reduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U, pos?: number, to?: number): U;
    export function reduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T, pos?: number, to?: number) => boolean, start: U): U;
    export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
    export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    export function forEach<T>(src: T[], fn: (el: T, i: number) => any, startIndex?: number): void;
    export function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel?: boolean): Promise<void>;
    export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => void, startIndex?: number): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
    export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void;
    export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => void): void;
    export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): void;
    export function some<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function insertAt<T>(src: T[], pos: number, v: T): void;
    export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
    export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[];
    type zipFn<S, T, U, V = undefined, W = undefined> = (i: number, a: S, b: T, c?: V, d?: W) => U;
    export function zip<S, T, U = [S, T], V = undefined, W = undefined>(
        a: S[],
        b: T[],
        fn?: zipFn<S, T, U, V, W>,
        c?: undefined,
        d?: undefined,
    ): U[];
    export function zip<S, T, V, U = [S, T, V], W = undefined>(
        a: S[],
        b: T[],
        c: V[],
        fn?: zipFn<S, T, U, V, W>,
        d?: undefined,
    ): U[];
    export function zip<S, T, V, W, U = [S, T, V, W]>(
        a: S[],
        b: T[],
        c: V[],
        d: W[],
        fn?: zipFn<S, T, U, V, W>,
    ): U[];
    export function unzip<S, T, U = [S, T]>(arr: U[], fn?: (u: U, i?: number, out?: [S, T]) => [S, T]): [S[], T[]];
    export function pivot<S = any, T extends S[] = S[]>(arr: T[]): S[][];
    export function deserialize<S>(array: any[], target: S[], ...types: Array<Constructor<any>>): S[];
    type Descriminator<T> = (el: T) => boolean;
    export function bucket<T>(array: T[], ...desciminators: Array<Descriminator<T>>): T[][];
    export function split<T>(array: T[], isA: Descriminator<T>): [T[], T[]];
    export function disinct<T>(array: T[], hashFn?: (el: T) => string): T[];
}

declare namespace Obj {
    export function destroy(obj: Object): void;
    export function wipe(obj: Object): void;
    export function setNull(obj: Object): void;
    export function isClassOf(a: Object, b: Object): boolean;
    export function isSameClass(a: Object, b: Object): boolean;
    export function inherits(a: Object, b: Object): boolean;
    export function equals(a: any, b: any): boolean;
    export function isDifferent(a: any, b: any): boolean;
    export function shallowCopy<T, K extends keyof T>(obj: T): {[P in K]: T[P]};
    export function clone<T>(obj: T): T;
    export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    export function mixin(target: Indexable<any>, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): Indexable<any>;
    export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting?: boolean): void;
    export function forEach<T>(
        target: Indexable<T> | T[],
        fn: (value: T, key: string) => boolean | void,
    ): void;
    // tslint:disable-next-line:max-line-length
    export function transform<T extends {[index: string]: any}, S = {}, U = any>(target: T | U[], fn: (result: S, value: any, key: string) => boolean | void, accumulator?: S): S;
    export function difference<T extends {[index: string]: any}, S extends {[index: string]: any} = T>(target: T, base: S): S;
}
declare interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}

interface IDebounceOptions {
    leading: boolean;
}
//@ts-ignore TS2304
type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ? 
    PromiseLike<S> : 
    T extends (...a: unknown[]) => infer R ? 
        U extends { leading: true } ?
            R : 
            PromiseLike<R>
        : never;
//@ts-ignore TS2304
interface IDebouncedFunction<T, U> {
    (...args: ArgTypes<T>): DebounceResultType<T, U>;
    //@ts-ignore TS2304
    resetTimer?(): void;
}
interface IThrottleOptions {
    leading: boolean;
    trailing: boolean;
}
type IThrottledFunction<T> = (...args: ArgTypes<T>) => ResultType<T>;
declare namespace Util {
    export class LoggableCounter {
        public name: string;
        public log(): void;
        public inc(): LoggableCounter;
        public reset(): LoggableCounter;
        valueOf(): number;
        toString(): string;
    }
    export function counter(key?: number | string): LoggableCounter;
    export function count(key?: number | string): LoggableCounter;
    export function once<T extends (...args: any[]) => S, S = void>(fn: T): T;
    export function init(win?: Window): void;
    export function getFunctionName(fn: Function): string;
    export function getFunctionCode(fn: Function): string;
    export function getDate(delta?: string, start?: Date): Date;
    export function newUUID(): string;
    export function newInt(): number;
    export function callDebugger(): void;
    export function pipeOut(
        log?: ((...args: any[]) => void) | null,
        warn?: ((...args: any[]) => void) | null,
        error?: ((...args: any[]) => void) | null,
        catchDefault?: boolean | {log?: boolean, warn?: boolean, error: boolean},
    ): void;
    export class AssertError extends Error { }
    export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
    // tslint:disable-next-line:max-line-length
    export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(objOrClass: U, fnName: string, proxyFn: (originalFn: (...args: any[]) => S | V, ...args: any[]) => void): void;
    export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
    export function toArray<T>(arr: ArrayLike<T>): T[];

    export function debounce<T extends (...args: any[]) => any, U extends Partial<IDebounceOptions>>(
        method: T,
        duration: number,
        options?: U,
    ): IDebouncedFunction<T, U>;
    export function throttle<T extends (...args: any[]) => any>(
        method: T,
        duration?: number,
        options?: Partial<IThrottleOptions>,
    ): IThrottledFunction<T>;
}
declare namespace Test {
    export class Env {
        public static useNative?: boolean;
        public static isOpera(): boolean;
        public static isFirefox(): boolean;
        public static isSafari(): boolean;
        public static isIE(): boolean;
        public static isEdge(): boolean;
        public static isChrome(): boolean;
        public static isBlink(): boolean;
        public static hasFastNativeArrays(): boolean;
    }
    export function hasWindow(): boolean;
    export function hasConsole(): boolean;
    export function isArray(it: any): boolean;
    export function isElement(target: any): boolean;
    export function isFunction(it: any): boolean;
    export function isNumber(x: any): boolean;
    export function isInt(x: any): boolean;
    export function isString(x: any): boolean;
    export function areNullOrUndefined(...args: any[]): boolean;
    export function areNotNullOrUndefined(...args: any[]): boolean;
    export function isNullOrUndefined(arg: any): boolean;
    export function isNotNullOrUndefined(arg: any): boolean;
    export function areUndefined(...args: any[]): boolean;
    export function areNotUndefined(...args: any[]): boolean;
    export function isNull(arg: any): boolean;
    export function isNotNull(arg: any): boolean;
    export function isUndefined(arg: any): boolean;
    export function isNotUndefined(arg: any): boolean;
}

declare function Poolable<S>(_constructor?: ICtor<S>): ICtor<S & IPoolable>;
declare function Initable<S>(_constructor?: ICtor<S>): ICtor<S & IInitable>;

declare class Pool<T> {
    readonly available: number;
    readonly size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    // tslint:disable-next-line:no-reserved-keywords
    get(): T & IPoolable;
    release(obj: T): void;
}

declare namespace MocData {
    export enum MocDataType {
        LinearInt = 0,
        RandomInt = 1,
        LinearFloat = 2,
        RandomFloat = 3,
    }
    export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    export function randomString(length?: number): string;
    export function randomInt(): number;
    export function randomNumber(): number;
    export function numericArray(length: number, dataType?: MocDataType): number[];
    export function stringArray(arrayLength: number, stringLength?: number): string[];
}

declare class KeyValuePair<S, T> {
    key: S;
    value: T;
}

declare namespace Decorators {
    // tslint:disable-next-line:max-line-length
    export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
        configurable: boolean;
        enumerable: boolean | undefined;
        // tslint:disable-next-line:no-reserved-keywords
        get: () => any;
    };
    // tslint:disable-next-line:max-line-length
    export function throttled<S>(duration?: number, options?: Partial<IThrottleOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
        configurable: boolean;
        enumerable: boolean | undefined;
        // tslint:disable-next-line:no-reserved-keywords
        get: () => any;
    };
    export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
    export function deprecated<S>(instead?: string, message?: string):
        (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    export function asserts<S>(assertFn: Function, result?: any):
        (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    // tslint:disable-next-line:max-line-length
    export function before<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    // tslint:disable-next-line:max-line-length
    export function after<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    // tslint:disable-next-line:max-line-length
    export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    // tslint:disable-next-line:max-line-length
    export function provided<S>(condition: (name: string, ...args: any[]) => boolean): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    export let async: {
        <S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        before?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        after?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        provided?<S>(async_predicate: (...args: any[]) => Promise<boolean>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    };
}
