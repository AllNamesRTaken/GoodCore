import { forEach } from "../Arr";
import { clone, setProperties, wipe } from "../Obj";
import { isFunction, isNotUndefined } from "../Test";
import { List } from "./List";

export class Dictionary<T> implements ISerializable<IObject>, IDeserializable<Dictionary<T>>, ICloneable<Dictionary<T>> {
	private _lookup: any;
	private _list: List<T>;
	private _isDirty: boolean;

	constructor() {
		this._lookup = Object.create(null);
		this._list = new List<T>();
		this._isDirty = false;
	}

	protected create<S = T>(): Dictionary<S> {
		return new ((this as any).constructor)();
	}
	public has(key: number|string): boolean {
		return this._lookup[key] !== undefined;
	}
	public contains(key: number|string): boolean {
		return this.has(key);
	}
	public get(key: number|string): T | undefined {
		return this._lookup[key];
	}
	public set(key: number|string, value: T): Dictionary<T> {
		this._isDirty = this._isDirty || this.has(key);
		if (value !== undefined) {
			this._lookup[key] = value;
			if (!this._isDirty) {
				this._list.push(value);
			}
		}
		return this;
	}
	public delete(key: number|string): Dictionary<T> {
		if (this.has(key)) {
			delete this._lookup[key];
			this._isDirty = true;
		}
		return this;
	}
	public clear(): Dictionary<T> {
		wipe(this._lookup);
		this._list.clear();
		return this;
	}
	public get values(): T[] {
		this.cleanList();
		return this._list.values;
	}
	public get keys(): string[] {
		return Object.keys(this._lookup);
	}
	public get list(): List<T> {
		this.cleanList();
		return this._list;
	}
	public get count(): number {
		let result = 0;
		if (this._isDirty) {
			result = this.keys.length;
		} else {
			result = this._list.count;
		}
		return result;
	}
	private cleanList(): void {
		if (this._isDirty) {
			this.reCreateList();
		}
	}
	private reCreateList(): void {
		let lookup = this._lookup;
		let keys = Object.keys(this._lookup);
		let i = -1;
		let list = this._list;
		list.clear();
		while (++i < keys.length) {
			list.add(lookup[keys[i]]);
		}
	}
	public clone(): Dictionary<T> {
		let result = this.create<T>();
		result._isDirty = this._isDirty;
		result._list = this._list.clone();
		result._lookup = clone(this._lookup);
		return result;
	}
	public toJSON(): any {
		return this._lookup;
	}
	public serialize(): IObject {
		let obj = Object.create(null);
		forEach(this.keys, (key) => {
			let v = this.get(key);
			obj[key] = isFunction((v as any).serialize) ? (v as any).serialize() : v;
		});
		return obj;
	}
	public deserialize(obj: any, ...types: Array<Constructor<any>>): Dictionary<T> {
		let [T, ...passthroughT] = types;
		this.clear();
		if (isNotUndefined(T)) {
			if (isNotUndefined(T.prototype.deserialize)) {
				for (let key of Object.keys(obj)) {
					this.set(key, (new T()).deserialize(obj[key], ...passthroughT));
				}
			} else {
				for (let key of Object.keys(obj)) {
					let newT = new T();
					setProperties(newT, obj[key]);
					this.set(key, newT);
				}
			}
		} else {
			for (let key of Object.keys(obj)) {
				this.set(key, obj[key]);
			}
		}
		return this;
	}
}
