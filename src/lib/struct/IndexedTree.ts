import { Tree } from "./Tree.js";
import { isArray } from "../Test.js";
import { once } from "../Util.js";
import { wipe } from "../Obj.js";
import type { Indexable } from "../../@types/index.js";

export class IndexedTree<T> extends Tree<T> {
  private _indexer: (node: this) => string | number;
  private _index: Indexable<this> | undefined;
  constructor(
    id?: string | number,
    indexer?: (node: IndexedTree<T>) => string | number,
    index?: { [key: string]: IndexedTree<T> },
  ) {
    super(id);
    this._indexer = indexer ? indexer : (node: IndexedTree<T>) => node.id;
    this._index = index as any;
    if (index !== undefined) {
      this._index![this.id] = this;
    }
  }
  public get index(): Indexable<this> {
    if (this._index === undefined) {
      let newIndex = Object.create(null);
      this.forEach((node) => {
        if (node._index !== newIndex) {
          node._index = newIndex;
          this._index![this._indexer(node as this)] = node as this;
        }
      });
    }
    return this._index! as Indexable<this>;
  }
  public set index(v: Indexable<this>) {
    throw new Error("Not a settable property");
  }
  public get indexer(): (node: this) => string | number {
    return this._indexer;
  }
  public set indexer(v: (node: this) => string | number) {
    let hasChanged = this._indexer !== v;
    this._indexer = v;
    if (hasChanged) {
      this.reIndex();
    }
  }
  public get _count(): number {
    return Object.keys(this.index).length;
  }
  public reIndex(): this {
    let root = this.root;
    wipe(this.index);
    root.forEach((node: this) => {
      this.index[this._indexer(node)] = node;
    });
    return this;
  }
  // tslint:disable-next-line:no-reserved-keywords
  public get(id: string | number): this | undefined {
    once(() => {
      console.warn(
        "Function IndexedTree::get(id) is deprecated please use IndexedTree::lookup instead. get is a reserved word.",
      );
    });
    return this.lookup(id);
  }
  public lookup(id: string | number): this | undefined {
    return this.index[id];
  }
  public addTo(
    parentId: string | number,
    data: T | this,
    id?: string | number,
    updateIndex = true,
  ): this | undefined {
    let parent = this.index[parentId];
    let node: this | undefined;
    if (parent) {
      node = parent.add(data, id, updateIndex);
    }
    return node;
  }
  public add(data: T | this, id?: string | number, updateIndex = true): this {
    let node = super.add(data, id);
    if (updateIndex) {
      let hasSameIndex = this.index === node.index;
      if (!hasSameIndex) {
        node._index = this.index;
      }
      this.index[this._indexer(node)] = node;
      if (!hasSameIndex) {
        node.forEach((el: this) => {
          el._index = this._index;
          el._indexer = this._indexer;
          this.index[this._indexer(el)] = el;
        });
      }
    }
    return node;
  }
  public remove(): void {
    let parent = this.parent;
    super.remove();
    this.forEach((node: this) => {
      if (parent !== null) {
        delete parent.index[parent._indexer(node)];
      }
      node._index = undefined;
    });
    this._index = undefined;
  }
  public insertAt(
    pos: number,
    data: T | this,
    id?: string | number,
    updateIndex = true,
  ): this {
    const node = super.insertAt(pos, data, id);
    if (updateIndex) {
      this.index[this._indexer(node)] = node;
      node.forEach((el: this) => {
        el._index = this._index;
        el._indexer = this._indexer;
        this.index[this._indexer(el)] = el;
      });
    }
    return node;
  }
  public clone(): this {
    const node = super.clone();
    if (node.parent === null) {
      node._index = Object.create(null);
      node.forEach((n) => (n._index = node.index));
      node.reIndex();
    }
    return node;
  }
  public contains(node: this | string | number): boolean {
    return (
      this.index[node instanceof IndexedTree ? this._indexer(node) : node] !==
      undefined
    );
  }
  public prune(): this {
    let tree = super.prune();
    this.reIndex();
    return tree;
  }
  public cut(): this {
    let cut = super.cut();
    cut.reIndex();
    return cut;
  }
  public filter(
    condition: (node: this) => boolean,
    parent: this | null = null,
  ): this | null {
    let root = super.filter(condition, parent);
    if (root !== null && root.parent === null) {
      root.reIndex();
    }
    return root;
  }

  public static fromObject<T>(
    obj: Indexable<any>,
    indexer?: (node: IndexedTree<T>) => string | number,
  ): Tree<T> {
    const parent: IndexedTree<T> | null =
      this instanceof IndexedTree ? this : null;
    const root = new IndexedTree<T>(
      obj.id as any,
      indexer,
      parent ? parent._index : undefined,
    ).init({
      data: obj.data as any,
      parent: parent as Tree<T>,
    }) as IndexedTree<T>;
    root.index[root._indexer(root!)] = root;
    if (obj.children !== undefined && isArray(obj.children)) {
      root.children = (obj.children as Array<IndexedTree<T>>).map(
        (el, i) =>
          IndexedTree.fromObject.call(root, el, indexer) as IndexedTree<T>,
      );
    }
    return root;
  }
  public static fromNodeList<S, T>(
    nodes: S[],
    mapcfg?: {
      id?: ((node: S) => string | number) | string | number;
      parent?: ((node: S) => string | number) | string | number;
      data?: ((node: S) => any) | string;
      // tslint:disable-next-line:align
    },
    virtualRoot: boolean = false,
  ): Tree<T> {
    let tree = super.fromNodeList(
      nodes,
      mapcfg,
      virtualRoot,
      IndexedTree,
    ) as IndexedTree<T>;
    tree.reIndex();
    return tree;
  }
}
