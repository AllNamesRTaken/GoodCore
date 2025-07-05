import { binarySearch } from "../Arr.js";
import { equals } from "../Obj.js";
import { isFunction, hasWindow } from "../Test.js";
import { List } from "./List.js";
import { once } from "../Util.js";
import type {
  IBasicList,
  ISerializable,
  IDeserializable,
  ICloneable,
  Constructor,
} from "../../@types/index.js";

if (hasWindow() && !(window as any).Symbol) {
  (window as any).Symbol = { iterator: "iterator" };
}

export class Comparer {
  public static StringAsc = function (a: string, b: string) {
    return a < b ? -1 : a === b ? 0 : 1;
  };
  public static StringDesc = function (a: string, b: string) {
    return a < b ? 1 : a === b ? 0 : -1;
  };
  public static NumberAsc = function (a: number, b: number) {
    return a < b ? -1 : a === b ? 0 : 1;
  };
  public static NumberDesc = function (a: number, b: number) {
    return a < b ? 1 : a === b ? 0 : -1;
  };
}
export class SortedList<T = number>
  implements
    IterableIterator<T>,
    IBasicList<T>,
    ISerializable<T[]>,
    IDeserializable<SortedList<T>>,
    ICloneable
{
  private _list: List<T> = new List<T>();
  private _cmp: (a: T, b: T) => number;
  private _pointer: number = 0;

  constructor(
    comparer: (a: T, b: T) => number = (a: T, b: T) =>
      a < b ? -1 : a === b ? 0 : 1,
    arr?: T[] | List<T> | SortedList<T>,
  ) {
    this._cmp = comparer;

    if (arr === undefined) {
      this._list = new List<T>();
    } else {
      if (arr instanceof List || arr instanceof SortedList) {
        this.copy(arr.values);
      } else {
        this.copy(arr);
      }
    }
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
  public next(value?: any): IteratorResult<T> {
    return {
      done: this._pointer >= this.length,
      value:
        this._pointer < this.length
          ? this.values[this._pointer++]
          : ((this._pointer = 0), undefined as any),
    };
  }
  protected create<S = T>(
    comparer?: (a: S, b: S) => number,
    arr?: S[] | List<S> | SortedList<S>,
  ): SortedList<S> {
    return new (this as any).constructor(comparer, arr);
  }
  public get values(): T[] {
    return this._list.values;
  }
  // tslint:disable-next-line:no-reserved-keywords
  public get(pos: number): T | undefined {
    once(() => {
      console.warn(
        "Function SortedList::get is deprecated please use SortedList::read instead. get is a reserved word.",
      );
    });
    return this.read(pos);
  }
  public read(pos: number): T | undefined {
    return this._list.read(pos);
  }
  public get count(): number {
    return this._list.length;
  }
  public get length(): number {
    return this._list.length;
  }
  public get comparer(): (a: T, b: T) => number {
    return this._cmp;
  }
  public set comparer(v: (a: T, b: T) => number) {
    this._cmp = v;
    this.sort();
  }
  public sort() {
    this._list.orderBy(this._cmp);
  }
  public truncate(size: number = 0): this {
    this._list.truncate(size);
    return this;
  }
  public fill(size: number, populator: ((i: number) => T) | T): this {
    this._list.fill(size, populator);
    this.sort();
    return this;
  }
  public clear(): this {
    this._list.clear();
    return this;
  }
  public add(v: T): this {
    let index = this.getInsertIndex(v);
    this._list.insertAt(index, v);
    return this;
  }
  public pop(): T | undefined {
    return this._list.pop();
  }
  public shift(): T | undefined {
    return this._list.shift();
  }
  public bulkAdd(v: T[] | List<T> | SortedList<T>): this {
    if (v instanceof List || v instanceof SortedList) {
      this._list.append(v.values);
    } else {
      this._list.append(v);
    }
    this.sort();
    return this;
  }
  public copy(src: SortedList<T> | List<T> | T[]): this {
    if (src instanceof List || src instanceof SortedList) {
      this._list.copy(src.values);
    } else {
      this._list.copy(src);
    }
    this.sort();
    return this;
  }
  public clone(): this {
    return this.create(this._cmp, this._list.clone()) as this;
  }
  public remove(v: T): this {
    let index = this.indexOf(v);
    if (index !== -1) {
      this._list.removeAt(index);
    }
    return this;
  }
  public removeAt(n: number): T | undefined {
    return this._list.removeAt(n);
  }
  public removeFirst(fn: (el: T) => boolean): T | undefined {
    return this._list.removeFirst(fn);
  }
  public forEach(fn: (el: T, i: number) => any, startIndex: number = 0): this {
    this._list.forEach(fn, startIndex);
    return this;
  }
  public forSome(
    filter: (el: T, i: number) => boolean,
    fn: (el: T, i: number) => any,
  ): this {
    this._list.forSome(filter, fn);
    return this;
  }
  public until(
    fnOrTest: (el: T, i: number) => boolean,
    startIndex?: number,
  ): this;
  public until(
    fnOrTest: (el: T, i: number) => boolean,
    fn: (el: T, i: number) => void,
    startIndex?: number,
  ): this;
  public until(
    fnOrTest: (el: T, i: number) => boolean,
    fn?: ((el: T, i: number) => void) | number,
    startIndex?: number,
  ): this {
    this._list.until(fnOrTest as any, fn as any, startIndex);
    return this;
  }
  public reverseForEach(fn: (el: T, i: number) => any): this {
    this._list.reverseForEach(fn);
    return this;
  }
  public reverseUntil(
    fnOrTest: (el: T, i: number) => boolean,
    fn?: (el: T, i: number) => void,
  ): this {
    this._list.reverseUntil(fnOrTest as any, fn as any);
    return this;
  }
  public some(fn: (el: T) => boolean): boolean {
    return this._list.some(fn);
  }
  public all(fn: (el: T) => boolean): boolean {
    return this._list.all(fn);
  }
  public getInsertIndex(v: T): number {
    return binarySearch(this._list.values, (el: T) => this._cmp(el, v), true);
  }
  public indexOf(v: T | ((el: T) => boolean)): number {
    let result = -1;
    if (v instanceof Function) {
      result = this._list.indexOf(v);
    } else {
      result = binarySearch(
        this._list.values,
        (el: T) => this._cmp(el, v),
        false,
      );
    }
    return result;
  }
  public contains(v: T | ((el: T) => boolean)): boolean {
    return this.indexOf(v) !== -1;
  }
  public first(fn?: (el: T) => boolean): T | undefined {
    return this._list.first(fn);
  }
  public find(fn: (el: T) => boolean): T | undefined {
    return this._list.find(fn);
  }
  public last(): T | undefined {
    return this._list.last();
  }
  public filter(fn: (el: T, i: number) => boolean): this {
    return this.create(this._cmp, this._list.filter(fn)) as this;
  }
  public select(fn: (el: T, i: number) => boolean): this {
    return this.create(this._cmp, this._list.filter(fn)) as this;
  }
  public selectInto(
    src: SortedList<T> | List<T> | T[],
    fn: (el: T, i: number) => boolean,
  ): this {
    if (src instanceof List || src instanceof SortedList) {
      this._list.selectInto(src.values, fn);
    } else {
      this._list.selectInto(src, fn);
    }
    this.sort();
    return this;
  }
  public head(count: number = 1): this {
    return this.create(this.comparer, this._list.head(count)) as this;
  }
  public tail(count: number = 1): this {
    return this.create(this.comparer, this._list.tail(count)) as this;
  }
  public map<S>(fn: (el: T, i: number) => S): List<S> {
    return this._list.map(fn);
  }
  public mapInto<S>(
    src: SortedList<S> | List<S> | S[],
    fn: (el: S, i: number) => T,
  ): this {
    if (src instanceof List || src instanceof SortedList) {
      this._list.mapInto(src.values, fn);
    } else {
      this._list.mapInto(src, fn);
    }
    this.sort();
    return this;
  }
  public reduce<U>(fn: (acc: U, cur: T) => any, start: U): U {
    return this._list.reduce(fn, start) as U;
  }
  public reduceUntil<U>(
    fn: (acc: U, cur: T) => U,
    test: (acc: U, cur: T) => boolean,
    start: U,
  ): U {
    return this._list.reduceUntil(fn, test, start) as U;
  }
  public reverseReduce<U>(fn: (acc: U, cur: T) => U, start: U): U {
    return this._list.reverseReduce(fn, start) as U;
  }
  public reverseReduceUntil<U>(
    fn: (acc: U, cur: T) => U,
    test: (acc: U, cur: T) => boolean,
    start: U,
  ): U {
    return this._list.reverseReduceUntil(fn, test, start) as U;
  }
  public equals(b: List<T> | SortedList<T>): boolean {
    const result = equals(this._list.values, b.values);
    return result;
  }
  public same(b: List<T> | SortedList<T>): boolean {
    return this.equals(b);
  }
  public intersect(b: List<T> | SortedList<T>): this {
    let result = this.create(this.comparer) as this;
    let _long: List<T> | SortedList<T>;
    let _short: List<T> | SortedList<T>;
    if (this.length > 0 && b.length > 0) {
      if (this.length < b.length) {
        ((_short = this), (_long = b));
      } else {
        ((_long = this), (_short = b));
      }
      if (b instanceof SortedList && this.comparer === b.comparer) {
        let longPos =
          (_long as SortedList<T>).getInsertIndex(_short.read(0)!) - 1;
        let lastPos =
          (_long as SortedList<T>).getInsertIndex(_short.last()!) - 1;
        let i = -1;
        let shortLen = _short.length;
        while (longPos < lastPos && ++i < shortLen) {
          let el = _short.read(i)!;
          let aVsB;
          while (
            ++longPos < lastPos &&
            (aVsB = this.comparer(_long.read(longPos)!, el)) < 0
          ) {
            void 0;
          }
          if (longPos < lastPos && aVsB === 0) {
            result.add(el);
          }
        }
      } else if (
        _long instanceof SortedList ||
        (_long instanceof List && _long.indexer !== null)
      ) {
        _short.forEach((el) => {
          if (_long.contains(el)) {
            result.add(el);
          }
        });
      } else {
        result = result.bulkAdd(
          (_short as SortedList<T>).toList().intersect(_long),
        );
      }
    }
    return result;
  }
  public union(b: List<T> | SortedList<T>): this {
    let result: this;
    let _long: List<T> | SortedList<T>;
    let _short: List<T> | SortedList<T>;

    if (this.length > 0 || b.length > 0) {
      if (this.length < b.length) {
        ((_short = this), (_long = b));
      } else {
        ((_long = this), (_short = b));
      }
      if (b instanceof SortedList && this.comparer === b.comparer) {
        result = this.create(this.comparer, _long.values) as this;
        let longPos =
          (_long as SortedList<T>).getInsertIndex(_short.read(0)!) - 1;
        let lastPos =
          (_long as SortedList<T>).getInsertIndex(_short.last()!) - 1;
        let i = -1;
        let shortLen = _short.length;
        while (++i < shortLen && longPos < lastPos) {
          let el = _short.read(i)!;
          let aVsB = -1;
          while (
            ++longPos < lastPos &&
            (aVsB = this.comparer(_long.read(longPos)!, el)) < 0
          ) {
            void 0;
          }
          if ((aVsB > 0 && longPos < lastPos) || longPos === lastPos) {
            result.add(el);
          }
        }
        if (i < shortLen) {
          --i;
          while (++i < shortLen) {
            result.add(_short.read(i)!);
          }
        }
      } else if (
        _long instanceof SortedList ||
        (_long instanceof List && _long.indexer !== null)
      ) {
        result = this.create(this.comparer, _long.values) as this;
        _short.forEach((el) => {
          if (!_long.contains(el)) {
            result.add(el);
          }
        });
      } else {
        result = this.create(
          this.comparer,
          (_short as SortedList<T>).toList().union(_long),
        ) as this;
      }
    } else {
      result = this.create(this.comparer) as this;
    }
    return result;
  }
  public toList(): List<T> {
    return new List(this.values);
  }
  public toJSON(): any {
    return this.values;
  }
  public serialize(): T[] {
    return this.values.map((el) =>
      isFunction((el as any).serialize) ? (el as any).serialize() : el,
    );
  }
  public deserialize(array: any[], ...types: Array<Constructor<any>>): this {
    this._list.deserialize.apply(this._list, [array].concat(types));
    this.sort();
    return this;
  }
}
