/// <reference path="base.d.ts" />

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
    export function reduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U, pos?: number, to?: number): U;
    export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
    export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    export function forEach<T>(src: T[], fn: (el: T, i: number) => any, startIndex?: number): void;
    export function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel?: boolean): Promise<void>
    export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, startIndex?: number): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
    export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void;
    export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): void;
    export function some<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function insertAt<T>(src: T[], pos: number, v: T): void;
    export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
    export function create<T>(length: number, populator: (i?: number, arr?: T[]) => T): T[];
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
    export function pivot<S = any, T extends Array<S> = S[]>(arr: T[]): S[][];
    export function deserialize<S>(array: any[], target: S[], ...types: Array<Constructor<any>>): S[];
    type Descriminator<T> = (el: T) => boolean;
    export function bucket<T>(array: T[], ...desciminators: Array<Descriminator<T>>): T[][];
    export function split<T>(array: T[], isA: Descriminator<T>): [T[], T[]];
    export function disinct<T>(array: T[], hashFn?: (el: T) => string): T[];
    