import List from "./List";
export default class Dictionary<T> {
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
    readonly Values: Array<T>;
    readonly Keys: Array<string>;
    readonly List: List<T>;
}
