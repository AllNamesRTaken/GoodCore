import { List } from "./List";
export declare class Stack<T> {
    private _array;
    private _pos;
    readonly Values: T[];
    readonly Depth: number;
    constructor(size?: number);
    Push(obj: T): void;
    Pop(): T;
    ToList(): List<T>;
}
