/// <reference path="../base.d.ts" />

import { List } from "./List";
export class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable {
    public id: string;
    public parent: this | null;
    public children: List<this> | null;
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
    protected _weight: number;
    
    root: this;
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
    public aggregate<S = any>(fn: (cur: this, i: number, agg: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
/**
 * @deprecated Since version 1.9.2. Will be deleted in version 2.0. Use aggregate instead.
 */
    public collect<S = any>(fn: (cur: this, i: number, collected: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    public init(obj: Partial<this>, mapping?: any): this;
    public insertAt(pos: number, data: T, id?: string | number): void;
    public add(data: T | this, id?: string | number): this;
    public remove(): void;
    public prune(): this;
    public cut(): this;
    public forEach(fn: (el: this, i: number) => void, _i?: number): this;
    public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S;
    public clone(): this;
    public filter(condition: (node: this) => boolean): this;
    public select(condition?: (node: this) => boolean, acc?: List<this>): List<this>;
    public find(condition: number | ((node: this) => boolean)): this | null;
    protected _findBySize(pos: number): this | null;
    public depth(): number;
    public sort(comparer: (a: this, b: this) => number): this;
    public serialize(): T[];		
    public toJSON(): any;
    public on(event: TreeEvent, callback: (targets: Array<Tree<T>>) => void): number;
    public off(event: TreeEvent, index: number): void;
    public trigger(event: TreeEvent, targets: Array<Tree<T>>): void;    
    public set(values: Partial<T>): void;
}
