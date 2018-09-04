import { map } from "../Arr";
import { clone, isSameClass, setProperties } from "../Obj";
import { isArray, isNullOrUndefined } from "../Test";
import { newUUID } from "../Util";
import { Dictionary } from "./Dictionary";
import { List } from "./List";
import { Stack } from "./Stack";

export class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable<Tree<T>> {
	public id: string | number = "";
	public parent: this | null = null;
	public children: List<this> | null = null;
	public data: T | null = null;
	public virtual: boolean = false;
	public static fromObject<T>(obj: any): Tree<T> {
		const parent: Tree<T> | null = (this instanceof Tree) ? this : null;
		const root = new Tree<T>(obj.id).init({ data: obj.data, parent });
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
		let nodeList = list.map((el) => new ctor("").init({id: map.id(el), data: map.data(el)}));
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
			let nodeId: string = map.id(el);
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
		return node;
	}
	public remove(): void {
		if (this.parent !== null) {
			this.parent.children!.remove(this);
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
			this.children.forEach((child) => child.forEach(fn));
		}
		return this;
	}
	public reduce(fn?: (acc: any, cur: this | null) => any, start?: any): any {
		const stack = new Stack<this>();
		let acc: any = start;
		if (!fn) { fn = (acc, cur) => (acc.push({id: cur!.id, parent: cur!.parent ? cur!.parent!.id : null, data: cur!.data }), acc); }
		if (start === undefined) { acc = [] as any; }
		let cur: this | undefined;
		let i: number;
		stack.push(this);
		while (cur = stack.pop()) {
			acc = fn(acc, cur);
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
			}
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
	public find(condition: (node: this) => boolean): this | null {
		let result: this | null = null;
		const children = this.children;
		if (children !== null) {
			let i = -1;
			const len = this.children!.count;
			const val = this.children!.values;
			while (++i < len) {
				if (condition(val[i])) {
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

