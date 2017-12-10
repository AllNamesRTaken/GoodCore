import { map } from "../Arr";
import { clone, isSameClass, setProperties } from "../Obj";
import { Initable } from "../standard/mixins/Initable";
import { isArray } from "../Test";
import { newUUID } from "../Util";
import { Dictionary } from "./Dictionary";
import { List } from "./List";
import { Stack } from "./Stack";

export class Tree<T> implements ICloneable<Tree<T>>, IInitable<Tree<T>> {
	public id: string = "";
	public parent: Tree<T> | null = null;
	public children: List<Tree<T>> | null = null;
	public data: T | null = null;
	public static fromObject<T>(obj: any): Tree<T> {
		const parent: Tree<T> | null = (this instanceof Tree) ? this : null;
		const root = new Tree<T>().init({ id: obj.id || newUUID(), data: obj.data, parent });
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<Tree<T>>(map<any, Tree<T>>(obj.children as Array<Tree<T>>, Tree.fromObject.bind(root)));
		}
		return root;
	}
	public static fromNodeList<S, T>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string)|string, 
		parent?: ((node: S) => string)|string, 
		data?: ((node: S) => any)|string
	}): Tree<T> {
		let result = new Tree<T>();
		// create map
		let mapResolver = (key: string) => {
			return !mapcfg || typeof((mapcfg as any)[key]) === "undefined" ? (el: S) => (el as any)[key] :
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
		let lookup: Dictionary<Tree<T>> = new Dictionary();
		list.forEach((el, i) => {
			let node = new Tree<T>().init({id: map.id(el), data: map.data(el)});
			// map
			lookup.set(node.id, node);
		});
		// hook nodes together
		list.forEach((el, i) => {
			let parent = map.parent(el);
			if (lookup.contains(parent)) {
				lookup.get(parent)!.add(lookup.get(map.id(el))!);
			}
		});
		// find root
		result = lookup.get(map.id(list.get(0)))!;
		while (result.parent) {
			result = result.parent;
		}
		return result;
	}

	constructor() {
		this.id = newUUID();
	}

	protected create<S = T>(): Tree<S> {
		return new ((this as any).constructor)();
	}
	public init(obj: Partial<Tree<T>>): Tree<T> {
		setProperties(this, obj);
		return this;
	}
	public insertAt(pos: number, data: T): void {
		if (this.children === null || this.children.count <= pos) {
			this.add(data);
		} else {
			this.children.insertAt(pos, this.create<T>().init({ data, parent: this }));
		}
	}
	public add(data: T|Tree<T>): void {
		if (this.children === null) {
			this.children = new List<Tree<T>>();
		}
		if (isSameClass(data, this)) {
			(data as Tree<T>).parent = this;
			this.children.add(data as Tree<T>);
		} else {
			this.children.add((this.create<T>()).init({ data: data as T, parent: this }));
		}
	}
	public remove(): void {
		if (this.parent !== null) {
			this.parent.children!.remove(this);
		}
	}
	public prune(): Tree<T> {
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
	public reduce(fn?: (acc: any, cur: Tree<T> | null) => any, start?: any): any {
		const stack = new Stack<Tree<T>>();
		let acc: any = start;
		if (!fn) { fn = (acc, cur) => (acc.push({id: cur!.id, parent: cur!.parent ? cur!.parent!.id : null, data: cur!.data }), acc); }
		if (start === undefined) { acc = [] as any; }
		let cur: Tree<T> | undefined;
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
	public clone(): Tree<T> {
		const result = new ((this as any).constructor as ICtor<Tree<T>>)();
		result.id = this.id;
		result.parent = this.parent;
		result.children = this.children === null ? null : this.children.clone();
		result.data = this.data === null || this.data === undefined ? this.data : clone(this.data);
		return result;
	}
	private duplicateNode(): Tree<T> {
		const result = new ((this as any).constructor as ICtor<Tree<T>>)();
		result.id = this.id;
		result.parent = this.parent;
		result.children = this.children;
		result.data = this.data;
		return result;
	}
	public filter(condition: (node: Tree<T>) => boolean): Tree<T> {
		const root = this.duplicateNode();
		const children = this.children;
		if (children !== null) {
			root.children =
				root.children!
					.select(condition)
					.map(function(el: Tree<T>, i: number) {
						return el.filter(condition);
					});
		}
		return root;
	}
	public select(condition?: (node: Tree<T>) => boolean, acc: List<Tree<T>> = new List<Tree<T>>()): List<Tree<T>> {
		const result = acc;
		const children = this.children as List<Tree<T>>;
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
	public find(condition: (data: T | null) => boolean): Tree<T> | null {
		let result: Tree<T> | null = null;
		const children = this.children;
		if (children !== null) {
			let i = -1;
			const len = this.children!.count;
			const val = this.children!.values;
			while (++i < len) {
				if (condition(val[i].data)) {
					result = val[i];
					break;
				} else {
					result = val[i].children !== null ? (val[i] as Tree<T>).find(condition) : null;
					if (result !== null) {
						break;
					}
				}
			}
		}
		return result;
	}
	public contains(condition: (data: T) => boolean): boolean {
		return this.find(condition) !== null;
	}
	public depth(): number {
		let result = 0;
		let node = this as Tree<T>;
		while (node.parent) {
			node = node.parent;
			++result;
		}
		return result;
	}
	public toJSON(): any {
		let result = new List<any>();
		result.push({id: this.id, data: this.data, parent: this.parent === null ? null : this.parent.id, children: this.children === null ? null : this.children.map((el) => el.id)});
		if (this.children !== null) {
			this.children.forEach((node) => result.append(node.toJSON()));
		}
		return result.toJSON();
	}
}
