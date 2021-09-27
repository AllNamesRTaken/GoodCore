type IValue = number | string | boolean | null | undefined;
type IValueOf<T extends IDiffable> = T[keyof T] extends IDiffable ? T[keyof T] : never;
type IDiffable = Indexable<IDiffable> | IDiffable[] | IValue;
type IDeltaObj<T extends IDiffable, S extends IDiffable> = 
	T extends Indexable<IDiffable> ?
	S extends Indexable<IDiffable> ? 
		{[P in keyof (S | T)]: IDelta<T[P], S[P]>} : 
	never :
	never;
type IDelta<T extends IDiffable, S extends IDiffable> = 
	T extends Array<infer U> ? 
	S extends Array<infer V> ?
		[U[], null | [], V[]] : 
		[T, null, S] :
	T extends Object ? 
	S extends Object ? 
		[Partial<T>, IDeltaObj<T, S>, Partial<S>] : 
		[T, null, S] :
	[T, null, S];

export function destroy(obj: Object): void;
export function wipe(obj: Object): void;
export function setNull(obj: Object): void;
export function isClassOf(a: Object, b: Object): boolean;
export function isSameClass(a: Object, b: Object): boolean;
export function inherits(a: Object, b: Object): boolean;
export function equals(a: any, b: any): boolean;
export function isDifferent(a: any, b: any): boolean;
export function shallowCopy<T, K extends keyof T>(obj: T): {[P in K]: T[P]};
export function clone<T>(obj: T): T;
export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
export function mixin(target: Indexable<any>, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): Indexable<any>;
export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting?: boolean): void;
export function forEach<T>(
    target: Indexable<T> | T[],
    fn: (value: T, key: string) => boolean | void
): void;
export function transform<T extends {[index: string]: any}, S = {}, U = any>(target: T | Array<U>, fn: (result: S, value: any, key: string) => boolean | void, accumulator?: S): S;
export function difference<T extends {[index: string]: any}, S extends {[index: string]: any} = T>(target: T, base: S): T;
export function diff<T extends IDiffable, S extends IDiffable>(target: T, base: S): IDelta<T, S>;
