/// <reference path="base.d.ts" />

export class Pool<T extends IPoolable> implements IPool<IPoolable> {
    readonly available: number;
    readonly size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    get(): T;
    release(obj: T): void;
}
