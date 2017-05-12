export declare class BaseCacheObject<T> {
    Key: string;
    Data: T;
}
export declare const _InitableCacheObject: typeof BaseCacheObject & ICtor<IInitable<typeof BaseCacheObject>>;
export declare class CacheObject<T> extends _InitableCacheObject<T> {
}
export declare class Cache<T> {
    private static DEFAULT_FIFO_SIZE;
    private _size;
    private _order;
    private _data;
    private _stage;
    Size: number;
    readonly Count: number;
    readonly StageCount: number;
    constructor(size?: number);
    Hit(key: string): boolean;
    Get(key: string): T;
    Push(key: string, data: T): void;
    GetStaged(key: string): T;
    Stage(key: string, data: T): void;
    Publish(key: string): void;
    Remove(key: string): void;
    Cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void;
    Clear(): void;
    private Add(key, data);
    private Trim();
}
