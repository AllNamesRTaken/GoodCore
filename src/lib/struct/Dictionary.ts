import { forEach } from "../Arr";
import { clone, setProperties, wipe } from "../Obj";
import { isFunction, isNotUndefined, isNotNullOrUndefined } from "../Test";
import { once } from "../Util";

export class Dictionary<T> implements ISerializable<IObject>, IDeserializable<Dictionary<T>>, ICloneable {
	private _lookup: { [key: string]: T };
	private _list: T[];
	private _isDirty: boolean;

	constructor() {
		this._lookup = Object.create(null) as { [key: string]: T };
		this._list = new Array<T>();
		this._isDirty = false;

		// tslint:disable-next-line:no-string-literal
		(this as any)["delete"] = (key: number | string) => {
			once(() => {
				console.warn("Function Dictionary::delete(id) is deprecated please use Dictionary::remove instead. set is a reserved word.");
			});
			return this.lookup(key);
		};
	}

	protected create<S = T>(): this {
		return new ((this as any).constructor)();
	}
	public has(key: number | string): boolean {
		return this._lookup[key] !== undefined;
	}
	public contains(key: number | string): boolean {
		return this.has(key);
	}
	// tslint:disable-next-line:no-reserved-keywords
	public get(key: number | string): T | undefined {
		once(() => {
			console.warn("Function Dictionary::get(id) is deprecated please use Dictionary::lookup instead. get is a reserved word.");
		});
		return this.lookup(key);
	}
	public lookup(key: number | string): T | undefined {
		return this._lookup[key];
	}
	// tslint:disable-next-line:no-reserved-keywords
	public set(key: number | string, value: T): this {
		once(() => {
			console.warn("Function Dictionary::set(id) is deprecated please use Dictionary::add instead. set is a reserved word.");
		});
		return this.add(key, value);
	}
	public add(key: number | string, value: T): this {
		this._isDirty = this._isDirty || this.has(key);
		if (value !== undefined) {
			this._lookup[key] = value;
			if (!this._isDirty) {
				this._list.push(value);
			}
		}
		return this;
	}

	public remove(key: number | string): this {
		if (this.has(key)) {
			delete this._lookup[key];
			this._isDirty = true;
		}
		return this;
	}
	public clear(): this {
		wipe(this._lookup);
		this._list.length = 0;
		return this;
	}
	public get values(): T[] {
		this.cleanList();
		return this._list;
	}
	public get keys(): string[] {
		return Object.keys(this._lookup);
	}
	public get count(): number {
		let result = 0;
		if (this._isDirty) {
			result = this.keys.length;
		} else {
			result = this._list.length;
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
		list.length = 0;
		while (++i < keys.length) {
			list.push(lookup[keys[i]]);
		}
		this._isDirty = false;
	}
	public clone(): this {
		let result = this.create<T>();
		result._isDirty = true;
		result._lookup = clone(this._lookup);
		result.reCreateList();
		return result;
	}
	public toJSON(): any {
		return this._lookup;
	}
	public serialize(): IObject {
		let obj = Object.create(null) as Indexable<T>;
		forEach(this.keys, (key) => {
			let v = this.lookup(key)! as T;
			obj[key] = isNotNullOrUndefined(v) && isFunction((v as any).serialize) ? (v as any).serialize() : v;
		});
		return obj;
	}
	public deserialize(obj: Indexable<any>, ...types: Array<Constructor<any>>): this {
		let T: Constructor<any> | undefined;
		let passthroughT: Array<Constructor<any>>;
		T = types.shift();
		passthroughT = types;
		// [T, ...passthroughT] = types;
		this.clear();
		let keys = Object.keys(obj);
		if (isNotUndefined(T)) {
			if (isNotUndefined(T!.prototype.deserialize)) {
				for (let i = 0; i < keys.length; i ++) {
					let key = keys[i];
					let t = (new T!());
					this.add(key, t.deserialize.apply(t, [obj[key]].concat(passthroughT)));
				}
			} else {
				for (let i = 0; i < keys.length; i ++) {
					let key = keys[i];
					let newT = new T!() as T;
					setProperties(newT, obj[key]);
					this.add(key, newT);
				}
			}
		} else {
			for (let i = 0; i < keys.length; i ++) {
				let key = keys[i];
				this.add(key, obj[key]);
			}
		}
		this.reCreateList();
		return this;
	}
}
