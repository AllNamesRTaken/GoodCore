import * as Arr from "../Arr";
import { clone, equals, setProperties } from "../Obj";
import { isArray, isFunction, isNotNullOrUndefined, isNotUndefined } from "../Test";
import { Dictionary } from "./Dictionary";

export class List<T> implements IList<T>, ISerializable<T[]>, IDeserializable<List<T>>, ICloneable<List<T>> {
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

	protected create<S = T>(arr?: S[] | List<S>): List<S> {
		return new ((this as any).constructor)(arr);
	}
	public get values(): T[] {
		return this._array;
	}
	public get(pos: number): T | undefined {
		return this._array[pos];
	}
	public getByIndex(key: number | string): T | undefined {
		let result: T | undefined;
		return isNotNullOrUndefined(this._index) ? this._index!.get(key) : undefined;
	}
	public set(pos: number, v: T): List<T> {
		if (pos >= 0 && pos < this.length) {
			this._array[pos | 0] = v;
			if (this._indexer !== null) {
				this._index!.set(this._indexer!(v), v);
			}
		} else {
			throw new Error(`index out of bounds on <List>.set(${pos}, ${v.toString()})`);
		}
		return this;
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
	public fill(size: number, populator: ((i: number) => T) | T): List<T> {
		size = Math.max(0, size || 0);
		if (isFunction(populator)) {
			this._array = Arr.create(size, populator as (i: number) => T);
		} else if (!(populator instanceof Object)) {
			this._array = Arr.create<T>(size, () => populator);
		} else {
			this._array = Arr.create(size, () => clone<T>(populator as T));
		}
		this._reindex();
		return this;
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
		return this.create(arr);
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
		let result = this.create(arr);
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
	public forEach(fn: (el: T, i: number) => any, startIndex: number = 0): List<T> {
		Arr.forEach(this._array, fn, startIndex);
		return this;
	}
	public forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T> {
		Arr.forSome(this._array, filter, fn);
		return this;
	}
	public until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): List<T>;
	public until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): List<T>;
	public until(fnOrTest: (el: T, i: number) => boolean, fn?: ((el: T, i: number) => void) | number, startIndex?: number): List<T> {
		Arr.until(this._array, fnOrTest as any, fn as any, startIndex);
		return this;
	}
	public reverseForEach(fn: (el: T, i: number) => any): List<T> {
		Arr.reverseForEach(this._array, fn);
		return this;
	}
	public reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): List<T> {
		Arr.reverseUntil(this._array, fnOrTest as any, fn as any);
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
		if ( isFunction(v) ) {
			result = Arr.indexOf(this._array, v as ((el: T) => boolean));
		} else {
			result = Arr.indexOfElement(this._array, v);
		}
		return result;
	}
	public contains(v: T | ((el: T) => boolean)): boolean {
		let result = false;
		if ( isFunction(v) ) {
			result = this.find(v as ((el: T) => boolean)) !== undefined;
		} else {
			if (this._indexer !== null) {
				result = this._index!.contains(this._indexer(v as T));
			} else {
				result = Arr.indexOfElement(this._array, v) !== -1;
			}
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
		return this.create(Arr.filter(this._array, fn));
	}
	public select(fn: (el: T, i: number) => boolean): List<T> {
		return this.create(Arr.filter(this._array, fn));
	}
	public selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T> {
		let arr = src instanceof List ? src.values : src;
		Arr.filterInto<T>(arr, this._array, fn);
		this.index(arr);
		return this;
	}
	public head(count: number = 1): List<T> {
		count = Math.max(0, count);
		return this.create(Arr.slice(this._array, 0, count));
	}
	public tail(count: number = 1): List<T> {
		count = Math.min(this._array.length, count);
		return this.create(Arr.slice(this._array, Math.max(0, this._array.length - count)));		
	}
	public splice(pos: number = 0, remove: number = Infinity, insert: T[] | List<T> = []): List<T> {
		Arr.splice(this._array, pos, remove, isArray(insert) ? insert as T[] : (insert as List<T>).values);
		this._reindex();
		return this;
	}
	public orderBy(fn: (a: T, b: T) => number): List<T> {
		this._array.sort(fn);
		return this;
	}
	public map<S>(fn: (el: T, i: number) => S): List<S> {
		return this.create<S>(Arr.map<T, S>(this._array, fn));
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
	public reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return Arr.reduceUntil(this._array, fn, test, start) as U;
	}
	public reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return Arr.reverseReduce(this._array, fn, start) as U;
	}
	public reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return Arr.reverseReduceUntil(this._array, fn, test, start) as U;
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
		let result = this.create();
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
		let result = this.create();
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
	public subtract(b: List<T>): List<T> {
		let result = this.create();
		result.indexer = this.indexer;
		result = this.select((el) => !b.contains(el));
		return result;
	}
	public zip<U, V>(list: List<U>, fn: (t: T, u: U) => V = (t: T, u: U) => [t, u] as any): List<V> {
		let result: List<V> = this.create<V>();
		let length = list.length;
		this.until(function (el: T, i: number) {
			return i >= length;
		}, function (el: T, i: number) {
			result.push(fn(el, list.get(i)!));
		});
		return result;
	}
	public unzip<U, V>(fn: (el: T) => [U, V] = (el: any) => [el[0], el[1]]): [List<U>, List<V>] {
		let result: [List<U>, List<V>] = [this.create<U>(), this.create<V>()];
		this.forEach(function (el) {
			let tuple = fn(el);
			result[0].push(tuple[0]);
			result[1].push(tuple[1]);
		});
		return result;
	}
	public flatten<U>(maxDepth: number = Infinity): List<U> {
		return this.create<U>(maxDepth < 1 ? this.values as any : this._flattenInner(this.values, maxDepth));
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
	public serialize(): T[] {
		return this.values.map((el) => isFunction((el as any).serialize) ? (el as any).serialize() : el);
	}
	public deserialize(array: any[], ...types: Array<Constructor<any>>): List<T> {
		Arr.deserialize(array, this._array, ...types);
		return this;
	}
}
