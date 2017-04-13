import { Util } from "./Util"
import { Arr } from "./Arr"

export class _Obj {
    public _(): _Obj {
        return new _Obj;
    }

    public constructor() {

    }
    public Destroy(obj: any): void {
        if (obj.Destroy !== undefined) {
            obj.Destroy();
        } else {
            this.Null(obj);
        }
    }
    public Wipe(obj: any): void {
        var keys = Object.keys(obj);
        let i = -1
        let len = keys.length;
        while (++i < len) {
            delete obj[keys[i]];
        }
    }
    public Null(obj: any): void {
        if (obj.constructor.prototype.Clear !== undefined) {
            obj.Clear();
        } else {
            let keys = Object.keys(obj);
            let key = null;
            let i = -1
            let len = keys.length;
            while (++i < len) {
                key = keys[i];
                obj[key] = null;
            }
        }
    }
    public IsNullOrUndefined(...args: any[]): boolean {
        let len = args.length;
        let i = -1;
        let a: any;
        let result = false;
        while(!result && ++i < len) {
            a = args[i];
            result = a === undefined || a === null;
        }
        return result;
    }
    public IsNotNullOrUndefined(...args: any[]): boolean {
        return !this.IsNullOrUndefined(...args);
    }
    public IsClassOf(a: any, b: any): boolean {
        return this.IsNotNullOrUndefined(a, b) && a instanceof b.constructor;
    }
    public IsSameClass(a: any, b: any): boolean {
        return this.IsNotNullOrUndefined(a, b) && a.constructor === b.constructor;
    }
    public Inherits(a: any, b: any): boolean {
        return this.IsClassOf(a, b) && !this.IsSameClass(a,b);
    }
    public Equals(a: any, b: any): boolean {
        let result = a === b;
        if (a !== b && (a instanceof Object) && this.IsSameClass(a, b)) {
            if (Util.IsArray(a)) {
                // Compare arrays
                let len = a.length;
                let i = 0;
                result = len === b.length;
                if (result) {
                    for (; i < len; i += 1) {
                        result = this.Equals(a[i], b[i]);
                        if (result === false) {
                            break;
                        }
                    }
                }
            } else if (a.constructor.prototype.Equals) {
                // Compare Coparables
                result = a.Equals(b);
            } else {
                // Compare Objects
                let keys = Object.keys(a);
                let key = null;
                result = true;
                let i = -1
                let len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    result = this.Equals(a[key], b[key]);
                    if (!result) {
                        if(Util.IsFunction(a[key])) {
                            result = true;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
    public IsDifferent(a: any, b: any): boolean {
        return !this.Equals(a, b);
    }
    public ShallowCopy(obj: any): any {
        let keys = Object.keys(obj);
        let result: any = {};
        let i = -1
        let len = keys.length;
        while (++i < len) {
            let key = keys[i];
            result[key] = obj[key];
        }
        return result;
    }
    public Clone<T>(obj: T): T {
        let result: any;
        if (!(obj instanceof Object)) {
            result = obj;
        }
        else if (obj.constructor.prototype.Clone !== undefined) {
            //Cloneable
            result = (<ICloneable<T>>(<any>obj)).Clone();
        }
        else if (Util.IsArray(obj)) {
            //Array
            result = Arr.DeepCopy(<any>obj);
        }
        else if (obj instanceof Date) {
            return <any>new Date(obj.getTime())
        }
        else if (obj instanceof RegExp) {
            return <any>new RegExp(obj)
        }
        else {
            //Object
            result = new (<any>obj).constructor();
            let keys = Object.keys(obj);
            let key = null;
            let i = -1
            let len = keys.length;
            while (++i < len) {
                key = keys[i];
                result[key] = this.Clone((<any>obj)[key]);
            }
        }
        return result;
    }
    public CloneInto<T, S>(src: T | Array<S>, target: T | Array<S>): T | Array<S> {
        if (Util.IsArray(target)) {
            //Array
            let arrS = src as Array<S>;
            let arrT = target as Array<S>;
            let len = arrS.length;
            arrT.length = len;
            let i = -1;
            while (++i < len) {
                if (arrS[i] instanceof Object) {
                    this.CloneInto(arrS[i], arrT[i]);
                } else {
                    arrT[i] = arrS[i];
                }
            }
        }
        else {
            //Object
            let keys = Object.keys(src);
            let key = null;
            let i = -1
            let len = keys.length;
            while (++i < len) {
                key = keys[i];
                let a = (<any>src)[key];
                if (a instanceof Object) {
                    let b = (<any>target)[key];
                    if(b === undefined || b === null) {
                        if(Util.IsArray(a)) {
                            b = (<any>target)[key] = [];
                        } else {
                            b = (<any>target)[key] = {};
                        }
                    }
                    if (this.IsDifferent(a, b)) {
                        this.CloneInto(a, b);
                    }
                } else {
                    (<any>target)[key] = a;
                }
            }
        }
        return target;
    }
    public Mixin(target: any = {}, exclude: any, ...sources: Array<any>): any {
        let result = target, i = 0, len = sources ? sources.length : 0;
        sources = Arr.Flatten(sources);
        for (; i < len; i++) {
            let src = sources[i];
            if (Util.IsFunction(src)) {
                src = src.prototype;
            }
            if (src === undefined) {
                continue;
            }
            let keys = Object.keys(src);
            let key = null;
            if (exclude) {
                let i = -1
                let len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    if (exclude.hasOwnProperty(key)) {
                        continue;
                    }
                    target[key] = src[key];
                }
            }
            else {
                let i = -1
                let len = keys.length;
                while (++i < len) {
                    key = keys[i];
                    target[key] = src[key];
                }
            }
        }
        return result;
    }
    public SetProperties(target: any, values: any): void {
        let keys = Object.keys(values);
        let key: string;
        let i = -1;
        let len = keys.length;
        while (++i < len) {
            key = keys[i];
            if (target.hasOwnProperty(key)) {
                target[key] = values[key];
            }
        }
    }
}

export var Obj = new _Obj();
