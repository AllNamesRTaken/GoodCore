import { insertAt, until, append } from "../Arr";
import { clone, isSameClass, setProperties, forEach } from "../Obj";
import { isArray, isNullOrUndefined, isNotNullOrUndefined, isNumber, isNull } from "../Test";
import { newUUID } from "../Util";
import { Stack } from "./Stack";

export class Tree<T> implements ISerializable<T[]>, ICloneable, IInitable {
	public id: string | number = "";
	public parent: this | null = null;
	public children: this[] | null = null;
	public data: T | null = null;
	public isDirty: boolean = false;
	public isEventing: boolean = true;

	protected _virtual: boolean = false;
	protected _size: number = 1;
	protected _leafCount: number = 1;
	protected _weight = 1;
	protected _listeners: Indexable<Indexable<(targets?: Array<Tree<T>>) => void> | null> = {};
	protected _listenerIndex: number = 0;

	public static fromObject<T>(obj: Indexable<any>): Tree<T> {
		const parent: Tree<T> | null = (this instanceof Tree) ? this : null;
		const root = new Tree<T>(obj.id as any).init({ data: obj.data as any, parent, isDirty: true });
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = 
				(obj.children as Array<Tree<T>>).map(
					Tree.fromObject.bind(root) as (el: any, i: number) => Tree<T>
				)
			;
		}
		return root;
	}
	public static fromNodeList<S, T>(
		nodes: S[], 
		mapcfg?: {
			id?: ((node: S) => string | number) | string | number,
			parent?: ((node: S) => string | number) | string | number,
			data?: ((node: S) => any) | string
		},
		virtualRoot: boolean = false,
		ctor: Constructor<Tree<T>> = Tree
	): Tree<T> {
		let result = new Tree<T>();
		// create map
		let mapResolver = (key: string) => {
			return !mapcfg || typeof ((mapcfg as any)[key]) === "undefined"
				? (key === "id"
					? (el: S) => typeof ((el as unknown as Indexable<any>)[key]) === undefined
						? newUUID()
						: (el as unknown as Indexable<any>)[key] as any
					: (el: S) => (el as unknown as Indexable<any>)[key] as any
				)
				: typeof ((mapcfg as any)[key]) === "string"
					? (el: S) => (el as unknown as Indexable<any>)[(mapcfg as any)[key]] as any
					: (mapcfg as any)[key];
		};
		let map = {
			id: mapResolver("id") as ((node: S) => string | number),
			parent: mapResolver("parent") as ((node: S) => string | number),
			data: mapResolver("data") as ((node: S) => T)
		};
		// create node lookup
		let list = nodes;
		let lookup = Object.create(null) as {[key: string]: Tree<T>[]};
		let nodeList = list.map((el) => new ctor("").init({ id: map.id(el), data: map.data(el), isDirty: true, isEventing: false }));
		nodeList.forEach((node, i) => {
			if (lookup[node.id] === undefined) {
				lookup[node.id] = [];
			}
			lookup[node.id].push(node);
		});

		// hook nodes together
		let rootNodes = new Array<Tree<T>>();
		list.forEach((el, i) => {
			let parentId: string = map.parent(el) as string;
			if (lookup[parentId] !== undefined) {
				lookup[parentId].forEach((p) => p.add(nodeList[i]!));
			} else {
				rootNodes.push(nodeList[i]!);
			}
		});
		nodeList.forEach((n) => n.isEventing = true);

		// find root
		if (virtualRoot === false) {
			result = rootNodes[0];
		} else {
			result = new ctor().init({ virtual: true });
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
		return isNull(this.children) ? 0 : this.children!.length;
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

	public on(event: TreeEvent, callback: (targets: Array<Tree<T>>) => void): number {
		this._listeners[event] = this._listeners[event] || {};
		this._listeners[event]![this._listenerIndex] = callback;
		return this._listenerIndex++;
	}
	public off(event: TreeEvent, index?: number): void {
		if (index === undefined) {
			this._listeners[event] && (delete this._listeners[event])
		} else {
			this._listeners[event] && delete this._listeners[event]![index];
		}
		(this._listeners[event] && Object.keys(this._listeners[event]!).length === 0) && (delete this._listeners[event]);
	}
	public trigger(event: TreeEvent, targets: Array<Tree<T>>): void {
		if (this.isEventing) {
			switch (event) {
				case "change":
					this._listeners[event] && forEach(this._listeners[event]!, (fn) => fn(targets));
					this.parent && this.parent.trigger(event, targets || [this]);
					break;
				default:
					break;
			}
		}
	}

	public set(values?: Partial<T>) {
		this.data && values && (this.data! = {...this.data!, ...values});
		this.trigger("change", [this]);  
	}

	protected markAsDirty(): void {
		if (!this.isDirty) {
			this.isDirty = true;
			if (this.parent !== null) {
				this.parent.markAsDirty();
			}
		}
	}
	protected create<S = T>(id?: string | number): this {
		return new ((this as Tree<T>).constructor as Constructor<Tree<T>>)(id) as this;
	}
	public init(obj: Partial<Tree<T>>, mapping?: any): this {
		setProperties(this, obj);
		return this;
	}
	public insertAt(pos: number, data: T | this, id?: string | number): this {
		let node: this;
		if (this.children === null || this.children.length <= pos) {
			node = this.add(data);
		} else {
			if (data instanceof Tree) {
				node = data;
				node.cut();
				node.parent = this;
			} else {
				node = this.create<T>(id).init({ data, parent: this });
			}
			insertAt(this.children, pos, node);
			this.markAsDirty();
			this.trigger("change", [this]); 
		}
		return node;
	}
	public add(data: T | this, id?: string | number): this {
		let node: this;
		if (this.children === null) {
			this.children = [];
		}
		if (isSameClass(data as object, this)) {
			node = data as this;
			node.cut();
			node.parent = this;
			this.children.push(node);
		} else {
			node = (this.create<T>(id)).init({ data: data as T, parent: this });
			this.children.push(node);
		}
		this.markAsDirty();
		this.trigger("change", [this]); 
		return node;
	}
	public remove(): void {
		let parent = this.parent;
		if (parent !== null) {
			let pos = parent.children!.indexOf(this);
			parent.children!.splice(pos, 1);
			if (parent.children!.length === 0) {
				parent.children = null;
			}
			parent.markAsDirty();
			this.parent = null; 
			parent.trigger("change", [parent]);
		}
	}
	public prune(): this {
		if (this.children !== null) {
			this.children
				.forEach(function (el: Tree<T>, i: number) {
					el.parent = null;
				})
				;
			this.children.length = 0;
		}
		this.children = null;
		this.markAsDirty();
		this.trigger("change", [this]); 
		return this;
	}
	public cut(): this {
		this.remove();
		return this;
	}
	public forEach(fn: (el: this, i: number) => void, _i: number = 0): this {
		fn(this, _i);
		if (this.children) {
			this.children.forEach((child, i) => child.forEach(fn, i));
		}
		return this;
	}
	public reCalculateSize(): this {
		this.aggregate<number[]>((cur, i, agg) => {
			[cur._size, cur._leafCount] = isNull(agg) || agg!.length === 0 ?
				[cur._size, cur._leafCount] :
				agg!.reduce((acc, cur) => {
					return [acc[0] + cur[0], acc[1] + cur[1]];
				}, [cur.weight, cur.children === null || cur.children.length === 0 ? 1 : 0]);
			cur.isDirty = false;
			return [cur._size, cur._leafCount];
		}, (cur, i) => !cur.isDirty
		);
		return this;
	}
	public aggregate<S = any>(
		fn: (cur: this, i: number, agg: S[] | null, isPruned: boolean) => S, 
		prune?: (cur: this, i: number) => boolean, 
		i: number = 0
	): S {
		let isPruned = isNotNullOrUndefined(prune) && prune!(this, i);
		return fn(this, i,
			isPruned || this.children === null 
				? null 
				: this.children.map(function (el, i) {
					return el.aggregate(fn, prune, i);
				}), isPruned);
	}
	public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S {
		const stack = new Stack<this>();
		let acc: S = (start || ([] as any[])) as any;
		if (!fn) { 
			fn = (acc, cur) => 
				((acc as unknown as any[]).push({ 
					id: cur!.id, 
					parent: cur!.parent ? cur!.parent!.id : null, 
					data: cur!.data 
				}), acc); 
		}
		let cur: this | undefined;
		let i: number;
		stack.push(this);
		while (cur = stack.pop()) {
			acc = fn!(acc, cur);
			i = (cur.children && cur.children.length) || 0;
			while (i--) {
				stack.push(cur.children![i]!);
			}
		}
		return acc;
	}
	public clone(): this {
		const result = this.create();
		result.id = this.id;
		result.children = this.children === null ? null : clone(this.children);
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
						.filter(condition)
						.map(function (el: Tree<T>, i: number) {
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
	public select(condition?: (node: this) => boolean, acc: this[] = []): this[] {
		const result = acc;
		const children = this.children as this[];
		if (condition === undefined || condition(this)) {
			result.push(this);
		}
		if (children) {
			children.reduce(function (acc: Array<Tree<T>>, cur: Tree<T>) {
				return cur.select(condition, acc);
			}, result);
		}
		return result;
	}
	protected _findBySize(pos: number): this | null {
		let result: this | null;
		if (pos < 0 || pos >= this.size) {
			result = null;
		} else if (this.children === null || this.children.length === 0 || pos < this.weight) {
			result = this;
		} else {
			let size = this.weight;
			let cur: number = 0;
			until(this.children, (el, i) =>
				size + el.size > pos
				, (el, i) => {
					++cur;
					size += el.size;
				});
			result = this.children[cur]!._findBySize(pos - size);
		}
		return result;
	}
	public find(condition: number | ((node: this) => boolean)): this | null {
		let result: this | null = null;
		if (isNumber(condition)) {
			result = this._findBySize(condition as number);
		} else {
			const children = this.children;
			if (children !== null) {
				let i = -1;
				const len = this.children!.length;
				const val = this.children!;
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
		} else if (this.leafCount === this.children!.length) {
			return this.children![pos]!;
		} else {
			let leaves = 0;
			let cur: number = 0;
			until(this.children!, (el, i) =>
				leaves + el.leafCount > pos
				, (el, i) => {
					++cur;
					leaves += el.leafCount;
				});
			result = this.children![cur]!.getLeaf(pos - leaves);
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
			this.children.sort(comparer);
			this.children.forEach((el) => el.sort(comparer));
			this.trigger("change", [this]); 
		}
		return this;
	}
	public toJSON() {
		let result = new Array<{ 
			id: string | number, 
			data: T | null, 
			parent: string | number | null, 
			children: Array<string | number> | null 
		}>();
		
		this.forEach((node) => {
			result.push({ 
				id: node.id, 
				data: node.data, 
				parent: node.parent === null ? null : node.parent.id, 
				children: node.children === null ? null : node.children.map((el) => el.id) 
			});
		});
		return result;
	}
	public serialize(): T[] {
		let result = new Array<any>();
		result.push({ 
			id: this.id, 
			data: this.data, 
			parent: this.parent === null ? null : this.parent.id, 
			children: this.children === null ? null : this.children.map((el) => el.id) 
		});
		if (this.children !== null) {
			this.children.forEach((node) => append(result, node.serialize()));
		}
		return result;
	}
}
