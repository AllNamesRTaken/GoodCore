export type Constructor<T> = new (...args: any[]) => T;
export type ICtor<T> = { new(...args: any[]): T; };
export type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type PickKeysOfType<T, KT> = ({ [P in keyof T]: T[P] extends KT ? P : never })[keyof T];
export type PickType<T, KT> = Pick<T, PickKeysOfType<T, KT>>;
export type PickFunctions<T> = PickType<T, Function>;
export type ExcludeType<T, KT> = Omit<T, PickKeysOfType<T, KT>>;
export type ExcludeFunctions<T> = ExcludeType<T, Function>;

export interface Indexable<T> {
	[key: string]: T;
}
export interface IObject extends Indexable<any> {}
export interface IInstance<T> extends IObject {
	constructor?: ICtor<T>;
}
export type ArgTypes<T> = T extends (...a:infer A) => unknown ? A : [];
export type ResultType<T> = T extends (...a: unknown[]) => infer S ? S : never;
export interface IPool<T extends IPoolable> {
	get(): T;
	release(obj: T): void;
}
export interface IPoolable {
	__pool__: IPool<IPoolable>;
	release(): void;
	initPool(pool: IPool<IPoolable>): void;
}
export interface ICloneable {
	clone(): this;
}
export interface IInitable {
	init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this;
}
export type TInitable<T> = T & IInitable;
export interface ISerializable<T> {
	toJSON(): any;
	serialize(): T;
}
export interface IDeserializable<T> {
	deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
export interface IBasicList<T> {
	[Symbol.iterator](): IterableIterator<T>;
	next(value?: any): IteratorResult<T>;
	values: T[];
	read(pos: number): T | undefined;
	count: number;
	clear(): IBasicList<T>;
	add(v: T): IBasicList<T> | undefined;
	pop(): T | undefined;
	shift(): T | undefined;
	copy(src: IBasicList<T> | T[]): IBasicList<T>;
	clone(): this;
	truncate(size?: number): IBasicList<T>;
	fill(size: number, populator: ((i: number) => T) | T): IBasicList<T>;
	remove(v: T): IBasicList<T>;
	removeFirst(fn: (el: T) => boolean): T | undefined;
	removeAt(n: number): T | undefined;
	forEach(fn: (el: T, i?: number) => any, startIndex?: number): IBasicList<T>;
	forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IBasicList<T>;
	until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): IBasicList<T>;
	until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number, startIndex?: number) => void): IBasicList<T>;
	reverseForEach(fn: (el: T, i: number) => any): IBasicList<T>;
	reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): IBasicList<T>;
	first(fn?: (el: T) => boolean): T | undefined;
	find(fn: (el: T) => boolean): T | undefined;
	last(): T | undefined;
	indexOf(v: T | ((el: T) => boolean)): number;
	contains(v: T | ((el: T) => boolean)): boolean;
	some(fn: (el: T) => boolean): boolean;
	all(fn: (el: T) => boolean): boolean;
	select(fn: (el: T) => boolean): IBasicList<T>;
	selectInto(src: IBasicList<T> | T[], fn: (el: T) => boolean): IBasicList<T>;
	head(count?: number): IBasicList<T>;
	tail(count?: number): IBasicList<T>;
	map<S>(fn: (el: T, i?: number) => S): IBasicList<S>;
	mapInto(src: IBasicList<any> | any[], fn: (el: any, i?: number) => any): IBasicList<T>;
	reduce(fn: (acc: any, cur: T) => any, start: any): any;
	reverseReduce(fn: (acc: any, cur: T) => any, start: any): any;
	equals(b: IBasicList<T>): boolean;
	same(b: IBasicList<T>): boolean;
	intersect(b: IBasicList<T>): IBasicList<T>;
	union(b: IBasicList<T>): IBasicList<T>;
	toJSON(): any;
	serialize(): T[];
}
export interface IList<T> extends IBasicList<T> {
	getByIndex(key: number | string): T | undefined;
	write(pos: number, value: T): IList<T>;
	push(v: T): number;
	splice(pos?: number, remove?: number, insert?: T[] | IList<T>): IList<T>;
	concat(v: T[] | IList<T>): IList<T>;
	append(v: T[] | IList<T>): void;
	shallowCopy(src: IList<T> | T[]): IList<T>;
	reverse(): IList<T>;
	orderBy(fn: (a: T, b: T) => number): IList<T>;
	subtract(b: IList<T>): IList<T>;
	zip<U, V>(list: IList<U>, fn: (t: T, u: U) => V): IList<V>;
	unzip<U, V>(fn: (el: T) => [U, V]): [IList<U>, IList<V>];
	flatten<U>(maxDepth?: number): IList<U>;
}
export interface ITreeNode<T> {
	id: string;
	parent: ITreeNode<T> | null;
	children: Array<ITreeNode<T>> | null;
	data: T | null;
}
export type TreeEvent = "change";
export type { IVec2 } from "./IVec2.js"
export type { IRange2 } from "./IRange2.js"
export type { IRect } from "./IRect.js"
export interface IDebounceOptions {
	leading: boolean;
}
export type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ? 
	PromiseLike<S> : 
	T extends (...a: unknown[]) => infer R ? 
		U extends { leading: true } ?
			R : 
			PromiseLike<R>
		: never;
export interface IDebouncedFunction<T, U> {
	(...args: ArgTypes<T>): DebounceResultType<T, U>;
	resetTimer?(): void;
}
export interface IThrottleOptions {
	leading: boolean;
	trailing: boolean;
}
export interface IThrottledFunction<T> {
	(...args: ArgTypes<T>): ResultType<T>;
}
export type IValue = number | string | boolean | null | undefined;
export type IValueOf<T extends IDiffable> = T[keyof T] extends IDiffable ? T[keyof T] : IValue;
export type IDiffable = Indexable<IDiffable> | IDiffable[] | IValue;
export type IDeltaObj<T extends IDiffable, S extends IDiffable> = 
	T extends Indexable<IDiffable> ?
	S extends Indexable<IDiffable> ? 
		{[P in keyof (S | T)]: IDelta<T[P], S[P]>} : 
	never :
	never;
export type IDelta<T extends IDiffable, S extends IDiffable> = 
	T extends Array<infer U> ? 
	S extends Array<infer V> ?
		[U[], null | [], V[]] : 
		[T, null, S] :
	T extends Object ? 
	S extends Object ? 
		[Partial<T>, IDeltaObj<T, S>, Partial<S>] : 
		[T, null, S] :
	[T, null, S];

	export interface IDebounceOptions {
		leading: boolean;
	}
	export type InnerDebounceResultType<T> = T extends (...a: unknown[]) => PromiseLike<infer S> ? S : T extends (...a: unknown[]) => infer S ? S : never;
	export interface IDebouncedFunction<T, U> {
		(...args: ArgTypes<T>): DebounceResultType<T, U>;
		resetTimer?(): void;
	}

	export interface IThrottleOptions {
		leading: boolean;
		trailing: boolean;
	}
	export interface IThrottledFunction<T> {
		(...args: ArgTypes<T>): ResultType<T>;
	}