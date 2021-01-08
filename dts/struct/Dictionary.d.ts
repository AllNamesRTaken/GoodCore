/// <reference path="../base.d.ts" />

import { List } from "./List";
export class Dictionary<T> implements ISerializable<IObject>, IDeserializable<Dictionary<T>>, ICloneable {
    constructor();
    protected create<S = T>(): Dictionary<S>;
    has(key: number | string): boolean;
    contains(key: number | string): boolean;
    get(key: number | string): T | undefined;
    lookup(key: number | string): T | undefined;
    add(key: number | string, value: T): Dictionary<T>;
    set(key: number | string, value: T): Dictionary<T>;
    remove(key: number | string, value: T): Dictionary<T>;
    delete(key: number | string): Dictionary<T>;
    remove(key: number | string): Dictionary<T>;
    clear(): Dictionary<T>;
    readonly values: T[];
    readonly keys: string[];
    readonly count: number;
    clone(): this;
    toJSON(): any;
    serialize(): IObject;
    deserialize(obj: any, ...types: Array<Constructor<any>>): Dictionary<T>;
}
