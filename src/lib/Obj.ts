import { areNotNullOrUndefined, isArray, isFunction, isObject } from "./Test";

export function destroy(obj: any): void {
	if (obj.constructor.prototype.destroy !== undefined) {
		obj.destroy();
	} else {
		setNull(obj);
	}
}
export function wipe(obj: any): void {
	const keys = Object.keys(obj as Indexable<any>);
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		delete (obj as Indexable<any>)[keys[i]];
	}
}
export function setNull(obj: any): void {
	if (obj.constructor.prototype.clear !== undefined) {
		obj.clear();
	} else {
		const keys = Object.keys(obj as Indexable<any>);
		let key = null;
		let i = -1;
		const len = keys.length;
		while (++i < len) {
			key = keys[i];
			(obj as Indexable<any>)[key] = null;
		}
	}
}

export function isClassOf(a: any, b: any): boolean {
	return areNotNullOrUndefined(a, b) && a instanceof b.constructor;
}
export function isSameClass(a: any, b: any): boolean {
	return areNotNullOrUndefined(a, b) && a.constructor === b.constructor;
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
		} else if (a.constructor.prototype.equals) {
			// Compare Coparables
			result = a.equals(b);
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
	const keys = Object.keys(obj as any);
	const result: Indexable<any> = {};
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		const key = keys[i];
		result[key] = obj[key];
	}
	return result as any;
}
export function clone<T>(obj: T): T {
	let result: T;
	if (!(obj instanceof Object)) {
		result = obj;
	} else if ((obj as Object).constructor.prototype.clone !== undefined) {
		//Cloneable
		result = ((obj as any) as ICloneable<T>).clone();
	} else if (isArray(obj)) {
		//Array
		let i = -1;
		const len: number = (obj as any).length as number;
		result = new Array(len) as any;
		while (++i < len) {
			(result as Indexable<any>)[i] = (clone((obj as any)[i]));
		}
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
			(result as Indexable<any>)[key] = clone((obj as any)[key]);
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
export function mixin(target: Indexable<any> = {}, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): any {
	const
		result = target,
		len = sources ? sources.length : 0;
	let i = 0;
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
export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting: boolean = false): void {
	const keys = Object.keys(values);
	let key: string;
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		key = keys[i];
		if (mapping && key in mapping) {
			key = mapping[key];
		}
		if (!limitToExisting || key in target) {
			target[key] = values[keys[i]];
		}
	}
}
export function forEach<T>(
	target: Indexable<T> | T[],
	fn: (value: T, key: string | number) => boolean | void
): void
{
	if (isArray(target)) {
		let i = - 1;
		const len = (target as T[]).length;
		while (++i < len && false !== fn((target as T[])[i], i)) {
		}
	} else {
		const keys = Object.keys(target);
		let key: string;
		let i = -1;
		const len = keys.length;
		let run = true;
		while (run && ++i < len) {
			key = keys[i];
			run = false !== fn((target as Indexable<T>)[key], key);
		}
	}
}
export function transform<T extends {[index: string]: any}, S = T, U = any>(
	target: T | U[], 
	fn: (result: S, value: any, key: string | number) => boolean | void, 
	accumulator?: S
): S  {
	if (accumulator === undefined) {
		accumulator = Object.create(target);
	}
	forEach(target, (value: any, key: string | number) => {
		return fn(accumulator!, value, key);
	});
	return accumulator!;
}
export function difference<T extends Indexable<any>, S extends Indexable<any> = T>(target: T, base: S): S {
	function changes<T extends Indexable<any>, S extends Indexable<any> = T>(target: T, base: S): S {
		return transform(target, function(result, value: any, key: string) {
			if (isDifferent(value, base[key])) {
				(result as Indexable<any>)[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(target, base);
}
