import { List } from "./List";
export declare class Stack<T> {
    private _array;
    private _pos;
    readonly values: T[];
    readonly depth: number;
    constructor(size?: number);
    push(obj: T): void;
    pop(): T;
    toList(): List<T>;
}
