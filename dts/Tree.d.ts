/// <reference path="base.d.ts" />

import { List } from "./List";
export class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable<Tree<T>> {
    id: string;
    parent: Tree<T> | null;
    children: List<Tree<T>> | null;
    data: T | null;
    virtual: boolean;
    root: Tree<T>;
    static fromObject<T>(obj: any): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string) | string;
        parent?: ((node: S) => string) | string;
        data?: ((node: S) => any) | string;
    }, virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number);
    protected create<S = T>(...args: any[]): Tree<S>;
    init(obj: Partial<Tree<T>>, mapping?: any): this;
    insertAt(pos: number, data: T, id?: string | number): void;
    add(data: T | Tree<T>, id?: string | number): void;
    remove(): void;
    prune(): Tree<T>;
    cut(): Tree<T>;
    forEach(fn: (el: Tree<T>, i: number) => void, _i?: number): Tree<T>;
    reduce(fn?: (acc: any, cur: Tree<T> | null) => any, start?: any): any;
    clone(): Tree<T>;
    filter(condition: (node: Tree<T>) => boolean): Tree<T>;
    select(condition?: (node: Tree<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
    find(condition: (node: Tree<T>) => boolean): Tree<T> | null;
    depth(): number;
    sort(comparer: (a: Tree<T>, b: Tree<T>) => number): Tree<T>;
    serialize(): T[];		
    toJSON(): any;
}
