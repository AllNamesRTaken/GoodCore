import { Arr } from "../Arr";
import { Obj } from "../Obj";
import { List } from "./List";

const DEFAULT_SIZE = 100;
export class Stack<T> {
	private _array: T[];
	private _pos: number = 0;
	public get Values(): T[] {
		return Arr.Slice(this._array, 0, this._pos);
	}
	public get Depth(): number {
		return this._pos;
	}

	constructor(size: number = DEFAULT_SIZE) {
		this._array = new Array<T>(size);
	}
	public Push(obj: T): void {
		this._array[this._pos] = obj;
		this._pos++;
	}
	public Pop(): T {
		let result: T = null;
		if (this._pos !== 0) {
			result = this._array[--this._pos];
		}
		return result;
	}
	public ToList(): List<T> {
		const result = new List<T>();
		return new List(this.Values);
	}
}
