import * as Arr from "../Arr";
import { equals } from "../Obj";
import { isArray } from "../Test";

export class List<T> implements IList<T> {
	private _array: T[] = [];

	constructor(arr?: T[] | List<T>) {
		if (arr === undefined) {
			this._array = new Array<T>();
		} else {
			if (arr instanceof (List)) {
				this._array = Arr.shallowCopy(arr._array);
			} else {
				this._array = Arr.shallowCopy(arr);
			}
		}
	}

	public get values(): T[] {
		return this._array;
	}
	public get(pos: number): T {
		return this._array[pos];
	}
	public get count(): number {
		return this._array.length;
	}
	public get length(): number {
		return this._array.length;
	}
	public clear(): List<T> {
		this._array.length = 0;
		return this;
	}
	public add(v: T): List<T> {
		this._array.push(v);
		return this;
	}
	public insertAt(pos: number, v: T): List<T> {
		Arr.insertAt(this._array, pos, v);
		return this;
	}
	public push(v: T): number {
		return this._array.push(v);
	}
	public pop(): T | undefined {
		return this._array.pop();
	}
	public shift(): T| undefined {
		return this._array.shift();
	}
	public concat(v: T[] | List<T>): List<T> {
		let arr: T[];
		if (v instanceof List) {
			arr = Arr.concat(this._array, v._array);
		} else {
			arr = Arr.concat(this._array, v);
		}
		return new List<T>(arr);
	}
	public append(v: T[] | List<T>): List<T> {
		if (v instanceof List) {
			Arr.append(this._array, v._array);
		} else {
			Arr.append(this._array, v);
		}
		return this;
	}
	public copy(src: List<T> | T[]): List<T> {
		if (src instanceof List) {
			Arr.deepCopyInto(src._array, this._array);
		} else {
			Arr.deepCopyInto(src, this._array);
		}
		return this;
	}
	public shallowCopy(src: List<T> | T[]): List<T> {
		if (src instanceof List) {
			Arr.shallowCopyInto(src._array, this._array);
		} else {
			Arr.shallowCopyInto(src, this._array);
		}
		return this;
	}
	public clone(): List<T> {
		const arr = Arr.deepCopy(this._array);
		return new List(arr);
	}
	public remove(v: T): List<T> {
		Arr.remove(this._array, v);
		return this;
	}
	public removeFirst(fn: (el: T) => boolean): T {
		return this.removeAt(this.indexOf(fn));
	}
	public removeAt(n: number): T {
		return Arr.removeAt(this._array, n);
	}
	public forEach(fn: (el: T, i: number) => any): List<T> {
		Arr.forEach(this._array, fn);
		return this;
	}
	public forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T> {
		Arr.forSome(this._array, filter, fn);
		return this;
	}
	public until(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T> {
		Arr.until(this._array, test, fn);
		return this;
	}
	public reverseForEach(fn: (el: T, i: number) => any): List<T> {
		Arr.reverseForEach(this._array, fn);
		return this;
	}
	public reverseUntil(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T> {
		Arr.reverseUntil(this._array, test, fn);
		return this;
	}
	public some(fn: (el: T) => boolean): boolean {
		return Arr.some(this._array, fn);
	}
	public all(fn: (el: T) => boolean): boolean {
		return Arr.all(this._array, fn);
	}
	public indexOf(v: T | ((el: T) => boolean)): number {
		let result: number = -1;
		if (v instanceof Function) {
			result = Arr.indexOf(this._array, v);
		} else {
			result = Arr.indexOfElement(this._array, v);
		}
		return result;
	}
	public contains(v: T): boolean {
		return Arr.indexOfElement(this._array, v) !== -1;
	}
	public reverse(): List<T> {
		Arr.reverse(this._array);
		return this;
	}
	public first(fn?: (el: T) => boolean): T | undefined {
		let index: number = -1;
		let result: T | undefined;
		if (fn === undefined) {
			index = 0;
		} else {
			index = Arr.indexOf(this._array, fn);
		}
		return index === -1 ? undefined : this.get(index);
	}
	public filter(fn: (el: T, i: number) => boolean): List<T> {
		return new List<T>(Arr.filter(this._array, fn));
	}
	public select(fn: (el: T, i: number) => boolean): List<T> {
		return new List<T>(Arr.filter(this._array, fn));
	}
	public selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T> {
		if (src instanceof List) {
			Arr.filterInto<T>(src._array, this._array, fn);
		} else {
			Arr.filterInto<T>(src, this._array, fn);
		}
		return this;
	}
	public orderBy(fn: (a: T, b: T) => number): List<T> {
		this._array.sort(fn);
		return this;
	}
	public map<S>(fn: (el: T, i: number) => S): List<S> {
		return new List<any>(Arr.map<T, S>(this._array, fn));
	}
	public mapInto<S>(src: List<S> | S[], fn: (el: S, i: number) => T): List<T> {
		if (src instanceof List) {
			Arr.mapInto<S, T>(src._array, this._array, fn);
		} else {
			Arr.mapInto<S, T>(src, this._array, fn);
		}
		return this;
	}
	public reduce(fn: (acc: any, cur: T) => any, start?: any): any {
		return Arr.reduce(this._array, fn, start);
	}
	public equals(b: List<T>): boolean {
		const result = equals(this._array, b.values);
		return result;
	}
	public zip<U, V>(list: List<U>, fn: (t: T, u: U) => V = (t: T, u: U) => [t, u] as any): List<V> {
		let result = new List<V>();
		let length = list.length;
		this.until(function(el: T, i: number) { 
				return i >= length; 
			}, function (el: T, i: number) {
				result.push(fn(el, list.get(i)));
			});
		return result;
	}
	public unzip<U, V>(fn: (el: T) => [U, V] = (el: any) => [el[0], el[1]]): [List<U>, List<V>] {
		let result: [List<U>, List<V>] = [new List<U>(), new List<V>()];
		this.forEach(function(el) {
			let tuple = fn(el);
			result[0].push(tuple[0]);
			result[1].push(tuple[1]);
		});
		return result;
	}
	public flatten<U>(): List<U> {
		return new List(this._flattenInner(this.values));
	}
	private _flattenInner<T>(src: any[], result: T[] = []): T[] {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (isArray(src[i])) {
				this._flattenInner<T>(src[i], result);
			} else if (src[i] instanceof List) {
				this._flattenInner<T>(src[i].values, result);
			} else {
				result.push(src[i]);
			}
		}
		return result;
	}
	public toJSON(): string {
		return JSON.stringify(this.values);
	}
}
