/// <reference path="../base.d.ts" />

import { List } from "./List";
export class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable<Tree<T>> {
    public id: string;
    public parent: Tree<T> | null;
    public children: List<Tree<T>> | null;
    public data: T | null;
    public virtual: boolean;
    public isDirty: boolean;
    public size: number;
    public leafCount: number;
    public childCount: number;
    public weight: number;

    protected _virtual: boolean;
    protected _size: number;
	protected _leafCount: number;
    protected _weight;
    
    root: Tree<T>;
    static fromObject<T>(obj: any): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string) | string;
        parent?: ((node: S) => string) | string;
        data?: ((node: S) => any) | string;
    }, virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number);
    protected create<S = T>(...args: any[]): Tree<S>;
    protected markAsDirty(): void;
    public reCalculateSize(): this;
    public collect<S = any>(fn: (cur: this, i: number, collected: List<S>, isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    public init(obj: Partial<Tree<T>>, mapping?: any): this;
    public insertAt(pos: number, data: T, id?: string | number): void;
    public add(data: T | Tree<T>, id?: string | number): void;
    public remove(): void;
    public prune(): Tree<T>;
    public cut(): Tree<T>;
    public forEach(fn: (el: Tree<T>, i: number) => void, _i?: number): Tree<T>;
    public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S;
    public clone(): Tree<T>;
    public filter(condition: (node: Tree<T>) => boolean): Tree<T>;
    public select(condition?: (node: Tree<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
    public find(condition: number | ((node: this) => boolean)): this | null;
    protected _findBySize(pos: number): this | null;
    public depth(): number;
    public sort(comparer: (a: Tree<T>, b: Tree<T>) => number): Tree<T>;
    public serialize(): T[];		
    public toJSON(): any;
}
