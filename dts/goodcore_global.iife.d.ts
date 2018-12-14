type Constructor<T> = new (...args: any[]) => T;
interface ICtor<T> { new(...args: any[]): T }
interface Indexable<T> {
	[key: string]: T;
}
interface IObject {
	[key: string]: any;
}
interface IInstance<T> extends IObject {
	constructor?: ICtor<T>;
}
interface IPool<T extends IPoolable> {
	get(): T & IPoolable;
	release(obj: T): void;
}
interface IPoolable {
	__pool__: IPool<IPoolable>;
	release(): void;
	initPool(pool: IPool<IPoolable>): void;
}
interface ISerializable<T> {
	toJSON(): any;
	serialize(): T
}
interface IRevivable<T> {
	revive(data: any, ...types: Array<Constructor<any>>): T;
	deserialize(array: any, ...types: Array<Constructor<any>>): T;
}
interface ICloneable<T> {
	clone(): T;
}
interface IInitable<T> {
	init(obj: Partial<T> | Indexable<any>, mapping?: Indexable<string>): this;
}
interface IBasicList<T> {
	[Symbol.iterator](): IterableIterator<T>;
	next(value?: any): IteratorResult<T>;
	values: T[];
	get(pos: number): T | undefined;
    read(pos: number): T | undefined;
	count: number;
	clear(): IBasicList<T>;
	add(v: T): IBasicList<T> | undefined;
	pop(): T | undefined;
	shift(): T | undefined;
	copy(src: IBasicList<T> | T[]): IBasicList<T>;
	clone(): IBasicList<T>;
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
	flatten<U>(maxDepth?: number): IList<U>
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
interface IDebounceOptions {
	leading: boolean;
}
interface IDebouncedFunction<T> {
	(...args: any[]): T
	resetTimer?: () => void;
}

declare const Global: {
    window: Window | null;
    hasNativeWindow: boolean;
    global: Window; // has to exclude Node since this is browser only
};
declare class Vec2Const {
    static EPSILON: number;
    static IDENTITY: IVec2;
    static X_DIM: IVec2;
    static Y_DIM: IVec2;
}
declare class Vec2 implements IVec2 {
    x: number;
    y: number;
    readonly isZero: boolean;
    constructor(x?: number, y?: number);
    protected create(x?: number, y?: number): Vec2;
    set(src: IVec2): Vec2;
    copy(src: IVec2): Vec2;
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

declare class Range2 implements IRange2 {
    pos: Vec2;
    size: Vec2;
    readonly isZero: boolean;
    constructor(x?: number, y?: number, w?: number, h?: number);
    protected create(x?: number, y?: number, w?: number, h?: number): Range2;
    set(src: IRange2): Range2;
    copy(src: IRange2): Range2;
    clone(out?: Range2): Range2;
    toRect(endInclusive?: boolean, out?: Rect): Rect;
    scale(factor: IVec2, keepCenter?: boolean): Range2;
    translate(system: IVec2): Range2;
    move(system: IVec2): Range2;
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

declare class Rect implements IRect {
    start: Vec2;
    stop: Vec2;
    endInclusive: boolean;
    readonly isZero: boolean;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
    protected create(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean): Rect;
    set(src: IRect): Rect;
    copy(src: IRect): Rect;
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

declare class List<T> implements IList<T>, ISerializable<T[]>, IRevivable<List<T>>, ICloneable<List<T>> {
    constructor(arr?: T[] | List<T>);
    [Symbol.iterator](): IterableIterator<T>;
    next(value?: any): IteratorResult<T>;
    protected create<S = T>(arr?: S[] | List<S>): List<S>;
    readonly values: T[];
    get(pos: number): T | undefined;
    read(pos: number): T | undefined;
    getByIndex(key: number | string): T | undefined;
    set(pos: number, v: T): List<T>;
    write(pos: number, v: T): List<T>;
    readonly count: number;
    readonly length: number;
    indexer: ((el: T) => any) | null;
    clear(): List<T>;
    add(v: T): List<T>;
    insertAt(pos: number, v: T): List<T>;
    push(v: T): number;
    pop(): T | undefined;
    shift(): T | undefined;
    truncate(size?: number): List<T>
    fill(size: number, populator: ((i: number) => T) | T): List<T>;
    splice(pos?: number, remove?: number, insert?: T[] | IList<T>): List<T>;
    concat(v: T[] | List<T>): List<T>;
    append(v: T[] | List<T>): List<T>;
    copy(src: List<T> | T[]): List<T>;
    shallowCopy(src: List<T> | T[]): List<T>;
    clone(): List<T>;
    remove(v: T): List<T>;
    removeFirst(fn: (el: T) => boolean): T | undefined;
    removeAt(n: number): T | undefined;
    forEach(fn: (el: T, i: number) => any, startIndex?: number): List<T>;
    forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): List<T>;
    until(fnOrTest: (el: T, i: number) => void, startIndex?: number): List<T>;
    until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): List<T>;
    reverseForEach(fn: (el: T, i: number) => any): List<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => void): List<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): List<T>;
    some(fn: (el: T) => boolean): boolean;
    all(fn: (el: T) => boolean): boolean;
    indexOf(v: T | ((el: T) => boolean)): number;
    contains(v: T | ((el: T) => boolean)): boolean;
    reverse(): List<T>;
    first(fn?: (el: T) => boolean): T | undefined;
    find(fn: (el: T) => boolean): T | undefined;
    last(): T | undefined;
    filter(fn: (el: T, i: number) => boolean): List<T>;
    select(fn: (el: T, i: number) => boolean): List<T>;
    selectInto(src: List<T> | T[], fn: (el: T, i: number) => boolean): List<T>;
    head(count?: number): List<T>;
    tail(count?: number): List<T>;
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
    subtract(b: List<T>): List<T>;
    zip<U, V>(list: List<U>, fn?: (t: T, u: U) => V): List<V>;
    unzip<U, V>(fn?: (el: T) => [U, V]): [List<U>, List<V>];
    flatten<U>(maxDepth?: number): List<U>;
    toJSON(): any;
    serialize(): T[];
    revive(array: any[], ...types: Array<Constructor<any>>): List<T>;
    deserialize(array: any[], ...types: Array<Constructor<any>>): List<T>;
}

declare class Comparer {
    static StringAsc: (a: string, b: string) => 1 | -1 | 0;
    static StringDesc: (a: string, b: string) => 1 | -1 | 0;
    static NumberAsc: (a: number, b: number) => 1 | -1 | 0;
    static NumberDesc: (a: number, b: number) => 1 | -1 | 0;
}
declare class SortedList<T> implements IBasicList<T>, ISerializable<T[]>, IRevivable<SortedList<T>>, ICloneable<SortedList<T>> {
    constructor(comparer?: (a: T, b: T) => number, arr?: T[] | List<T> | SortedList<T>);
    [Symbol.iterator](): IterableIterator<T>;
    next(value?: any): IteratorResult<T>;
    protected create<S = T>(comparer?: (a: S, b: S) => number, arr?: S[] | List<S> | SortedList<S>): SortedList<S>;
    readonly values: T[];
    get(pos: number): T | undefined;
    read(pos: number): T | undefined;
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
    truncate(size?: number): List<T>
    fill(size: number, populator: ((i: number) => T) | T): List<T>;
    clone(): SortedList<T>;
    remove(v: T): SortedList<T>;
    removeAt(n: number): T | undefined;
    removeFirst(fn: (el: T) => boolean): T | undefined;
    forEach(fn: (el: T, i: number) => any, startIndex?: number): SortedList<T>;
    forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T>;
    until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): SortedList<T>;
    until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): SortedList<T>;
    reverseForEach(fn: (el: T, i: number) => any): SortedList<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => boolean): SortedList<T>;
    reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): SortedList<T>;
    some(fn: (el: T) => boolean): boolean;
    all(fn: (el: T) => boolean): boolean;
    getInsertIndex(v: T): number;
    indexOf(v: T | ((el: T) => boolean)): number;
    contains(v: T | ((el: T) => boolean)): boolean;
    first(fn?: (el: T) => boolean): T | undefined;
    find(fn: (el: T) => boolean): T | undefined;
    last(): T | undefined;
    filter(fn: (el: T, i: number) => boolean): SortedList<T>;
    select(fn: (el: T, i: number) => boolean): SortedList<T>;
    selectInto(src: SortedList<T> | List<T> | T[], fn: (el: T, i: number) => boolean): SortedList<T>;
    head(count?: number): SortedList<T>;
    tail(count?: number): SortedList<T>;
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
    serialize(): T[];
    revive(array: any[], ...types: Array<Constructor<any>>): SortedList<T>;
    deserialize(array: any[], ...types: Array<Constructor<any>>): SortedList<T>;
}

declare class Dictionary<T> implements ISerializable<IObject>, IRevivable<Dictionary<T>>, ICloneable<Dictionary<T>> {
    constructor();
    protected create<S = T>(): Dictionary<S>;
    has(key: number | string): boolean;
    contains(key: number | string): boolean;
    get(key: number | string): T | undefined;
    set(key: number | string, value: T): Dictionary<T>;
    delete(key: number | string): Dictionary<T>;
    clear(): Dictionary<T>;
    readonly values: T[];
    readonly keys: string[];
    readonly count: number;
    clone(): Dictionary<T>;
    toJSON(): any;
    serialize(): IObject;
    revive(obj: any, ...types: Array<Constructor<any>>): Dictionary<T>;
    deserialize(obj: any, ...types: Array<Constructor<any>>): Dictionary<T>;
}

declare class Stack<T> implements ISerializable<T[]>, IRevivable<Stack<T>>, ICloneable<Stack<T>> {
    DEFAULT_SIZE: number;
    readonly values: T[];
    readonly depth: number;
    readonly size: number;
    readonly isEmpty: boolean;
    limit: number;
    constructor(size?: number);
    protected create<S = T>(size?: number): Stack<S>;
    push(obj: T): void;
    fastPush(obj: T): void;
    limitedPush(obj: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    peekAt(index: number): T | undefined;
    toList(): List<T>;
    clear(): Stack<T>;
    clone(): Stack<T>;
    toJSON(): any;
    serialize(): T[];
    revive(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
    deserialize(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
}

declare class Tree<T> implements ISerializable<T[]>, ICloneable<Tree<T>>, IInitable<Tree<T>> {
    public id: string;
    public parent: this | null;
    public children: List<this> | null;
    public data: T | null;
    public virtual: boolean;
    public isDirty: boolean;
    public size: number;
    public leafCount: number;
    public childCount: number;
    public weight: number;

    protected _virtual: boolean;
    protected _size: number;
    protected _leafCount: number;
    protected _weight: number;

    root: this;
    static fromObject<T>(obj: any): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string) | string;
        parent?: ((node: S) => string) | string;
        data?: ((node: S) => any) | string;
    }, virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number);
    protected create<S = T>(...args: any[]): Tree<S>;
    protected markAsDirty(): void;
    public reCalculateSize(): this;
    public aggregate<S = any>(fn: (cur: this, i: number, agg: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    /**
     * @deprecated Since version 1.9.2. Will be deleted in version 2.0. Use aggregate instead.
     */
    public collect<S = any>(fn: (cur: this, i: number, collected: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
    public init(obj: Partial<this>, mapping?: any): this;
    public insertAt(pos: number, data: T, id?: string | number): void;
    public add(data: T | this, id?: string | number): this;
    public remove(): void;
    public prune(): this;
    public cut(): this;
    public forEach(fn: (el: this, i: number) => void, _i?: number): this;
    public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S;
    public clone(): this;
    public filter(condition: (node: this) => boolean): this;
    public select(condition?: (node: this) => boolean, acc?: List<this>): List<this>;
    public find(condition: number | ((node: this) => boolean)): this | null;
    protected _findBySize(pos: number): this | null;
    public depth(): number;
    public sort(comparer: (a: this, b: this) => number): this;
    public serialize(): T[];
    public toJSON(): any;
}

declare class IndexedTree<T> extends Tree<T> {
    init(obj: Partial<this>, mapping?: any): this;
    index: Dictionary<this>;
    indexer: (node: this) => string | number;
    count: number;
    static fromObject<T>(obj: any, indexer?: (node: IndexedTree<T>) => string | number): Tree<T>;
    static fromNodeList<S, T>(nodes: S[], mapcfg?: {
        id?: ((node: S) => string | number) | string | number,
        parent?: ((node: S) => string | number) | string | number,
        data?: ((node: S) => any) | string
    }, virtualRoot?: boolean): Tree<T>;
    constructor(id?: string | number, indexer?: (node: IndexedTree<T>) => string | number, index?: Dictionary<Tree<T>>);
    protected create<S = T>(...args: any[]): Tree<S>;
    insertAt(pos: number, data: T, id?: string | number, updateIndex?: boolean): void;
    addTo(parentId: string | number, data: T | this, id?: string | number, updateIndex?: boolean): this | undefined;
    add(data: T | this, id?: string | number, updateIndex?: boolean): this;
    contains(node: this | string | number): boolean
    get(id: string | number): this | undefined;
    lookup(id: string | number): this | undefined;
    cut(): this;
    reIndex(): void;
    clone(): this;
    prune(): this;
    filter(condition: (node: this) => boolean, parent?: this | null): this;
}

declare class CalcConst {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
}
declare namespace Calc {
    export function sign(x: number): number;
    export function rotationDeg(rotation: number): number[];
    export function rotationRad(rotation: number): number[];
    export function closestRadianRotation(radian: number): number;
}

declare namespace Dom {
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
    export function setAttr(_el: HTMLElement | Node | String, attr: any): void;
    export function remove(element: Element | Node): Element | Node | null;
    export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
    export function clear(element: Element | Node): void;
    export function get(id: string): HTMLElement | null;
    export function byId(id: string): HTMLElement | null;
    export function find(selector: string): Element | null;
    export function findAll(selector: string, root?: HTMLElement): Element[];
    export function children(root: HTMLElement, selector?: string): Element[];
    export function findParent(root: Element, selector: string): HTMLElement | null;
    export function position(el: HTMLElement, x: number, y: number): void;
    export function is(selector: string, element: Element): boolean;
    export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
}

declare namespace Arr {
    export function flatten<T>(src: any[]): T[];
    export function reverse<T>(array: T[]): T[];
    export function concat(...arrs: any[]): any[];
    export function slice<T>(src: T[], pos?: number, count?: number): T[];
    export function splice<T>(src: T[], pos?: number, remove?: number, insert?: T[]): void
    export function append<T>(arr: T[], values: T[]): void;
    export function removeAt<T>(arr: T[], index: number): T | undefined;
    export function indexOfElement(src: any[], el: any): number;
    export function remove(arr: any[], el: any): void;
    export function indexOf(src: any[], fn: (el: any) => boolean): number;
    export function find<T>(src: T[], fn: (el: any) => boolean): T | undefined;
    export function removeOneByFn<T>(arr: T[], fn: (el: T) => boolean): void;
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
    export function reduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U, pos?: number, to?: number): U;
    export function reduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T, pos?: number, to?: number) => boolean, start: U): U;
    export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
    export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
    export function forEach<T>(src: T[], fn: (el: T, i: number) => any, startIndex?: number): void;
    export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => void, startIndex?: number): void;
    export function until<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
    export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void;
    export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => void): void;
    export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): void;
    export function some<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
    export function insertAt<T>(src: T[], pos: number, v: T): void;
    export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
    export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[];
    type zipFn<S, T, U, V = undefined, W = undefined> = (i: number, a: S, b: T, c?: V, d?: W) => U;
    export function zip<S, T, U = [S, T], V = undefined, W = undefined>(
        a: S[], 
        b: T[], 
        fn?: zipFn<S, T, U, V, W>,
        c?: undefined, 
        d?: undefined, 
    ): U[];
    export function zip<S, T, V, U = [S, T, V], W = undefined>(
        a: S[], 
        b: T[], 
        c: V[], 
        fn?: zipFn<S, T, U, V, W>,
        d?: undefined, 
    ): U[];
    export function zip<S, T, V, W, U = [S, T, V, W]>(
        a: S[], 
        b: T[], 
        c: V[], 
        d: W[], 
        fn?: zipFn<S, T, U, V, W>,
    ): U[]; 
    export function unzip<S, T, U =[S, T]>(arr: U[], fn?: (u: U, i?: number, out?: [S, T]) => [S, T]): [S[], T[]];
    export function deserialize<S>(array: any[], target: S[], ...types: Array<Constructor<any>>): S[];
}

declare namespace Obj {
    export function destroy(obj: any): void;
    export function wipe(obj: any): void;
    export function setNull(obj: any): void;
    export function isClassOf(a: any, b: any): boolean;
    export function isSameClass(a: any, b: any): boolean;
    export function inherits(a: any, b: any): boolean;
    export function equals(a: any, b: any): boolean;
    export function isDifferent(a: any, b: any): boolean;
    export function shallowCopy(obj: any): any;
    export function clone<T>(obj: T): T;
    export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    export function mixin(target: any, exclude: any, ...sources: any[]): any;
    export function setProperties(target: any, values: any, mapping?: any): void;
    export function forEach<T extends { [index: string]: any }, U = any>(target: T | Array<U>, fn: (value: any, key?: string | number) => boolean | void): void;
    export function transform<T extends { [index: string]: any }, S = T, U = any>(target: T | Array<U>, fn: (result: S, value: any, key: string | number) => boolean | void, accumulator?: S): S;
    export function difference<T extends { [index: string]: any }, S extends { [index: string]: any } = T>(target: T, base: S): S;
}
declare interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}

declare namespace Util {
    export class LoggableCounter {
        public name: string;
        public log(): void;
        public inc(): LoggableCounter;
        public reset(): LoggableCounter;
        valueOf(): number;
        toString(): string;
    }
    export function counter(key?: number | string): LoggableCounter;
    export function count(key?: number | string): LoggableCounter;
    export function once<T extends (...args: any[]) => S, S = void>(fn: T): T;
    export function init(win?: Window): void;
    export function getFunctionName(fn: Function): string;
    export function getFunctionCode(fn: Function): string;
    export function newUUID(): string;
    export function newInt(): number;
    export function callDebugger(): void;
    export function pipeOut(
        log?: ((...args: any[]) => void) | null,
        warn?: ((...args: any[]) => void) | null,
        error?: ((...args: any[]) => void) | null
    ): void;
    export class AssertError extends Error { }
    export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
    export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(objOrClass: U, fnName: string, proxyFn: (originalFn: (...args: any[]) => S | V, ...args: any[]) => void): void;
    export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
    export function toArray<T>(arr: ArrayLike<T>): T[];
    export function debounce<S extends any, T extends (...args: any[]) => S | void>(method: T, duration?: number, options?: Partial<IDebounceOptions>): IDebouncedFunction<S>;
}

declare namespace Test {
    export class Env {
        public static useNative?: boolean;
        public static isOpera(): boolean;
        public static isFirefox(): boolean;
        public static isSafari(): boolean;
        public static isIE(): boolean;
        public static isEdge(): boolean;
        public static isChrome(): boolean;
        public static isBlink(): boolean;
        public static hasFastNativeArrays(): boolean;
    }
    export function hasWindow(): boolean;
    export function hasConsole(): boolean;
    export function isArray(it: any): boolean;
    export function isElement(target: any): boolean;
    export function isFunction(it: any): boolean;
    export function isNumber(x: any): boolean;
    export function isInt(x: any): boolean;
    export function isString(x: any): boolean;
    export function areNullOrUndefined(...args: any[]): boolean;
    export function areNotNullOrUndefined(...args: any[]): boolean;
    export function isNullOrUndefined(arg: any): boolean;
    export function isNotNullOrUndefined(arg: any): boolean;
    export function areUndefined(...args: any[]): boolean;
    export function areNotUndefined(...args: any[]): boolean;
    export function isNull(arg: any): boolean;
    export function isNotNull(arg: any): boolean;
    export function isUndefined(arg: any): boolean;
    export function isNotUndefined(arg: any): boolean;
}

declare class Timer {
    static readonly time: number;
    constructor();
    static now(): number;
    static start(): number;
    static stop(): number;
}

declare class Uri {
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

declare function Poolable<T extends { new(...args: any[]): {} }>(_constructor: T): T & Constructor<IPoolable>
declare function Initable<T extends { new(...args: any[]): {} }>(_constructor: T): T & Constructor<IInitable<T>>

declare class Pool<T> {
    readonly available: number;
    readonly size: number;
    constructor(cls: ICtor<T>, growthStep?: number);
    get(): T & IPoolable;
    release(obj: T): void;
}

declare namespace MocData {
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
    export function numericArray(length: number, dataType?: MocDataType): number[];
    export function stringArray(arrayLength: number, stringLength?: number): string[];
}

declare class KeyValuePair<S, T> {
    key: S;
    value: T;
}

declare interface IVec2 {
    x: number;
    y: number;
}

declare interface IRange2 {
    pos: IVec2;
    size: IVec2;
}

declare interface IRect {
    start: IVec2;
    stop: IVec2;
    endInclusive?: boolean;
}
declare namespace Decorators {
    export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
        configurable: boolean;
        enumerable: boolean | undefined;
        get: () => any;
    };
    export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
    export function deprecated<S>(instead?: string, message?: string):
        (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    export function asserts<S>(assertFn: Function, result?: any):
        (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
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
}
