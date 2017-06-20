import { map } from "../Arr";
import { clone, setProperties } from "../Obj";
import { Initable } from "../standard/mixins/Initable";
import { isArray } from "../Test";
import { newUUID } from "../Util";
import { List } from "./List";
import { Stack } from "./Stack";

export class Tree<T> implements ICloneable<ITreeNode<T>>, IInitable<ITreeNode<T>> {
	public id: string = null;
	public parent: Tree<T> = null;
	public children: List<Tree<T>> = null;
	public data: T = null;
	public static fromObject<T>(obj: any): Tree<T> {
		const parent = (this instanceof Tree) ? this : null;
		const root = new Tree<T>().init({ data: obj.data as T !== undefined ? obj.data : null, parent });
		if (obj.children !== undefined && isArray(obj.children)) {
			root.children = new List<Tree<T>>(map<any, Tree<T>>(obj.children as Array<Tree<T>>, Tree.fromObject.bind(root)));
		}
		return root;
	}

	constructor() {
		this.id = this.newId();
	}

	public init(obj: ITreeNode<T>): Tree<T> {
		setProperties(this, obj);
		return this;
	}
	private newId(): any {
		return newUUID();
	}
	public insertAt(pos: number, data: T): void {
		if (this.children === null || this.children.count <= pos) {
			this.add(data);
		} else {
			this.children.insertAt(pos, new Tree<T>().init({ data, parent: this }));
		}
	}
	public add(data: T): void {
		if (this.children === null) {
			this.children = new List<Tree<T>>();
		}
		this.children.add((new Tree<T>()).init({ data, parent: this }));
	}
	public remove(): void {
		if (this.parent !== null) {
			this.parent.children.remove(this);
		}
	}
	public prune(): Tree<T> {
		if (this.children !== null) {
			this.children
				.forEach(function(el: ITreeNode<T>, i: number) {
					el.parent = null;
				})
				.clear();
		}
		this.children = null;
		return this;
	}
	public reduce(fn: (acc: any, cur: T) => any, start?: any): any {
		const stack = new Stack<ITreeNode<T>>();
		let acc: any = start;
		if (start === undefined) { acc = 0 as any; }
		let cur: ITreeNode<T>;
		let i: number;
		stack.push(this);
		while (cur = stack.pop()) {
			acc = fn(acc, cur.data);
			i = (cur.children && cur.children.count) || 0;
			while (i--) {
				stack.push(cur.children.get(i));
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
	public filter(condition: (node: ITreeNode<T>) => boolean): Tree<T> {
		const root = this.duplicateNode();
		const children = this.children;
		if (children !== null) {
			root.children =
				root.children
					.select(condition)
					.map(function(el: Tree<T>, i: number) {
						return el.filter(condition);
					});
		}
		return root;
	}
	public select(condition?: (node: ITreeNode<T>) => boolean, acc: List<Tree<T>> = new List<Tree<T>>()): List<Tree<T>> {
		const result = acc;
		const children = this.children as List<Tree<T>>;
		if (condition === undefined || condition(this)) {
			result.add(this);
		} else {
			children.reduce(function(acc: List<Tree<T>>, cur: Tree<T>) {
				return cur.select(condition, acc);
			}, result);
		}
		return result;
	}
	public find(condition: (data: T) => boolean): ITreeNode<T> {
		let result: ITreeNode<T> = null;
		const children = this.children;
		if (children !== null) {
			let i = -1;
			const len = this.children.count;
			const val = this.children.values;
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
}
