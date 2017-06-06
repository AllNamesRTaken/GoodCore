import { List } from "./List";
export declare class Dictionary<T> {
    private _lookup;
    private _list;
    private _reverseIndex;
    private _isDirty;
    constructor();
    has(key: number | string): boolean;
    contains(key: number | string): boolean;
    get(key: number | string): T;
    set(key: number | string, value: T): Dictionary<T>;
    delete(key: number | string): Dictionary<T>;
    clear(): Dictionary<T>;
    readonly values: T[];
    readonly keys: string[];
    readonly list: List<T>;
    readonly count: number;
    private cleanList();
    private reCreateList();
}
