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
interface IList<T> {
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
  removeAt(n: number): IList<T>;
  forEach(fn: (el: T, i?: number) => any): IList<T>;
  until(test: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): IList<T>;
  some(filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): IList<T>;
  indexOf(v: T): number;
  contains(v: T): boolean;
  reverse(): IList<T>;
  select(fn: (el: T) => boolean): IList<T>;
  selectInto(src: IList<T> | Array<T>, fn: (el: T) => boolean): IList<T>;
  orderBy(fn: (a: T, b: T) => number): IList<T>;
  map<S>(fn: (el: T, i?: number) => S): IList<S>;
  mapInto(src: IList<any> | Array<any>, fn: (el: any, i?: number) => any): IList<T>;
  reduce(fn: (acc: any, cur: T) => any, start?: any): any;
  equals(b: IList<T>): boolean;
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
