/// <reference path="../base.d.ts" />

import { List } from "./List";
export class Comparer {
    static StringAsc: (a: string, b: string) => 1 | 0 | -1;
    static StringDesc: (a: string, b: string) => 1 | 0 | -1;
    static NumberAsc: (a: number, b: number) => 1 | 0 | -1;
    static NumberDesc: (a: number, b: number) => 1 | 0 | -1;
}
export class SortedList<T = number> implements IBasicList<T>, ISerializable<T[]>, IDeserializable<SortedList<T>>, ICloneable<SortedList<T>> {
    constructor(comparer?: ((a: T, b: T) => number), arr?: T[] | List<T> | SortedList<T>);
    [Symbol.iterator](): IterableIterator<T>;
    next(value?: any): IteratorResult<T>;
    protected create<S = T>(comparer?: (a: S, b: S) => number, arr?: S[] | List<S> | SortedList<S>): SortedList<S>;
    readonly values: T[];
    get(pos: number): T | undefined;
    readonly count: number;
    readonly length: number;
    comparer: (a: T, b: T) => number;
    sort(): void;
    truncate(size?: number): SortedList<T>
    fill(size: number, populator: ((i: number) => T) | T): SortedList<T>;
    clear(): SortedList<T>;
    add(v: T): SortedList<T>;
    pop(): T | undefined;
    shift(): T | undefined;
    bulkAdd(v: T[] | List<T> | SortedList<T>): SortedList<T>;
    copy(src: SortedList<T> | List<T> | T[]): SortedList<T>;
    clone(): SortedList<T>;
    remove(v: T): SortedList<T>;
    removeAt(n: number): T | undefined;
    removeFirst(fn: (el: T) => boolean): T | undefined;
    forEach(fn: (el: T, i: number) => any, startIndex?: number): SortedList<T>;
    forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T>;
    until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): SortedList<T>;
    until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): SortedList<T>;
    reverseForEach(fn: (el: T, i: number) => any): SortedList<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): SortedList<T>;
    some(fn: (el: T) => boolean): boolean;
    all(fn: (el: T) => boolean): boolean;
    getInsertIndex(v: T): number;
    indexOf(v: T | ((el: T) => boolean)): number;
    contains(v: T | ((el: T) => boolean)): boolean;
    first(fn?: (el: T) => boolean): T | undefined;
    find(fn: (el: T) => boolean): T | undefined;
    last(): T | undefined;
    filter(fn: (el: T, i: number) => boolean): SortedList<T>;
    select(fn: (el: T, i: number) => boolean): SortedList<T>;
    selectInto(src: SortedList<T> | List<T> | T[], fn: (el: T, i: number) => boolean): SortedList<T>;
    head(count?: number): SortedList<T>;
    tail(count?: number): SortedList<T>;
    map<S>(fn: (el: T, i: number) => S): List<S>;
    mapInto<S>(src: SortedList<S> | List<S> | S[], fn: (el: S, i: number) => T): SortedList<T>;
    reduce<U>(fn: (acc: U, cur: T) => any, start: U): U;
    reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
    reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    equals(b: List<T> | SortedList<T>): boolean;
    same(b: List<T> | SortedList<T>): boolean;
    intersect(b: List<T> | SortedList<T>): SortedList<T>;
    union(b: List<T> | SortedList<T>): SortedList<T>;
    toList(): List<T>;
    toJSON(): any;
    serialize(): T[];
    deserialize(array: any[], ...types: Array<Constructor<any>>): SortedList<T>;
}
