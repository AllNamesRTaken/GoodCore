import { Arr } from "../Arr";
import Dictionary from "../struct/Dictionary";
import List from "../struct/List";
import { IObjectWithFunctions, Util } from "../Util";
import Initable from "./mixins/Initable";

export class BaseCacheObject<T> {
	public Key: string = null;
	public Data: T = null;
}

export const _InitableCacheObject = Initable(BaseCacheObject);
export class CacheObject<T> extends _InitableCacheObject<T> {}
export class Cache<T> {
	private static DEFAULT_FIFO_SIZE: number = 100;
	private _size: number = Cache.DEFAULT_FIFO_SIZE;
	private _order: List<string> = new List<string>();
	private _data: Dictionary<CacheObject<T>> = new Dictionary<CacheObject<T>>();
	private _stage: Dictionary<CacheObject<T>> = new Dictionary<CacheObject<T>>();

	public get Size(): number {
		return this._size;
	}
	public set Size(value: number) {
		if ((value !== this._size)
			&& (value >= 0)) {
			this._size = value;
			this.Trim();
		}
	}
	public get Count(): number {
		return this._order.Count;
	}
	public get StageCount(): number {
		return this._stage.List.Count;
	}
	public constructor(size: number = Cache.DEFAULT_FIFO_SIZE) {
		this._size = size;
	}
	public Hit(key: string): boolean {
		return this._data.Has(key);
	}
	public Get(key: string): T {
		let result: T;
		result = this.Hit(key) ? this._data.Get(key).Data : null;
		return result;
	}
	public Push(key: string, data: T) {
		this.Add(key, data);
	}
	public GetStaged(key: string): T {
		let result: T;
		result = this._stage.Has(key) ? this._stage.Get(key).Data : null;
		return result;
	}
	public Stage(key: string, data: T) {
		this._stage.Set(key, new CacheObject<T>().Init({Key: key, Data: data}));
	}
	public Publish(key: string) {
		if (this._stage.Has(key)) {
			this.Add(key, this._stage.Get(key).Data);
			this._stage.Delete(key);
		}

	}
	public Remove(key: string) {
		if (this.Hit(key)) {
			this._data.Delete(key);
			this._order.Remove(key);
		}

	}
	public Cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void {
		if (keyFn === undefined) {
			keyFn = function(...args: any[]): string {
				return Util.Md5(Arr.Reduce(args, (acc: string, cur: any) => acc += JSON.stringify(cur))) as string;
			};
		}
		const proxyFn = (superFn: Function, ...args: any[]) => {
			const key = keyFn(...args);
			if (key !== null && this.Hit(key)) {
				return this.Get(key);
			}
			const result = superFn(...args);
			if (key !== null) {
				this.Add(key, result);
			}
			return result;
		};

		Util.ProxyFn(obj as any, fnName, proxyFn, false);
	}
	public Clear() {
		this._data.Clear();
		this._order.Clear();
		this._stage.Clear();
	}
	private Add(key: string, data: T) {
		if (this.Hit(key)) {
			this._order.Remove(key);
		}
		this._data.Set(key, new CacheObject<T>().Init({Key: key, Data: data}));
		this._order.Add(key);
		this.Trim();
	}

	private Trim() {
		while ((this._order.Count > this._size)) {
			this._data.Delete(this._order.Get(0));
			this._order.Shift();
		}
	}
}
