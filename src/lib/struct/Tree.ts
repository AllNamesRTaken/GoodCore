import { map } from "../Arr";
import { clone, isSameClass, setProperties } from "../Obj";
import { isArray, isNullOrUndefined, isUndefined, isNotNullOrUndefined, isNumber } from "../Test";
import { newUUID } from "../Util";
import { Dictionary } from "./Dictionary";
import { List } from "./List";
import { Stack } from "./Stack";
import { isNull } from "util";

export class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable<Tree<T>> {
	public id: string | number = "";
	public parent: this | null = null;
	public children: List<this> | null = null;
	public data: T | null = null;
	public isDirty: boolean = false;

	protected _virtual: boolean = false;
	protected _size: number = 1;
	protected _leafCount: number = 1;
	protected _weight = 1;
	
	public static fromObject<T>(obj: any): Tree<T> {
		const parent: Tree<T> | null = (this instanceof Tree) ? this : null;
		const root = new Tree<T>(obj.id).init({ data: obj.data, parent, isDirty: true });
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<Tree<T>>(map<any, Tree<T>>(obj.children as Array<Tree<T>>, Tree.fromObject.bind(root)));
		}
		return root;
	}
	public static fromNodeList<S, T>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string | number)|string | number, 
		parent?: ((node: S) => string | number)|string | number, 
		data?: ((node: S) => any)|string
	// tslint:disable-next-line:align
	}, 
	virtualRoot: boolean = false,
	ctor: Constructor<Tree<T>> = Tree
	): Tree<T> {
		let result = new Tree<T>();
		// create map
		let mapResolver = (key: string) => {
			return !mapcfg || typeof((mapcfg as any)[key]) === "undefined" ? 
			( key === "id" ? newUUID() : (el: S) => (el as any)[key] ):
				typeof((mapcfg as any)[key]) === "string" ? (el: S) => (el as any)[(mapcfg as any)[key]] : 
				(mapcfg as any)[key];
			};
		let map = {
			id: mapResolver("id"),
			parent: mapResolver("parent"),
			data: mapResolver("data")
		};
		// create node lookup
		let list = new List<S>(nodes);
		let lookup: Dictionary<Array<Tree<T>>> = new Dictionary();
		let nodeList = list.map((el) => new ctor("").init({id: map.id(el), data: map.data(el), isDirty: true}));
		nodeList.forEach((node, i) => {
			if (!lookup.has(node.id)) {
				lookup.set(node.id, []);
			}
			lookup.get(node.id)!.push(node);
		});

		// hook nodes together
		let rootNodes = new List<Tree<T>>();
		list.forEach((el, i) => {
			let parentId: string = map.parent(el);
			if (lookup.contains(parentId)) {
				lookup.get(parentId)!.forEach((p) => p.add(nodeList.get(i)!));
			} else {
				rootNodes.add(nodeList.get(i)!);
			}
		});

		// find root
		if (virtualRoot === false) {
			result = rootNodes.first()!;
		} else {
			result = new ctor().init({virtual: true});
			rootNodes.forEach((el) => result.add(el));
		}
		return result;
	}

	constructor(id?: string | number) {
		this.id = isNullOrUndefined(id) ? newUUID() : id!;
	}
	public get root(): this {
		let root = this;
		while (root.parent) {
			root = root.parent;
		}
		return root;
	}

	public get childCount(): number {
		return isNull(this.children) ? 0 : this.children.count;
	}
	public get size(): number {
		return this.isDirty ? this.reCalculateSize().size : this._size;
	}
	public get leafCount(): number {
		return this.isDirty ? this.reCalculateSize().leafCount : this._leafCount;
	}
	public get weight(): number {
		return this._weight;
	}
	public set weight(value: number) {
		let changed = value !== this._weight;
		this._weight = value;
		if (changed) {
			this.markAsDirty();
		}
	}
	public get virtual(): boolean {
		return this._virtual;
	}
	public set virtual(value: boolean) {
		let changed = value !== this._virtual;
		this._virtual = value;
		if (changed) {
			this._weight = value ? 0 : 1;
			this.markAsDirty();
		}
	}

	protected markAsDirty(): void {
		if (!this.isDirty) {
			this.isDirty = true;
			if (this.parent !== null) {
				this.parent.markAsDirty();
			}
		}
	}
	protected create<S = T>(...args: any[]): this {
		return new ((this as any).constructor)(...args);
	}
	public init(obj: Partial<Tree<T>>, mapping?: any): this {
		setProperties(this, obj);
		return this;
	}
	public insertAt(pos: number, data: T|this, id?: string | number): this {
		let node: this;
		if (this.children === null || this.children.count <= pos) {
			node = this.add(data);
		} else {
			if ( data instanceof Tree ) {
				node = data;
				data.parent = this;
			} else {
				node = this.create<T>(id).init({ data, parent: this });
			}
			this.children.insertAt(pos, node);
			this.markAsDirty();
		}
		return node;
	}
	public add(data: T|this, id?: string | number): this {
		let node: this;
		if (this.children === null) {
			this.children = new List<this>();
		}
		if (isSameClass(data, this)) {
			node = data as this;
			node.parent = this;
			this.children.add(node);
		} else {
			node = (this.create<T>(id)).init({ data: data as T, parent: this });
			this.children.add(node);
		}
		this.markAsDirty();
		return node;
	}
	public remove(): void {
		if (this.parent !== null) {
			this.parent.children!.remove(this);
			if (this.parent.children!.count === 0) {
				this.parent.children = null;
			}
			this.parent.markAsDirty()
		}
	}
	public prune(): this {
		if (this.children !== null) {
			this.children
				.forEach(function(el: Tree<T>, i: number) {
					el.parent = null;
				})
				.clear();
		}
		this.children = null;
		this.markAsDirty()
		return this;
	}
	public cut(): this {
		this.remove();
		this.parent = null;
		return this;
	}
	public forEach(fn: (el: this, i: number) => void, _i: number = 0): this {
		fn(this, _i);
		if(this.children) {
			this.children.forEach((child, i) => child.forEach(fn, i));
		}
		return this;
	}
	public reCalculateSize(): this {
		this.collect<number[]>((cur, i, collected) => {
				[cur._size, cur._leafCount] = collected.count === 0 ? 
					[cur._size, cur._leafCount] : 
					collected.reduce((acc, cur) => {
						return [acc[0] + cur[0], acc[1] + cur[1]];
					}, [cur.weight, cur.children === null || cur.children.count === 0 ? 1 : 0]);
					cur.isDirty = false;
				return [cur._size, cur._leafCount];
			}, (cur, i) => !cur.isDirty
		);
		return this;
	}
	public collect<S = any>(fn: (cur: this, i: number, collected: List<S>, isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i: number = 0): S {
		let isPruned = isNotNullOrUndefined(prune) && prune!(this, i);
		return fn(this, i,
			isPruned || this.children === null ?
				new List<S>() :
				this.children.map<S>(function (el, i) {
					return el.collect(fn, prune, i);
				}), isPruned);
	}
	public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S {
		const stack = new Stack<this>();
		let acc: S = (start || ([] as any[])) as any;
		if (!fn) { fn = (acc, cur) => ((acc as any).push({id: cur!.id, parent: cur!.parent ? cur!.parent!.id : null, data: cur!.data }), acc); }
		let cur: this | undefined;
		let i: number;
		stack.push(this);
		while (cur = stack.pop()) {
			acc = fn!(acc, cur);
			i = (cur.children && cur.children.count) || 0;
			while (i--) {
				stack.push(cur.children!.get(i)!);
			}
		}
		return acc;
	}
	public clone(): this {
		const result = this.create();
		result.id = this.id;
		result.children = this.children === null ? null : this.children.clone();
		if (result.children !== null) {
			result.children.forEach((node) => node.parent = result);
		}
		result.data = this.data === null || this.data === undefined ? this.data : clone(this.data);
		return result;
	}
	protected duplicateNode(): this {
		const result = this.create();
		result.id = this.id;
		result.data = this.data;
		return result;
	}
	public filter(condition: (node: this) => boolean, parent: this | null = null): this | null {
		let node: Tree<T> | null = null;
		if (condition(this)) {
			node = this.duplicateNode();
			const children = this.children;
			node.parent = parent;
			if (children !== null) {
				node.children =
					children!
						.select(condition)
						.map(function(el: Tree<T>, i: number) {
							return el.filter(condition, node)!;
						});
				if (node.children.length === 0) {
					node.children = null;
				}
			}
			node.markAsDirty();
		}
		return node as this;
	}
	public select(condition?: (node: this) => boolean, acc: List<this> = new List<this>()): List<this> {
		const result = acc;
		const children = this.children as List<this>;
		if (condition === undefined || condition(this)) {
			result.add(this);
		}
		if (children) {
			children.reduce(function(acc: List<Tree<T>>, cur: Tree<T>) {
				return cur.select(condition, acc);
			}, result);
		}
		return result;
	}
	protected _findBySize(pos: number): this | null {
		let result: this | null;
		if (pos < 0 || pos >= this.size) {
			result = null;
		} else if (this.children === null || this.children.count === 0 || pos < this.weight) {
			result = this;
		} else {
			let size = this.weight;
			let cur: number = 0;
			this.children.until((el, i) => 
				size + el.size > pos
			, (el, i) => {
				++cur;
				size += el.size;
			});
			result = this.children.get(cur)!._findBySize(pos - size);
		}
		return result;
	}
	public find(condition: number | ((node: this) => boolean)): this | null {
		let result: this | null = null;
		if ( isNumber( condition ) ) {
			result = this._findBySize(condition as number);
		} else {
			const children = this.children;
			if (children !== null) {
				let i = -1;
				const len = this.children!.count;
				const val = this.children!.values;
				while (++i < len) {
					if ((condition as (node: this) => boolean)(val[i])) {
						result = val[i];
						break;
					} else {
						result = val[i].children !== null ? (val[i] as this).find(condition) : null;
						if (result !== null) {
							break;
						}
					}
				}
			}
		}
		return result;
	}
	public getLeaf(pos: number): this | null {
		let result: this | null;
		if (isNull(this.children)) {
			result = this;
		} else if (pos < 0 || pos >= this.leafCount) {
			result = null;
		} else if (this.leafCount === this.children.count) {
			return this.children.get(pos)!;
		} else {
			let leaves = 0;
			let cur: number = 0;
			this.children.until((el, i) => 
				leaves + el.leafCount > pos
			, (el, i) => {
				++cur;
				leaves += el.leafCount;
			});
			result = this.children.get(cur)!.getLeaf(pos - leaves);
		}
		return result;
	}
	public depth(): number {
		let result = 0;
		let node = this;
		while (node.parent) {
			node = node.parent;
			++result;
		}
		return result;
	}
	public sort(comparer: (a: this, b: this) => number): this {
		if (this.children !== null) {
			this.children.orderBy(comparer);
			this.children.forEach((el) => el.sort(comparer));
		}
		return this;
	}
	public toJSON(): any {
		let result = new List<any>();
		result.push({id: this.id, data: this.data, parent: this.parent === null ? null : this.parent.id, children: this.children === null ? null : this.children.map((el) => el.id)});
		if (this.children !== null) {
			this.children.forEach((node) => result.append(node.toJSON()));
		}
		return result.toJSON();
	}
	public serialize(): T[] {
		let result = new List<any>();
		result.push({id: this.id, data: this.data, parent: this.parent === null ? null : this.parent.id, children: this.children === null ? null : this.children.map((el) => el.id)});
		if (this.children !== null) {
			this.children.forEach((node) => result.append(node.serialize()));
		}
		return result.serialize();
	}
}

