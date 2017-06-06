import { Arr } from "../Arr";
import { Dictionary } from "../struct/Dictionary";
import { List } from "../struct/List";
import { IObjectWithFunctions, Util } from "../Util";
import { Initable } from "./mixins/Initable";

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

	public get size(): number {
		return this._size;
	}
	public set size(value: number) {
		if ((value !== this._size)
			&& (value >= 0)) {
			this._size = value;
			this.trim();
		}
	}
	public get count(): number {
		return this._order.count;
	}
	public get stageCount(): number {
		return this._stage.list.count;
	}
	public constructor(size: number = Cache.DEFAULT_FIFO_SIZE) {
		this._size = size;
	}
	public hit(key: string): boolean {
		return this._data.has(key);
	}
	public get(key: string): T {
		let result: T;
		result = this.hit(key) ? this._data.get(key).Data : null;
		return result;
	}
	public push(key: string, data: T) {
		this.add(key, data);
	}
	public getStaged(key: string): T {
		let result: T;
		result = this._stage.has(key) ? this._stage.get(key).Data : null;
		return result;
	}
	public stage(key: string, data: T) {
		this._stage.set(key, new CacheObject<T>().init({Key: key, Data: data}));
	}
	public publish(key: string) {
		if (this._stage.has(key)) {
			this.add(key, this._stage.get(key).Data);
			this._stage.delete(key);
		}

	}
	public remove(key: string) {
		if (this.hit(key)) {
			this._data.delete(key);
			this._order.remove(key);
		}

	}
	public cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void {
		if (keyFn === undefined) {
			keyFn = function(...args: any[]): string {
				return Util.md5(Arr.reduce(args, (acc: string, cur: any) => acc += JSON.stringify(cur))) as string;
			};
		}
		const proxyFn = (superFn: Function, ...args: any[]) => {
			const key = keyFn(...args);
			if (key !== null && this.hit(key)) {
				return this.get(key);
			}
			const result = superFn(...args);
			if (key !== null) {
				this.add(key, result);
			}
			return result;
		};

		Util.proxyFn(obj as any, fnName, proxyFn, false);
	}
	public clear() {
		this._data.clear();
		this._order.clear();
		this._stage.clear();
	}
	private add(key: string, data: T) {
		if (this.hit(key)) {
			this._order.remove(key);
		}
		this._data.set(key, new CacheObject<T>().init({Key: key, Data: data}));
		this._order.add(key);
		this.trim();
	}

	private trim() {
		while ((this._order.count > this._size)) {
			this._data.delete(this._order.get(0));
			this._order.shift();
		}
	}
}
