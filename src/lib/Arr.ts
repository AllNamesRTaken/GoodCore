import type { Constructor, Indexable } from "../@types/index.js";
import {
  clone,
  setProperties,
  equals,
  toLookup,
  defaultHashFunction,
  arrayDiff,
} from "./Obj.js";
import {
  isArray,
  isNullOrUndefined,
  isNumber,
  isUndefined,
  isNotUndefined,
  isNotNullOrUndefined,
  isFunction,
  isObject,
  isNull,
} from "./Test.js";
import { assert, deprecate } from "./Util.js";
export { toLookup } from "./Obj.js";
export const difference = arrayDiff;

export const reverse = deprecate("Array.prototype.reverse", function reverse<
  T,
>(array: T[]): T[] {
  return array.reverse();
});
export function concat(...arrs: any[]): any[] {
  const result = Array.prototype.concat.apply([], arrs) as any[];
  return result;
}
export function append<T>(arr: T[], values: T[]): void {
  let index = -1;
  const offset = arr.length;
  const length = isNullOrUndefined(values) ? 0 : values.length;

  while (++index < length) {
    arr[offset + index] = values[index];
  }
}
export function removeAt<T>(arr: T[], index: number): T | undefined {
  return index >= 0 ? arr?.splice(index, 1)[0] : undefined;
}
export function remove(arr: any[], el: any): void {
  const start = arr?.indexOf(el) ?? -1;
  removeAt(arr, start);
}
export function indexOf<T>(
  src: T[],
  fn: (el: T, i: number, arr: T[]) => boolean,
): number {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  while (++i < len) {
    if (fn(src[i], i, src)) {
      return i;
    }
  }
  return -1;
}
export function removeOneByFn<T>(arr: T[], fn: (el: T) => boolean): void {
  const start = indexOf(arr, fn);
  removeAt(arr, start);
}
export function shallowCopy<T>(src: T[]): T[] {
  return src?.slice() ?? [];
}
export function shallowCopyInto<T>(src: T[], target: T[]): void {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  target.length = len;
  while (++i < len) {
    target[i] = src[i];
  }
}
export function shallowFill<T>(src: T[], target: T[], at: number = 0): void {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  if (target.length < len + at) {
    target.length = len + at;
  }
  while (++i < len) {
    target[at + i] = src[i];
  }
}
export function deepCopy<T>(src: T[]): T[] {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  const result = new Array(len);
  while (++i < len) {
    result[i] = clone(src[i]);
  }
  return result;
}
export function deepCopyInto<T>(src: T[], target: T[]): void {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  target.length = len;
  while (++i < len) {
    target[i] = clone(src[i]);
  }
}
export function deepFill<T>(src: T[], target: T[], at: number = 0): void {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  if (target.length < len + at) {
    target.length = len + at;
  }
  while (++i < len) {
    target[at + i] = clone(src[i]);
  }
}
export function filterInto<T>(
  src: T[],
  target: T[],
  fn: (el: T, i: number) => boolean,
): void {
  let i = -1;
  let j = 0;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  const space = target.length;
  while (++i < len) {
    const el = src[i];
    if (fn(el, i!) === true) {
      if (j < space) {
        target[j++] = el;
      } else {
        ++j;
        target.push(el);
      }
    }
  }
  target.length = j;
}
export async function mapAsync<S, T>(
  src: S[],
  fn: (el: S, i: number) => PromiseLike<T>,
  inParallel: boolean = false,
): Promise<T[]> {
  let result: T[];
  if (!inParallel) {
    let i = -1;
    const len = isNullOrUndefined(src) ? 0 : src.length;
    result = new Array<T>(len);
    while (++i < len) {
      result[i] = await fn(src[i], i);
    }
  } else {
    result = await Promise.all(src.map(fn));
  }
  return result;
}
export function mapInto<S, T>(
  src: S[],
  target: T[],
  fn: (el: S, i: number) => T,
  startIndex: number = 0,
): void {
  let i = startIndex - 1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  target.length = len;
  while (++i < len) {
    target[i] = fn(src[i], i);
  }
}
export function reduce<T, U>(
  src: T[],
  fn: (acc: U, cur: T) => U,
  start: U,
  pos?: number,
  to?: number,
): U {
  let acc: U = start;
  if (isNotNullOrUndefined(src)) {
    pos = Math.min(Math.max(0, isUndefined(pos) ? 0 : pos!), src.length - 1);
    to = Math.min(
      Math.max(0, isUndefined(to) ? src.length - 1 : to!),
      src.length - 1,
    );
    let i = pos - 1;
    while (++i < to + 1) {
      acc = fn(acc, src[i]);
    }
  }
  return acc;
}
export function reduceUntil<T, U>(
  src: T[],
  fn: (acc: U, cur: T) => U,
  test: (acc: U, cur: T) => boolean,
  start: U,
  pos?: number,
  to?: number,
): U {
  let acc: U = start;
  if (isNotNullOrUndefined(src)) {
    pos = Math.min(Math.max(0, isUndefined(pos) ? 0 : pos!), src.length - 1);
    to = Math.min(
      Math.max(0, isUndefined(to) ? src.length - 1 : to!),
      src.length - 1,
    );
    let i = pos - 1;
    while (++i < to + 1 && !test(acc, src[i])) {
      acc = fn(acc, src[i]);
    }
  }
  return acc;
}
export function reverseReduce<T, U>(
  src: T[],
  fn: (acc: U, cur: T) => U,
  start: U,
): U {
  let i = isNullOrUndefined(src) ? 0 : src.length;
  let acc: U = start;
  while (--i >= 0) {
    acc = fn(acc, src[i]);
  }
  return acc;
}
export function reverseReduceUntil<T, U>(
  src: T[],
  fn: (acc: U, cur: T) => U,
  test: (acc: U, cur: T) => boolean,
  start: U,
): U {
  let i = isNullOrUndefined(src) ? 0 : src.length;
  let acc: U = start;
  while (--i >= 0 && !test(acc, src[i])) {
    acc = fn(acc, src[i]);
  }
  return acc;
}
export function forEach<T>(
  src: T[],
  fn: (el: T, i: number) => any,
  startIndex: number = 0,
): void {
  if (startIndex === 0) {
    return src.forEach(fn);
  }
  let i = startIndex - 1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  while (++i < len) {
    fn(src[i], i);
  }
}
export async function forEachAsync<T>(
  array: T[],
  fn: (el: T, i: number) => PromiseLike<any>,
  inParallel: boolean = false,
): Promise<void> {
  if (!inParallel) {
    let i = -1;
    const len = isNullOrUndefined(array) ? 0 : array.length;
    while (++i < len) {
      await fn(array[i], i);
    }
  } else {
    await Promise.all(array.map(fn));
  }
}
export function forSome<T>(
  src: T[],
  filter: (el: T, i: number) => boolean,
  fn: (el: T, i: number) => any,
): void {
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  while (++i < len) {
    const el = src[i];
    if (filter(el, i)) {
      fn(el, i);
    }
  }
}
export function until<T>(
  src: T[],
  fn: (el: T, i: number) => boolean | void,
  startIndex?: number,
): void;
export function until<T>(
  src: T[],
  test: (el: T, i: number) => boolean | void,
  fn: (el: T, i: number) => void,
  startIndex?: number,
): void;
export function until<T>(
  src: T[],
  fnOrTest: (el: T, i: number) => boolean | void,
  fn?: ((el: T, i: number) => void) | number,
  startIndex?: number,
): void {
  let isCombined = isUndefined(fn) || isNumber(fn);
  startIndex = isCombined ? (fn as number) : startIndex;
  let i = isUndefined(startIndex) || startIndex! < 0 ? -1 : startIndex! - 1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  while (
    ++i < len &&
    (isCombined
      ? !fnOrTest(src[i], i)
      : !(
          fnOrTest(src[i], i) ||
          ((fn as (el: T, i: number) => void)!(src[i], i), false)
        ))
  ) {}
}
export function reverseForEach<T>(
  src: T[],
  fn: (el: T, i: number) => any,
): void {
  let i = isNullOrUndefined(src) ? 0 : src.length;
  while (--i >= 0) {
    fn(src[i], i);
  }
}
export function reverseUntil<T>(
  src: T[],
  fnOrTest: (el: T, i: number) => boolean,
  fn?: (el: T, i: number) => void,
): void {
  let i = isNullOrUndefined(src) ? 0 : src.length;
  let combined = isUndefined(fn);
  while (
    --i >= 0 &&
    (combined
      ? !fnOrTest(src[i], i)
      : !(fnOrTest(src[i], i) || (fn!(src[i], i), false)))
  ) {}
}
export function all<T>(src: T[], fn: (el: T, i: number) => boolean): boolean {
  let result = true;
  let i = -1;
  const len = isNullOrUndefined(src) ? 0 : src.length;
  while (++i < len && (result = fn(src[i], i))) {}
  return result;
}
export function insertAt<T>(src: T[], pos: number, v: T): void {
  if (isNullOrUndefined(src)) {
    throw new Error("Unable to insertAt on null or undefined");
  }
  if (pos === 0) {
    src.unshift(v);
  } else if (pos > 0) {
    let i = src.length;
    while (--i >= pos) {
      src[i + 1] = src[i];
    }
    src[i + 1] = v;
  }
}
export function binarySearch<T>(
  src: T[],
  cmp: (el: T) => number,
  closest: boolean = false,
): number {
  let lo = 0,
    hi = isNullOrUndefined(src) ? -1 : src.length - 1,
    mid,
    element;
  while (lo <= hi) {
    mid = (lo + hi) >> 1;
    element = src[mid];
    let val = cmp(element);
    if (val < 0) {
      lo = mid + 1;
    } else if (val > 0) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }
  return closest ? lo : -1;
}
export function create<T>(
  length: number,
  populator: (i?: number, arr?: T[]) => T,
): T[] {
  if ((length || -1) < 0) {
    length = 0;
  }
  let arr = new Array<T>(length);
  let i = -1;
  while (++i < length) {
    arr[i] = populator(i, arr);
  }
  return arr;
}
type zipFn<S, T, U, V = undefined, W = undefined> = (
  i: number,
  a: S,
  b: T,
  c?: V,
  d?: W,
) => U;
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
export function zip<
  S,
  T,
  V = undefined,
  W = undefined,
  U = [S, T] | [S, T, V] | [S, T, V, W],
>(
  a: S[],
  b: T[],
  x?: zipFn<S, T, U, V, W> | V[],
  y?: zipFn<S, T, U, V, W> | W[],
  z?: zipFn<S, T, U, V, W>,
): U[] {
  let c: V[] | undefined;
  let d: W[] | undefined;
  let defaultZipFn = (i: number, a: S, b: T): U => [a, b] as any;
  let fn: zipFn<S, T, U, V, W> = isNotUndefined(x)
    ? isFunction(x)
      ? (x! as zipFn<S, T, U, V, W>)
      : ((c = x as V[]),
        isNotUndefined(y)
          ? isFunction(y)
            ? (y! as zipFn<S, T, U, V, W>)
            : ((d = y as W[]), isNotUndefined(z) ? z! : defaultZipFn)
          : defaultZipFn)
    : defaultZipFn;
  let i = -1;
  let hasC = isNotUndefined(c);
  let hasD = isNotUndefined(d);
  let max = Math.min(
    a.length,
    b.length,
    hasC ? c!.length : Number.POSITIVE_INFINITY,
    hasD ? d!.length : Number.POSITIVE_INFINITY,
  );
  let u: U;
  let result: U[] = [];
  if (hasC && hasD) {
    while (++i < max && (u = fn(i, a[i], b[i], c![i], d![i])) !== undefined) {
      result.push(u);
    }
  } else if (hasC) {
    while (++i < max && (u = fn(i, a[i], b[i], c![i])) !== undefined) {
      result.push(u);
    }
  } else {
    while (++i < max && (u = fn(i, a[i], b[i])) !== undefined) {
      result.push(u);
    }
  }
  return result;
}
export function unzip<S, T, U = [S, T]>(
  arr: U[],
  fn: (u: U, i?: number, out?: [S, T]) => [S, T] = (
    u: any,
    i: number,
    out: [S, T],
  ) =>
    ((out[0] = (u as [S, T])[0] as any),
    (out[1] = (u as [S, T])[1]),
    out) as any,
): [S[], T[]] {
  let i = -1;
  let len = arr.length;
  let split: [S, T] = [undefined as any, undefined as any];
  let result: [S[], T[]] = [new Array<S>(), new Array<T>()];
  while (++i < len && (split = fn(arr[i], i, split))) {
    result[0].push(split[0]);
    result[1].push(split[1]);
  }
  return result;
}
export function pivot<S = any, T extends Array<S> = S[]>(arr: T[]): S[][] {
  assert(
    isArray(arr) && arr.length > 0 && isArray(arr[0]),
    "argument has to be a non-empty array of arrays",
  );
  let result: Array<Array<S>> = [];
  let i = -1;
  let len = arr.length;
  let width = arr[0].length;
  while (++i < width) {
    result.push(
      create(len, (j) => {
        return arr[j!][i];
      }),
    );
  }
  return result;
}
export function deserialize<S, U>(
  array: any[],
  target: S[],
  ...types: Array<Constructor<any>>
): void {
  let T: Constructor<any> | undefined;
  let passthroughT: Array<Constructor<any>>;
  T = types.shift();
  passthroughT = types;
  if (isNotUndefined(T)) {
    if (isNotUndefined((T!.prototype as any).deserialize)) {
      mapInto(array, target, (el) => {
        let t = new T!() as any;
        return (t.deserialize as Function).apply(t, [el].concat(passthroughT));
      });
    } else {
      mapInto(array, target, (el, i) => {
        let newT = new T!();
        setProperties(newT, el);
        return newT;
      });
    }
  } else {
    deepCopyInto(array, target);
  }
}
type Descriminator<T> = (el: T) => boolean;
export function bucket<T>(
  array: T[],
  ...desciminators: Array<Descriminator<T>>
): T[][] {
  let i = -1;
  const len = isNullOrUndefined(array) ? 0 : array.length;
  const descLen = isNullOrUndefined(desciminators) ? 0 : desciminators.length;
  let result: T[][] = create(descLen + 1, () => [] as never[]);
  while (++i < len) {
    let j = -1;
    let match = false;
    while (++j < descLen && !match) {
      if (desciminators[j](array[i])) {
        result[j].push(array[i]);
        match = true;
      }
    }
    if (!match) {
      result[j].push(array[i]);
    }
  }
  return result;
}
export function split<T>(array: T[], isA: Descriminator<T>): [T[], T[]] {
  return bucket(array, isA) as [T[], T[]];
}
export function distinct<T>(array: T[], hashFn?: (el: T) => string): T[] {
  let i = -1;
  const len = isNullOrUndefined(array) ? 0 : array.length;
  let result: T[] = [];
  let lookup = Object.create(null) as Indexable<boolean>;
  let nullFound = false;
  let undefinedFound = false;
  let objects: T[] = [];
  let hasHashFn = !!hashFn;
  if (len > 0) {
    if (hasHashFn) {
      while (++i < len) {
        let el = array[i];
        let key = hashFn!(el);
        if (!lookup[key]) {
          result.push(el);
          lookup[key] = true;
        }
      }
    } else {
      while (++i < len) {
        let el = array[i];
        if (isNull(el)) {
          if (!nullFound) {
            result.push(el);
            nullFound = true;
          }
        } else if (isUndefined(el)) {
          if (!undefinedFound) {
            result.push(el);
            undefinedFound = true;
          }
        } else if (isObject(el)) {
          if (!objects.find((obj) => equals(obj, el))) {
            result.push(el);
            objects.push(el);
          }
        } else {
          let key = (el as unknown as Object).toString();
          if (!lookup[key]) {
            result.push(el);
            lookup[key] = true;
          }
        }
      }
    }
  }
  return result;
}
function shortLong<T, S = T>(
  a: Array<T>,
  b: Array<S>,
): [Array<T>, Array<S>] | [Array<S>, Array<T>] {
  return a.length < b.length ? [a, b] : [b, a];
}
export function intersect<T, S = T>(
  a: Array<T>,
  b: Array<S>,
  hashFn: (el: T | S) => string = defaultHashFunction,
): Array<T> {
  const result: T[] = [];
  const [_short, _long] = shortLong(a, b);
  const longLookup = toLookup(_long, hashFn);
  _short.forEach((el: any) => {
    if (longLookup[hashFn(el)]) {
      result.push(el);
    }
  });
  return result;
}
export function union<T, S = T>(
  a: Array<T>,
  b: Array<S>,
  hashFn: (el: T | S) => string = defaultHashFunction,
): Array<T | S> {
  const result: Array<T | S> = a.concat(b as any);
  return distinct(result, hashFn);
}
export function subtract<T, S = T>(
  a: Array<T>,
  b: Array<S>,
  hashFn: (el: T | S) => string = defaultHashFunction,
): Array<T> {
  const result: T[] = [];
  const bLookup = toLookup(b, hashFn);
  a.forEach((el: T) => {
    if (!bLookup[hashFn(el)]) {
      result.push(el);
    }
  });
  return result;
}
