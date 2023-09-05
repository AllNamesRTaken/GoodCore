type Constructor<T> = new (...args: any[]) => T;
type ICtor<T> = new (...args: any[]) => T;
// tslint:disable-next-line:max-line-length
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type PickKeysOfType<T, KT> = ({ [P in keyof T]: T[P] extends KT ? P : never })[keyof T];
type PickType<T, KT> = Pick<T, PickKeysOfType<T, KT>>;
type PickFunctions<T> = PickType<T, Function>;
type ExcludeType<T, KT> = Omit<T, PickKeysOfType<T, KT>>;
type ExcludeFunctions<T> = ExcludeType<T, Function>;

// tslint:disable-next-line:interface-name
interface Indexable<T> {
    [key: string]: T;
}
interface IObject extends Indexable<any> { }
interface IInstance<T> extends IObject {
    // tslint:disable-next-line:no-reserved-keywords
    constructor?: ICtor<T>;
}
type ArgTypes<T> = T extends (...a: infer A) => unknown ? A : [];
type ResultType<T> = T extends (...a: unknown[]) => infer S ? S : never;
interface IPool<T extends IPoolable> {
    get(): T;
    release(obj: T): void;
}
interface IPoolable {
    __pool__: IPool<IPoolable>;
    release(): void;
    initPool(pool: IPool<IPoolable>): void;
}
interface ICloneable {
    clone(): this;
}
interface IInitable {
    init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this;
}
type TInitable<T> = T & IInitable;
interface ISerializable<T> {
    toJSON(): any;
    serialize(): T;
}
interface IDeserializable<T> {
    deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
interface IRevivable<T> {
    revive(data: any, ...types: Array<Constructor<any>>): T;
    deserialize(array: any, ...types: Array<Constructor<any>>): T;
}
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
type TreeEvent = "change";
interface ITreeNode<T> {
    id: string;
    parent: ITreeNode<T> | null;
    children: Array<ITreeNode<T>> | null;
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
interface ICookieMonsterOptions<T extends Indexable<any>> {
    name?: string;
    defaults?: T;
    retainTime?: string;
    path?: string;
    localStorage?: boolean;
    session?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
	requireSSL?: boolean;
}
interface ICookieMonster<T extends Indexable<any>, K extends keyof T = keyof T> {
    setCookie<S extends K>(key: S, value: T[S]): void;
    getCookie<S extends K>(key: S): T[S];
    eatCookie(key: K): void;
    removeCookies(): void;
}
declare namespace goodcore {
    export const Global: {
        window: Window | null;
        hasNativeWindow: boolean;
        global: Window; // has to exclude Node since this is browser only
    };
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
        constructor(x?: number | IVec2, y?: number);
        protected create(x?: number, y?: number): Vec2;
        // tslint:disable-next-line:no-reserved-keywords
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
        addUV(vectorB: IVec2): Vec2;
        subtractUV(vectorB: IVec2): Vec2;
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
    export function V2(x?: number | IVec2, y?: number): Vec2

    export class Range2 implements IRange2 {
        pos: Vec2;
        size: Vec2;
        readonly isZero: boolean;
        constructor(x?: number, y?: number, w?: number, h?: number);
        protected create(x?: number, y?: number, w?: number, h?: number): Range2;
        // tslint:disable-next-line:no-reserved-keywords
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

    export class Rect implements IRect {
        start: Vec2;
        stop: Vec2;
        endInclusive: boolean;
        readonly isZero: boolean;
        constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
        protected create(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean): Rect;
        // tslint:disable-next-line:no-reserved-keywords
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

    export class List<T> implements IList<T>, ISerializable<T[]>, IRevivable<List<T>>, ICloneable {
        constructor(arr?: T[] | List<T>);
        [Symbol.iterator](): IterableIterator<T>;
        next(value?: any): IteratorResult<T>;
        protected create<S = T>(arr?: S[] | List<S>): List<S>;
        readonly values: T[];
        // tslint:disable-next-line:no-reserved-keywords
        get(pos: number): T | undefined;
        read(pos: number): T | undefined;
        getByIndex(key: number | string): T | undefined;
        // tslint:disable-next-line:no-reserved-keywords
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
        truncate(size?: number): List<T>;
        fill(size: number, populator: ((i: number) => T) | T): List<T>;
        splice(pos?: number, remove?: number, insert?: T[] | IList<T>): List<T>;
        concat(v: T[] | List<T>): List<T>;
        append(v: T[] | List<T>): List<T>;
        copy(src: List<T> | T[]): List<T>;
        shallowCopy(src: List<T> | T[]): List<T>;
        clone(): this;
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

    export class Comparer {
        static StringAsc: (a: string, b: string) => 1 | -1 | 0;
        static StringDesc: (a: string, b: string) => 1 | -1 | 0;
        static NumberAsc: (a: number, b: number) => 1 | -1 | 0;
        static NumberDesc: (a: number, b: number) => 1 | -1 | 0;
    }
    export class SortedList<T> implements IBasicList<T>, ISerializable<T[]>, IRevivable<SortedList<T>>, ICloneable {
        constructor(comparer?: (a: T, b: T) => number, arr?: T[] | List<T> | SortedList<T>);
        [Symbol.iterator](): IterableIterator<T>;
        next(value?: any): IteratorResult<T>;
        protected create<S = T>(comparer?: (a: S, b: S) => number, arr?: S[] | List<S> | SortedList<S>): SortedList<S>;
        readonly values: T[];
        // tslint:disable-next-line:no-reserved-keywords
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
        truncate(size?: number): List<T>;
        fill(size: number, populator: ((i: number) => T) | T): List<T>;
        clone(): this;
        remove(v: T): SortedList<T>;
        removeAt(n: number): T | undefined;
        removeFirst(fn: (el: T) => boolean): T | undefined;
        forEach(fn: (el: T, i: number) => any, startIndex?: number): SortedList<T>;
        forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): SortedList<T>;
        until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): SortedList<T>;
        until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): SortedList<T>;
        reverseForEach(fn: (el: T, i: number) => any): SortedList<T>;
        reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): SortedList<T>;
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

    export class Dictionary<T> implements ISerializable<IObject>, IRevivable<Dictionary<T>>, ICloneable {
        constructor();
        protected create<S = T>(): Dictionary<S>;
        has(key: number | string): boolean;
        contains(key: number | string): boolean;
        // tslint:disable-next-line:no-reserved-keywords
        get(key: number | string): T | undefined;
        lookup(key: number | string): T | undefined;
        add(key: number | string, value: T): Dictionary<T>;
            // tslint:disable-next-line:no-reserved-keywords
        set(key: number | string, value: T): Dictionary<T>;
        remove(key: number | string): Dictionary<T>;
        // tslint:disable-next-line:no-reserved-keywords
        delete(key: number | string): Dictionary<T>;
        clear(): Dictionary<T>;
        readonly values: T[];
        readonly keys: string[];
        readonly count: number;
        clone(): this;
        toJSON(): any;
        serialize(): IObject;
        revive(obj: any, ...types: Array<Constructor<any>>): Dictionary<T>;
        deserialize(obj: any, ...types: Array<Constructor<any>>): Dictionary<T>;
    }

    export class Stack<T> implements ISerializable<T[]>, IRevivable<Stack<T>>, ICloneable {
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
        clear(): Stack<T>;
        clone(): this;
        toJSON(): any;
        serialize(): T[];
        revive(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
        deserialize(array: any[], ...types: Array<Constructor<any>>): Stack<T>;
    }

    export class Tree<T> implements ISerializable<T[]>, ICloneable, IInitable {
        public id: string;
        public parent: this | null;
        public children: this[] | null;
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
        // tslint:disable-next-line:max-line-length
        public aggregate<S = any>(fn: (cur: this, i: number, agg: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
        /**
         * @deprecated Since version 1.9.2. Will be deleted in version 2.0. Use aggregate instead.
         */
        // tslint:disable-next-line:max-line-length
        public collect<S = any>(fn: (cur: this, i: number, collected: S[], isPruned: boolean) => S, prune?: (cur: this, i: number) => boolean, i?: number): S;
        public init(obj: Partial<this>, mapping?: any): this;
        public insertAt(pos: number, data: T | this, id?: string | number): void;
        public add(data: T | this, id?: string | number): this;
        public remove(): void;
        public prune(): this;
        public cut(): this;
        public forEach(fn: (el: this, i: number) => void, _i?: number): this;
        public reduce<S>(fn?: (acc: S, cur: this | null) => S, start?: S): S;
        public clone(): this;
        public filter(condition: (node: this) => boolean): this;
        public select(condition?: (node: this) => boolean, acc?: this[]): this[];
        public find(condition: number | ((node: this) => boolean)): this | null;
        protected _findBySize(pos: number): this | null;
        public depth(): number;
        public sort(comparer: (a: this, b: this) => number): this;
        public serialize(): T[];
        public toJSON(): any;
        public on(event: TreeEvent, callback: (targets: Array<Tree<T>>) => void): number;
        public off(event: TreeEvent, index: number): void;
        public trigger(event: TreeEvent, targets: Array<Tree<T>>): void;
        public set(values: Partial<T>): void;
    }

    export class IndexedTree<T> extends Tree<T> {
        init(obj: Partial<this>, mapping?: any): this;
        index: Indexable<this>;
        indexer: (node: this) => string | number;
        count: number;
        static fromObject<T>(obj: any, indexer?: (node: IndexedTree<T>) => string | number): Tree<T>;
        static fromNodeList<S, T>(nodes: S[], mapcfg?: {
            id?: ((node: S) => string | number) | string | number,
            parent?: ((node: S) => string | number) | string | number,
            data?: ((node: S) => any) | string,
        }, virtualRoot?: boolean): Tree<T>;
        constructor(id?: string | number, indexer?: (node: IndexedTree<T>) => string | number, index?: Indexable<Tree<T>>);
        protected create<S = T>(...args: any[]): Tree<S>;
        insertAt(pos: number, data: T | this, id?: string | number, updateIndex?: boolean): void;
        addTo(parentId: string | number, data: T | this, id?: string | number, updateIndex?: boolean): this | undefined;
        add(data: T | this, id?: string | number, updateIndex?: boolean): this;
        contains(node: this | string | number): boolean;
        // tslint:disable-next-line:no-reserved-keywords
        get(id: string | number): this | undefined;
        lookup(id: string | number): this | undefined;
        cut(): this;
        reIndex(): void;
        clone(): this;
        prune(): this;
        filter(condition: (node: this) => boolean, parent?: this | null): this;
    }

    export namespace Cookie {
        export function getCookie(key: string): string;
        export function setCookie(key: string, value: string, expires: Date, path?: string): void;
        export function removeCookie(key: string, path?: string): void;
        export function parseAllCookies(): Indexable<string>;
        export function getMonster<T extends Indexable<any>>(options: Partial<ICookieMonsterOptions<T>>): ICookieMonster<T>;
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
        export function create<T extends HTMLElement>(html: string, attr?: any): T;
        export function resolve(target: HTMLElement | string, root?: HTMLElement): HTMLElement | null;
        export function resolveAll(target: HTMLElement | HTMLElement[] | string, root?: HTMLElement): HTMLElement[];
        export function contains(target: HTMLElement | HTMLElement[] | string, root?: Node, includeRoot?: boolean): boolean;
        export function outerHTML(el: HTMLElement): string;
        export function setAttr(_el: HTMLElement | Node | String, attr: any): void;
        export function remove(element: Element | Node): Element | Node | null;
        export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
        export function clear(element: Element | Node): void;
        // tslint:disable-next-line:no-reserved-keywords
        export function get<T extends HTMLElement>(id: string): T | null;
        export function byId<T extends HTMLElement>(id: string): T | null;
        export function find<T extends HTMLElement>(selector: string, root?: Element): T | null;
        export function findAll<T extends HTMLElement>(selector: string, root?: HTMLElement): T[];
        export function children(root: HTMLElement, selector?: string): Element[];
        export function findParent<T extends HTMLElement>(root: Element, selector: string): T | null;
        export function getOffset(el: HTMLElement): {
            left: number;
            top: number;
            right: number;
            bottom: number;
        };
        export function is(selector: string, element: Element): boolean;
        export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
        export function findParents(element: HTMLElement): HTMLElement[];
        export function findClosestCommonParent(elements: HTMLElement[], startAtIndex?: number): HTMLElement;
    }

    /**
    * Functions that helps you manipulate arrays
    */
    export namespace Arr {
        /**
        * Flattens a nested array to a single level.
        * @param src Array to flatten
        * @returns the flattened array
        */
        export function flatten<T>(src: any[]): T[];
        /**
        * Reverses an array. (Very fast)
        * @param src Array to reverse
        */
        export function reverse<T>(array: T[]): T[];
        /**
        * Append an array to another array.
        * @param arr Source array
        * @param values Array data to append
        */
        export function append<T>(arr: T[], values: T[]): void;
        /**
        * Searches an array for a matching condition.
        * @param src Array to search through
        * @param fn Condition to test the elements against
        * @returns the index of the matching element or -1
        */
        export function indexOf<T>(src: any[], fn: (el: T) => boolean): number;
        /**
         * Searches an array for a matching condition.
         * @param src Array to search through
         * @param fn Condition to test the elements against
         * @returns matching element or undefined
         */
        export function find<T>(src: T[], fn: (el: T) => boolean): T | undefined;
        /**
        * Copies an array by copying the elements by reference.
        * @param src Array to copy
        * @returns Copy
        */
        export function shallowCopy<T>(src: T[]): T[];
        /**
        * Copies an array deeply.
        * @param src Array to copy
        * @returns Copy
        */
        export function deepCopy<T>(src: T[]): T[];
        /**
        * Copies an array deeply into a target array.
        * @param src Array to copy
        * @param src Target array to copy into
        */
        export function deepCopyInto<T>(src: T[], target: T[]): void;
        /**
        * Applies an mapping function to all elements in an array and sets them in a targetArray without extra array allocation.
        * @param array Array loop over
        * @param fn Async function to apply
        */
        export function mapInto<S, T>(src: S[], target: T[], fn: (el: S, i: number) => T, startIndex?: number): void;
        /**
        * Applies an async function to all elements in an array and returns a resulting array
        * @param array Array loop over
        * @param fn Async function to apply
        * @param inParallel (Optional) option to execute functions in parallel or serially
        * @returns the flattened arrays
        */
        export function mapAsync<S, T>(src: S[], fn: (el: S, i: number) => PromiseLike<T>, inParallel?: boolean): Promise<T[]>;
        /**
        * Applies an async function to all elements in an array
        * @param array Array loop over
        * @param fn Async function to apply
        * @param inParallel (Optional) option to execute functions in parallel or serially
        */
        export function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel?: boolean): Promise<void>;
        /**
        * Applies a function to a subset of an array.
        * @param src Array to loop over
        * @param filter Filter function to apply to the array
        * @param fn Function to apply to each element in the subset
        */
        export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
        /**
        * Applies a function to the elements of an array until a condition is met.
        * @param src Array to loop over
        * @param fn Function to apply, if the function returns true, the loop will break.
        */
        export function until<T>(src: T[], fn: (el: T, i: number) => void, startIndex?: number): void;
        /**
        * Applies a function to the elements of an array until a condition is met.
        * @param src Array to loop over
        * @param test Test function. Returning true will break the loop.
        * @param fn Function to apply
        */
        export function until<T>(src: T[], test: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
        /**
        * Test if all elements in an array fullfils a condition
        * @param src Array to test
        * @param test Function to test against each elements
        */
        export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
        /**
        * Searches a sorted array and returns the index of the found element or -1.
        * @param src Sorted array to search
        * @param cmp Comparer function that returns negative if it is below and positive if above and 0 if its a match 
        * @returns index of matching element or -1
        */
        export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
        /**
        * Creates an array and populates it based on a function.
        * @param length Length of new array
        * @param populator Function that returns the new value, given the index
        * @returns New array
        */
        export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[];
        type zipFn<S, T, U, V = undefined, W = undefined> = (i: number, a: S, b: T, c?: V, d?: W) => U;
        /**
        * Transforms two or more arrays of max length N into one array of length N
        * @param a Input array
        * @param b Input array
        * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b]
        * @returns The new array
        */
        export function zip<S, T, U = [S, T], V = undefined, W = undefined>(
            a: S[],
            b: T[],
            fn?: zipFn<S, T, U, V, W>,
            c?: undefined,
            d?: undefined,
        ): U[];
        /**
        * Transforms two or more arrays of max length N into one array of length N
        * @param a Input array
        * @param b Input array
        * @param c Input array
        * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b, c]
        * @returns The new array
        */
        export function zip<S, T, V, U = [S, T, V], W = undefined>(
            a: S[],
            b: T[],
            c: V[],
            fn?: zipFn<S, T, U, V, W>,
            d?: undefined,
        ): U[];
        /**
        * Transforms two or more arrays of min length N into one array of length N
        * @param a Input array
        * @param b Input array
        * @param c Input array
        * @param d Input array
        * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b, c, d]
        * @returns The new array
        */
        export function zip<S, T, V, W, U = [S, T, V, W]>(
            a: S[],
            b: T[],
            c: V[],
            d: W[],
            fn?: zipFn<S, T, U, V, W>,
        ): U[];
        /**
        * Transforms an array of length N into a tuple of two arrays of length N.
        * @param arr Array to transform
        * @param fn Function that takes value and index and returns a tuple. Default will try and treat the value as a tuple of [a, b].
        * @returns A tuple of the two new arrays
        */
        export function unzip<S, T, U = [S, T]>(arr: U[], fn?: (u: U, i?: number, out?: [S, T]) => [S, T]): [S[], T[]];
        /**
        * Pivots a two dimensional array.
        * @param arr Array pivot
        * @returns The pivoted two dimensional array
        */
        export function pivot<S = any, T extends S[] = S[]>(arr: T[]): S[][];
        /**
        * Deserializes an array into an array of Objects of given types.
        * @param array Data to deserialize
        * @param target Array to place the deserialized data into
        * @param types List of constructors of classes that the data is deserializes to. Only the first will be used for the array data and any subsequent constructors are passed into future deserializers of the supplied classes.
        * @returns an array of the deserialized data
        */
        export function deserialize<S>(array: any[], target: S[], ...types: Array<Constructor<any>>): S[];
        type Descriminator<T> = (el: T) => boolean;
        /**
        * Splits an array into N buckets (arrays) based on N-1 descriminator functions.
        * @param array Array to split
        * @param desciminators N-1 functions that returns true if a value belongs to a bucket.
        * @returns a tuple with N arrays where ich array contains the elements matched by the matching deciminator function.
        */
        export function bucket<T>(array: T[], ...desciminators: Array<Descriminator<T>>): T[][];
        /**
        * Splits an array into two separate arrays bases on a descriminator function.
        * @param array Array to split
        * @param isA A function that returns true for the elements to put in the first result array.
        * @returns a tuple with two arrays, the first containing the elements matched by the deciminator function.
        */
        export function split<T>(array: T[], isA: Descriminator<T>): [T[], T[]];
        /**
        * Removes any duplicates from an array.
        * @param array Array to process
        * @param hashFn (Optional) Function to provide a hash for each value.
        * @returns a new array without duplicates
        */
        export function distinct<T>(array: T[], hashFn?: (el: T) => string): T[];
        export function concat(...arrs: any[]): any[];
        export function slice<T>(src: T[], pos?: number, count?: number): T[];
        export function splice<T>(src: T[], pos?: number, remove?: number, insert?: T[]): void;
        export function removeAt<T>(arr: T[], index: number): T | undefined;
        export function indexOfElement(src: any[], el: any): number;
        export function remove(arr: any[], el: any): void;
        export function find<T>(src: T[], fn: (el: T) => boolean): T | undefined;
        export function removeOneByFn<T>(arr: T[], fn: (el: T) => boolean): void;
        export function shallowCopyInto<T>(src: T[], target: T[]): void;
        export function shallowFill<T>(src: T[], target: T[], at?: number): void;
        export function deepFill<T>(src: T[], target: T[], at?: number): void;
        export function filter<T>(src: T[], fn: (el: T, i: number) => boolean): T[];
        export function filterInto<T>(src: T[], target: T[], fn: (el: T, i: number) => boolean): void;
        export function map<S, T>(src: S[], fn: (el: S, i: number) => T, startIndex?: number): T[];
        export function reduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U, pos?: number, to?: number): U;
        export function reduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T, pos?: number, to?: number) => boolean, start: U): U;
        export function reverseReduce<T, U>(src: T[], fn: (acc: U, cur: T) => U, start: U): U;
        export function reverseReduceUntil<T, U>(src: T[], fn: (acc: U, cur: T) => U, test: (acc: U, cur: T) => boolean, start: U): U;
        export function forEach<T>(src: T[], fn: (el: T, i: number) => any, startIndex?: number): void;
        export function reverseForEach<T>(src: T[], fn: (el: T, i: number) => any): void;
        export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => void): void;
        export function reverseUntil<T>(src: T[], fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number) => void): void;
        export function some<T>(src: T[], fn: (el: T) => boolean): boolean;
        export function insertAt<T>(src: T[], pos: number, v: T): void;
        export function toLookup<T>(a: Array<T>, hashFn?: (el: T) => string): Indexable<boolean>;
        export function difference<T, S = T>(a: Array<T>, b: Array<S>, hashFn?: (el: T | S) => string): [T[] , S[]];
        export function intersect<T, S = T>(a: Array<T>, b: Array<S>, hashFn?: (el: T | S) => string): Array<T>;
        export function union<T, S = T>(a: Array<T>, b: Array<S>, hashFn?: (el: T | S) => string): Array<T | S>;
        export function subtract<T, S = T>(a: Array<T>, b: Array<S>, hashFn?: (el: T | S) => string): Array<T>;
    
    }

    /**
    * Functions that loops over, transform or act on objects
    */
    export namespace Obj {
        /**
        * Calles the destroy function on any IDestroyable or sets all properties to null on other objects.
        * @param obj Object to destroy.
        */
        export function destroy(obj: Object): void;
        /**
        * Deletes all properties of an object.
        * @param obj Object to wipe.
        */
        export function wipe(obj: Object): void;
        /**
        * Sets all properties of an object to null
        * @param obj Object to null.
        */
        export function setNull(obj: Object): void;
        /**
        * Test if an object is of a class inheriting from another objects class or of the same class
        * @param a Object to test.
        * @param b Object to test against.
        * @returns true if A inherits B or if A == B
        */
        export function isClassOf(a: Object, b: Object): boolean;
        /**
        * Test if an object is of the same class as another object
        * @param a Object to test.
        * @param b Object to test against.
        * @returns true if a and b is of the same class
        */
        export function isSameClass(a: Object, b: Object): boolean;
        /**
        * Test if an object is of a class inheriting from another objects class but not the same class
        * @param a Object to test.
        * @param b Object to test against.
        * @returns true if A inherits B
        */
        export function inherits(a: Object, b: Object): boolean;
        /**
        * Test if two objects are equal, deeply
        * @param a Object to test.
        * @param b Object to test against.
        * @returns true if a deeply equals b
        */
        export function equals(a: any, b: any): boolean;
        /**
        * Test if two objects are different, deeply
        * @param a Object to test.
        * @param b Object to test against.
        * @returns true if a differs from b
        */
        export function isDifferent(a: any, b: any): boolean;
        /**
        * Copys an object by copying its properties by reference
        * @param obj Object to copy
        * @returns a shallow copy of obj
        */
        export function shallowCopy<T, K extends keyof T>(obj: T): { [P in K]: T[P] };
        /**
        * Copys an object deeply
        * @param obj Object to copy
        * @returns a deep copy of obj
        */
        export function clone<T>(obj: T): T;
        /**
        * Copys an object deeply into a target object
        * @param src Object to copy
        * @param target Target to copy the properties of src into
        * @returns target
        */
        export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
        /**
        * Adds the properties of a number of objects onto a target object
        * @param target The target object to apply properites to
        * @param exclude An object with properties whos names will not be copied from sources to target
        * @param sources List of objects to take properties from
        * @returns the total of target and sources
        */
        export function mixin(target: Indexable<any>, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): Indexable<any>;
        /**
        * Sets the property values of a source object to the properties of a target object. Possibly limiting to non undefined properties in the target.
        * @param target Target to apply values to
        * @param values Values to apply to target
        * @param mapping (Optional) property name transformation map
        * @param limitToExisting (Optional) Limit the properties being set to those that have non undefined values in target
        */
        export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting?: boolean): void;
        /**
        * Applies a function to all the properties of an object. Returning false will end the loop.
        * @param target Target object to loop over
        * @param fn Function to apply to each property. Returning false will end the loop
        */
        export function forEach<T>(
            target: Indexable<T> | T[],
            fn: (value: T, key: string) => boolean | void,
        ): void;
        // tslint:disable-next-line:max-line-length
        /**
        * Transforms an object to another object. Much like a reduce does on arrays.
        * @param target Input object.
        * @param fn Function to apply to each property. Returning false will end the transform. Mutations to the result argument is propagated to the next iteration.
        * @param accumulator (Optional) Object to alter using the transform function. Default is an instance of the target objects type.
        * @returns The last result argument.
        */
        export function transform<T extends { [index: string]: any }, S = {}, U = any>(target: T | U[], fn: (result: S, value: any, key: string) => boolean | void, accumulator?: S): S;
        /**
        * Creates an object with the propeties that are different between the target and the base object.
        * @param target Object to compare with.
        * @param base Object to compare against.
        * @returns An object of the targets type with the properties of target where those are different from the same properties in base.
        */
        export function difference<T extends { [index: string]: any }, S extends { [index: string]: any } = T>(target: T, base: S): T;
    }
    export interface IObjectWithFunctions<T extends Object | void> {
        [key: string]: (...args: any[]) => T;
    }

    interface IDebounceOptions {
        leading: boolean;
    }
    //@ts-ignore TS2304
    type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ?
        PromiseLike<S> :
        T extends (...a: unknown[]) => infer R ?
        U extends { leading: true } ?
        R :
        PromiseLike<R>
        : never;
    //@ts-ignore TS2304
    interface IDebouncedFunction<T, U> {
        (...args: ArgTypes<T>): DebounceResultType<T, U>;
        //@ts-ignore TS2304
        resetTimer?(): void;
    }
    interface IThrottleOptions {
        leading: boolean;
        trailing: boolean;
    }
    type IThrottledFunction<T> = (...args: ArgTypes<T>) => ResultType<T>;
    /**
    * Utility functions to make your life full of sunshine
    */
    export namespace Util {
        export class LoggableCounter {
            public name: string;
            public log(): void;
            public inc(): LoggableCounter;
            public reset(): LoggableCounter;
            valueOf(): number;
            toString(): string;
        }
        /**
        * Gets an instance of a LoggableCounter.
        * @param key (Optional) name of the counter.
        * @returns LoggableCounter.
        */
        export function counter(key?: number | string): LoggableCounter;
        /**
        * Increases a counter with a given name by 1.
        * @param key (Optional) name of the counter.
        * @returns LoggableCounter.
        */
        export function count(key?: number | string): LoggableCounter;
        /**
        * Wraps a function so that it only runs once.
        * @param fn Function to wrap
        * @returns A wrapped function that will only execute once.
        */
        export function once<T extends (...args: any[]) => S, S = void>(fn: T): T;
        export function deprecate<T extends Function>(instead: string, fn: T): T;
        export function init(win?: Window): void;
        /**
        * Gets a new Date object with a delta. Not as exact as a Time library like moment.
        * @param delta (Optional) Delta in the form of "+1Y2M3d4h5m6s" e.g "-4d" for negative 4 days. Default is 0.
        * @param start (Optional) Start Date to add delta to. Default is now.
        * @returns A new Date.
        */
        export function getDate(delta?: string, start?: Date): Date;
        /**
        * Creates a reasonably unique UUID that conforms to to the standard UUID format.
        * @returns a UUID string.
        */
        export function newUUID(): string;
        /**
        * Creates a global integer counter and returns the next value.
        * @param key (Optional) name of counter.
        * @returns new integer.
        */
        export function newInt(key?: number | string): number;
        export class AssertError extends Error { }
        /**
        * Asserts that a boolean expression is true or throws an exception with a given message.
        * @param assertion Boolean expression to test.
        * @param message (Optional) message to show if assertion fails.
        * @param noThrow (Optional) turns the exception into a console.error if set to true.
        * @returns the value of the assertion.
        */
        export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
        // tslint:disable-next-line:max-line-length
        /**
        * Executes a function X times.
        * @param count Number of times to loop.
        * @param fn Function to execute on each loop.
        */
        export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
        /**
        * Turns an arraylike object into a proper array.
        * @param arr ArrayLike to transform.
        * @returns A new array.
        */
        export function toArray<T>(arr: ArrayLike<T>): T[];
        /**
        * Debounces a function, meaning that it delays execution until no other calls has been made to that function for a specified time.
        * @param method Function to debounce
        * @param duration Duration to debounce
        * @param options Options object to configure if the debounced function should also trigger on the leading call.
        * @returns The new debounced function.
        */
        export function debounce<T extends (...args: any[]) => any, U extends Partial<IDebounceOptions>>(
            method: T,
            duration: number,
            options?: U,
        ): IDebouncedFunction<T, U>;
        /**
        * Throttles a function, meaning that it delays execution until atleast a specified time has passed.
        * @param method Function to throttle
        * @param duration Duration to throttle
        * @param options Options object to configure if the throttled function should also trigger on the leading call and/or trailing the last timeout.
        * @returns The new throttled function.
        */
        export function throttle<T extends (...args: any[]) => any>(
            method: T,
            duration?: number,
            options?: Partial<IThrottleOptions>,
        ): IThrottledFunction<T>;
        export function init(win?: Window): void;
        export function callDebugger(): void;
        export function pipeOut(
            log?: ((...args: any[]) => void) | null,
            warn?: ((...args: any[]) => void) | null,
            error?: ((...args: any[]) => void) | null,
            catchDefault?: boolean | { log?: boolean, warn?: boolean, error: boolean },
        ): void;
        // tslint:disable-next-line:max-line-length
        export function proxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends (any | IObjectWithFunctions<S>)>(objOrClass: U, fnName: string, proxyFn: (originalFn: (...args: any[]) => S | V, ...args: any[]) => void): void;
    }
    /**
    * Functions that test if a value is what you hope it is
    */
    export namespace Test {
        export class Env {
            public static useNative?: boolean;
            public static isOpera(): boolean;
            public static isFirefox(): boolean;
            public static isSafari(): boolean;
            public static isIE(): boolean;
            public static isEdge(): boolean;
            public static isChrome(): boolean;
            public static isBlink(): boolean;
        }
        export function hasWindow(): boolean;
        export function hasConsole(): boolean;
        /**
        * Tests if the argument is an Object (most non-values are).
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isObject(it: any): boolean;
        /**
        * Tests if the argument is an Array.
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isArray(it: any): boolean;
        /**
        * Tests if the argument is an Element.
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isElement(target: any): boolean;
        /**
        * Tests if the argument is a function.
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isFunction(it: any): boolean;
        /**
        * Tests if the argument is a number. (Strings with numbers are not numbers.)
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isNumber(x: any): boolean;
        /**
        * Tests if the argument is an integer.
        * @param it Argument to test.
        * @returns true if it is.
        */
        export function isInt(x: any): boolean;
        /**
        * Tests if the argument is a string.
        * @param it Argument to test.
        * @returns true if it is.
        */
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

    /**
    * Simple and precise Timer, can be used statically or as an instance.
    */
    export class Timer {
        /**
        * (readonly) The last measured time for this timer. The same as Stop() returns.
        */
        static readonly time: number;
        /**
        * Get the current precition date time value in ms
        */
        static now(): number;
        /**
        * Starts the timer
        * @returns the current time in ms
        */
        static start(): number;
        /**
        * Stops the timer and records the delta between start and stop
        * @returns The delta between start and stop in ms
        */
        static stop(): number;
        /**
        * (readonly) The last measured time for this timer. The same as Stop() returns.
        */
        readonly time: number;
        /**
        * Get the current precition date time value in ms
        * @returns the current time in ms
        */
        now(): number;
        /**
        * Starts the timer
        * @returns the current time in ms
        */
        start(): number;
        /**
        * Stops the timer and records the delta between start and stop
        * @returns The delta between start and stop in ms
        */
        stop(): number;
    }

    export class Uri {
        hash: string;
        page: string;
        pathName: string;
        directory: string;
        port: string;
        hostName: string;
        protocol: string;
        origin: string;
        full: string;
        args: Indexable<string>;
        constructor(url?: string);
        init(): void;
    }

    export function Poolable<S>(_constructor?: ICtor<S>): ICtor<S & IPoolable>;
    export function Initable<S>(_constructor?: ICtor<S>): ICtor<S & IInitable>;

    export class Pool<T> {
        readonly available: number;
        readonly size: number;
        constructor(cls: ICtor<T>, growthStep?: number);
        // tslint:disable-next-line:no-reserved-keywords
        get(): T & IPoolable;
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
        export function numericArray(length: number, dataType?: MocDataType): number[];
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
        endInclusive?: boolean;
    }
    export namespace Decorators {
        // tslint:disable-next-line:max-line-length
        export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
            configurable: boolean;
            enumerable: boolean | undefined;
            // tslint:disable-next-line:no-reserved-keywords
            get: () => any;
        };
        // tslint:disable-next-line:max-line-length
        export function throttled<S>(duration?: number, options?: Partial<IThrottleOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
            configurable: boolean;
            enumerable: boolean | undefined;
            // tslint:disable-next-line:no-reserved-keywords
            get: () => any;
        };
        export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
        export function deprecated<S>(instead?: string, message?: string):
            (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        export function asserts<S>(assertFn: Function, result?: any):
            (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        export function before<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        export function after<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        // tslint:disable-next-line:max-line-length
        export function provided<S>(condition: (name: string, ...args: any[]) => boolean): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        export let async: {
            <S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
            // tslint:disable-next-line:max-line-length
            before?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
            // tslint:disable-next-line:max-line-length
            after?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
            // tslint:disable-next-line:max-line-length
            provided?<S>(async_predicate: (...args: any[]) => Promise<boolean>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
        };
    }
}
