export default class Pool<T extends IPoolable> implements IPool<IPoolable> {
    private pool;
    private growthStep;
    private cls;
    private available;
    private size;
    readonly Available: number;
    readonly Size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    private Create();
    Get(): T;
    Release(obj: T): void;
}
