import { Tree } from "./Tree";
import { Dictionary } from "./Dictionary";
import { newUUID } from "../Util";
import { isArray } from "../Test";
import { List } from "./List";
import { map } from "../Arr";

export class IndexedTree<T> extends Tree<T> {
	private _indexer: (node: Tree<T>) => string | number;
	private _index: Dictionary<Tree<T>>;
	constructor(id?: string | number, indexer?: (node: Tree<T>) => string | number, index?: Dictionary<Tree<T>>) {
		super(id);
		this._indexer = indexer ? indexer : (node: Tree<T>) => node.id;
		this._index = index || new Dictionary();
    }
    public get indexer(): (node: Tree<T>) => string | number {
        return this._indexer;
    }
    public set indexer(v: (node: Tree<T>) => string | number) {
        this._indexer = v;
    }

	protected create<S = T>(id?: string | number): Tree<S> {
		return super.create(id, this._indexer, this._index);
	}
	public get(id: string | number): IndexedTree<T> | undefined {
		return this._index.get(id) as IndexedTree<T>;
	}
	public addTo(parentId: string | number, data: T|Tree<T>, id?: string | number): IndexedTree<T> | undefined {
		let parent = this._index.get(parentId);
		let node: IndexedTree<T> | undefined = undefined;
		if (parent) {
			node = parent.add(data, id) as IndexedTree<T>;
		}
		return node;
	}
	public add(data: T|Tree<T>, id?: string | number): Tree<T> {
		let node = super.add(data, id)
		this._index.set(this._indexer(node), node);
		return node;
	}
	public remove(): void {
		super.remove();
		this._index.delete(this._indexer(this as Tree<T>));
	}
	public insertAt(pos: number, data: T, id?: string | number): Tree<T> {
		const node = super.insertAt(pos, data, id);
		this._index.set(this._indexer(node), node);
		return node;
	}
	public clone(): Tree<T> {
		const node = super.clone();
		(node as IndexedTree<T>)._index = this._index;
		(node as IndexedTree<T>)._indexer = this._indexer;
		return node;
	}
	protected duplicateNode(): IndexedTree<T> {
		const node = (super.duplicateNode() as any) as IndexedTree<T>;
		node._index = this._index;
		node._indexer = this._indexer;
		return node;
    }
    public contains(node: Tree<T> | string): boolean {
        return this._index.contains(node instanceof Tree ? this._indexer(node) : node);
    }
	public static fromObject<T>(obj: any, indexer?: (node: Tree<T>) => string | number): Tree<T> {
		const parent: IndexedTree<T> | null = (this instanceof IndexedTree) ? this : null;
        const root = new IndexedTree<T>(obj.id, indexer, parent ? parent._index : undefined).init({ data: obj.data, parent }) as IndexedTree<T>;
        root._index.set(root._indexer(root!), root);
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<IndexedTree<T>>(map<any, IndexedTree<T>>(obj.children as Array<IndexedTree<T>>, (el, i) => IndexedTree.fromObject.call(root, el, indexer) as IndexedTree<T>));
        }
		return root;
	}
	public static fromNodeList<S, T>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string | number)|string | number, 
		parent?: ((node: S) => string | number)|string | number, 
		data?: ((node: S) => any)|string
	// tslint:disable-next-line:align
	}, virtualRoot: boolean = false): Tree<T> {
		throw "NotImplemented for IndexedTree";	
	}
}
