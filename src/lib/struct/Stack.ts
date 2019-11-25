import { deepCopy, deserialize } from "../Arr";
import { isFunction } from "../Test";

export class Stack<T> implements ISerializable<T[]>, IDeserializable<Stack<T>>, ICloneable {
	public DEFAULT_SIZE = 100;
	private _array: T[];
	private _pos: number = 0;
	private _limit: number = 0;
	public get values(): T[] {
		return this._array.slice(0, this._pos);
	}
	public get depth(): number {
		return this._pos;
	}
	public get size(): number {
		return this._pos;
	}
	public get isEmpty(): boolean {
		return this.size === 0;
	}
	public get limit(): number {
		return this._limit;
	}
	public set limit(value: number) {
		if (value < 0) {
			value = 0;
		}
		this._limit = value;
		if (value === 0) {
			this.push = this.fastPush;
		} else {
			this.push = this.limitedPush;
			this.limitObjects();
		}
	}

	constructor(size?: number) {
		if (!size) {
			size = this.DEFAULT_SIZE;
		}
		this.DEFAULT_SIZE = size;
		this._array = new Array<T>(size);
		this.push = this.fastPush;
	}
	protected create<S = T>(size?: number): Stack<S> {
		return new ((this as any).constructor)(size);
	}
	public push(obj: T): void {
	}
	public fastPush(obj: T): void {
		this._array[this._pos++] = obj;
	}
	public limitedPush(obj: T): void {
		this._array[this._pos] = obj;
		++this._pos;
		this.limitObjects();
	}
	public pop(): T | undefined {
		// tslint:disable-next-line:no-unnecessary-initializer
		let result: T | undefined = undefined;
		if (this._pos !== 0) {
			result = this._array[--this._pos];
		}
		return result;
	}
	public peek(): T | undefined {
		return this._array[this._pos - 1];
	}
	public peekAt(index: number): T | undefined {
		return index < 0 || index >= this._pos ? undefined : this._array[this._pos - index - 1];
	}
	public clear(): this {
		this._pos = 0;
		this._array.length = this.DEFAULT_SIZE;
		return this;
	}
	public clone(): this {
		const arr = deepCopy(this._array);
		let result = this.create(this.DEFAULT_SIZE) as this;
		result._array = arr;
		result._limit = this._limit;
		result._pos = this._pos;
		return result;
	}
	private limitObjects() {
		while (this._pos > this._limit) {
			this._array.shift();
			--this._pos;
		}
	}
	public toJSON(): T[] {
		return this.values.slice(0, this._pos);
	}
	public serialize(): T[] {
		return this.values
			.slice(0, this._pos)
			.map((el) => isFunction((el as any).serialize) ? (el as any).serialize() : el);
	}
	public deserialize(array: any[], ...types: Array<Constructor<any>>): this {
		deserialize.apply(this, [array, this._array].concat(types));
		this._pos = array.length;
		return this;
	}
}
