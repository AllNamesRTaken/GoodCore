import { Arr } from "./Arr";
import { Test } from "./Test";

export class _Obj {
	public constructor() {

	}
	public Destroy(obj: any): void {
		if (obj.Destroy !== undefined) {
			obj.Destroy();
		} else {
			this.Null(obj);
		}
	}
	public Wipe(obj: any): void {
		const keys = Object.keys(obj);
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			delete obj[keys[i]];
		}
	}
	public Null(obj: any): void {
		if (obj.constructor.prototype.Clear !== undefined) {
			obj.Clear();
		} else {
			const keys = Object.keys(obj);
			let key = null;
			let i = -1;
			const len = keys.length;
			while (++i < len) {
				key = keys[i];
				obj[key] = null;
			}
		}
	}
	public IsNullOrUndefined(...args: any[]): boolean {
		const len = args.length;
		let i = -1;
		let a: any;
		let result = false;
		while (!result && ++i < len) {
			a = args[i];
			result = a === undefined || a === null;
		}
		return result;
	}
	public IsNotNullOrUndefined(...args: any[]): boolean {
		return !this.IsNullOrUndefined(...args);
	}
	public IsClassOf(a: any, b: any): boolean {
		return this.IsNotNullOrUndefined(a, b) && a instanceof b.constructor;
	}
	public IsSameClass(a: any, b: any): boolean {
		return this.IsNotNullOrUndefined(a, b) && a.constructor === b.constructor;
	}
	public Inherits(a: any, b: any): boolean {
		return this.IsClassOf(a, b) && !this.IsSameClass(a, b);
	}
	public Equals(a: any, b: any): boolean {
		let result = a === b;
		if (a !== b && (a instanceof Object) && this.IsSameClass(a, b)) {
			if (Test.IsArray(a)) {
				// Compare arrays
				const len = a.length;
				let i = 0;
				result = len === b.length;
				if (result) {
					for (; i < len; i += 1) {
						result = this.Equals(a[i], b[i]);
						if (result === false) {
							break;
						}
					}
				}
			} else if (a.constructor.prototype.Equals) {
				// Compare Coparables
				result = a.Equals(b);
			} else {
				// Compare Objects
				const keys = Object.keys(a);
				let key = null;
				result = true;
				let i = -1;
				const len = keys.length;
				while (++i < len) {
					key = keys[i];
					result = this.Equals(a[key], b[key]);
					if (!result) {
						if (Test.IsFunction(a[key])) {
							result = true;
						} else {
							break;
						}
					}
				}
			}
		}
		return result;
	}
	public IsDifferent(a: any, b: any): boolean {
		return !this.Equals(a, b);
	}
	public ShallowCopy(obj: any): any {
		const keys = Object.keys(obj);
		const result: any = {};
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			const key = keys[i];
			result[key] = obj[key];
		}
		return result;
	}
	public Clone<T>(obj: T): T {
		let result: any;
		if (!(obj instanceof Object)) {
			result = obj;
		} else if (obj.constructor.prototype.Clone !== undefined) {
			//Cloneable
			result = ((obj as any) as ICloneable<T>).Clone();
		} else if (Test.IsArray(obj)) {
			//Array
			result = Arr.DeepCopy(obj as any);
		} else if (obj instanceof Date) {
			return new Date(obj.getTime()) as any;
		} else if (obj instanceof RegExp) {
			return new RegExp(obj) as any;
		} else {
			//Object
			result = new (obj as any).constructor();
			const keys = Object.keys(obj);
			let key = null;
			let i = -1;
			const len = keys.length;
			while (++i < len) {
				key = keys[i];
				result[key] = this.Clone((obj as any)[key]);
			}
		}
		return result;
	}
	public CloneInto<T, S>(src: T | S[], target: T | S[]): T | S[] {
		if (Test.IsArray(target)) {
			//Array
			const arrS = src as S[];
			const arrT = target as S[];
			const len = arrS.length;
			arrT.length = len;
			let i = -1;
			while (++i < len) {
				if (arrS[i] instanceof Object) {
					this.CloneInto(arrS[i], arrT[i]);
				} else {
					arrT[i] = arrS[i];
				}
			}
		} else {
			//Object
			const keys = Object.keys(src);
			let key = null;
			let i = -1;
			const len = keys.length;
			while (++i < len) {
				key = keys[i];
				const a = (src as any)[key];
				if (a instanceof Object) {
					let b = (target as any)[key];
					if (b === undefined || b === null) {
						if (Test.IsArray(a)) {
							b = (target as any)[key] = [];
						} else {
							b = (target as any)[key] = {};
						}
					}
					if (this.IsDifferent(a, b)) {
						this.CloneInto(a, b);
					}
				} else {
					(target as any)[key] = a;
				}
			}
		}
		return target;
	}
	public Mixin(target: any = {}, exclude: any, ...sources: any[]): any {
		const 
			result = target,
			len = sources ? sources.length : 0;
		let i = 0;
		sources = Arr.Flatten(sources);
		for (; i < len; i++) {
			let src = sources[i];
			if (Test.IsFunction(src)) {
				src = src.prototype;
			}
			if (src === undefined) {
				continue;
			}
			const keys = Object.keys(src);
			let key = null;
			if (exclude) {
				let i = -1;
				const len = keys.length;
				while (++i < len) {
					key = keys[i];
					if (exclude.hasOwnProperty(key)) {
						continue;
					}
					target[key] = src[key];
				}
			} else {
				let i = -1;
				const len = keys.length;
				while (++i < len) {
					key = keys[i];
					target[key] = src[key];
				}
			}
		}
		return result;
	}
	public SetProperties(target: any, values: any): void {
		const keys = Object.keys(values);
		let key: string;
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			key = keys[i];
			if (target.hasOwnProperty(key)) {
				target[key] = values[key];
			}
		}
	}
}

export let Obj = new _Obj();
