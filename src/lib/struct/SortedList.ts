import { binarySearch } from "../Arr";
import { equals } from "../Obj";
import { List } from "./List";

export class Comparer {
	public static StringAsc = function(a: string, b: string) { return a < b ? -1 : a === b ? 0 : 1; };
	public static StringDesc = function(a: string, b: string) { return a < b ? 1 : a === b ? 0 : -1; };
	public static NumberAsc = function(a: number, b: number) { return a < b ? -1 : a === b ? 0 : 1; };
	public static NumberDesc = function(a: number, b: number) { return a < b ? 1 : a === b ? 0 : -1; };
}
export class SortedList<T> {
	private _list: List<T> = new List<T>();
	private _cmp: (a: T, b: T) => number;

	constructor(comparer: (a: T, b: T) => number, arr?: T[] | List<T> | SortedList<T>) {
		this._cmp = comparer;

		if (arr === undefined) {
			this._list = new List<T>();
		} else {
			if (arr instanceof (List) || arr instanceof (SortedList)) {
				this.copy(arr.values);
			} else {
				this.copy(arr);
			}
		}
	}

	public get values(): T[] {
		return this._list.values;
	}
	public get(pos: number): T {
		return this._list.get(pos);
	}
	public get count(): number {
		return this._list.length;
	}
	public get length(): number {
		return this._list.length;
	}
	public get comparer(): (a: T, b: T) => number {
		return this._cmp;
	}
	public set comparer(v: (a: T, b: T) => number) {
		this._cmp = v;
		this.sort();
	}
	public sort() {
		this._list.orderBy(this._cmp);
	}
	public clear(): SortedList<T> {
		this._list.clear();
		return this;
	}
	public add(v: T): SortedList<T> {
		let index = this.getInsertIndex(v);
		this._list.insertAt(index, v);
		return this;
	}
	public pop(): T | undefined {
		return this._list.pop();
	}
	public shift(): T | undefined {
		return this._list.shift();
	}
	public bulkAdd(v: T[] | List<T> | SortedList<T>): SortedList<T> {
		if (v instanceof List || v instanceof SortedList) {
			this._list.append(v.values);
		} else {
			this._list.append(v);
		}
		this._list.orderBy(this._cmp);
		this.sort();
		return this;
	}
	public copy(src: SortedList<T> | List<T> | T[]): SortedList<T> {
		if (src instanceof List || src instanceof SortedList) {
			this._list.copy(src.values);
		} else {
			this._list.copy(src);
		}
		this.sort();
		return this;
	}
	public clone(): SortedList<T> {
		return new SortedList(this._cmp, this._list.clone());
	}
	public remove(v: T): SortedList<T> {
		let index = this.indexOf(v);
		if (index !== -1) {
			this._list.removeAt(index);
		}
		return this;
	}
	public removeAt(n: number): T {
		return this._list.removeAt(n);
	}
	public forEach(fn: (el: T, i: number) => any): SortedList<T> {
		this._list.forEach(fn);
		return this;
	}
	public forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T> {
		this._list.forSome(filter, fn);
		return this;
	}
	public until(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T> {
		this._list.until(test, fn);
		return this;
	}
	public reverseForEach(fn: (el: T, i: number) => any): SortedList<T> {
		this._list.reverseForEach(fn);
		return this;
	}
	public reverseUntil(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T> {
		this._list.reverseUntil(test, fn);
		return this;
	}
	public some(fn: (el: T) => boolean): boolean {
		return this._list.some(fn);
	}
	public all(fn: (el: T) => boolean): boolean {
		return this._list.all(fn);
	}
	private getInsertIndex(v: T): number {
		return binarySearch(this._list.values, (el: T) => this._cmp(el, v), true);
	}
	public indexOf(v: T | ((el: T) => boolean)): number {
		let result = -1;
		if (v instanceof Function) {
			result = this._list.indexOf(v);
		} else {
			result = binarySearch(this._list.values, (el: T) => this._cmp(el, v), false);
		}
		return result;
	}
	public contains(v: T): boolean {
		return this.indexOf(v) !== -1;
	}
	public first(fn?: (el: T) => boolean): T | undefined {
		return this._list.first(fn);
	}
	public filter(fn: (el: T, i: number) => boolean): SortedList<T> {
		return new SortedList<T>(this._cmp, this._list.filter(fn));
	}
	public select(fn: (el: T, i: number) => boolean): SortedList<T> {
		return new SortedList<T>(this._cmp, this._list.filter(fn));
	}
	public selectInto(src: SortedList<T> | List<T> | T[], fn: (el: T, i: number) => boolean): SortedList<T> {
		if (src instanceof List || src instanceof SortedList) {
			this._list.selectInto(src.values, fn);
		} else {
			this._list.selectInto(src, fn);
		}
		this.sort();
		return this;
	}
	public map<S>(fn: (el: T, i: number) => S): List<S> {
		return this._list.map(fn);
	}
	public mapInto<S>(src: SortedList<S> | List<S> | S[], fn: (el: S, i: number) => T): SortedList<T> {
		if (src instanceof List || src instanceof SortedList) {
			this._list.mapInto(src.values, fn);
		} else {
			this._list.mapInto(src, fn);
		}
		this.sort();
		return this;
	}
	public reduce(fn: (acc: any, cur: T) => any, start?: any): any {
		return this._list.reduce(fn, start);
	}
	public equals(b: List<T> | SortedList<T>): boolean {
		const result = equals(this._list.values, b.values);
		return result;
	}
	public toList(): List<T> {
		return new List(this.values);
	}
	public toJSON(): any {
		return this.values;
	}
}
