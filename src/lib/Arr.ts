import { clone } from "./Obj";
import { isArray } from "./Test";

class ArrayState {
	public static _int: number;
}

export function flatten<T>(src: any[]): T[] {
	return flattenInner<T>(src);
}
function flattenInner<T>(src: any[], result: T[] = []): T[] {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		if (isArray(src[i])) {
			flattenInner<T>(src[i], result);
		} else {
			result.push(src[i]);
		}
	}
	return result;
}
export function reverse<T>(array: T[]): T[] {
	let left = null;
	let right = null;
	const length = array.length;
	for (left = 0; left < length / 2; left += 1) {
		right = length - 1 - left;
		const temporary = array[left];
		array[left] = array[right];
		array[right] = temporary;
	}
	return array;
}
export function concat(...arrs: any[]): any[] {
	const result = Array.prototype.concat.apply([], arrs);
	return result;
}
export function slice<T>(src: T[], from: number = 0, count: number = Infinity): T[] {
	let len = Math.min(src.length - from, count);
	if (len < 0) {
		len = 0;
	}
	let i = -1;
	const result = new Array(len);
	while (++i < len) {
		result[i] = src[i + from];
	}
	return result;
}
export function append<T>(arr: T[], values: T[]): void {
	let index = -1;
	const offset = arr.length;
	const length = values.length;

	while (++index < length) {
		arr[offset + index] = values[index];
	}
}
export function removeAt(arr: any[], index: number): any {
	let result;
	if (index !== -1 && index < arr.length) {
		const len = arr.length;
		let i = index;
		result = arr[index];
		while (++i < len) {
			arr[i - 1] = arr[i];
		}
		arr.length -= 1;
	}
	return result;
}
export function indexOfElement(src: any[], el: any): number {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		if (src[i] === el) {
			return i;
		}
	}
	return -1;
}
export function remove(arr: any[], el: any): void {
	const start = indexOfElement(arr, el);
	removeAt(arr, start);
}
export function indexOf(src: any[], fn: (el: any) => boolean): number {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		if (fn(src[i])) {
			return i;
		}
	}
	return -1;
}
export function removeOneByFn(arr: any[], fn: (el: any) => boolean): void {
	const start = indexOf(arr, fn);
	removeAt(arr, start);
}
export function shallowCopy<T>(src: T[]): T[] {
	let i = -1;
	const len = src.length;
	const result = new Array(len);
	while (++i < len) {
		result[i] = src[i];
	}
	return result;
}
export function shallowCopyInto<T>(src: T[], target: T[]): void {
	let i = -1;
	const len = src.length;
	target.length = len;
	while (++i < len) {
		target[i] = src[i];
	}
}
export function shallowFill<T>(src: T[], target: T[], at: number = 0): void {
	let i = -1;
	const len = src.length;
	if (target.length < len + at) {
		target.length = len + at;
	}
	while (++i < len) {
		target[at + i] = src[i];
	}
}
export function deepCopy<T>(src: T[]): T[] {
	let i = -1;
	const len = src.length;
	const result = new Array(len);
	while (++i < len) {
		result[i] = (clone(src[i]));
	}
	return result;
}
export function deepCopyInto<T>(src: T[], target: T[]): void {
	let i = -1;
	const len = src.length;
	target.length = len;
	while (++i < len) {
		target[i] = (clone(src[i]));
	}
}
export function deepFill<T>(src: T[], target: T[], at: number = 0): void {
	let i = -1;
	const len = src.length;
	if (target.length < len + at) {
		target.length = len + at;
	}
	while (++i < len) {
		target[at + i] = (clone(src[i]));
	}
}
export function filter<T>(src: T[], fn: (el: T, i: number) => boolean): T[] {
	const result: T[] = [];
	let i = -1;
	const len = src.length;
	while (++i < len) {
		const el = src[i];
		if (fn(el, i) === true) {
			result.push(el);
		}
	}
	return result;
}
export function filterInto<T>(src: T[], target: T[], fn: (el: T, i: number) => boolean): void {
	let i = -1;
	let j = 0;
	const len = src.length;
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
export function map<S, T>(src: S[], fn: (el: S, i: number) => T): T[] {
	let i = -1;
	const len = src.length;
	const result = new Array<T>(len);
	while (++i < len) {
		result[i] = fn(src[i], i);
	}
	return result;
}
export function mapInto<S, T>(src: S[], target: T[], fn: (el: S, i: number) => T): void {
	let i = -1;
	const len = src.length;
	target.length = len;
	while (++i < len) {
		target[i] = fn(src[i], i);
	}
}
export function reduce<T>(src: T[], fn: (acc: any | number, cur: T) => any | number, start: any | number = 0): any | number {
	let i = -1;
	const len = src.length;
	let acc: any | number = start;
	while (++i < len) {
		acc = fn(acc, src[i]);
	}
	return acc;
}
export function forEach<T>(src: T[], fn: (el: T, i: number) => any): void {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		fn(src[i], i);
	}
}
export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		const el = src[i];
		if (filter(el, i)) {
			fn(el, i);
		}
	}
}
export function until<T>(src: T[], test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void {
	let i = -1;
	const len = src.length;
	while (++i < len) {
		if (test(src[i], i)) {
			return;
		}
		fn(src[i], i);
	}
}
export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void {
	let i = src.length;
	while (--i >= 0) {
		fn(src[i], i);
	}
}
export function reverseUntil<T>(src: T[], test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void {
	let i = src.length;
	while (--i >= 0) {
		if (test(src[i], i)) {
			return;
		}
		fn(src[i], i);
	}
}
export function some<T>(src: T[], fn: (el: T) => boolean): boolean {
	let result = false;
	let i = -1;
	const len = src.length;
	while (++i < len && !(result = fn(src[i]))) {
	}
	return result;
}
export function all<T>(src: T[], fn: (el: T) => boolean): boolean {
	let result = true;
	let i = -1;
	const len = src.length;
	while (++i < len && (result = fn(src[i]))) {
	}
	return result;
}
export function insertAt<T>(src: T[], pos: number, v: T): void {
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
		hi = src.length - 1,
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
export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[] {
	let arr = new Array<T>(length);
	let i = -1;	
	if (length < 0) {
		length = 0;
	}
	while (++i < length) {
		arr[i] = populator(i, arr);		
	}
	return arr;
}
