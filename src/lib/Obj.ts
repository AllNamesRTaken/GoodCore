import { areNotNullOrUndefined, isArray, isFunction, isObject, isNullOrUndefined, isNull } from "./Test";

interface IDestroyable {
	destroy(): void;
}
interface IClearable {
	clear(): void;
}
interface IEquatable {
	equals(b: any): boolean;
}
export function destroy(obj: Object): void {
	if (obj.constructor && isFunction((obj.constructor.prototype as any).destroy)) {
		(obj as IDestroyable).destroy();
	} else {
		setNull(obj);
	}
}
export function wipe(obj: Object): void {
	const keys = Object.keys(obj as Indexable<any>);
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		delete (obj as Indexable<any>)[keys[i]];
	}
}
export function setNull(obj: Object): void {
	if (obj.constructor && isFunction((obj.constructor.prototype as any).clear)) {
		(obj as IClearable).clear();
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

export function isClassOf(a: Object, b: Object): boolean {
	return areNotNullOrUndefined(a, b) && a instanceof b.constructor;
}
export function isSameClass(a: Object, b: Object): boolean {
	return areNotNullOrUndefined(a, b) && a.constructor === b.constructor;
}
export function inherits(a: Object, b: Object): boolean {
	return isClassOf(a, b) && !isSameClass(a, b);
}
export function equals(a: any, b: any): boolean {
	let result = a === b;
	if (a !== b && (a instanceof Object) && isSameClass(a as Object, b as Object)) {
		if (isArray(a)) {
			// Compare arrays
			const len = (a as any[]).length;
			let i = 0;
			result = len === (b as any[]).length;
			if (result) {
				for (; i < len; i += 1) {
					result = equals((a as any[])[i], (b as any[])[i]);
					if (result === false) {
						break;
					}
				}
			}
		} else if ((a as Object).constructor && isFunction(((a as Object).constructor.prototype as any).equals)) {
			// Compare Coparables
			result = (a as IEquatable).equals(b);
		} else {
			// Compare Objects
			const aKeys = Object.keys(a as Object);
			const bKeys = Object.keys(b as Object);
			let sameLength = aKeys.length === bKeys.length;
			let key = null;
			result = sameLength;
			let i = -1;
			const len = aKeys.length;
			while (++i < len && result) {
				key = aKeys[i];
				result = equals((a as Indexable<any>)[key], (b as Indexable<any>)[key]);
				if (!result) {
					if (isFunction((a as Indexable<any>)[key]) && isFunction((b as Indexable<any>)[key])) {
						result = true;
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
export function shallowCopy<T, K extends keyof T>(obj: T): {[P in K]: T[P]} {
	const keys = Object.keys(obj);
	const result: Indexable<any> = {};
	let i = -1;
	const len = keys.length;
	while (++i < len) {
		const key = keys[i];
		result[key] = (obj as Indexable<any>)[key];
	}
	return result as {[P in K]: T[P]};
}
export function clone<T>(obj: T): T {
	let result: T;
	let isNullObject = !isNullOrUndefined(obj) && !(obj instanceof Object) && !(obj as unknown as Object).constructor;
	if (!(obj instanceof Object) && !isNullObject) {
		result = obj;
	} else if ((obj instanceof Object) && isFunction(((obj as unknown as Object).constructor.prototype as any).clone)) {
		//Cloneable
		result = (obj as unknown as ICloneable<T>).clone();
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
		if (isNullObject) {
			result = Object.create(null) as T;
		} else {
			result = new ((obj as unknown as Object).constructor as Constructor<T>)();
		}
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
export function mixin(target: Indexable<any> = {}, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): Indexable<any> {
	const
		result = target,
		len = sources ? sources.length : 0;
	let i = 0;
	for (; i < len; i++) {
		let src = sources[i];
		if (isFunction(src)) {
			src = src.prototype as Indexable<any>;
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
// tslint:disable-next-line: max-line-length
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
	fn: (value: T, key: string) => boolean | void
): void {
	if (isArray(target)) {
		let i = - 1;
		const len = (target as T[]).length;
		while (++i < len && false !== fn((target as T[])[i], i.toString())) {
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
	fn: (result: S, value: any, key: string) => boolean | void, 
	accumulator?: S
): S  {
	if (accumulator === undefined) {
		accumulator = Object.create(target) as S;
	}
	forEach(target, (value: any, key: string) => {
		return fn(accumulator!, value, key);
	});
	return accumulator!;
}
export function difference<T extends {[index: string]: any}, S extends {[index: string]: any} = T>(target: T, base: S): S {
	function changes<T extends {[index: string]: any}, S extends {[index: string]: any} = T>(target: T, base: S): S {
		return transform(target, function(result, value: any, key: string) {
			if (isDifferent(value, base[key])) {
				(result as Indexable<any>)[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(target, base);
}
