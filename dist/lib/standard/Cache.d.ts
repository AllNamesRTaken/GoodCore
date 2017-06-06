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
    size: number;
    readonly count: number;
    readonly stageCount: number;
    constructor(size?: number);
    hit(key: string): boolean;
    get(key: string): T;
    push(key: string, data: T): void;
    getStaged(key: string): T;
    stage(key: string, data: T): void;
    publish(key: string): void;
    remove(key: string): void;
    cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void;
    clear(): void;
    private add(key, data);
    private trim();
}
