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
interface ICloneable {
    clone(): this;
}
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
type TreeEvent = "change";
interface ITreeNode<T> {
    id: string;
    parent: ITreeNode<T> | null;
    children: Array<ITreeNode<T>> | null;
    data: T | null;
}
interface IVec2 {
    x: number;
    y: number;
}
interface IRange2 {
    pos: IVec2;
    size: IVec2;
}
interface IRect {
    start: IVec2;
    stop: IVec2;
}
interface IDebounceOptions {
    leading: boolean;
}
declare const Global: {
    window: Window | null;
    hasNativeWindow: boolean;
    global: Window; // has to exclude Node since this is browser only
};
declare class Stack<T> implements ISerializable<T[]>, IRevivable<Stack<T>>, ICloneable {
    DEFAULT_SIZE: number;
    readonly values: T[];
    readonly depth: number;
    readonly size: number;
    readonly isEmpty: boolean;
    limit: number;
    constructor(size?: number);
    protected create<S = T>(size?: number): Stack<S>;
    push(obj: T): void;
    fastPush(obj: T): void;
    limitedPush(obj: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    peekAt(index: number): T | undefined;
    clear(): Stack<T>;
    clone(): this;
    toJSON(): any;
    serialize(): T[];
    revive(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
    deserialize(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
}

declare class Tree<T> implements ISerializable<T[]>, ICloneable, IInitable {
    public id: string;
    public parent: this | null;
    public children: this[] | null;
    public data: T | null;
    public virtual: boolean;
    public isDirty: boolean;
    public size: number;
    public leafCount: number;
    public childCount: number;
    public weight: number;

    protected _virtual: boolean;
    protected _size: number;
    protected _leafCount: number;
    protected _weight: number;

    root: this;
    static fromObject<T>(obj: any): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string) | string;
        parent?: ((node: S) => string) | string;
        data?: ((node: S) => any) | string;
    },                        virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number);
    protected create<S = T>(...args: any[]): Tree<S>;
    protected markAsDirty(): void;
    public reCalculateSize(): this;
    public aggregate<S = any>(fn: (cur: this, i: number, agg: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    /**
     * @deprecated Since version 1.9.2. Will be deleted in version 2.0. Use aggregate instead.
     */
    // tslint:disable-next-line:max-line-length
    public collect<S = any>(fn: (cur: this, i: number, collected: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    public init(obj: Partial<this>, mapping?: any): this;
    public insertAt(pos: number, data: T, id?: string | number): void;
    public add(data: T | this, id?: string | number): this;
    public remove(): void;
    public prune(): this;
    public cut(): this;
    public forEach(fn: (el: this, i: number) => void, _i?: number): this;
    public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S;
    public clone(): this;
    public filter(condition: (node: this) => boolean): this;
    public select(condition?: (node: this) => boolean, acc?: this[]): this[];
    public find(condition: number | ((node: this) => boolean)): this | null;
    protected _findBySize(pos: number): this | null;
    public depth(): number;
    public sort(comparer: (a: this, b: this) => number): this;
    public serialize(): T[];
    public toJSON(): any;
    public on(event: TreeEvent, callback: (targets: Array<Tree<T>>) => void): number;
    public off(event: TreeEvent, index: number): void;
    public trigger(event: TreeEvent, targets: Array<Tree<T>>): void;    
    public set(values: Partial<T>): void;
}

declare namespace Arr {
    export function flatten<T>(src: any[]): T[];
    export function reverse<T>(array: T[]): T[];
    export function append<T>(arr: T[], values: T[]): void;
    export function find<T>(src: T[], fn: (el: T) => boolean): T | undefined;
    export function shallowCopy<T>(src: T[]): T[];
    export function deepCopy<T>(src: T[]): T[];
    export function deepCopyInto<T>(src: T[], target: T[]): void;
    export function mapAsync<S, T>(src: S[], fn: (el: S, i: number) => PromiseLike<T>, inParallel?: boolean): Promise<T[]>;
    export function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel?: boolean): Promise<void>;
    export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => void, startIndex?: number): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
    export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
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
    export function transform<T extends {[index: string]: any}, S = T, U = any>(target: T | U[], fn: (result: S, value: any, key: string) => boolean | void, accumulator?: S): S;
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
    export function getDate(delta?: string, start?: Date): Date;
    export function newUUID(): string;
    export function newInt(): number;
    export class AssertError extends Error { }
    export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
    // tslint:disable-next-line:max-line-length
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

declare class KeyValuePair<S, T> {
    key: S;
    value: T;
}
