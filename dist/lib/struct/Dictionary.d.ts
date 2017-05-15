import { List } from "./List";
export declare class Dictionary<T> {
    private _lookup;
    private _index;
    private _list;
    private _reverseIndex;
    constructor();
    Has(key: string): boolean;
    Get(key: string): T;
    Set(key: string, value: T): Dictionary<T>;
    Delete(key: string): Dictionary<T>;
    Clear(): Dictionary<T>;
    readonly Values: T[];
    readonly Keys: string[];
    readonly List: List<T>;
}
