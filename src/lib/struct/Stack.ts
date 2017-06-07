import { Arr } from "../Arr";
import { Obj } from "../Obj";
import { List } from "./List";

export class Stack<T> {
	public DEFAULT_SIZE = 100;
	private _array: T[];
	private _pos: number = 0;
	public get values(): T[] {
		return Arr.slice(this._array, 0, this._pos);
	}
	public get depth(): number {
		return this._pos;
	}

	constructor(size?: number) {
		if (!size) {
			size = this.DEFAULT_SIZE;
		}
		this._array = new Array<T>(size);
	}
	public push(obj: T): void {
		this._array[this._pos] = obj;
		this._pos++;
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
}
