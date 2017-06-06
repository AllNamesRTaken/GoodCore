import { Arr } from "./Arr";
import { Test } from "./Test";

export class _Obj {
	public constructor() {

	}
	public destroy(obj: any): void {
		if (obj.Destroy !== undefined) {
			obj.Destroy();
		} else {
			this.null(obj);
		}
	}
	public wipe(obj: any): void {
		const keys = Object.keys(obj);
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			delete obj[keys[i]];
		}
	}
	public null(obj: any): void {
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
	public isNullOrUndefined(...args: any[]): boolean {
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
	public isNotNullOrUndefined(...args: any[]): boolean {
		return !this.isNullOrUndefined(...args);
	}
	public isClassOf(a: any, b: any): boolean {
		return this.isNotNullOrUndefined(a, b) && a instanceof b.constructor;
	}
	public isSameClass(a: any, b: any): boolean {
		return this.isNotNullOrUndefined(a, b) && a.constructor === b.constructor;
	}
	public inherits(a: any, b: any): boolean {
		return this.isClassOf(a, b) && !this.isSameClass(a, b);
	}
	public equals(a: any, b: any): boolean {
		let result = a === b;
		if (a !== b && (a instanceof Object) && this.isSameClass(a, b)) {
			if (Test.isArray(a)) {
				// Compare arrays
				const len = a.length;
				let i = 0;
				result = len === b.length;
				if (result) {
					for (; i < len; i += 1) {
						result = this.equals(a[i], b[i]);
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
					result = this.equals(a[key], b[key]);
					if (!result) {
						if (Test.isFunction(a[key])) {
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
	public isDifferent(a: any, b: any): boolean {
		return !this.equals(a, b);
	}
	public shallowCopy(obj: any): any {
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
	public clone<T>(obj: T): T {
		let result: any;
		if (!(obj instanceof Object)) {
			result = obj;
		} else if (obj.constructor.prototype.clone !== undefined) {
			//Cloneable
			result = ((obj as any) as ICloneable<T>).clone();
		} else if (Test.isArray(obj)) {
			//Array
			result = Arr.deepCopy(obj as any);
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
				result[key] = this.clone((obj as any)[key]);
			}
		}
		return result;
	}
	public cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[] {
		if (Test.isArray(target)) {
			//Array
			const arrS = src as S[];
			const arrT = target as S[];
			const len = arrS.length;
			arrT.length = len;
			let i = -1;
			while (++i < len) {
				if (arrS[i] instanceof Object) {
					this.cloneInto(arrS[i], arrT[i]);
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
						if (Test.isArray(a)) {
							b = (target as any)[key] = [];
						} else {
							b = (target as any)[key] = {};
						}
					}
					if (this.isDifferent(a, b)) {
						this.cloneInto(a, b);
					}
				} else {
					(target as any)[key] = a;
				}
			}
		}
		return target;
	}
	public mixin(target: any = {}, exclude: any, ...sources: any[]): any {
		const 
			result = target,
			len = sources ? sources.length : 0;
		let i = 0;
		sources = Arr.flatten(sources);
		for (; i < len; i++) {
			let src = sources[i];
			if (Test.isFunction(src)) {
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
	public setProperties(target: any, values: any): void {
		const keys = Object.keys(values);
		let key: string;
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			key = keys[i];
			if (key in target) {
				target[key] = values[key];
			}
		}
	}
}

export let Obj = new _Obj();
