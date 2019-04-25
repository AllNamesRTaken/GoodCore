import { clone, setProperties } from "./Obj";
import { isArray, isNullOrUndefined, isNumber, isUndefined, isNotUndefined, isNotNullOrUndefined, Env, isFunction } from "./Test";

export function flatten<T>(src: any[]): T[] {
	return flattenInner<T>(src);
}
function flattenInner<T>(src: any[], result: T[] = []): T[] {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len) {
		if (isArray(src[i])) {
			flattenInner<T>(src[i] as any[], result);
		} else {
			result.push(src[i] as T);
		}
	}
	return result;
}
export function reverse<T>(array: T[]): T[] {
	let left = null;
	let right = null;
	const length = isNullOrUndefined(array) ? 0 : array.length;
	for (left = 0; left < length / 2; left += 1) {
		right = length - 1 - left;
		const temporary = array[left];
		array[left] = array[right];
		array[right] = temporary;
	}
	return array;
}
export function concat(...arrs: any[]): any[] {
	const result = Array.prototype.concat.apply([], arrs) as any[];
	return result;
}
export function slice<T>(src: T[], pos: number = 0, count: number = Infinity): T[] {
	let result: T[];
	if (isNotNullOrUndefined(src)) {
		let len = Math.min( src.length - pos, count);
		if (Env.hasFastNativeArrays()) {
			result = src.slice(pos, pos + count);
		} else {
			let len = Math.min( src.length - pos, count);
			if (len <= 0) {
				len = 0;
			}
			result = new Array(len);
			let i = -1;
			while (++i < len) {
				result[i] = src[i + pos];
			}
		}
	} else {
		result = [];
	}
	return result;
}
export function splice<T>(src: T[], pos: number = 0, remove: number = Infinity, insert: T[] = []): void {
	if (isNullOrUndefined(src)) {
		throw new Error("Unable to splice on null or undefined");
	}
	let srcLen = src.length;
	pos = Math.max(0, pos);
	pos = Math.min(pos, srcLen);
	remove = Math.max(0, remove);
	remove = Math.min(remove, srcLen - pos);

	// natives are still slower on node 10.9
	if (Env.hasFastNativeArrays() && (insert.length !== remove || pos + insert.length >= src.length)) {
		(src.splice.bind(src, pos, remove) as Function).apply(src, insert);
	} else {
		let insertLen = insert.length;
		let newLen = srcLen - remove + insertLen;
		let delta = remove - insertLen;
		if (delta < 0) {
			src.length = newLen;		
			let i = newLen;
			while (--i >= pos + remove) {
				src[i] = src[i + delta];
			}
		}

		let i = pos - 1;
		while (++i < pos + insertLen) {
			src[i] = insert[i - pos];
		}
		if ( delta > 0) {
			--i;
			while (++i < srcLen - delta) {
				src[i] = src[i + delta];
			}
			src.length = newLen;
		}
	}
}
export function append<T>(arr: T[], values: T[]): void {
	let index = -1;
	const offset = arr.length;
	const length = isNullOrUndefined(values) ? 0 : values.length;

	while (++index < length) {
		arr[offset + index] = values[index];
	}
}
export function removeAt<T>(arr: T[], index: number): T | undefined {
	let result;
	if (isNotNullOrUndefined(arr) && index >= 0) {
		// natives are still slower on node 10.9
		if (Env.hasFastNativeArrays()) {
			result = arr.splice(index, 1)[0];
		} else {
			let len = arr.length;
			index = Math.max(0, index);
			index = Math.min(index, len);
			let i = index;
			result = arr[i];
			// result = arr[index];
			while (++i < len) {
				arr[i - 1] = arr[i];
			}
			arr.length -= 1;
		}
	}
	return result;
}
export function indexOfElement(src: any[], el: any): number {
	let result = -1;
	if (isNotNullOrUndefined(src)) {
		if (Env.hasFastNativeArrays()) {
			result = src.indexOf(el);
		} else {
			const len = isNullOrUndefined(src) ? 0 : src.length;
			let i = -1;
			while (++i < len) {
				if (src[i] === el) {
					result = i;
					break;
				}
			}
		}
	}
	return result;
}
export function remove(arr: any[], el: any): void {
	const start = indexOfElement(arr, el);
	removeAt(arr, start);
}
export function indexOf(src: any[], fn: (el: any) => boolean): number {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len) {
		if (fn(src[i])) {
			return i;
		}
	}
	return -1;
}
export function find<T>(src: T[], fn: (el: any) => boolean): T | undefined {
	let i = indexOf(src, fn);
	let result: T | undefined;
	if (i !== -1) {
		result = src[i];
	}
	return result;
} 
export function removeOneByFn<T>(arr: T[], fn: (el: T) => boolean): void {
	const start = indexOf(arr, fn);
	removeAt(arr, start);
}
export function shallowCopy<T>(src: T[]): T[] {
	let i = -1;
	let result: T[];
	if (isNotNullOrUndefined(src)) {
		if (Env.hasFastNativeArrays()) {
			result = src.slice();
		} else {
			const len = src.length;
			result = new Array(len);
			while (++i < len) {
				result[i] = src[i];
			}
		}
	} else {
		result = [];
	}
	return result;
}
export function shallowCopyInto<T>(src: T[], target: T[]): void {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	target.length = len;
	while (++i < len) {
		target[i] = src[i];
	}
}
export function shallowFill<T>(src: T[], target: T[], at: number = 0): void {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	if (target.length < len + at) {
		target.length = len + at;
	}
	while (++i < len) {
		target[at + i] = src[i];
	}
}
export function deepCopy<T>(src: T[]): T[] {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	const result = new Array(len);
	while (++i < len) {
		result[i] = (clone(src[i]));
	}
	return result;
}
export function deepCopyInto<T>(src: T[], target: T[]): void {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	target.length = len;
	while (++i < len) {
		target[i] = (clone(src[i]));
	}
}
export function deepFill<T>(src: T[], target: T[], at: number = 0): void {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	if (target.length < len + at) {
		target.length = len + at;
	}
	while (++i < len) {
		target[at + i] = (clone(src[i]));
	}
}
export function filter<T>(src: T[], fn: (el: T, i: number) => boolean): T[] {
	let result: T[];
	// natives are still slower on node 10.9
	// if(Env.hasFastNativeArrays()) {
	// 	result = isNullOrUndefined(src) ? [] : src.filter(fn);
	// } else {
	result = [];
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len) {
			const el = src[i];
			if (fn(el, i) === true) {
				result.push(el);
			}
		}
	// }
	return result;
}
export function filterInto<T>(src: T[], target: T[], fn: (el: T, i: number) => boolean): void {
	let i = -1;
	let j = 0;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	const space = target.length;
	while (++i < len) {
		const el = src[i];
		if (fn(el, i!) === true) {
			if (j < space) {
				target[j++] = el;
			} else {
				++j;
				target.push(el);
			}
		}
	}
	target.length = j;
}
export function map<S, T>(src: S[], fn: (el: S, i: number) => T, startIndex: number = 0): T[] {
	let result: T[];
	let i = startIndex - 1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	result = new Array<T>(len);
	while (++i < len) {
		result[i] = fn(src[i], i);
	}
	return result;
}
export async function mapAsync<S, T>(src: S[], fn: (el: S, i: number) => PromiseLike<T>, inParallel: boolean = false): Promise<T[]> {
	let result: T[];
	if (!inParallel) {
		let i = - 1;
		const len = isNullOrUndefined(src) ? 0 : src.length;
		result = new Array<T>(len);
		while (++i < len) {
			result[i] = await fn(src[i], i);
		}
	} else {
		result = await Promise.all(map(src, fn));
	}
	return result;
}
export function mapInto<S, T>(src: S[], target: T[], fn: (el: S, i: number) => T, startIndex: number = 0): void {
	let i = startIndex - 1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	target.length = len;
	while (++i < len) {
		target[i] = fn(src[i], i);
	}
}
export function reduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U, pos?: number, to?: number): U {
	let acc: U = start;
	if (isNotNullOrUndefined(src)) {
		pos = Math.min(Math.max(0, isUndefined(pos) ? 0 : pos!), src.length - 1);
		to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to!), src.length - 1);
		let i = pos - 1;
		while (++i < to + 1) {
			acc = fn(acc, src[i]);
		}
	}
	return acc;
}
export function reduceUntil<T, U>(
	src: T[], 
	fn: (acc: U, cur: T) => U, 
	test: (acc: U, cur: T) => boolean, 
	start: U, 
	pos?: number, 
	to?: number
): U {
	let acc: U = start;
	if (isNotNullOrUndefined(src)) {
		pos = Math.min(Math.max(0, isUndefined(pos) ? 0 : pos!), src.length - 1);
		to = Math.min(Math.max(0, isUndefined(to) ? src.length - 1 : to!), src.length - 1);
		let i = pos - 1;
		while (++i < to + 1 && !test(acc, src[i])) {
			acc = fn(acc, src[i]);
		}
	}
	return acc;
}
export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U {
	let i = isNullOrUndefined(src) ? 0 : src.length;
	let acc: U = start;
	while (--i >= 0) {
		acc = fn(acc, src[i]);
	}
	return acc;
}
export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U {
	let i = isNullOrUndefined(src) ? 0 : src.length;
	let acc: U = start;
	while (--i >= 0 && !test(acc, src[i])) {
		acc = fn(acc, src[i]);
	}
	return acc;
}
export function forEach<T>(src: T[], fn: (el: T, i: number) => any, startIndex: number = 0): void {
	let i = startIndex - 1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len) {
		fn(src[i], i);
	}
}
export async function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel: boolean = false): Promise<void> {
	if (!inParallel) {
		let i = -1;
		const len = isNullOrUndefined(array) ? 0 : array.length;
		while (++i < len) {
			await fn(array[i], i);
		}
	} else {
		await Promise.all(map(array, fn));
	}
}
export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void {
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len) {
		const el = src[i];
		if (filter(el, i)) {
			fn(el, i);
		}
	}
}
export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean | void, startIndex?: number): void;
export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean | void, fn: (el: T, i: number) => void, startIndex?: number): void;
export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean | void, fn?: ((el: T, i: number) => void) | number, startIndex?: number): void {
	let isCombined = isUndefined(fn) || isNumber(fn);
	startIndex = isCombined ? fn as number : startIndex;
	let i = isUndefined(startIndex) || startIndex! < 0 ? -1 : startIndex! - 1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len && (isCombined ? 
			!fnOrTest(src[i], i) : 
			!(fnOrTest(src[i], i) || ((fn as (el: T, i: number) => void)!(src[i], i), false)))
		) {
	}
}
export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void {
	let i = isNullOrUndefined(src) ? 0 : src.length;
	while (--i >= 0) {
		fn(src[i], i);
	}
}
export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): void {
	let i = isNullOrUndefined(src) ? 0 : src.length;
	let combined = isUndefined(fn);
	while (--i >= 0 && (combined ? !fnOrTest(src[i], i) : !(fnOrTest(src[i], i) || (fn!(src[i], i), false)))) {
	}
}
export function some<T>(src: T[], fn: (el: T) => boolean): boolean {
	let result = false;
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len && !(result = fn(src[i]))) {
	}
	return result;
}
export function all<T>(src: T[], fn: (el: T) => boolean): boolean {
	let result = true;
	let i = -1;
	const len = isNullOrUndefined(src) ? 0 : src.length;
	while (++i < len && (result = fn(src[i]))) {
	}
	return result;
}
export function insertAt<T>(src: T[], pos: number, v: T): void {
	if (isNullOrUndefined(src)) {
		throw new Error("Unable to insertAt on null or undefined");		
	}
	if (pos === 0) {
		src.unshift(v);
	} else if (pos > 0) {
		let i = src.length;
		while (--i >= pos) {
			src[i + 1] = src[i];
		}
		src[i + 1] = v;
	}
}
export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest: boolean = false): number {
	let lo = 0,
		hi = isNullOrUndefined(src) ? -1 : src.length - 1,
		mid,
		element;
	while (lo <= hi) {
		mid = ((lo + hi) >> 1);
		element = src[mid];
		let val = cmp(element);
		if (val < 0) {
			lo = mid + 1;
		} else if (val > 0) {
			hi = mid - 1;
		} else {
			return mid;
		}
	}
	return closest ? lo : -1;
}
export function create<T>(length: number, populator: (i?: number, arr?: T[]) => T): T[] {
	if ((length || -1) < 0) {
		length = 0;
	}
	let arr = new Array<T>(length);
	let i = -1;	
	while (++i < length) {
		arr[i] = populator(i, arr);		
	}
	return arr;
}
type zipFn<S, T, U, V = undefined, W = undefined> = (i: number, a: S, b: T, c?: V, d?: W) => U;
export function zip<S, T, U = [S, T], V = undefined, W = undefined>(
	a: S[], 
	b: T[], 
	fn?: zipFn<S, T, U, V, W>,
	c?: undefined, 
	d?: undefined, 
): U[];
export function zip<S, T, V, U = [S, T, V], W = undefined>(
	a: S[], 
	b: T[], 
	c: V[], 
	fn?: zipFn<S, T, U, V, W>,
	d?: undefined, 
): U[];
export function zip<S, T, V, W, U = [S, T, V, W]>(
	a: S[], 
	b: T[], 
	c: V[], 
	d: W[], 
	fn?: zipFn<S, T, U, V, W>,
): U[]; 
export function zip<S, T, V = undefined, W = undefined, U = [S, T] | [S, T, V] | [S, T, V, W]>(
	a: S[], 
	b: T[], 
	x?: zipFn<S, T, U, V, W> | V[], 
	y?: zipFn<S, T, U, V, W> | W[], 
	z?: zipFn<S, T, U, V, W>,
): U[] {
	let c: V[] | undefined;
	let d: W[] | undefined;
	let defaultZipFn = (i: number, a: S, b: T): U => [a, b] as any;
	let fn: zipFn<S, T, U, V, W> = 
		isNotUndefined(x) ? 
			isFunction(x) ? 
				x! as zipFn<S, T, U, V, W> : 
				(c = x as V[], isNotUndefined(y) ? 
					isFunction(y) ? 
						y! as zipFn<S, T, U, V, W> :
						(d = y as W[], isNotUndefined(z) ?
							z! :
							defaultZipFn 
						) :
					defaultZipFn
				) :
		defaultZipFn;
	let i = -1;
	let hasC = isNotUndefined(c);
	let hasD = isNotUndefined(d);
	let max = Math.min(a.length, b.length, hasC ? c!.length : Number.POSITIVE_INFINITY, hasD ? d!.length : Number.POSITIVE_INFINITY);
	let u: U;
	let result: U[] = [];
	if (hasC && hasD) {
			while (++i < max && (u = fn(i, a[i], b[i], c![i], d![i] )) !== undefined) {
			result.push(u);
		}
	} else if (hasC) {
		while (++i < max && (u = fn(i, a[i], b[i], c![i] )) !== undefined) {
			result.push(u);
		}
	} else {
		while (++i < max && (u = fn(i, a[i], b[i] )) !== undefined) {
			result.push(u);
		}
	}
	return result;
}
export function unzip<S, T, U = [S, T]>(
	arr: U[], 
	fn: (u: U, i?: number, out?: [S, T]) => [S, T] 
		= (u: any, i: number, out: [S, T]) => (out[0] = ((u as [S, T])[0] as any), out[1] = (u as [S, T])[1], out) as any 
): [S[], T[]] {
	let i = -1;
	let len = arr.length;
	let split: [S, T] =  [undefined as any, undefined as any];
	let result: [S[], T[]] = [
		new Array<S>(),
		new Array<T>()
	];
	while (++i < len && (split = fn(arr[i], i, split) ) ) {
		result[0].push(split[0]);
		result[1].push(split[1]);
	}
	return result;
}
export function deserialize<S, U>(array: any[], target: S[], ...types: Array<Constructor<any>>): void {
	let T: Constructor<any> | undefined;
	let passthroughT: Array<Constructor<any>>;
	T = types.shift();
	passthroughT = types;
	if (isNotUndefined(T)) {
		if (isNotUndefined((T!.prototype as any).deserialize)) {
			mapInto(array, target, (el) => {
				let t = (new T!() as any);
				return (t.deserialize as Function).apply(t, [el].concat(passthroughT));
			});
		} else {
			mapInto(array, target, (el, i) => {
				let newT = new T!();
				setProperties(newT, el);
				return newT;
			});
		}
	} else {
		deepCopyInto(array, target);
	}
}
