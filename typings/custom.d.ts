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
