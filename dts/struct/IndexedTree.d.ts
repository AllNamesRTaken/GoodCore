/// <reference path="../base.d.ts" />

import { Dictionary } from "./Dictionary";
import { Tree } from "./Tree";
export class IndexedTree<T> extends Tree<T> {
    init(obj: Partial<this>, mapping?: any): this;
    index: Dictionary<this>;
    indexer: (node: this) => string | number;
    count: number;
    static fromObject<T>(obj: any, indexer?: (node: IndexedTree<T>) => string | number): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string | number)|string | number, 
        parent?: ((node: S) => string | number)|string | number, 
        data?: ((node: S) => any)|string
    }, virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number, indexer?: (node: IndexedTree<T>) => string | number, index?: Dictionary<Tree<T>>);
    protected create<S = T>(...args: any[]): Tree<S>;
    insertAt(pos: number, data: T, id?: string | number, updateIndex?: boolean): void;
    addTo(parentId: string | number, data: T| this, id?: string | number, updateIndex?: boolean): this | undefined;
    add(data: T | this, id?: string | number, updateIndex?: boolean): this;
    contains(node: this | string | number): boolean
    get(id: string | number): this | undefined;
    lookup(id: string | number): this | undefined;
    cut(): this;
    reIndex(): void;
    clone(): this;
    prune(): this;
    filter(condition: (node: this) => boolean, parent?: this | null): this;
}
