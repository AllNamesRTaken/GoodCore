import type { ICtor, IPoolable } from "../../@types/index.js";
import { once } from "../Util.js";

export class Pool<T> {
  private _pool: T[] = [];
  private _growthStep: number;
  private _cls: any;
  private _available: number = 0;
  private _size: number = 0;

  public get available(): number {
    return this._available;
  }
  public get size(): number {
    return this._size;
  }

  constructor(cls: ICtor<T>, growthStep: number = 10) {
    this._cls = cls;
    this._growthStep = growthStep;
    this.createNewInstances();
  }
  private createNewInstances() {
    let i = 0;
    for (; i < this._growthStep; i++) {
      this._pool.push(new this._cls() as T);
    }
    this._size += this._growthStep;
    this._available += this._growthStep;
  }

  // tslint:disable-next-line:no-reserved-keywords
  public get(): T & IPoolable {
    once(() => {
      console.warn(
        "Function Pool.get(id) is deprecated please use Pool.byId instead. get is a reserved word.",
      );
    });
    return this.getInstance();
  }
  public getInstance(): T & IPoolable {
    let result: T;
    if (this._pool.length === 0) {
      this.createNewInstances();
    }
    result = this._pool.pop()!;
    --this._available;
    (result as any).initPool(this);
    return result as any as T & IPoolable;
  }
  public release(obj: T): void {
    this._pool.push(obj);
    ++this._available;
  }
}
