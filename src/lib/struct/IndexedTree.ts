import { Tree } from "./Tree";
import { Dictionary } from "./Dictionary";
import { isArray } from "../Test";
import { List } from "./List";
import { map } from "../Arr";
import { once } from "../Util";

export class IndexedTree<T> extends Tree<T> {
	private _indexer: (node: this) => string | number;
	private _index: Dictionary<this> | undefined;
	constructor(id?: string | number, indexer?: (node: IndexedTree<T>) => string | number, index?: Dictionary<IndexedTree<T>>) {
		super(id);
		this._indexer = indexer ? indexer : (node: IndexedTree<T>) => node.id;
		this._index = index as any;
		if (index !== undefined) {
			this._index!.add(this.id, this);
		}
	}
	public get index(): Dictionary<this> {
		if (this._index === undefined) {
			let newIndex = new Dictionary<this>();
			this.forEach((node) => {
				if ((node)._index !== newIndex) {
					(node)._index = newIndex;
					this._index!.add(this._indexer(node as this), node as this);
				}
			});
		}
		return this._index! as Dictionary<this>;
	}
	public set index(v: Dictionary<this>) {
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
		return this.index.count;
	}
	public reIndex(): this {
		let root = this.root;
		this.index.clear();
		root.forEach((node: this) => {
			this.index.add(this._indexer(node), node);
		});
		return this;
	}
	// tslint:disable-next-line:no-reserved-keywords
	public get(id: string | number): this | undefined {
		once(() => {
			console.warn("Function IndexedTree::get(id) is deprecated please use IndexedTree::lookup instead. get is a reserved word.");
		});
		return this.lookup(id);
	}
	public lookup(id: string | number): this | undefined {
		return this.index.lookup(id);
	}
	public addTo(parentId: string | number, data: T | this, id?: string | number, updateIndex = true): this | undefined {
		let parent = this.index.lookup(parentId);
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
			this.index.add(this._indexer(node), node);
			if (!hasSameIndex) {
				node.forEach((el: this) => {
					el._index = this._index;
					el._indexer = this._indexer;
					this.index.add(this._indexer(el), el);
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
				parent.index.remove(parent._indexer(node));
			}
			node._index = undefined;
		});
		this._index = undefined;
	}
	public insertAt(pos: number, data: T, id?: string | number, updateIndex = true): this {
		const node = super.insertAt(pos, data, id);
		if (updateIndex) {
			this.index.add(this._indexer(node), node);
			node.forEach((el: this) => {
				el._index = this._index;
				el._indexer = this._indexer;
				this.index.add(this._indexer(el), el);
			});
		}
		return node;
	}
	public clone(): this {
		const node = super.clone();
		if (node.parent === null) {
			node._index = new Dictionary<this>();
			node.forEach((n) => n._index = node.index);
			node.reIndex();
		}
		return node;
	}
	public contains(node: this | string | number): boolean {
		return this.index.contains(node instanceof IndexedTree ? this._indexer(node) : node);
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
	public filter(condition: (node: this) => boolean, parent: this | null = null): this | null {
		let root = super.filter(condition, parent);
		if (root !== null && root.parent === null) {
			root.reIndex();
		}
		return root;
	}

	public static fromObject<T>(obj: any, indexer?: (node: IndexedTree<T>) => string | number): Tree<T> {
		const parent: IndexedTree<T> | null = (this instanceof IndexedTree) ? this : null;
		const root = new IndexedTree<T>(obj.id, indexer, parent ? parent._index : undefined).init({ data: obj.data, parent: parent as Tree<T> }) as IndexedTree<T>;
		root.index.add(root._indexer(root!), root);
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<IndexedTree<T>>(map<any, IndexedTree<T>>(obj.children as Array<IndexedTree<T>>, (el, i) => IndexedTree.fromObject.call(root, el, indexer) as IndexedTree<T>));
		}
		return root;
	}
	public static fromNodeList<S, T>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string | number) | string | number,
		parent?: ((node: S) => string | number) | string | number,
		data?: ((node: S) => any) | string
		// tslint:disable-next-line:align
	}, virtualRoot: boolean = false): Tree<T> {
		let tree = super.fromNodeList(nodes, mapcfg, virtualRoot, IndexedTree) as IndexedTree<T>;
		tree.reIndex();
		return tree;
	}
}
