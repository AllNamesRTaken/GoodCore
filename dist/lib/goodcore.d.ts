type Constructor = new (...args: any[]) => object;
interface ICtor<T> { new (...args: any[]): T }

type AnyObject<T> = {
  [key: string]: any;
  constructor: ICtor<T>;
}

interface IPool<T extends IPoolable> {
  Get(): T;
  Release(obj: T): void;
}
interface IPoolable {
  __pool__: IPool<IPoolable>;
  Release(): void;
  InitPool(pool: IPool<IPoolable>): void;
}
interface ICloneable<T> {
  Clone(): T;
}
interface IInitable<T> {
  Init(obj: Object): any;
}
interface IList<T> {
  Values: Array<T>;
  Get(pos: number): T;
  Count: number;
  Clear(): IList<T>;
  Add(v: T): IList<T>;
  Push(v: T): number;
  Pop(): T;
  Shift(): T;
  Concat(v: Array<T> | IList<T>): IList<T>;
  Append(v: Array<T> | IList<T>): void;
  Copy(src: IList<T> | Array<T>): IList<T>;
  ShallowCopy(src: IList<T> | Array<T>): IList<T>;
  Clone(): IList<T>;
  Remove(v: T): IList<T>;
  RemoveAt(n: number): IList<T>;
  ForEach(fn: (el: T, i?: number) => any): IList<T>;
  Until(fn: (el: T, i?: number) => boolean): IList<T>;
  Some(filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): IList<T>;
  IndexOf(v: T): number;
  Contains(v: T): boolean;
  Reverse(): IList<T>;
  Select(fn: (el: T) => boolean): IList<T>;
  SelectInto(src: IList<T> | Array<T>, fn: (el: T) => boolean): IList<T>;
  OrderBy(fn: (a: T, b: T) => number): IList<T>;
  Map<S>(fn: (el: T, i?: number) => S): IList<S>;
  MapInto(src: IList<any> | Array<any>, fn: (el: any, i?: number) => any): IList<T>;
  Reduce(fn: (acc: any, cur: T) => any, start?: any): any;
  Equals(b: IList<T>): boolean;
}
interface ITreeNode<T> {
  Id: string;
  Parent: ITreeNode<T>;
  Children: IList<ITreeNode<T>>;
  Data: T;
}
// Generated by dts-bundle v0.7.2

declare module 'goodcore' {
    export { default as Vec2 } from "goodcore/struct/Vec2";
    export { default as Range2 } from "goodcore/struct/Range2";
    export { default as Rect } from "goodcore/struct/Rect";
    export { default as List } from "goodcore/struct/List";
    export { default as Dictionary } from "goodcore/struct/Dictionary";
    export { default as Stack } from "goodcore/struct/Stack";
    export { Tree as Tree } from "goodcore/struct/Tree";
    export { default as Calc } from "goodcore/Calc";
    export { Dom as Dom } from "goodcore/Dom";
    export { Arr as Arr } from "goodcore/Arr";
    export { Obj as Obj } from "goodcore/Obj";
    export { Util as Util } from "goodcore/Util";
    export { Timer as Timer } from "goodcore/Timer";
    export { Uri as Uri } from "goodcore/Uri";
    export { default as Poolable } from "goodcore/standard/mixins/Poolable";
    export { default as Initable } from "goodcore/standard/mixins/Initable";
    export { default as Pool } from "goodcore/standard/Pool";
    export { default as Integrate } from "goodcore/Integration";
    export { MocData as MocData } from "goodcore/MocData";
    export { Cache as Cache } from "goodcore/standard/Cache";
}

declare module 'goodcore/struct/Vec2' {
    export default class Vec2 {
        x: number;
        y: number;
        static EPSILON: number;
        static IDENTITY: Vec2;
        static X_DIM: Vec2;
        static Y_DIM: Vec2;
        constructor(x?: number, y?: number);
        Set(src: Vec2): Vec2;
        Clone(out?: Vec2): Vec2;
        ToInt(): Vec2;
        Ceil(): Vec2;
        ToDecimal(): Vec2;
        LengthSq(): number;
        Length(): number;
        HorizontalAngle(): number;
        Rotate(angle: number): Vec2;
        RotateAround(center: Vec2, angle: number): Vec2;
        Normalize(): Vec2;
        Scale(vectorB: Vec2): Vec2;
        Relate(vectorB: Vec2): Vec2;
        Multiply(scalar: number): Vec2;
        Add(vectorB: Vec2): Vec2;
        Subtract(vectorB: Vec2): Vec2;
        Invert(): void;
        Equals(target: Vec2): boolean;
        AlmostEquals(target: Vec2): boolean;
        GetNormal(isNormalized?: boolean): Vec2;
        Dot(vectorB: Vec2): number;
        Cross(vectorB: Vec2): number;
        ProjectOnto(vectorB: Vec2): Vec2;
        VerticalAngle(): number;
        Angle: () => number;
        Direction: () => number;
        RotateBy(rotation: number): Vec2;
    }
}

declare module 'goodcore/struct/Range2' {
    import Vec2 from "goodcore/struct/Vec2";
    import Rect from "goodcore/struct/Rect";
    export default class Range2 {
        pos: Vec2;
        size: Vec2;
        constructor(x?: number, y?: number, w?: number, h?: number);
        Set(src: Range2): Range2;
        Clone(out?: Range2): Range2;
        ToRect(endInclusive?: boolean): Rect;
        Scale(factor: Vec2, keepCenter?: boolean): Range2;
        Translate(system: Vec2): Range2;
        ToInt(): Range2;
        ToDecimal(): Range2;
        Contains(vec: Vec2): boolean;
        First(fn: (p: Vec2) => boolean): Vec2;
        ForEach(fn: (p: Vec2) => boolean, start?: Vec2): void;
        Equals(range: Range2): boolean;
    }
}

declare module 'goodcore/struct/Rect' {
    import Vec2 from "goodcore/struct/Vec2";
    import Range2 from "goodcore/struct/Range2";
    export default class Rect {
        start: Vec2;
        stop: Vec2;
        endInclusive: boolean;
        constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
        Set(src: Rect): Rect;
        Clone(out?: Rect): Rect;
        ToRange2(): Range2;
        Scale(factor: Vec2, keepCenter?: boolean): Rect;
        Translate(system: Vec2): Rect;
        Equals(rect: Rect): boolean;
        ToInt(): Rect;
        ToDecimal(): Rect;
        Area(): number;
        Move(vec: Vec2): Rect;
    }
}

declare module 'goodcore/struct/List' {
    export default class List<T> implements IList<T> {
        constructor(arr?: Array<T> | List<T>);
        readonly Values: Array<T>;
        Get(pos: number): T;
        readonly Count: number;
        Clear(): List<T>;
        Add(v: T): List<T>;
        InsertAt(pos: number, v: T): List<T>;
        Push(v: T): number;
        Pop(): T;
        Shift(): T;
        Concat(v: Array<T> | List<T>): List<T>;
        Append(v: Array<T> | List<T>): List<T>;
        Copy(src: List<T> | Array<T>): List<T>;
        ShallowCopy(src: List<T> | Array<T>): List<T>;
        Clone(): List<T>;
        Remove(v: T): List<T>;
        RemoveAt(n: number): List<T>;
        ForEach(fn: (el: T, i?: number) => any): List<T>;
        Until(fn: (el: T, i?: number) => boolean): List<T>;
        Some(filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): List<T>;
        IndexOf(v: T): number;
        Contains(v: T): boolean;
        Reverse(): List<T>;
        Select(fn: (el: T, i?: number) => boolean): List<T>;
        SelectInto(src: List<T> | Array<T>, fn: (el: T, i?: number) => boolean): List<T>;
        OrderBy(fn: (a: T, b: T) => number): List<T>;
        Map<S>(fn: (el: T, i?: number) => S): List<S>;
        MapInto(src: List<any> | Array<any>, fn: (el: any, i?: number) => any): List<T>;
        Reduce(fn: (acc: any, cur: T) => any, start?: any): any;
        Equals(b: List<T>): boolean;
    }
}

declare module 'goodcore/struct/Dictionary' {
    import List from "goodcore/struct/List";
    export default class Dictionary<T> {
        constructor();
        Has(key: string): boolean;
        Get(key: string): T;
        Set(key: string, value: T): Dictionary<T>;
        Delete(key: string): Dictionary<T>;
        Clear(): Dictionary<T>;
        readonly Values: Array<T>;
        readonly Keys: Array<string>;
        readonly List: List<T>;
    }
}

declare module 'goodcore/struct/Stack' {
    import List from "goodcore/struct/List";
    export default class Stack<T> {
        readonly Values: Array<T>;
        readonly Depth: number;
        constructor(size?: number);
        Push(obj: T): void;
        Pop(): T;
        ToList(): List<T>;
    }
}

declare module 'goodcore/struct/Tree' {
    import List from "goodcore/struct/List";
    export class BaseTree<T> implements ITreeNode<T> {
        Id: string;
        Parent: Tree<T>;
        Children: List<Tree<T>>;
        Data: T;
    }
    export const _InitableTree: typeof BaseTree & ICtor<IInitable<typeof BaseTree>>;
    export class Tree<T> extends _InitableTree<T> implements ICloneable<ITreeNode<T>> {
        static FromObject<T>(obj: any): Tree<T>;
        constructor();
        InsertAt(pos: number, data: T): void;
        Add(data: T): void;
        Remove(): void;
        Prune(): Tree<T>;
        Reduce(fn: (acc: any, cur: T) => any, start?: any): any;
        Clone(): Tree<T>;
        Filter(condition: (node: ITreeNode<T>) => boolean): Tree<T>;
        Select(condition?: (node: ITreeNode<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
        Find(condition: (data: T) => boolean): ITreeNode<T>;
        Contains(condition: (data: T) => boolean): boolean;
    }
}

declare module 'goodcore/Calc' {
    export default class _Calc {
        static ROTATION_DEGREE_PRECISION: number;
        static RADIAN_FACTOR: number;
        static DEGREE_FACTOR: number;
        static DEG360: number;
        static ROTATION_LOOKUP: Array<Array<number>>;
        _(): _Calc;
        constructor();
        Sign(x: number): number;
        RotationDeg(rotation: number): Array<number>;
        RotationRad(rotation: number): Array<number>;
        ClosestRadianRotation(rotation: number): number;
    }
    export var Calc: _Calc;
}

declare module 'goodcore/Dom' {
    export enum Sides {
        Top = 0,
        Bottom = 1,
        Left = 2,
        Right = 3,
    }
    export class _Dom {
        Sides: typeof Sides;
        _(win: Window): _Dom;
        constructor(win: Window);
        Init(win: Window): void;
        ToArray<T>(a: ArrayLike<T>): Array<T>;
        Create(html: string, attr?: any): HTMLElement;
        OuterHTML(el: HTMLElement): string;
        SetAttr(_el: HTMLElement | String, attr: any): void;
        Remove(element: Element): HTMLElement;
        Replace(src: HTMLElement, target: HTMLElement): HTMLElement;
        Clear(element: Element): void;
        Get(id: string): HTMLElement;
        Find(selector: string): HTMLElement;
        FindAll(selector: string, root?: HTMLElement): Element[];
        Children(root: HTMLElement, selector?: string): Element[];
        Position(el: HTMLElement, x: number, y: number): void;
        Is(selector: string, element: HTMLElement): boolean;
        SetStylesExplicitly(element: HTMLElement, ...styles: Array<string>): void;
    }
    export var Dom: _Dom;
}

declare module 'goodcore/Arr' {
    export class _Array {
        _(): _Array;
        constructor();
        Flatten(src: Array<any>): Array<any>;
        Reverse(array: Array<any>): void;
        Concat(...arrs: Array<any>): Array<any>;
        Slice<T>(src: Array<T>, from?: number, count?: number): Array<T>;
        Append<T>(arr: Array<T>, values: Array<T>): void;
        RemoveOneAt(arr: Array<any>, index: number): void;
        IndexOfElement(src: Array<any>, el: any): number;
        RemoveOneByElement(arr: Array<any>, el: any): void;
        IndexOf(src: Array<any>, fn: (el: any) => boolean): number;
        RemoveOneByFn(arr: Array<any>, fn: (el: any) => boolean): void;
        ShallowCopy<T>(src: Array<T>): Array<T>;
        ShallowCopyInto<T>(src: Array<T>, target: Array<T>): void;
        ShallowFill<T>(src: Array<T>, target: Array<T>, at?: number): void;
        DeepCopy<T>(src: Array<T>): Array<T>;
        DeepCopyInto<T>(src: Array<T>, target: Array<T>): void;
        DeepFill<T>(src: Array<T>, target: Array<T>, at?: number): void;
        Filter<T>(src: Array<T>, fn: (el: T, i?: number) => boolean): Array<T>;
        FilterInto<T>(src: Array<T>, target: Array<T>, fn: (el: T, i?: number) => boolean): void;
        Map<T>(src: Array<T>, fn: (el: T, i?: number) => any): Array<any>;
        MapInto<T>(src: Array<any>, target: Array<T>, fn: (el: T, i?: number) => T): void;
        Reduce<T>(src: Array<T>, fn: (acc: any | number, cur: T) => any | number, start?: any | number): any | number;
        ForEach<T>(src: Array<T>, fn: (el: T, i?: number) => any): void;
        Until<T>(src: Array<T>, fn: (el: T, i?: number) => boolean): void;
        Some<T>(src: Array<T>, filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void;
        InsertAt<T>(src: Array<T>, pos: number, v: T): void;
    }
    export var Arr: _Array;
}

declare module 'goodcore/Obj' {
    export class _Obj {
        _(): _Obj;
        constructor();
        Destroy(obj: any): void;
        Wipe(obj: any): void;
        Null(obj: any): void;
        IsNullOrUndefined(...args: any[]): boolean;
        IsNotNullOrUndefined(...args: any[]): boolean;
        IsClassOf(a: any, b: any): boolean;
        IsSameClass(a: any, b: any): boolean;
        Inherits(a: any, b: any): boolean;
        Equals(a: any, b: any): boolean;
        IsDifferent(a: any, b: any): boolean;
        ShallowCopy(obj: any): any;
        Clone<T>(obj: T): T;
        CloneInto<T, S>(src: T | Array<S>, target: T | Array<S>): T | Array<S>;
        Mixin(target: any, exclude: any, ...sources: Array<any>): any;
        SetProperties(target: any, values: any): void;
    }
    export var Obj: _Obj;
}

declare module 'goodcore/Util' {
    export interface IZeroEvent extends Event {
        data: string;
    }
    export type ObjectWithFunctions<T extends Object | void> = {
        [key: string]: (...args: any[]) => T;
    };
    export class _Util {
        _(win?: Window): _Util;
        constructor(win?: Window);
        Init(win?: Window): void;
        readonly HasWindow: boolean;
        readonly HasConsole: boolean;
        ToArray<T>(arr: ArrayLike<T>): Array<T>;
        IsArray(it: any): boolean;
        IsElement(target: any): boolean;
        IsFunction(it: any): boolean;
        GetFunctionName(fn: Function): string;
        GetFunctionCode(fn: Function): string;
        NewUUID(): string;
        NewInt(): number;
        Debugger(): void;
        PipeOut(log: (...args: Array<any>) => void, warn: (...args: Array<any>) => void, error: (...args: Array<any>) => void): void;
        Assert(assertion: boolean, message: string, isDebug?: boolean): boolean;
        ProxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends ObjectWithFunctions<S>>(that: U, fnName: string, proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void, onPrototype?: boolean): void;
        Md5(str: string): string;
        Async: (fn: Function) => void;
    }
    export var Util: _Util;
}

declare module 'goodcore/Timer' {
    export class _Timer {
        _(): _Timer;
        readonly Time: number;
        constructor();
        Now(): number;
        Start(): number;
        Stop(): number;
    }
    export var Timer: _Timer;
}

declare module 'goodcore/Uri' {
    export class _Uri {
        _(win: Window): _Uri;
        hash: string;
        pathName: string;
        port: string;
        hostName: string;
        protocol: string;
        origin: string;
        full: string;
        args: any;
        constructor(win: Window);
        Init(win: Window): void;
    }
    export var Uri: _Uri;
}

declare module 'goodcore/standard/mixins/Poolable' {
    export default function Poolable<T extends Constructor>(Base: T): T & ICtor<IPoolable>;
}

declare module 'goodcore/standard/mixins/Initable' {
    export default function Initable<T extends Constructor>(Base: T): T & ICtor<IInitable<T>>;
}

declare module 'goodcore/standard/Pool' {
    export default class Pool<T extends IPoolable> implements IPool<IPoolable> {
        readonly Available: number;
        readonly Size: number;
        constructor(cls: ICtor<T>, growthStep?: number);
        Get(): T;
        Release(obj: T): void;
    }
}

declare module 'goodcore/Integration' {
    export default function Integrate(alias?: string, win?: Window): void;
}

declare module 'goodcore/MocData' {
    export enum MocDataType {
        LinearInt = 0,
        RandomInt = 1,
        LinearFloat = 2,
        RandomFloat = 3,
    }
    export class _MocData {
        Type: typeof MocDataType;
        _(): _MocData;
        constructor();
        static VALID_CHARS: string;
        RandomString(length?: number): string;
        RandomInt(): number;
        RandomNumber(): number;
        NumericArray(length: number, type?: MocDataType): number[];
        StringArray(arrayLength: number, stringLength?: number): string[];
    }
    export var MocData: _MocData;
}

declare module 'goodcore/standard/Cache' {
    export class BaseCacheObject<T> {
        Key: string;
        Data: T;
    }
    export const _InitableCacheObject: typeof BaseCacheObject & ICtor<IInitable<typeof BaseCacheObject>>;
    export class CacheObject<T> extends _InitableCacheObject<T> {
    }
    export class Cache<T> {
        static DEFAULT_FIFO_SIZE: number;
        Size: number;
        readonly Count: number;
        readonly StageCount: number;
        constructor(size?: number);
        Hit(key: string): boolean;
        Get(key: string): T;
        Push(key: string, data: T): void;
        GetStaged(key: string): T;
        Stage(key: string, data: T): void;
        Publish(key: string): void;
        Remove(key: string): void;
        Cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void;
        Clear(): void;
    }
}
