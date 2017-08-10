import { slice } from "../Arr";
import { List } from "./List";

export class Stack<T> {
	public DEFAULT_SIZE = 100;
	private _array: T[];
	private _pos: number = 0;
	private _limit: number = 0;
	public get values(): T[] {
		return slice(this._array, 0, this._pos);
	}
	public get depth(): number {
		return this._pos;
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
		this._array = new Array<T>(size);
		this.push = this.fastPush;
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
	public pop(): T {
		let result: T = null;
		if (this._pos !== 0) {
			result = this._array[--this._pos];
		}
		return result;
	}
	public toList(): List<T> {
		const result = new List<T>();
		return new List(this.values);
	}
	private limitObjects() {
		if (this._limit > 0) {
			while (this._pos > this._limit) {
				this._array.shift();
				--this._pos;
			}
		}
	}
}
