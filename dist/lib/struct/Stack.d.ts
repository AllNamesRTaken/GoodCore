import List from "./List";
export default class Stack<T> {
    private _array;
    private _pos;
    readonly Values: Array<T>;
    readonly Depth: number;
    constructor(size?: number);
    Push(obj: T): void;
    Pop(): T;
    ToList(): List<T>;
}
