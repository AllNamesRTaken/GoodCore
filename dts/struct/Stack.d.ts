/// <reference path="../base.d.ts" />

import { List } from "./List";
export class Stack<T> implements ISerializable<T[]>, IDeserializable<Stack<T>>, ICloneable {
    DEFAULT_SIZE: number;
    readonly values: T[];
    readonly depth: number;
    readonly size: number;
    readonly isEmpty: boolean;
    limit: number;
    constructor(size?: number);
    protected create<S = T>(size?: number): Stack<S>;
    push(obj: T): void;
    fastPush(obj: T): void;
    limitedPush(obj: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    peekAt(index: number): T | undefined;
    toList(): List<T>;
    clear(): Stack<T>;
    clone(): this;
    toJSON(): any;
    serialize(): T[];
    deserialize(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
}
