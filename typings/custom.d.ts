type Constructor<T> = new (...args: any[]) => T;
interface ICtor<T> { new (...args: any[]): T }

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
