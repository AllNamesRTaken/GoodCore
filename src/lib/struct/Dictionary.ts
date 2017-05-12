import { Obj } from "../Obj";
import List from "./List";

export default class Dictionary<T> {
	private _lookup: any;
	private _index: any;
	private _list: List<T>;
	private _reverseIndex: any;

	constructor() {
		this._lookup = {};
		this._index = {};
		this._list = new List<T>();
	}
	public Has(key: string): boolean {
		return this._lookup.hasOwnProperty(key);
	}
	public Get(key: string): T {
		return this._lookup[key];
	}
	public Set(key: string, value: T): Dictionary<T> {
		const list = this._list;
		const index = this._index;
		if (this.Has(key)) {
			list.RemoveAt(index[key]);
		}
		this._lookup[key] = value;
		const pos = list.Push(value);
		index[key] = pos - 1;
		return this;
	}
	public Delete(key: string): Dictionary<T> {
		if (this.Has(key)) {
			const i = this._index[key];
			delete this._index[key];
			delete this._lookup[key];
			this._list.RemoveAt(i);
		}
		return this;
	}
	public Clear(): Dictionary<T> {
		Obj.Wipe(this._lookup);
		Obj.Wipe(this._index);
		this._list.Clear();
		return this;
	}
	public get Values(): T[] {
		return this._list.Values;
	}
	public get Keys(): string[] {
		return Object.keys(this._lookup);
	}
	public get List(): List<T> {
		return this._list;
	}

}
