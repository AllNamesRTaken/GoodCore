/// <reference path="base.d.ts" />

import { Dictionary } from "./Dictionary";
import { Tree } from "./Tree";
export class IndexedTree<T> extends Tree<T> {
    init(obj: Partial<IndexedTree<T>>, mapping?: any): this;
    index: Dictionary<IndexedTree<T>>;
    indexer: (node: IndexedTree<T>) => string | number;
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
    addTo(parentId: string | number, data: T|IndexedTree<T>, id?: string | number, updateIndex?: boolean): IndexedTree<T> | undefined;
    add(data: T | IndexedTree<T>, id?: string | number, updateIndex?: boolean): void;
    contains(node: IndexedTree<T> | string | number): boolean
    get(id: string | number): IndexedTree<T> | undefined;
    cut(): IndexedTree<T>;
    reIndex(): void;
    clone(): IndexedTree<T>;
    prune(): IndexedTree<T>;
    filter(condition: (node: Tree<T>) => boolean, parent?: Tree<T> | null): IndexedTree<T>;
}
