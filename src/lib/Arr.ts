import { Obj } from "./Obj"
import { Util } from "./Util"

export class _Array {
    private _int: number;
    public _(): _Array {
        return new _Array();
    }

    public constructor() {

    }

    public Flatten(src: Array<any>): Array<any> {
        return this.FlattenInner(src);
    }
    private FlattenInner(src: Array<any>, result: Array<any> = []): Array<any> {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            if (Util.IsArray(src[i])) {
                this.FlattenInner(src[i], result);
            } else {
                result.push(src[i]);
            }
        }
        return result;
    }
    public Reverse(array: Array<any>) {
        let left = null;
        let right = null;
        let length = array.length;
        for (left = 0; left < length / 2; left += 1) {
            right = length - 1 - left;
            var temporary = array[left];
            array[left] = array[right];
            array[right] = temporary;
        }
    }
    public Concat(...arrs: Array<any>): Array<any> {
        let result = Array.prototype.concat.apply([], arrs);
        return result;
    }
    public Slice<T>(src: Array<T>, from: number = 0, count: number = Infinity): Array<T> {
        let len = Math.min(src.length - from, count);
        if (len < 0) {
            len = 0;
        }
        let i = -1;
        let result = new Array(len);
        while (++i < len) {
            result[i] = src[i + from];
        }
        return result;
    }
    public Append<T>(arr: Array<T>, values: Array<T>): void {
        var index = -1,
            length = values.length,
            offset = arr.length;
        arr.length = length + offset;

        while (++index < length) {
            arr[offset + index] = values[index];
        }
    }
    public RemoveOneAt(arr: Array<any>, index: number): void {
        if (index !== -1 && index < arr.length) {
            let len = arr.length;
            let i = index;
            while(++i < len) {
                arr[i - 1] = arr[i];
            }
            arr.length -= 1;
        }
    }
    public IndexOfElement(src: Array<any>, el: any): number {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            if (src[i] === el) {
                return i;
            }
        }
        return -1;
    }
    public RemoveOneByElement(arr: Array<any>, el: any): void {
        let start = this.IndexOfElement(arr, el);
        this.RemoveOneAt(arr, start);
    }
    public IndexOf(src: Array<any>, fn: (el: any) => boolean): number {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            if (fn(src[i])) {
                return i;
            }
        }
        return -1;
    }
    public RemoveOneByFn(arr: Array<any>, fn: (el: any) => boolean): void {
        let start = this.IndexOf(arr, fn);
        this.RemoveOneAt(arr, start);
    }
    public ShallowCopy<T>(src: Array<T>): Array<T> {
        let i = -1;
        let len = src.length;
        let result = new Array(len);
        while (++i < len) {
            result[i] = src[i];
        }
        return result;
    }
    public ShallowCopyInto<T>(src: Array<T>, target: Array<T>): void {
        let i = -1;
        let len = src.length;
        target.length = len
        while (++i < len) {
            target[i] = src[i];
        }
    }
    public ShallowFill<T>(src: Array<T>, target: Array<T>, at: number = 0): void {
        let i = -1;
        let len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = src[i];
        }
    }
    public DeepCopy<T>(src: Array<T>): Array<T> {
        let i = -1;
        let len = src.length;
        let result = new Array(len);
        while (++i < len) {
            result[i] = (Obj.Clone(src[i]));
        }
        return result;
    }
    public DeepCopyInto<T>(src: Array<T>, target: Array<T>): void {
        let i = -1;
        let len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = (Obj.Clone(src[i]));
        }
    }
    public DeepFill<T>(src: Array<T>, target: Array<T>, at: number = 0): void {
        let i = -1;
        let len = src.length;
        if (target.length < len + at) {
            target.length = len + at;
        }
        while (++i < len) {
            target[at + i] = (Obj.Clone(src[i]));
        }
    }
    public Filter<T>(src: Array<T>, fn: (el: T, i?: number) => boolean): Array<T> {
        let result: Array<T> = [];
        let i = -1;
        let len = src.length;
        while (++i < len) {
            let el = src[i];
            if (fn(el, i) === true) {
                result.push(el)
            }
        }
        return result;
    }
    public FilterInto<T>(src: Array<T>, target: Array<T>, fn: (el: T, i?: number) => boolean): void {
        let i = -1;
        let j = 0;
        let len = src.length;
        let space = target.length;
        while (++i < len) {
            let el = src[i];
            if (fn(el, i) === true) {
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
    public Map<T>(src: Array<T>, fn: (el: T, i?: number) => any): Array<any> {
        let i = -1;
        let len = src.length;
        let result = new Array(len);
        while (++i < len) {
            result[i] = fn(src[i], i);
        }
        return result;
    }
    public MapInto<T>(src: Array<any>, target: Array<T>, fn: (el: T, i?: number) => T): void {
        let i = -1;
        let len = src.length;
        target.length = len;
        while (++i < len) {
            target[i] = fn(src[i], i);
        }
    }
    public Reduce<T>(src: Array<T>, fn: (acc: any | number, cur: T) => any | number, start: any | number = 0): any | number {
        let i = -1;
        let len = src.length;
        let acc: any | number = start;
        while (++i < len) {
            acc = fn(acc, src[i]);
        }
        return acc;
    }
    public ForEach<T>(src: Array<T>, fn: (el: T, i?: number) => any): void {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            fn(src[i], i);
        }
    }
    public Until<T>(src: Array<T>, fn: (el: T, i?: number) => boolean): void {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            let brk = fn(src[i], i);
            if (brk) {
                return;
            }
        }
    }
    public Some<T>(src: Array<T>, filter: (el: T, i?: number) => boolean, fn: (el: T, i?: number) => any): void {
        let i = -1;
        let len = src.length;
        while (++i < len) {
            let el = src[i];
            if (filter(el, i)) {
                fn(el, i);
            }
        }
    }
    public InsertAt<T>(src: Array<T>, pos: number, v: T): void {
        if(pos > 0) {
            let i = src.length;
            while(--i >= pos) {
                src[i + 1] = src[i];
            }
            src[i + 1] = v;
        }
    }
}

export var Arr = new _Array();
