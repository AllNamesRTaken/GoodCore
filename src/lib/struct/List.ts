import { shallowCopy, create, insertAt, concat, forEach, append, deepCopy, deepCopyInto, 
	shallowCopyInto, remove, removeAt, forSome, until, reverseForEach, indexOfElement, map,  
	reverseUntil, some, all, reverse, indexOf, filterInto, slice, splice, filter, 
	mapInto, reduce, reduceUntil, reverseReduce, reverseReduceUntil, deserialize } from "../Arr";
import { clone, equals, setProperties, wipe } from "../Obj";
import { isArray, isFunction, isNotNullOrUndefined, isNotUndefined, hasWindow, isNotNull } from "../Test";
import { once } from "../Util";

if (hasWindow() && !(window as any).Symbol) {
	(window as any).Symbol = { iterator: "iterator" };
}
export class List<T> implements IterableIterator<T>, IList<T>, ISerializable<T[]>, IDeserializable<List<T>>, ICloneable<List<T>> {
	private _array: T[] = [];
	private _index: {[key: string]: T} | null = null;
	private _indexer: ((el: T) => any) | null = null;
	private _pointer: number = 0;

	constructor(arr?: T[] | List<T>) {
		if (arr === undefined) {
			this._array = new Array<T>();
		} else {
			if (arr instanceof (List)) {
				this._array = shallowCopy(arr._array);
			} else {
				this._array = shallowCopy(arr);
			}
		}
	}

	public [Symbol.iterator](): IterableIterator<T> {
		return this;
	}
	public next(value?: any): IteratorResult<T> {
		return {
				done: this._pointer >= this.length,
				value: this._pointer < this.length ? this._array[this._pointer++] : (this._pointer = 0, undefined as any)
			};
	}
	protected create<S = T>(arr?: S[] | List<S>): List<S> {
		return new ((this as any).constructor)(arr);
	}
	public get values(): T[] {
		return this._array;
	}
	// tslint:disable-next-line:no-reserved-keywords
	public get(pos: number): T | undefined {
		once(() => {
			console.warn("Function List::get(id) is deprecated please use List::read instead. get is a reserved word.");
		});
		return this.read(pos);
	}
	public read(pos: number): T | undefined {
		return this._array[pos];
	}
	public getByIndex(key: number | string): T | undefined {
		let result: T | undefined;
		return isNotNullOrUndefined(this._index) ? this._index![key] : undefined;
	}
	// tslint:disable-next-line:no-reserved-keywords
	public set(pos: number, v: T): this {
		once(() => {
			console.warn("Function List::get(id) is deprecated please use List::write instead. get is a reserved word.");
		});
		return this.write(pos, v);
	}
	public write(pos: number, v: T): this {
		if (pos >= 0 && pos < this.length) {
			this._array[pos | 0] = v;
			if (this._indexer !== null) {
				this._index![this._indexer!(v)] = v;
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
				this._index = Object.create(null);
			} else {
				wipe(this._index);
			}
			this.forEach((el) => this._index![this._indexer!(el)] = el);
		}
	}
	public truncate(size: number = 0): this {
		if (size < 0) {
			let arr = this._array;
			let len = arr.length;
			size = Math.min(len, -1 * size);
			let i = len - size - 1;
			let j = -1;
			while ( ++i < len) {
				arr[++j] = arr[i];
			}
		}
		this._array.length = Math.max(0, Math.min(this._array.length, size));
		this._reindex();
		return this;
	}
	public fill(size: number, populator: ((i: number) => T) | T): this {
		size = Math.max(0, size || 0);
		if (isFunction(populator)) {
			this._array = create(size, populator as (i: number) => T);
		} else if (!(populator instanceof Object)) {
			this._array = create<T>(size, () => populator);
		} else {
			this._array = create(size, () => clone<T>(populator as T));
		}
		this._reindex();
		return this;
	}
	public clear(): this {
		this._array.length = 0;
		if (this._index !== null) {
			wipe(this._index);
		}
		return this;
	}
	public add(v: T): this {
		this._array.push(v);
		if (this._indexer !== null) {
			this._index![this._indexer!(v)] = v;
		}
		return this;
	}
	public insertAt(pos: number, v: T): this {
		insertAt(this._array, pos, v);
		if (this._indexer !== null) {
			this._index![this._indexer!(v)] = v;
		}
		return this;
	}
	public push(v: T): number {
		if (this._indexer !== null) {
			this._index![this._indexer!(v)] = v;
		}
		return this._array.push(v);
	}
	public pop(): T | undefined {
		let result = this._array.pop();
		if (result !== undefined && this._indexer !== null) {
			delete this._index![this._indexer!(result)];
		}
		return result;
	}
	public shift(): T | undefined {
		let result = this._array.shift();
		if (result !== undefined && this._indexer !== null) {
			delete this._index![this._indexer!(result)];
		}
		return result;
	}
	public concat(v: T[] | this): this {
		let arr: T[];
		let arr2: T[] = v instanceof List ? v.values : v;
		arr = concat(this._array, arr2);
		return this.create(arr) as this;
	}
	private index(arr: T[]): void {
		if (this._indexer !== null) {
			forEach(arr, (el) => {
				this._index![this._indexer!(el)] = el;
			});
		}
	}
	private unindexEl(el: T | undefined): void {
		if (isNotUndefined(el) && isNotNull(this._indexer)) {
			delete this._index![this._indexer!(el!)];
		}
	}
	public append(v: T[] | this): this {
		let arr2: T[] = v instanceof List ? v.values : v;
		append(this._array, arr2);
		this.index(arr2);
		return this;
	}
	public copy(src: this | T[]): this {
		let arr2: T[] = src instanceof List ? src.values : src;
		deepCopyInto(arr2, this._array);
		this.index(arr2);
		return this;
	}
	public shallowCopy(src: this | T[]): this {
		let arr2: T[] = src instanceof List ? src.values : src;
		shallowCopyInto(arr2, this._array);
		this.index(arr2);
		return this;
	}
	public clone(): this {
		const arr = deepCopy(this._array);
		let result = this.create(arr);
		if (this._indexer !== null) {
			result._indexer = this._indexer;
			result._index = clone(this._index);
		}
		return result as this;
	}
	public remove(v: T): this {
		remove(this._array, v);
		this.unindexEl(v);
		return this;
	}
	public removeFirst(fn: (el: T) => boolean): T | undefined {
		let result = this.removeAt(this.indexOf(fn));
		this.unindexEl(result);
		return result;
	}
	public removeAt(n: number): T | undefined {
		let result = removeAt(this._array, n);
		this.unindexEl(result);
		return result;
	}
	public forEach(fn: (el: T, i: number) => any, startIndex: number = 0): this {
		forEach(this._array, fn, startIndex);
		return this;
	}
	public forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): this {
		forSome(this._array, filter, fn);
		return this;
	}
	public until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): this;
	public until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): this;
	public until(fnOrTest: (el: T, i: number) => boolean, fn?: ((el: T, i: number) => void) | number, startIndex?: number): this {
		until(this._array, fnOrTest as any, fn as any, startIndex);
		return this;
	}
	public reverseForEach(fn: (el: T, i: number) => any): this {
		reverseForEach(this._array, fn);
		return this;
	}
	public reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): this {
		reverseUntil(this._array, fnOrTest as any, fn as any);
		return this;
	}
	public some(fn: (el: T) => boolean): boolean {
		return some(this._array, fn);
	}
	public all(fn: (el: T) => boolean): boolean {
		return all(this._array, fn);
	}
	public indexOf(v: T | ((el: T) => boolean)): number {
		let result: number = -1;
		if ( isFunction(v) ) {
			result = indexOf(this._array, v as ((el: T) => boolean));
		} else {
			result = indexOfElement(this._array, v);
		}
		return result;
	}
	public contains(v: T | ((el: T) => boolean)): boolean {
		let result = false;
		if ( isFunction(v) ) {
			result = this.find(v as ((el: T) => boolean)) !== undefined;
		} else {
			if (this._indexer !== null) {
				result = this._index![this._indexer(v as T)] !== undefined;
			} else {
				result = indexOfElement(this._array, v) !== -1;
			}
		}
		return result;
	}
	public reverse(): this {
		reverse(this._array);
		return this;
	}
	public first(fn?: (el: T) => boolean): T | undefined {
		let index: number = -1;
		let result: T | undefined;
		if (fn === undefined) {
			index = 0;
		} else {
			index = indexOf(this._array, fn);
		}
		return index === -1 ? undefined : this.read(index);
	}
	public find(fn: (el: T) => boolean): T | undefined {
		return this.first(fn);
	}
	public last(): T | undefined {
		return this.length === 0 ? undefined : this.read(this.length - 1 );
	}
	public filter(fn: (el: T, i: number) => boolean): this {
		return this.create(filter(this._array, fn)) as this;
	}
	public select(fn: (el: T, i: number) => boolean): this {
		return this.create(filter(this._array, fn)) as this;
	}
	public selectInto(src: this | T[], fn: (el: T, i: number) => boolean): this {
		let arr = src instanceof List ? src.values : src;
		filterInto<T>(arr, this._array, fn);
		this.index(arr);
		return this;
	}
	public head(count: number = 1): this {
		count = Math.max(0, count);
		return this.create(slice(this._array, 0, count)) as this;
	}
	public tail(count: number = 1): this {
		count = Math.min(this._array.length, count);
		return this.create(slice(this._array, Math.max(0, this._array.length - count))) as this;		
	}
	public splice(pos: number = 0, remove: number = Infinity, insert: T[] | this = []): this {
		splice(this._array, pos, remove, isArray(insert) ? insert as T[] : (insert as this).values);
		this._reindex();
		return this;
	}
	public orderBy(fn: (a: T, b: T) => number): this {
		this._array.sort(fn);
		return this;
	}
	public map<S>(fn: (el: T, i: number) => S): List<S> {
		return this.create<S>(map<T, S>(this._array, fn));
	}
	public mapInto<S>(src: List<S> | S[], fn: (el: S, i: number) => T): this {
		let arr = src instanceof List ? src.values : src;
		mapInto<S, T>(arr, this._array, fn);
		this._reindex();
		return this;
	}
	public reduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return reduce(this._array, fn, start) as U;
	}
	public reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return reduceUntil(this._array, fn, test, start) as U;
	}
	public reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
		return reverseReduce(this._array, fn, start) as U;
	}
	public reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
		return reverseReduceUntil(this._array, fn, test, start) as U;
	}
	public equals(b: this): boolean {
		const result = equals(this._array, b.values);
		return result;
	}
	// Index is slower when less than 100
	public same(b: this): boolean {
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
	public intersect(b: this): this {
		let result = this.create();
		let _long: this;
		let _short: this;
		result.indexer = this.indexer;
		if (this.length < b.length) {
			_short = this, _long = b;
		} else {
			_long = this, _short = b;
		}
		if (_long.indexer !== null) {
			_short.forEach((el) => {
				if (_long.contains(el)) {
					result.push(el);
				}
			});
		} else {
			_long.forEach((el) => {
				if (_short.contains(el)) {
					result.push(el);
				}
			});			
		}
		return result as this;
	}
	public union(b: this): this {
		let result = this.create();
		let _long: this;
		let _short: this;
		result.indexer = this.indexer;
		if (this.length < b.length) {
			_short = this, _long = b;
		} else {
			_long = this, _short = b;
		}
		if (_long.indexer !== null) {
			result = _long.clone();
			_short.forEach((el) => {
				if (!_long.contains(el)) {
					result.push(el);
				}
			});
		} else {
			result = _short.clone();
			_long.forEach((el) => {
				if (!_short.contains(el)) {
					result.push(el);
				}
			});			
		}
		return result as this;
	}
	public subtract(b: this): this {
		let result = this.create();
		result.indexer = this.indexer;
		result = this.select((el) => !b.contains(el));
		return result as this;
	}
	public zip<U, V>(list: List<U>, fn: (t: T, u: U) => V = (t: T, u: U) => [t, u] as any): List<V> {
		let result: List<V> = this.create<V>();
		let length = list.length;
		this.until(function (el: T, i: number) {
			return i >= length;
		}, function (el: T, i: number) {
			result.push(fn(el, list.read(i)!));
		});
		return result;
	}
	public unzip<U, V>(fn: (el: T) => [U, V] = (el: any) => [(el as [U, V])[0], (el as [U, V])[1]]): [List<U>, List<V>] {
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
					this._flattenInner((src[i] as any[]), maxDepth, depth, result);
				} else if (src[i] instanceof List) {
					this._flattenInner((src[i] as List<any>).values, maxDepth, depth, result);
				} else {
					result.push((src[i] as any));
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
	public deserialize(array: any[], ...types: Array<Constructor<any>>): this {
		deserialize.apply(this, [array, this._array].concat(types));
		return this;
	}
}
