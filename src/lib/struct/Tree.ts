/// <reference path="../../../typings/custom.d.ts" />

import List from "./List"
import Stack from "./Stack"
import { Arr } from "../Arr"
import { Util } from "../Util"
import { Obj } from "../Obj"
import Initable from "../standard/mixins/Initable"

export class BaseTree<T> implements ITreeNode<T> {
	Id: string = null;
	Parent: Tree<T> = null;
	Children: List<Tree<T>> = null;
	Data: T = null;
}
export const _InitableTree = Initable(BaseTree);
export class Tree<T> extends _InitableTree<T> implements ICloneable<ITreeNode<T>> {
	static FromObject<T>(obj: any): Tree<T> {
		let parent = (this instanceof Tree) ? this : null;
		let root = new Tree<T>().Init({Data: <T>obj.data !== undefined ? obj.data : null, Parent: parent});
		if (obj.children !== undefined && Util.IsArray(obj.children)) {
			root.Children = new List(Arr.Map<Tree<T>>(<Array<Tree<T>>>obj.children, Tree.FromObject.bind(root)));
		}
		return root;
	}

	constructor() {
		super();
		this.Id = this.NewId();
	}

	private NewId(): any {
		return Util.NewUUID();
	}
	public InsertAt(pos: number, data: T): void {
		if (this.Children === null || this.Children.Count <= pos) {
			this.Add(data);
		} else {
			this.Children.InsertAt(pos, new Tree<T>().Init({ Data: data, Parent: this }));
		}
	}
	public Add(data: T): void {
		if (this.Children === null) {
			this.Children = new List<Tree<T>>();
		}
		this.Children.Add((new Tree<T>()).Init({ Data: data, Parent: this }));
	}
	public Remove(): void {
		if (this.Parent !== null) {
			this.Parent.Children.Remove(this);
		}
	}
	public Prune(): Tree<T> {
		if (this.Children !== null) {
			this.Children
				.ForEach(function (el: ITreeNode<T>, i: number) {
					el.Parent = null;
				})
				.Clear();
		}
		this.Children = null;
		return this;
	}
	public Reduce(fn: (acc: any, cur: T) => any, start?: any): any {
		let stack = new Stack<ITreeNode<T>>();
		let acc: any = start;
		if (start === undefined) acc = <any>0;
		let cur: ITreeNode<T>;
		let i: number;
		stack.Push(this);
		while (cur = stack.Pop()) {
			acc = fn(acc, cur.Data);
			i = (cur.Children && cur.Children.Count) || 0;
			while (i--) {
				stack.Push(cur.Children.Get(i));
			}
		}
		return acc;
	}
	public Clone(): Tree<T> {
		let result = new (<ICtor<Tree<T>>>(<any>this).constructor)();
		result.Id = this.Id;
		result.Parent = this.Parent;
		result.Children = this.Children === null ? null : this.Children.Clone();
		result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj.Clone(this.Data);
		return result;
	}
	private DuplicateNode(): Tree<T> {
		let result = new (<ICtor<Tree<T>>>(<any>this).constructor)();
		result.Id = this.Id;
		result.Parent = this.Parent;
		result.Children = this.Children;
		result.Data = this.Data;
		return result;
	}
	public Filter(condition: (node: ITreeNode<T>) => boolean): Tree<T> {
		let root = this.DuplicateNode();
		let children = this.Children;
		if (children !== null) {
			root.Children =
				root.Children
					.Select(condition)
					.Map(function (el: Tree<T>, i: number) {
						return el.Filter(condition);
					});
		}
		return root;
	}
	public Select(condition?: (node: ITreeNode<T>) => boolean, acc: List<Tree<T>> = new List<Tree<T>>()): List<Tree<T>> {
		let result = acc;
		let children = <List<Tree<T>>>this.Children;
		if (condition === undefined || condition(this)) {
			result.Add(this);
		}
		else {
			children.Reduce(function (acc: List<Tree<T>>, cur: Tree<T>) {
				return cur.Select(condition, acc);
			}, result);
		}
		return result;
	}
	public Find(condition: (data: T) => boolean): ITreeNode<T> {
		let result: ITreeNode<T> = null;
		let children = this.Children;
		if (children !== null) {
			let i = -1;
			let len = this.Children.Count;
			let val = this.Children.Values;
			while (++i < len) {
				if (condition(val[i].Data)) {
					result = val[i];
					break;
				} else {
					result = val[i].Children !== null ? (<Tree<T>>val[i]).Find(condition) : null;
					if (result !== null) {
						break;
					}
				}
			}
		}
		return result;
	}
	public Contains(condition: (data: T) => boolean): boolean {
		return this.Find(condition) !== null;
	}
}

