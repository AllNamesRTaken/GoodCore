type Constructor<T> = new (...args: any[]) => T;
interface ICtor<T> { new(...args: any[]): T }

type AnyObject<T> = {
	[key: string]: any;
	constructor: ICtor<T>;
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
	init(obj: Partial<T>): T;
}
interface IBasicList<T> {
	values: Array<T>;
	get(pos: number): T;
	count: number;
	clear(): IBasicList<T>;
	add(v: T): IBasicList<T>;
	pop(): T | undefined;
	shift(): T | undefined;
	copy(src: IBasicList<T> | Array<T>): IBasicList<T>;
	clone(): IBasicList<T>;
	remove(v: T): IBasicList<T>;
	removeFirst(fn: (el: T) => boolean): T;
	removeAt(n: number): T;
	forEach(fn: (el: T, i?: number) => any): IBasicList<T>;
	forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IBasicList<T>
	until(test: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): IBasicList<T>;
	reverseForEach(fn: (el: T, i: number) => any): IBasicList<T>
	reverseUntil(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IBasicList<T>
	first(fn?: (el: T) => boolean): T | undefined;
	find(fn: (el: T) => boolean): T | undefined;
	last(): T | undefined;
	indexOf(v: T | ((el: T) => boolean)): number;
	contains(v: T): boolean;
	some(fn: (el: T) => boolean): boolean
	all(fn: (el: T) => boolean): boolean
	select(fn: (el: T) => boolean): IBasicList<T>;
	selectInto(src: IBasicList<T> | Array<T>, fn: (el: T) => boolean): IBasicList<T>;
	map<S>(fn: (el: T, i?: number) => S): IBasicList<S>;
	mapInto(src: IBasicList<any> | Array<any>, fn: (el: any, i?: number) => any): IBasicList<T>;
	reduce(fn: (acc: any, cur: T) => any, start?: any): any;
	reverseReduce(fn: (acc: any, cur: T) => any, start?: any): any;
	equals(b: IBasicList<T>): boolean;
	same(b: IBasicList<T>): boolean;
	intersect(b: IBasicList<T>): IBasicList<T>;
	union(b: IBasicList<T>): IBasicList<T>;
	// zip<U, V>(list: IBasicList<U>, fn: (t: T, u: U) => V): IBasicList<V>;
	// unzip<U, V>(fn: (el: T) => [U, V]): [IBasicList<U>, IBasicList<V>];
	// flatten<U>(maxDepth?: number): IBasicList<U>
	toJSON(): any;
}
interface IList<T> extends IBasicList<T> {
	values: Array<T>;
	get(pos: number): T;
	count: number;
	clear(): IList<T>;
	add(v: T): IList<T>;
	push(v: T): number;
	pop(): T | undefined;
	shift(): T | undefined;
	concat(v: Array<T> | IList<T>): IList<T>;
	append(v: Array<T> | IList<T>): void;
	copy(src: IList<T> | Array<T>): IList<T>;
	shallowCopy(src: IList<T> | Array<T>): IList<T>;
	clone(): IList<T>;
	remove(v: T): IList<T>;
	removeFirst(fn: (el: T) => boolean): T;
	removeAt(n: number): T;
	forEach(fn: (el: T, i?: number) => any): IList<T>;
	forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IList<T>
	until(test: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): IList<T>;
	reverseForEach(fn: (el: T, i: number) => any): IList<T>
	reverseUntil(test: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IList<T>
	first(fn?: (el: T) => boolean): T | undefined;
	find(fn: (el: T) => boolean): T | undefined;
	last(): T | undefined;
	indexOf(v: T | ((el: T) => boolean)): number;
	contains(v: T): boolean;
	reverse(): IList<T>;
	some(fn: (el: T) => boolean): boolean
	all(fn: (el: T) => boolean): boolean
	select(fn: (el: T) => boolean): IList<T>;
	selectInto(src: IList<T> | Array<T>, fn: (el: T) => boolean): IList<T>;
	orderBy(fn: (a: T, b: T) => number): IList<T>;
	map<S>(fn: (el: T, i?: number) => S): IList<S>;
	mapInto(src: IList<any> | Array<any>, fn: (el: any, i?: number) => any): IList<T>;
	reduce(fn: (acc: any, cur: T) => any, start?: any): any;
	reverseReduce(fn: (acc: any, cur: T) => any, start?: any): any;
	equals(b: IList<T>): boolean;
	same(b: IList<T>): boolean;
	intersect(b: IList<T>): IList<T>;
	union(b: IList<T>): IList<T>;
	zip<U, V>(list: IList<U>, fn: (t: T, u: U) => V): IList<V>;
	unzip<U, V>(fn: (el: T) => [U, V]): [IList<U>, IList<V>];
	flatten<U>(maxDepth?: number): IList<U>
	toJSON(): any;
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
}
// Generated by dts-bundle v0.7.3

declare namespace goodcore {

	export class Vec2Const {
		static EPSILON: number;
		static IDENTITY: IVec2;
		static X_DIM: IVec2;
		static Y_DIM: IVec2;
	}
	export class Vec2 implements IVec2 {
		x: number;
		y: number;
		readonly isZero: boolean;
		constructor(x?: number, y?: number);
		set(src: IVec2): Vec2;
		clone(out?: Vec2): Vec2;
		toInt(): Vec2;
		ceil(): Vec2;
		toDecimal(): Vec2;
		lengthSq(): number;
		length(): number;
		horizontalAngle(): number;
		rotate(angle: number): Vec2;
		rotateAround(center: IVec2, angle: number): Vec2;
		normalize(): Vec2;
		scale(vectorB: IVec2): Vec2;
		relate(vectorB: IVec2): Vec2;
		multiply(scalar: number): Vec2;
		add(vectorB: IVec2): Vec2;
		subtract(vectorB: IVec2): Vec2;
		invert(): this;
		equals(target: IVec2): boolean;
		almostEquals(target: IVec2): boolean;
		getNormal(isNormalized?: boolean): Vec2;
		dot(vectorB: IVec2): number;
		cross(vectorB: IVec2): number;
		projectOnto(vectorB: IVec2): Vec2;
		verticalAngle(): number;
		angle: () => number;
		direction: () => number;
		rotateBy(rotation: number): Vec2;
		max(v: IVec2): Vec2;
		min(v: IVec2): Vec2;
		zero(): Vec2;
	}

	export class Range2 implements IRange2 {
		pos: Vec2;
		size: Vec2;
		readonly isZero: boolean;
		constructor(x?: number, y?: number, w?: number, h?: number);
		set(src: IRange2): Range2;
		clone(out?: Range2): Range2;
		toRect(endInclusive?: boolean, out?: Rect): Rect;
		scale(factor: IVec2, keepCenter?: boolean): Range2;
		translate(system: IVec2): Range2;
		toInt(): Range2;
		toDecimal(): Range2;
		contains(target: Range2): boolean;
		intersect(target: Range2): boolean;
		containsPoint(vec: IVec2): boolean;
		first(fn: (p: Vec2) => boolean): Vec2 | null;
		forEach(fn: (p: Vec2) => boolean, start?: Vec2 | null): void;
		equals(range: IRange2): boolean;
		zero(): Range2;
	}

	export class Rect implements IRect {
		start: Vec2;
		stop: Vec2;
		endInclusive: boolean;
		readonly isZero: boolean;
		constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
		set(src: IRect): Rect;
		clone(out?: Rect): Rect;
		toRange2(out?: Range2): Range2;
		scale(factor: IVec2, keepCenter?: boolean): Rect;
		translate(system: IVec2): Rect;
		equals(rect: IRect): boolean;
		toInt(): Rect;
		toDecimal(): Rect;
		area(): number;
		move(vec: IVec2): Rect;
		contains(target: IRect): boolean;
		intersect(target: IRect): boolean;
		containsPoint(x: number, y: number): boolean;
		zero(): Rect;
	}

	export class List<T> implements IList<T> {
		constructor(arr?: T[] | List<T>);
		readonly values: T[];
		get(pos: number): T;
		readonly count: number;
		readonly length: number;
		indexer: ((el: T) => any) | null;
		clear(): List<T>;
		add(v: T): List<T>;
		insertAt(pos: number, v: T): List<T>;
		push(v: T): number;
		pop(): T | undefined;
		shift(): T | undefined;
		concat(v: T[] | List<T>): List<T>;
		append(v: T[] | List<T>): List<T>;
		copy(src: List<T> | T[]): List<T>;
		shallowCopy(src: List<T> | T[]): List<T>;
		clone(): List<T>;
		remove(v: T): List<T>;
		removeFirst(fn: (el: T) => boolean): T;
		removeAt(n: number): T;
		forEach(fn: (el: T, i: number) => any): List<T>;
		forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T>;
		until(fnOrTest: (el: T, i: number) => void): List<T>;
		until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): List<T>;
		reverseForEach(fn: (el: T, i: number) => any): List<T>;
		reverseUntil(fnOrTest: (el: T, i: number) => void): List<T>;
		reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): List<T>;
		some(fn: (el: T) => boolean): boolean;
		all(fn: (el: T) => boolean): boolean;
		indexOf(v: T | ((el: T) => boolean)): number;
		contains(v: T): boolean;
		reverse(): List<T>;
		first(fn?: (el: T) => boolean): T | undefined;
		find(fn: (el: T) => boolean): T | undefined;
		last(): T | undefined;
		filter(fn: (el: T, i: number) => boolean): List<T>;
		select(fn: (el: T, i: number) => boolean): List<T>;
		selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T>;
		orderBy(fn: (a: T, b: T) => number): List<T>;
		map<S>(fn: (el: T, i: number) => S): List<S>;
		mapInto<S>(src: List<S> | S[], fn: (el: S, i: number) => T): List<T>;
		reduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
		reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
		reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		equals(b: List<T>): boolean;
		same(b: List<T>): boolean;
		intersect(b: List<T>): List<T>;
		union(b: List<T>): List<T>;
		zip<U, V>(list: List<U>, fn?: (t: T, u: U) => V): List<V>;
		unzip<U, V>(fn?: (el: T) => [U, V]): [List<U>, List<V>];
		flatten<U>(maxDepth?: number): List<U>;
		toJSON(): any;
	}

	export class Comparer {
		static StringAsc: (a: string, b: string) => 1 | -1 | 0;
		static StringDesc: (a: string, b: string) => 1 | -1 | 0;
		static NumberAsc: (a: number, b: number) => 1 | -1 | 0;
		static NumberDesc: (a: number, b: number) => 1 | -1 | 0;
	}
	export class SortedList<T> implements IBasicList<T> {
		constructor(comparer: (a: T, b: T) => number, arr?: T[] | List<T> | SortedList<T>);
		readonly values: T[];
		get(pos: number): T;
		readonly count: number;
		readonly length: number;
		comparer: (a: T, b: T) => number;
		sort(): void;
		clear(): SortedList<T>;
		add(v: T): SortedList<T>;
		pop(): T | undefined;
		shift(): T | undefined;
		bulkAdd(v: T[] | List<T> | SortedList<T>): SortedList<T>;
		copy(src: SortedList<T> | List<T> | T[]): SortedList<T>;
		clone(): SortedList<T>;
		remove(v: T): SortedList<T>;
		removeAt(n: number): T;
		removeFirst(fn: (el: T) => boolean): T;
		forEach(fn: (el: T, i: number) => any): SortedList<T>;
		forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T>;
		until(fnOrTest: (el: T, i: number) => void): SortedList<T>;
		until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): SortedList<T>;
		reverseForEach(fn: (el: T, i: number) => any): SortedList<T>;
		reverseUntil(fnOrTest: (el: T, i: number) => void): SortedList<T>;
		reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): SortedList<T>;
		some(fn: (el: T) => boolean): boolean;
		all(fn: (el: T) => boolean): boolean;
		getInsertIndex(v: T): number;
		indexOf(v: T | ((el: T) => boolean)): number;
		contains(v: T): boolean;
		first(fn?: (el: T) => boolean): T | undefined;
		find(fn: (el: T) => boolean): T | undefined;
		last(): T | undefined;
		filter(fn: (el: T, i: number) => boolean): SortedList<T>;
		select(fn: (el: T, i: number) => boolean): SortedList<T>;
		selectInto(src: SortedList<T> | List<T> | T[], fn: (el: T, i: number) => boolean): SortedList<T>;
		map<S>(fn: (el: T, i: number) => S): List<S>;
		mapInto<S>(src: SortedList<S> | List<S> | S[], fn: (el: S, i: number) => T): SortedList<T>;
		reduce<U>(fn: (acc: U, cur: T) => any, start: U): U;
		reduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U;
		reverseReduceUntil<U>(fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		equals(b: List<T> | SortedList<T>): boolean;
		same(b: List<T> | SortedList<T>): boolean;
		intersect(b: List<T> | SortedList<T>): SortedList<T>;
		union(b: List<T> | SortedList<T>): SortedList<T>;
		toList(): List<T>;
		toJSON(): any;
	}
	
	export class Dictionary<T> {
		constructor();
		has(key: number | string): boolean;
		contains(key: number | string): boolean;
		get(key: number | string): T;
		set(key: number | string, value: T): Dictionary<T>;
		delete(key: number | string): Dictionary<T>;
		clear(): Dictionary<T>;
		readonly values: T[];
		readonly keys: string[];
		readonly list: List<T>;
		readonly count: number;
		clone(): Dictionary<T>;
		toJSON(): any;
	}

	export class Stack<T> {
		DEFAULT_SIZE: number;
		readonly values: T[];
		readonly depth: number;
		limit: number;
		constructor(size?: number);
		push(obj: T): void;
		fastPush(obj: T): void;
		limitedPush(obj: T): void;
		pop(): T | undefined;
		peek(): T | undefined;
		peekAt(index: number): T | undefined;
		toList(): List<T>;
		toJSON(): any;
	}

	export class Tree<T> implements ICloneable<Tree<T>>, IInitable<Tree<T>> {
		id: string;
		parent: Tree<T> | null;
		children: List<Tree<T>> | null;
		data: T | null;
		static fromObject<T>(obj: any): Tree<T>;
		static fromNodeList<S, T>(nodes: S[], mapcfg?: {
			id?: ((node: S) => string) | string;
			parent?: ((node: S) => string) | string;
			data?: ((node: S) => any) | string;
		}): Tree<T>;
		constructor();
		init(obj: Partial<Tree<T>>): Tree<T>;
		insertAt(pos: number, data: T): void;
		add(data: T | Tree<T>): void;
		remove(): void;
		prune(): Tree<T>;
		reduce(fn?: (acc: any, cur: Tree<T> | null) => any, start?: any): any;
		clone(): Tree<T>;
		filter(condition: (node: Tree<T>) => boolean): Tree<T>;
		select(condition?: (node: Tree<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
		find(condition: (data: T | null) => boolean): Tree<T> | null;
		contains(condition: (data: T) => boolean): boolean;
		depth(): number;
		toJSON(): any;
	}

	export class CalcConst {
		static ROTATION_DEGREE_PRECISION: number;
		static RADIAN_FACTOR: number;
		static DEGREE_FACTOR: number;
		static DEG360: number;
		static ROTATION_LOOKUP: number[][];
	}
	export namespace Calc {
		export function sign(x: number): number;
		export function rotationDeg(rotation: number): number[];
		export function rotationRad(rotation: number): number[];
		export function closestRadianRotation(radian: number): number;
	}

	export namespace Dom {
		export enum Sides {
			Top = 0,
			Bottom = 1,
			Left = 2,
			Right = 3,
		}
		export function init(win: Window): void;
		export function toArray<T>(a: ArrayLike<T>): T[];
		export function create(html: string, attr?: any): HTMLElement;
		export function outerHTML(el: HTMLElement): string;
		export function setAttr(_el: HTMLElement | String, attr: any): void;
		export function remove(element: Element): HTMLElement | null;
		export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
		export function clear(element: Element): void;
		export function get(id: string): HTMLElement;
		export function find(selector: string): HTMLElement;
		export function findAll(selector: string, root?: HTMLElement): Element[];
		export function children(root: HTMLElement, selector?: string): Element[];
		export function findParent(root: HTMLElement, selector: string): HTMLElement | null;
		export function position(el: HTMLElement, x: number, y: number): void;
		export function is(selector: string, element: HTMLElement): boolean;
		export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
	}

	export namespace Array {
		export function flatten<T>(src: any[]): T[];
		export function reverse<T>(array: T[]): T[];
		export function concat(...arrs: any[]): any[];
		export function slice<T>(src: T[], from?: number, count?: number): T[];
		export function append<T>(arr: T[], values: T[]): void;
		export function removeAt(arr: any[], index: number): any;
		export function indexOfElement(src: any[], el: any): number;
		export function remove(arr: any[], el: any): void;
		export function indexOf(src: any[], fn: (el: any) => boolean): number;
		export function removeOneByFn(arr: any[], fn: (el: any) => boolean): void;
		export function shallowCopy<T>(src: T[]): T[];
		export function shallowCopyInto<T>(src: T[], target: T[]): void;
		export function shallowFill<T>(src: T[], target: T[], at?: number): void;
		export function deepCopy<T>(src: T[]): T[];
		export function deepCopyInto<T>(src: T[], target: T[]): void;
		export function deepFill<T>(src: T[], target: T[], at?: number): void;
		export function filter<T>(src: T[], fn: (el: T, i: number) => boolean): T[];
		export function filterInto<T>(src: T[], target: T[], fn: (el: T, i: number) => boolean): void;
		export function map<S, T>(src: S[], fn: (el: S, i: number) => T): T[];
		export function mapInto<S, T>(src: S[], target: T[], fn: (el: S, i: number) => T): void;
		export function reduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
		export function reduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
		export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
		export function forEach<T>(src: T[], fn: (el: T, i: number) => any): void;
		export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
		export function until<T>(src: T[], fnOrTest: (el: T, i: number) => void): void;
		export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): void;
		export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void;
		export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => void): void;
		export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): void;
		export function some<T>(src: T[], fn: (el: T) => boolean): boolean;
		export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
		export function insertAt<T>(src: T[], pos: number, v: T): void;
		export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
		export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[];
	}

	export namespace Obj {
		export function destroy(obj: any): void;
		export function wipe(obj: any): void;
		export function setNull(obj: any): void;
		export function isNullOrUndefined(...args: any[]): boolean;
		export function isNotNullOrUndefined(...args: any[]): boolean;
		export function isUndefined(...args: any[]): boolean;
		export function isNotUndefined(...args: any[]): boolean;
		export function isClassOf(a: any, b: any): boolean;
		export function isSameClass(a: any, b: any): boolean;
		export function inherits(a: any, b: any): boolean;
		export function equals(a: any, b: any): boolean;
		export function isDifferent(a: any, b: any): boolean;
		export function shallowCopy(obj: any): any;
		export function clone<T>(obj: T): T;
		export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
		export function mixin(target: any, exclude: any, ...sources: any[]): any;
		export function setProperties(target: any, values: any): void;
	}
	export interface IObjectWithFunctions<T extends Object | void> {
		[key: string]: (...args: any[]) => T;
	}

	export namespace Util {
		export function init(win?: Window): void;
		export function getFunctionName(fn: Function): string;
		export function getFunctionCode(fn: Function): string;
		export function newUUID(): string;
		export function newInt(): number;
		export function callDebugger(): void;
		export function pipeOut(log: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void): void;
		export function assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
		export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends IObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
		export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
		export function toArray<T>(arr: ArrayLike<T>): T[];
	}

	export namespace Test {
		export function hasWindow(): boolean;
		export function hasConsole(): boolean;
		export function isArray(it: any): boolean;
		export function isElement(target: any): boolean;
		export function isFunction(it: any): boolean;
	}

	export class Timer {
		static readonly time: number;
		constructor();
		static now(): number;
		static start(): number;
		static stop(): number;
	}

	export class Uri {
		hash: string;
		pathName: string;
		port: string;
		hostName: string;
		protocol: string;
		origin: string;
		full: string;
		args: any;
		constructor();
		init(): void;
	}

	export function Poolable<T>(Base: Constructor<T>): Constructor<T> & Constructor<IPoolable>;

	export function Initable<T>(base: Constructor<T>): Constructor<T> & Constructor<IInitable<T>>;

	export function before<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	export function after<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	export function provided<S>(condition: (name: string, ...args: any[]) => boolean): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

	export let async: {
		<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
		before?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
		after?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
		provided?<S>(async_predicate: (...args: any[]) => Promise<boolean>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	};

	export class Pool<T extends IPoolable> implements IPool<IPoolable> {
		readonly available: number;
		readonly size: number;
		constructor(cls: ICtor<T>, growthStep?: number);
		get(): T;
		release(obj: T): void;
	}

	export function integrate(alias?: string | object): void;

	export namespace MocData {
		export enum MocDataType {
			LinearInt = 0,
			RandomInt = 1,
			LinearFloat = 2,
			RandomFloat = 3,
		}
		export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		export function randomString(length?: number): string;
		export function randomInt(): number;
		export function randomNumber(): number;
		export function numericArray(length: number, type?: MocDataType): number[];
		export function stringArray(arrayLength: number, stringLength?: number): string[];
	}

	export class KeyValuePair<S, T> {
		key: S;
		value: T;
	}

	export interface IVec2 {
		x: number;
		y: number;
	}

	export interface IRange2 {
		pos: IVec2;
		size: IVec2;
	}

	export interface IRect {
		start: IVec2;
		stop: IVec2;
	}
}