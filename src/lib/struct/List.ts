import * as Arr from "../Arr";
import { equals } from "../Obj";
import { isArray } from "../Test";
import { Dictionary } from "./Dictionary";

export class List<T> implements IList<T> {
	private _array: T[] = [];
	private _index: Dictionary<T> | null = null;
	private _indexer: ((el: T) => any) | null = null;

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
	public get indexer(): ((el: T) => any) | null {
		return this._indexer;
	}
	public set indexer(fn: ((el: T) => any) | null) {
		this._indexer = fn;
		this._reindex();
	}
	private _reindex() {
		if (this._indexer === null) {
			this._index = null;
		} else {
			if (this._index === null) {
				this._index = new Dictionary<T>();
			} else {
				this._index.clear();
			}
			this.forEach((el) => this._index!.set(this._indexer!(el), el));
		}
	}
	public clear(): List<T> {
		this._array.length = 0;
		if (this._index !== null) {
			this._index.clear();
		}
		return this;
	}
	public add(v: T): List<T> {
		this._array.push(v);
		if (this._indexer !== null) {
			this._index!.set(this._indexer!(v), v);
		}
		return this;
	}
	public insertAt(pos: number, v: T): List<T> {
		Arr.insertAt(this._array, pos, v);
		if (this._indexer !== null) {
			this._index!.set(this._indexer!(v), v);
		}
		return this;
	}
	public push(v: T): number {
		if (this._indexer !== null) {
			this._index!.set(this._indexer!(v), v);
		}
		return this._array.push(v);
	}
	public pop(): T | undefined {
		let result = this._array.pop();
		if (result !== undefined && this._indexer !== null) {
			this._index!.delete(this._indexer!(result));
		}
		return result;
	}
	public shift(): T | undefined {
		let result = this._array.shift();
		if (result !== undefined && this._indexer !== null) {
			this._index!.delete(this._indexer!(result));
		}
		return result;
	}
	public concat(v: T[] | List<T>): List<T> {
		let arr: T[];
		let arr2: T[] = v instanceof List ? v.values : v;
		arr = Arr.concat(this._array, arr2);
		return new List<T>(arr);
	}
	private index(arr: T[]): void {
		if (this._indexer !== null) {
			Arr.forEach(arr, (el) => {
				this._index!.set(this._indexer!(el), el);
			});
		}
	}
	private unindexEl(el: T): void {
		if (this._indexer !== null) {
			this._index!.delete(this._indexer!(el));
		}
	}
	public append(v: T[] | List<T>): List<T> {
		let arr2: T[] = v instanceof List ? v.values : v;
		Arr.append(this._array, arr2);
		this.index(arr2);
		return this;
	}
	public copy(src: List<T> | T[]): List<T> {
		let arr2: T[] = src instanceof List ? src.values : src;
		Arr.deepCopyInto(arr2, this._array);
		this.index(arr2);
		return this;
	}
	public shallowCopy(src: List<T> | T[]): List<T> {
		let arr2: T[] = src instanceof List ? src.values : src;
		Arr.shallowCopyInto(arr2, this._array);
		this.index(arr2);
		return this;
	}
	public clone(): List<T> {
		const arr = Arr.deepCopy(this._array);
		let result = new List(arr);
		if (this._indexer !== null) {
			result._indexer = this._indexer;
			result._index = this._index!.clone();
		}
		return result;
	}
	public remove(v: T): List<T> {
		Arr.remove(this._array, v);
		this.unindexEl(v);
		return this;
	}
	public removeFirst(fn: (el: T) => boolean): T {
		let result = this.removeAt(this.indexOf(fn));
		this.unindexEl(result);
		return result;
	}
	public removeAt(n: number): T {
		let result = Arr.removeAt(this._array, n);
		this.unindexEl(result);
		return result;
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
		let result = false;
		if (this._indexer !== null) {
			result = this._index!.contains(this._indexer(v));
		} else {
			result = Arr.indexOfElement(this._array, v) !== -1;
		}
		return result;
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
	public find(fn: (el: T) => boolean): T | undefined {
		return this.first(fn);
	}
	public last(): T | undefined {
		return this.length === 0 ? undefined : this.get(this.length - 1 );
	}
	public filter(fn: (el: T, i: number) => boolean): List<T> {
		return new List<T>(Arr.filter(this._array, fn));
	}
	public select(fn: (el: T, i: number) => boolean): List<T> {
		return new List<T>(Arr.filter(this._array, fn));
	}
	public selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T> {
		let arr = src instanceof List ? src.values : src;
		Arr.filterInto<T>(arr, this._array, fn);
		this.index(arr);
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
		let arr = src instanceof List ? src.values : src;
		Arr.mapInto<S, T>(arr, this._array, fn);
		this._reindex();
		return this;
	}
	public reduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return Arr.reduce(this._array, fn, start) as U;
	}
	public reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return Arr.reverseReduce(this._array, fn, start) as U;
	}
	public equals(b: List<T>): boolean {
		const result = equals(this._array, b.values);
		return result;
	}
	// Index is slower when less than 100
	public same(b: List<T>): boolean {
		let a = this;
		let count = 0;
		if (a.length === b.length) {
			if (a.indexer !== null) {
				b.until((el) => !a.contains(el), (el, i) => ++count);
			} else {
				a.until((el) => !b.contains(el), (el, i) => ++count);
			}
		}
		return count === a.length;
	}
	public intersect(b: List<T>): List<T> {
		let result = new List<T>();
		let long: List<T>;
		let short: List<T>;
		result.indexer = this.indexer;
		if (this.length < b.length) {
			short = this, long = b;
		} else {
			long = this, short = b;
		}
		if (long.indexer !== null) {
			short.forEach((el) => {
				if (long.contains(el)) {
					result.push(el);
				}
			});
		} else {
			long.forEach((el) => {
				if (short.contains(el)) {
					result.push(el);
				}
			});			
		}
		return result;
	}
	public union(b: List<T>): List<T> {
		let result = new List<T>();
		let long: List<T>;
		let short: List<T>;
		result.indexer = this.indexer;
		if (this.length < b.length) {
			short = this, long = b;
		} else {
			long = this, short = b;
		}
		if (long.indexer !== null) {
			result = long.clone();
			short.forEach((el) => {
				if (!long.contains(el)) {
					result.push(el);
				}
			});
		} else {
			result = short.clone();
			long.forEach((el) => {
				if (!short.contains(el)) {
					result.push(el);
				}
			});			
		}
		return result;
	}
	public zip<U, V>(list: List<U>, fn: (t: T, u: U) => V = (t: T, u: U) => [t, u] as any): List<V> {
		let result = new List<V>();
		let length = list.length;
		this.until(function (el: T, i: number) {
			return i >= length;
		}, function (el: T, i: number) {
			result.push(fn(el, list.get(i)));
		});
		return result;
	}
	public unzip<U, V>(fn: (el: T) => [U, V] = (el: any) => [el[0], el[1]]): [List<U>, List<V>] {
		let result: [List<U>, List<V>] = [new List<U>(), new List<V>()];
		this.forEach(function (el) {
			let tuple = fn(el);
			result[0].push(tuple[0]);
			result[1].push(tuple[1]);
		});
		return result;
	}
	public flatten<U>(maxDepth: number = Infinity): List<U> {
		return new List(maxDepth < 1 ? this.values as any : this._flattenInner(this.values, maxDepth));
	}
	private _flattenInner<U>(src: any[], maxDepth: number, depth: number = -1, result: U[] = []): U[] {
		let i = -1;
		const len = src.length;
		if (++depth > maxDepth) {
			result.push(src as any);
		} else {
			while (++i < len) {
				if (isArray(src[i])) {
					this._flattenInner(src[i], maxDepth, depth, result);
				} else if (src[i] instanceof List) {
					this._flattenInner(src[i].values, maxDepth, depth, result);
				} else {
					result.push(src[i]);
				}
			}
		}
		return result;
	}
	public toJSON(): any {
		return this.values;
	}
}
