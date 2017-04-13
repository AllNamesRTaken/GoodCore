import { Arr } from "../Arr"
import { Obj } from "../Obj"

export default class List<T> implements IList<T> {
    private _array: Array<T>;

    constructor(arr?: Array<T> | List<T>) {
        if (arr === undefined) {
            this._array = new Array<T>();
        } else {
            if (arr instanceof (List)) {
                this._array = Arr.ShallowCopy(arr._array);
            } else {
                this._array = Arr.ShallowCopy(arr);
            }
        }
    }

    public get Values(): Array<T> {
        return this._array;
    }
    public Get(pos: number): T {
        return this._array[pos];
    }
    public get Count(): number {
        return this._array.length;
    }
    public Clear(): List<T> {
        this._array.length = 0;
        return this;
    }
    public Add(v: T): List<T> {
        this._array.push(v);
        return this;
    }
    public InsertAt(pos: number, v: T): List<T> {
        Arr.InsertAt(this._array, pos, v);
        return this;
    }
    public Push(v: T): number {
        return this._array.push(v);
    }
    public Pop(): T {
        return this._array.pop();
    }
    public Shift(): T {
        return this._array.shift();
    }
    public Concat(v: Array<T> | List<T>): List<T> {
        let arr: Array<T>;
        if (v instanceof List) {
            arr = Arr.Concat(this._array, v._array);
        } else {
            arr = Arr.Concat(this._array, v);
        }
        return new List<T>(arr);
    }
    public Append(v: Array<T> | List<T>): List<T> {
        if (v instanceof List) {
            Arr.Append(this._array, v._array);
        } else {
            Arr.Append(this._array, v);
        }
        return this;
    }
    public Copy(src: List<T> | Array<T>): List<T> {
        if (src instanceof List) {
            Arr.DeepCopyInto(src._array, this._array);
        } else {
            Arr.DeepCopyInto(src, this._array);
        }
        return this;
    }
    public ShallowCopy(src: List<T> | Array<T>): List<T> {
        if (src instanceof List) {
            Arr.ShallowCopyInto(src._array, this._array);
        } else {
            Arr.ShallowCopyInto(src, this._array);
        }
        return this;
    }
    public Clone(): List<T> {
        let arr = Arr.DeepCopy(this._array);
        return new List(arr);
    }
    public Remove(v: T): List<T> {
        Arr.RemoveOneByElement(this._array, v);
        return this;
    }
    public RemoveAt(n: number): List<T> {
        Arr.RemoveOneAt(this._array, n);
        return this;
    }
    public ForEach(fn: (el: T, i?: number) => any): List<T> {
        Arr.ForEach(this._array, fn);
        return this;
    }
    public Until(fn: (el: T, i?: number) => boolean): List<T> {
        Arr.Until(this._array, fn);
        return this;
    }
    public Some(filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): List<T> {
        Arr.Some(this._array, filter, fn);
        return this;
    }
    public IndexOf(v: T): number {
        return Arr.IndexOfElement(this._array, v);
    }
    public Contains(v: T): boolean {
        return Arr.IndexOfElement(this._array, v) !== -1;
    }
    public Reverse(): List<T> {
        Arr.Reverse(this._array);
        return this;
    }
    public Select(fn: (el: T, i?: number) => boolean): List<T> {
        return new List<T>(Arr.Filter(this._array, fn));
    }
    public SelectInto(src: List<T> | Array<T>, fn: (el: T, i?: number) => boolean): List<T> {
        if (src instanceof List) {
            Arr.FilterInto<T>(src._array, this._array, fn)
        } else {
            Arr.FilterInto<T>(src, this._array, fn)
        }
        return this;
    }
    public OrderBy(fn: (a: T, b: T) => number): List<T> {
        this._array.sort(fn);
        return this;
    }
    public Map<S>(fn: (el: T, i?: number) => S): List<S> {
        return new List<any>(Arr.Map<T>(this._array, fn));
    }
    public MapInto(src: List<any> | Array<any>, fn: (el: any, i?: number) => any): List<T> {
        if (src instanceof List) {
            Arr.MapInto<T>(src._array, this._array, fn)
        } else {
            Arr.MapInto<T>(src, this._array, fn)
        }
        return this;
    }
    public Reduce(fn: (acc: any, cur: T) => any, start?: any): any {
        return Arr.Reduce(this._array, fn, start);
    }
    public Equals(b: List<T>): boolean {
        let result = Obj.Equals(this._array, b.Values);
        return result;
    }
    // public GetEnumerator = function*(): T {
    //     for(let i = 0; i < this.Count; i += 1){
    //         yield this._array[i];
    //     }
    // }
}
