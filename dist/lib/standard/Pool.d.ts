export declare class Pool<T extends IPoolable> implements IPool<IPoolable> {
    private _pool;
    private _growthStep;
    private _cls;
    private _available;
    private _size;
    readonly available: number;
    readonly size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    private create();
    get(): T;
    release(obj: T): void;
}
