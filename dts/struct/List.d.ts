/// <reference path="../base.d.ts" />

export class List<T> implements IList<T>, ISerializable<T[]>, IDeserializable<List<T>>, ICloneable {
    constructor(arr?: T[] | List<T>);
    [Symbol.iterator](): IterableIterator<T>;
    next(value?: any): IteratorResult<T>;
    protected create<S = T>(arr?: S[] | List<S>): List<S>;
    readonly values: T[];
    get(pos: number): T | undefined;
    read(pos: number): T | undefined;
    getByIndex(key: number | string): T | undefined;
    set(pos: number, v: T): List<T>;
    write(pos: number, v: T): List<T>;
    readonly count: number;
    readonly length: number;
    indexer: ((el: T) => any) | null;
    truncate(size?: number): List<T>
    fill(size: number, populator: ((i: number) => T) | T): List<T>;
    clear(): List<T>;
    add(v: T): List<T>;
    insertAt(pos: number, v: T): List<T>;
    push(v: T): number;
    pop(): T | undefined;
    shift(): T | undefined;
    concat(v: T[] | List<T>): List<T>;
    append(v: T[] | List<T>): List<T>;
    copy(src: List<T> | T[]): List<T>;
    shallowCopy(src: List<T> | T[]): List<T>;
    clone(): this;
    remove(v: T): List<T>;
    removeFirst(fn: (el: T) => boolean): T | undefined;
    removeAt(n: number): T | undefined;
    forEach(fn: (el: T, i: number) => any, startIndex?: number): List<T>;
    forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T>;
    until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): List<T>;
    until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): List<T>;
    reverseForEach(fn: (el: T, i: number) => any): List<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): List<T>;
    some(fn: (el: T) => boolean): boolean;
    all(fn: (el: T) => boolean): boolean;
    indexOf(v: T | ((el: T) => boolean)): number;
    contains(v: T | ((el: T) => boolean)): boolean;
    reverse(): List<T>;
    first(fn?: (el: T) => boolean): T | undefined;
    find(fn: (el: T) => boolean): T | undefined;
    last(): T | undefined;
    filter(fn: (el: T, i: number) => boolean): List<T>;
    select(fn: (el: T, i: number) => boolean): List<T>;
    selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T>;
    head(count?: number): List<T>;
    tail(count?: number): List<T>;
    splice(pos?: number, remove?: number, insert?: T[] | List<T>): List<T>;
    orderBy(fn: (a: T, b: T) => number): List<T>;
    map<S>(fn: (el: T, i: number) => S): List<S>;
    mapInto<S>(src: List<S> | S[], fn: (el: S, i: number) => T): List<T>;
    reduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
    reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
    reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    equals(b: List<T>): boolean;
    same(b: List<T>): boolean;
    intersect(b: List<T>): List<T>;
    union(b: List<T>): List<T>;
    subtract(b: List<T>): List<T>;
    zip<U, V>(list: List<U>, fn?: (t: T, u: U) => V): List<V>;
    unzip<U, V>(fn?: (el: T) => [U, V]): [List<U>, List<V>];
    flatten<U>(maxDepth?: number): List<U>;
    toJSON(): any;
    serialize(): T[];
    deserialize(array: any[], ...types: Array<Constructor<any>>): List<T>;
}