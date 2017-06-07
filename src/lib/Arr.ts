import { Obj } from "./Obj";
import { Test } from "./Test";

class ArrayState {
	public static _int: number;
}
export class Arr {
	public constructor() {

	}

	public static flatten<T>(src: any[]): T[] {
		return Arr.flattenInner<T>(src);
	}
	private static flattenInner<T>(src: any[], result: T[] = []): T[] {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (Test.isArray(src[i])) {
				Arr.flattenInner<T>(src[i], result);
			} else {
				result.push(src[i]);
			}
		}
		return result;
	}
	public static reverse<T>(array: T[]): T[] {
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
	public static concat(...arrs: any[]): any[] {
		const result = Array.prototype.concat.apply([], arrs);
		return result;
	}
	public static slice<T>(src: T[], from: number = 0, count: number = Infinity): T[] {
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
	public static append<T>(arr: T[], values: T[]): void {
		let index = -1;
		const
			length = values.length,
			offset = arr.length;
		arr.length = length + offset;

		while (++index < length) {
			arr[offset + index] = values[index];
		}
	}
	public static removeAt(arr: any[], index: number): void {
		if (index !== -1 && index < arr.length) {
			const len = arr.length;
			let i = index;
			while (++i < len) {
				arr[i - 1] = arr[i];
			}
			arr.length -= 1;
		}
	}
	public static indexOfElement(src: any[], el: any): number {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (src[i] === el) {
				return i;
			}
		}
		return -1;
	}
	public static remove(arr: any[], el: any): void {
		const start = Arr.indexOfElement(arr, el);
		Arr.removeAt(arr, start);
	}
	public static indexOf(src: any[], fn: (el: any) => boolean): number {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (fn(src[i])) {
				return i;
			}
		}
		return -1;
	}
	public static removeOneByFn(arr: any[], fn: (el: any) => boolean): void {
		const start = Arr.indexOf(arr, fn);
		Arr.removeAt(arr, start);
	}
	public static shallowCopy<T>(src: T[]): T[] {
		let i = -1;
		const len = src.length;
		const result = new Array(len);
		while (++i < len) {
			result[i] = src[i];
		}
		return result;
	}
	public static shallowCopyInto<T>(src: T[], target: T[]): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = src[i];
		}
	}
	public static shallowFill<T>(src: T[], target: T[], at: number = 0): void {
		let i = -1;
		const len = src.length;
		if (target.length < len + at) {
			target.length = len + at;
		}
		while (++i < len) {
			target[at + i] = src[i];
		}
	}
	public static deepCopy<T>(src: T[]): T[] {
		let i = -1;
		const len = src.length;
		const result = new Array(len);
		while (++i < len) {
			result[i] = (Obj.clone(src[i]));
		}
		return result;
	}
	public static deepCopyInto<T>(src: T[], target: T[]): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = (Obj.clone(src[i]));
		}
	}
	public static deepFill<T>(src: T[], target: T[], at: number = 0): void {
		let i = -1;
		const len = src.length;
		if (target.length < len + at) {
			target.length = len + at;
		}
		while (++i < len) {
			target[at + i] = (Obj.clone(src[i]));
		}
	}
	public static filter<T>(src: T[], fn: (el: T, i?: number) => boolean): T[] {
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
	public static filterInto<T>(src: T[], target: T[], fn: (el: T, i?: number) => boolean): void {
		let i = -1;
		let j = 0;
		const len = src.length;
		const space = target.length;
		while (++i < len) {
			const el = src[i];
			if (fn(el, i) === true) {
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
	public static map<S, T>(src: S[], fn: (el: S, i?: number) => T): T[] {
		let i = -1;
		const len = src.length;
		const result = new Array<T>(len);
		while (++i < len) {
			result[i] = fn(src[i], i);
		}
		return result;
	}
	public static mapInto<S, T>(src: S[], target: T[], fn: (el: S, i?: number) => T): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = fn(src[i], i);
		}
	}
	public static reduce<T>(src: T[], fn: (acc: any | number, cur: T) => any | number, start: any | number = 0): any | number {
		let i = -1;
		const len = src.length;
		let acc: any | number = start;
		while (++i < len) {
			acc = fn(acc, src[i]);
		}
		return acc;
	}
	public static forEach<T>(src: T[], fn: (el: T, i?: number) => any): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			fn(src[i], i);
		}
	}
	public static until<T>(src: T[], test: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (test(src[i], i)) {
				return;
			}
			fn(src[i], i);
		}
	}
	public static reverseForEach<T>(src: T[], fn: (el: T, i?: number) => any): void {
		let i = src.length;
		while (--i >= 0) {
			fn(src[i], i);
		}
	}
	public static reverseUntil<T>(src: T[], test: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void {
		let i = src.length;
		while (--i >= 0) {
			if (test(src[i], i)) {
				return;
			}
			fn(src[i], i);
		}
	}
	public static some<T>(src: T[], filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			const el = src[i];
			if (filter(el, i)) {
				fn(el, i);
			}
		}
	}
	public static insertAt<T>(src: T[], pos: number, v: T): void {
		if (pos > 0) {
			let i = src.length;
			while (--i >= pos) {
				src[i + 1] = src[i];
			}
			src[i + 1] = v;
		}
	}
	public static binarySearch<T>(src: T[], cmp: (el: T) => number): number {
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
		return -1;
	}
}
