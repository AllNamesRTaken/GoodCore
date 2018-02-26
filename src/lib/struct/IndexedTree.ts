import { Tree } from "./Tree";
import { Dictionary } from "./Dictionary";
import { newUUID } from "../Util";
import { isArray } from "../Test";
import { List } from "./List";
import { map } from "../Arr";

export class IndexedTree<T> extends Tree<T> {
	private _indexer: (node: IndexedTree<T>) => string | number;
	private _index: Dictionary<IndexedTree<T>> | undefined;
	constructor(id?: string | number, indexer?: (node: IndexedTree<T>) => string | number, index?: Dictionary<IndexedTree<T>>) {
		super(id);
		this._indexer = indexer ? indexer : (node: IndexedTree<T>) => node.id;
		this._index = index;
		if (index !== undefined) {
			this._index!.set(this.id, this);
		}
    }
    public get index(): Dictionary<IndexedTree<T>> {
		if (this._index === undefined) {
			let newIndex = new Dictionary<IndexedTree<T>>();
			this.forEach((node) => {
				if ((node as IndexedTree<T>)._index !== newIndex) {
					(node as IndexedTree<T>)._index = newIndex;
					this._index!.set(this._indexer(node as IndexedTree<T>), node as IndexedTree<T>);
				}
			});
		}
        return this._index!;
    }
    public set index(v: Dictionary<IndexedTree<T>>) {
		throw "Not a settable property"
    }
    public get indexer(): (node: IndexedTree<T>) => string | number {
		return this._indexer;
    }
    public set indexer(v: (node: IndexedTree<T>) => string | number) {
		let hasChanged = this._indexer !== v;
		this._indexer = v;
		if (hasChanged) {
			this.reIndex();
		}
	}
	public get count(): number {
		return this.index.count;
	}
	protected create<S = T>(id?: string | number): Tree<S> {
		return super.create(id, this._indexer) as IndexedTree<S>;
	}
	public reIndex() {
		let root = this.root;
		this.index.clear();
		root.forEach((node: Tree<T>) => {
			this.index.set(this._indexer(node as IndexedTree<T>), node as IndexedTree<T>);
		})
	}
	public get(id: string | number): IndexedTree<T> | undefined {
		return this.index.get(id) as IndexedTree<T>;
	}
	public addTo(parentId: string | number, data: T|IndexedTree<T>, id?: string | number, updateIndex = true): IndexedTree<T> | undefined {
		let parent = this.index.get(parentId) as IndexedTree<T>;
		let node: IndexedTree<T> | undefined = undefined;
		if (parent) {
			node = parent.add(data, id, updateIndex) as IndexedTree<T>;
		}
		return node;
	}
	public add(data: T|IndexedTree<T>, id?: string | number, updateIndex = true): IndexedTree<T> {
		let node = super.add(data, id) as IndexedTree<T>;
		if (updateIndex) {
			let hasSameIndex = this.index === node.index;
			if ( !hasSameIndex ) {
				node._index = this.index;
			}
			this.index.set(this._indexer(node), node);
			if ( !hasSameIndex ) {
				node.forEach((el: Tree<T>) => {
					(el as IndexedTree<T>)._index = this._index;
					(el as IndexedTree<T>)._indexer = this._indexer;
					this.index.set(this._indexer(el as IndexedTree<T>), el as IndexedTree<T>);
				});
			}
		}
		return node;
	}
	public remove(): void {
		let parent = this.parent as IndexedTree<T>;
		super.remove();
		this.forEach((node: Tree<T>) => {
			parent.index.delete(parent._indexer(node as IndexedTree<T>));
			(node as IndexedTree<T>)._index = undefined;
		});
		this._index = undefined;
	}
	public insertAt(pos: number, data: T, id?: string | number, updateIndex = true): IndexedTree<T> {
		const node = super.insertAt(pos, data, id) as IndexedTree<T>;
		if (updateIndex) {
			this.index.set(this._indexer(node), node);
			node.forEach((el: Tree<T>) => {
				(el as IndexedTree<T>)._index = this._index;
				(el as IndexedTree<T>)._indexer = this._indexer;
				this.index.set(this._indexer(el as IndexedTree<T>), el as IndexedTree<T>);
			});
		}
		return node;
	}
	public clone(): IndexedTree<T> {
		const node = super.clone() as IndexedTree<T>;
		if(node.parent === null) {
			node._index = new Dictionary<IndexedTree<T>>();
			node.forEach((n) => (n as IndexedTree<T>)._index = node.index);
			node.reIndex();
		}
		return node;
	}
    public contains(node: IndexedTree<T> | string | number): boolean {
        return this.index.contains(node instanceof IndexedTree ? this._indexer(node) : node);
	}
	public prune(): IndexedTree<T> {
		let tree = super.prune() as IndexedTree<T>;
		this.reIndex();
		return tree;
	}
	public cut(): IndexedTree<T> {
		let cut = super.cut() as IndexedTree<T>;
		cut.reIndex();
		return cut as IndexedTree<T>;
	}
	public filter(condition: (node: Tree<T>) => boolean, parent: Tree<T> | null = null): IndexedTree<T> {
		let root = super.filter(condition, parent) as IndexedTree<T>;
		if (root.parent === null) {
			root.reIndex();
		}
		return root;
	}

	public static fromObject<T>(obj: any, indexer?: (node: IndexedTree<T>) => string | number): Tree<T> {
		const parent: IndexedTree<T> | null = (this instanceof IndexedTree) ? this : null;
        const root = new IndexedTree<T>(obj.id, indexer, parent ? parent._index : undefined).init({ data: obj.data, parent: parent as Tree<T> }) as IndexedTree<T>;
        root.index.set(root._indexer(root!), root);
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<IndexedTree<T>>(map<any, IndexedTree<T>>(obj.children as Array<IndexedTree<T>>, (el, i) => IndexedTree.fromObject.call(root, el, indexer) as IndexedTree<T>)) as List<Tree<T>>;
        }
		return root;
	}
	public static fromNodeList<S, T>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string | number)|string | number, 
		parent?: ((node: S) => string | number)|string | number, 
		data?: ((node: S) => any)|string
	// tslint:disable-next-line:align
	}, virtualRoot: boolean = false): Tree<T> {
		let tree = super.fromNodeList(nodes, mapcfg, virtualRoot, IndexedTree) as IndexedTree<T>;
		tree.reIndex();
		return tree;
	}
}
