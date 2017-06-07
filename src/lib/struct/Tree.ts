import { Arr } from "../Arr";
import { Obj } from "../Obj";
import { Initable } from "../standard/mixins/Initable";
import { Test } from "../Test";
import { Util } from "../Util";
import { List } from "./List";
import { Stack } from "./Stack";

export class Tree<T> implements ICloneable<ITreeNode<T>>, IInitable<ITreeNode<T>> {
	public Id: string = null;
	public Parent: Tree<T> = null;
	public Children: List<Tree<T>> = null;
	public Data: T = null;
	public static fromObject<T>(obj: any): Tree<T> {
		const parent = (this instanceof Tree) ? this : null;
		const root = new Tree<T>().init({Data: obj.data as T !== undefined ? obj.data : null, Parent: parent});
		if (obj.children !== undefined && Test.isArray(obj.children)) {
			root.Children = new List<Tree<T>>(Arr.map<any, Tree<T>>(obj.children as Array<Tree<T>>, Tree.fromObject.bind(root)));
		}
		return root;
	}

	constructor() {
		this.Id = this.newId();
	}

	public init(obj: Object): any {
		Obj.setProperties(this, obj);
		return this as any;
	}
	private newId(): any {
		return Util.newUUID();
	}
	public insertAt(pos: number, data: T): void {
		if (this.Children === null || this.Children.count <= pos) {
			this.add(data);
		} else {
			this.Children.insertAt(pos, new Tree<T>().init({ Data: data, Parent: this }));
		}
	}
	public add(data: T): void {
		if (this.Children === null) {
			this.Children = new List<Tree<T>>();
		}
		this.Children.add((new Tree<T>()).init({ Data: data, Parent: this }));
	}
	public remove(): void {
		if (this.Parent !== null) {
			this.Parent.Children.remove(this);
		}
	}
	public prune(): Tree<T> {
		if (this.Children !== null) {
			this.Children
				.forEach(function(el: ITreeNode<T>, i: number) {
					el.Parent = null;
				})
				.clear();
		}
		this.Children = null;
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
			acc = fn(acc, cur.Data);
			i = (cur.Children && cur.Children.count) || 0;
			while (i--) {
				stack.push(cur.Children.get(i));
			}
		}
		return acc;
	}
	public clone(): Tree<T> {
		const result = new ((this as any).constructor as ICtor<Tree<T>>)();
		result.Id = this.Id;
		result.Parent = this.Parent;
		result.Children = this.Children === null ? null : this.Children.clone();
		result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj.clone(this.Data);
		return result;
	}
	private duplicateNode(): Tree<T> {
		const result = new ((this as any).constructor as ICtor<Tree<T>>)();
		result.Id = this.Id;
		result.Parent = this.Parent;
		result.Children = this.Children;
		result.Data = this.Data;
		return result;
	}
	public filter(condition: (node: ITreeNode<T>) => boolean): Tree<T> {
		const root = this.duplicateNode();
		const children = this.Children;
		if (children !== null) {
			root.Children =
				root.Children
					.select(condition)
					.map(function(el: Tree<T>, i: number) {
						return el.filter(condition);
					});
		}
		return root;
	}
	public select(condition?: (node: ITreeNode<T>) => boolean, acc: List<Tree<T>> = new List<Tree<T>>()): List<Tree<T>> {
		const result = acc;
		const children = this.Children as List<Tree<T>>;
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
		const children = this.Children;
		if (children !== null) {
			let i = -1;
			const len = this.Children.count;
			const val = this.Children.values;
			while (++i < len) {
				if (condition(val[i].Data)) {
					result = val[i];
					break;
				} else {
					result = val[i].Children !== null ? (val[i] as Tree<T>).find(condition) : null;
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
