import { deepCopy, flatten } from "./Arr";
import { isArray, isFunction } from "./Test";

export function destroy(obj: any): void {
	if (obj.Destroy !== undefined) {
		obj.Destroy();
	} else {
		setNull(obj);
	}
}
export function wipe(obj: any): void {
	const keys = Object.keys(obj);
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		delete obj[keys[i]];
	}
}
export function setNull(obj: any): void {
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
export function isNullOrUndefined(...args: any[]): boolean {
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
export function isNotNullOrUndefined(...args: any[]): boolean {
	return !isNullOrUndefined(...args);
}
export function isUndefined(...args: any[]): boolean {
	const len = args.length;
	let i = -1;
	let a: any;
	let result = false;
	while (!result && ++i < len) {
		a = args[i];
		result = a === undefined;
	}
	return result;
}
export function isNotUndefined(...args: any[]): boolean {
	return !isUndefined(...args);
}
export function isClassOf(a: any, b: any): boolean {
	return isNotNullOrUndefined(a, b) && a instanceof b.constructor;
}
export function isSameClass(a: any, b: any): boolean {
	return isNotNullOrUndefined(a, b) && a.constructor === b.constructor;
}
export function inherits(a: any, b: any): boolean {
	return isClassOf(a, b) && !isSameClass(a, b);
}
export function equals(a: any, b: any): boolean {
	let result = a === b;
	if (a !== b && (a instanceof Object) && isSameClass(a, b)) {
		if (isArray(a)) {
			// Compare arrays
			const len = a.length;
			let i = 0;
			result = len === b.length;
			if (result) {
				for (; i < len; i += 1) {
					result = equals(a[i], b[i]);
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
				result = equals(a[key], b[key]);
				if (!result) {
					if (isFunction(a[key])) {
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
export function isDifferent(a: any, b: any): boolean {
	return !equals(a, b);
}
export function shallowCopy(obj: any): any {
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
export function clone<T>(obj: T): T {
	let result: any;
	if (!(obj instanceof Object)) {
		result = obj;
	} else if (obj.constructor.prototype.clone !== undefined) {
		//Cloneable
		result = ((obj as any) as ICloneable<T>).clone();
	} else if (isArray(obj)) {
		//Array
		result = deepCopy(obj as any);
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
			result[key] = clone((obj as any)[key]);
		}
	}
	return result;
}
export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[] {
	if (isArray(target)) {
		//Array
		const arrS = src as S[];
		const arrT = target as S[];
		const len = arrS.length;
		arrT.length = len;
		let i = -1;
		while (++i < len) {
			if (arrS[i] instanceof Object) {
				cloneInto(arrS[i], arrT[i]);
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
					if (isArray(a)) {
						b = (target as any)[key] = [];
					} else {
						b = (target as any)[key] = {};
					}
				}
				if (isDifferent(a, b)) {
					cloneInto(a, b);
				}
			} else {
				(target as any)[key] = a;
			}
		}
	}
	return target;
}
export function mixin(target: any = {}, exclude: any, ...sources: any[]): any {
	const
		result = target,
		len = sources ? sources.length : 0;
	let i = 0;
	sources = flatten(sources);
	for (; i < len; i++) {
		let src = sources[i];
		if (isFunction(src)) {
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
export function setProperties(target: any, values: any, mapping?: any): void {
	const keys = Object.keys(values);
	let key: string;
	let value: any;
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		key = keys[i];
		value = values[key];
		if (mapping && key in mapping) {
			key = mapping[key];
		}
		if (key in target) {
			target[key] = values[key];
		}
	}
}
