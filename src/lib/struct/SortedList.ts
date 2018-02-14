import { binarySearch, shallowCopy } from "../Arr";
import { equals, setProperties } from "../Obj";
import { isFunction, isNotUndefined, hasWindow } from "../Test";
import { List } from "./List";

if (hasWindow() && !(window as any).Symbol) {
	(window as any).Symbol = { iterator: "iterator" };
}

export class Comparer {
	public static StringAsc = function(a: string, b: string) { return a < b ? -1 : a === b ? 0 : 1; };
	public static StringDesc = function(a: string, b: string) { return a < b ? 1 : a === b ? 0 : -1; };
	public static NumberAsc = function(a: number, b: number) { return a < b ? -1 : a === b ? 0 : 1; };
	public static NumberDesc = function(a: number, b: number) { return a < b ? 1 : a === b ? 0 : -1; };
}
export class SortedList<T = number> implements IterableIterator<T>, IBasicList<T>, ISerializable<T[]>, IDeserializable<SortedList<T>>, ICloneable<SortedList<T>> {
	private _list: List<T> = new List<T>();
	private _cmp: (a: T, b: T) => number;
	private _pointer: number = 0;

	constructor(comparer: ((a: T, b: T) => number) = ((a: T, b: T) => a < b ? -1 : a === b ? 0 : 1 ), arr?: T[] | List<T> | SortedList<T>) {
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

	public [Symbol.iterator](): IterableIterator<T> {
		return this;
	}
	public next(value?: any): IteratorResult<T> {
		return {
				done: this._pointer >= this.length,
				value: this._pointer < this.length ? this.values[this._pointer++] : (this._pointer = 0, undefined as any)
			};
	}
	protected create<S = T>(comparer?: (a: S, b: S) => number, arr?: S[] | List<S> | SortedList<S>): SortedList<S> {
		return new ((this as any).constructor)(comparer, arr);
	}
	public get values(): T[] {
		return this._list.values;
	}
	public get(pos: number): T | undefined {
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
	public fill(size: number, populator: ((i: number) => T) | T): SortedList<T> {
		this._list.fill(size, populator);
		this.sort();
		return this;
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
		return this.create(this._cmp, this._list.clone());
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
	public removeFirst(fn: (el: T) => boolean): T {
		return this._list.removeFirst(fn);
	}
	public forEach(fn: (el: T, i: number) => any, startIndex: number = 0): SortedList<T> {
		this._list.forEach(fn, startIndex);
		return this;
	}
	public forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T> {
		this._list.forSome(filter, fn);
		return this;
	}
	public until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): SortedList<T>;
	public until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): SortedList<T>;
	public until(fnOrTest: (el: T, i: number) => boolean, fn?: ((el: T, i: number) => void) | number, startIndex?: number): SortedList<T> {
		this._list.until(fnOrTest as any, fn as any, startIndex);
		return this;
	}
	public reverseForEach(fn: (el: T, i: number) => any): SortedList<T> {
		this._list.reverseForEach(fn);
		return this;
	}
	public reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): SortedList<T> {
		this._list.reverseUntil(fnOrTest as any, fn as any);
		return this;
	}
	public some(fn: (el: T) => boolean): boolean {
		return this._list.some(fn);
	}
	public all(fn: (el: T) => boolean): boolean {
		return this._list.all(fn);
	}
	public getInsertIndex(v: T): number {
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
	public contains(v: T | ((el: T) => boolean)): boolean {
		return this.indexOf(v) !== -1;
	}
	public first(fn?: (el: T) => boolean): T | undefined {
		return this._list.first(fn);
	}
	public find(fn: (el: T) => boolean): T | undefined {
		return this._list.find(fn);
	}
	public last(): T | undefined {
		return this._list.last();
	}
	public filter(fn: (el: T, i: number) => boolean): SortedList<T> {
		return this.create(this._cmp, this._list.filter(fn));
	}
	public select(fn: (el: T, i: number) => boolean): SortedList<T> {
		return this.create(this._cmp, this._list.filter(fn));
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
	public head(count: number = 1): SortedList<T> {
		return this.create(this.comparer, this._list.head(count));
	}
	public tail(count: number = 1): SortedList<T> {
		return this.create(this.comparer, this._list.tail(count));
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
	public reduce<U>(fn: (acc: U, cur: T) => any, start: U): U {
		return this._list.reduce(fn, start) as U;
	}
	public reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return this._list.reduceUntil(fn, test, start) as U;
	}
	public reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return this._list.reverseReduce(fn, start) as U;
	}
	public reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return this._list.reverseReduceUntil(fn, test, start) as U;
	}
	public equals(b: List<T> | SortedList<T>): boolean {
		const result = equals(this._list.values, b.values);
		return result;
	}
	public same(b: List<T> | SortedList<T>): boolean {
		return this.equals(b);
	}
	public intersect(b: List<T> | SortedList<T>): SortedList<T> {
		let result = this.create(this.comparer);		
		let long: List<T> | SortedList<T>;
		let short: List<T> | SortedList<T>;
		if (this.length > 0 && b.length > 0) {
			if (this.length < b.length) {
				short = this, long = b;
			} else {
				long = this, short = b;
			}
			if (b instanceof SortedList && this.comparer === b.comparer) {
				let longPos = (long as SortedList<T>).getInsertIndex(short.get(0)!) - 1;
				let lastPos = (long as SortedList<T>).getInsertIndex(short.last()!) - 1;
				let i = -1;
				let shortLen = short.length;
				while (longPos < lastPos && ++i < shortLen) {
					let el = short.get(i)!;
					let aVsB;
					while (++longPos < lastPos && (aVsB = this.comparer(long.get(longPos)!, el)) < 0 ) {
						void(0);
					}
					if (longPos < lastPos && aVsB === 0) {
						result.add(el);
					}
				}
			} else if (long instanceof SortedList || (long instanceof List && long.indexer !== null)) {
				short.forEach((el) => {
					if (long.contains(el)) {
						result.add(el);
					}
				});
			} else {
				result = result.bulkAdd((short as SortedList<T>).toList().intersect(long));
			}
		}
		return result;
	}
	public union(b: List<T> | SortedList<T>): SortedList<T> {
		let result: SortedList<T>;
		let long: List<T> | SortedList<T>;
		let short: List<T> | SortedList<T>;

		if (this.length > 0 || b.length > 0) {
			if (this.length < b.length) {
				short = this, long = b;
			} else {
				long = this, short = b;
			}
			if (b instanceof SortedList && this.comparer === b.comparer) {
				result = this.create(this.comparer, long.values);
				let longPos = (long as SortedList<T>).getInsertIndex(short.get(0)!) - 1;
				let lastPos = (long as SortedList<T>).getInsertIndex(short.last()!) - 1;
				let i = -1;
				let shortLen = short.length;
				while (++i < shortLen && longPos < lastPos) {
					let el = short.get(i)!;
					let aVsB = -1;
					while (++longPos < lastPos && (aVsB = this.comparer(long.get(longPos)!, el)) < 0 ) {
						void(0);
					}
					if ((aVsB > 0 && longPos < lastPos) || longPos === lastPos) {
						result.add(el);
					}
				}
				if (i < shortLen) {
					--i;
					while (++i < shortLen) {
						result.add(short.get(i)!);
					}
				}
			} else if (long instanceof SortedList || (long instanceof List && long.indexer !== null)) {
				result = this.create(this.comparer, long.values);
				short.forEach((el) => {
					if (!long.contains(el)) {
						result.add(el);
					}
				});
			} else {
				result = this.create(this.comparer, (short as SortedList<T>).toList().union(long) );
			}
		} else {
			result = this.create(this.comparer);
		}
		return result;
	}
	public toList(): List<T> {
		return new List(this.values);
	}
	public toJSON(): any {
		return this.values;
	}
	public serialize(): T[] {
		return this.values.map((el) => isFunction((el as any).serialize) ? (el as any).serialize() : el);
	}
	public deserialize(array: any[], ...types: Array<Constructor<any>>): SortedList<T> {
		this._list.deserialize(array, ...types);
		this.sort();
		return this;
	}
}
