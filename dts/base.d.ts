type Constructor<T> = new (...args: any[]) => T;
interface ICtor<T> { new (...args: any[]): T; }

interface IObject {
	[key: string]: any;
}
interface IInstance<T> extends IObject {
	constructor?: ICtor<T>;
}
interface IPool<T extends IPoolable> {
	get(): T;
	release(obj: T): void;
}
interface IPoolable {
	__pool__: IPool<IPoolable>;
	release(): void;
	initPool(pool: IPool<IPoolable>): void;
}
interface ICloneable<T> {
	clone(): T;
}
interface IInitable<T> {
	init(obj: Partial<T> | any, mapping?: any): this;
}
interface ISerializable<T> {
	toJSON(): any;
	serialize(): T;
}
interface IDeserializable<T> {
	deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
interface IBasicList<T> {
	values: T[];
	get(pos: number): T | undefined;
	count: number;
	clear(): IBasicList<T>;
	add(v: T): IBasicList<T>;
	pop(): T | undefined;
	shift(): T | undefined;
	copy(src: IBasicList<T> | T[]): IBasicList<T>;
	fill(size: number, populator: ((i: number) => T) | T): IBasicList<T>;
	clone(): IBasicList<T>;
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
	map<S>(fn: (el: T, i?: number) => S): IBasicList<S>;
	mapInto(src: IBasicList<any> | any[], fn: (el: any, i?: number) => any): IBasicList<T>;
	reduce(fn: (acc: any, cur: T) => any, start: any): any;
	reverseReduce(fn: (acc: any, cur: T) => any, start: any): any;
	equals(b: IBasicList<T>): boolean;
	same(b: IBasicList<T>): boolean;
	intersect(b: IBasicList<T>): IBasicList<T>;
	union(b: IBasicList<T>): IBasicList<T>;
}
interface IList<T> extends IBasicList<T> {
	getByIndex(key: number | string): T | undefined;
	set(pos: number, value: T): IList<T>;
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
interface ITreeNode<T> {
	id: string;
	parent: ITreeNode<T> | null;
	children: IList<ITreeNode<T>> | null;
	data: T | null;
}
interface IVec2 {
	x: number;
	y: number;
}
interface IRange2 {
	pos: IVec2;
	size: IVec2;
}
interface IRect {
	start: IVec2;
	stop: IVec2;
	endInclusive?: boolean;
}
