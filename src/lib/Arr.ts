import { Obj } from "./Obj";
import { Util } from "./Util";

export class _Array {
	private _int: number;
	public _(): _Array {
		return new _Array();
	}

	public constructor() {

	}

	public Flatten(src: any[]): any[] {
		return this.FlattenInner(src);
	}
	private FlattenInner(src: any[], result: any[] = []): any[] {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (Util.IsArray(src[i])) {
				this.FlattenInner(src[i], result);
			} else {
				result.push(src[i]);
			}
		}
		return result;
	}
	public Reverse(array: any[]) {
		let left = null;
		let right = null;
		const length = array.length;
		for (left = 0; left < length / 2; left += 1) {
			right = length - 1 - left;
			const temporary = array[left];
			array[left] = array[right];
			array[right] = temporary;
		}
	}
	public Concat(...arrs: any[]): any[] {
		const result = Array.prototype.concat.apply([], arrs);
		return result;
	}
	public Slice<T>(src: T[], from: number = 0, count: number = Infinity): T[] {
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
	public Append<T>(arr: T[], values: T[]): void {
		let index = -1;
		const 
			length = values.length,
			offset = arr.length;
		arr.length = length + offset;

		while (++index < length) {
			arr[offset + index] = values[index];
		}
	}
	public RemoveOneAt(arr: any[], index: number): void {
		if (index !== -1 && index < arr.length) {
			const len = arr.length;
			let i = index;
			while (++i < len) {
				arr[i - 1] = arr[i];
			}
			arr.length -= 1;
		}
	}
	public IndexOfElement(src: any[], el: any): number {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (src[i] === el) {
				return i;
			}
		}
		return -1;
	}
	public RemoveOneByElement(arr: any[], el: any): void {
		const start = this.IndexOfElement(arr, el);
		this.RemoveOneAt(arr, start);
	}
	public IndexOf(src: any[], fn: (el: any) => boolean): number {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			if (fn(src[i])) {
				return i;
			}
		}
		return -1;
	}
	public RemoveOneByFn(arr: any[], fn: (el: any) => boolean): void {
		const start = this.IndexOf(arr, fn);
		this.RemoveOneAt(arr, start);
	}
	public ShallowCopy<T>(src: T[]): T[] {
		let i = -1;
		const len = src.length;
		const result = new Array(len);
		while (++i < len) {
			result[i] = src[i];
		}
		return result;
	}
	public ShallowCopyInto<T>(src: T[], target: T[]): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = src[i];
		}
	}
	public ShallowFill<T>(src: T[], target: T[], at: number = 0): void {
		let i = -1;
		const len = src.length;
		if (target.length < len + at) {
			target.length = len + at;
		}
		while (++i < len) {
			target[at + i] = src[i];
		}
	}
	public DeepCopy<T>(src: T[]): T[] {
		let i = -1;
		const len = src.length;
		const result = new Array(len);
		while (++i < len) {
			result[i] = (Obj.Clone(src[i]));
		}
		return result;
	}
	public DeepCopyInto<T>(src: T[], target: T[]): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = (Obj.Clone(src[i]));
		}
	}
	public DeepFill<T>(src: T[], target: T[], at: number = 0): void {
		let i = -1;
		const len = src.length;
		if (target.length < len + at) {
			target.length = len + at;
		}
		while (++i < len) {
			target[at + i] = (Obj.Clone(src[i]));
		}
	}
	public Filter<T>(src: T[], fn: (el: T, i?: number) => boolean): T[] {
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
	public FilterInto<T>(src: T[], target: T[], fn: (el: T, i?: number) => boolean): void {
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
	public Map<T>(src: T[], fn: (el: T, i?: number) => any): any[] {
		let i = -1;
		const len = src.length;
		const result = new Array(len);
		while (++i < len) {
			result[i] = fn(src[i], i);
		}
		return result;
	}
	public MapInto<T>(src: any[], target: T[], fn: (el: T, i?: number) => T): void {
		let i = -1;
		const len = src.length;
		target.length = len;
		while (++i < len) {
			target[i] = fn(src[i], i);
		}
	}
	public Reduce<T>(src: T[], fn: (acc: any | number, cur: T) => any | number, start: any | number = 0): any | number {
		let i = -1;
		const len = src.length;
		let acc: any | number = start;
		while (++i < len) {
			acc = fn(acc, src[i]);
		}
		return acc;
	}
	public ForEach<T>(src: T[], fn: (el: T, i?: number) => any): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			fn(src[i], i);
		}
	}
	public Until<T>(src: T[], fn: (el: T, i?: number) => boolean): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			const brk = fn(src[i], i);
			if (brk) {
				return;
			}
		}
	}
	public Some<T>(src: T[], filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void {
		let i = -1;
		const len = src.length;
		while (++i < len) {
			const el = src[i];
			if (filter(el, i)) {
				fn(el, i);
			}
		}
	}
	public InsertAt<T>(src: T[], pos: number, v: T): void {
		if (pos > 0) {
			let i = src.length;
			while (--i >= pos) {
				src[i + 1] = src[i];
			}
			src[i + 1] = v;
		}
	}
}

export let Arr = new _Array();
