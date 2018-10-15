/// <reference path="../base.d.ts" />

export class Pool<T>{
    readonly available: number;
    readonly size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    get(): T && IPoolable;
    release(obj: T): void;
}
