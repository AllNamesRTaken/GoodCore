export class Pool<T extends IPoolable> implements IPool<IPoolable> {
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
		this.create();
	}
	private create() {
		let i = 0;
		for (; i < this._growthStep; i++) {
			this._pool.push(new this._cls() as T);
		}
		this._size += this._growthStep;
		this._available += this._growthStep;
	}
	public get(): T {
		let result: T;
		if (this._pool.length === 0) {
			this.create();
		}
		result = this._pool.pop();
		--this._available;
		result.initPool(this);
		return result;
	}
	public release(obj: T): void {
		this._pool.push(obj);
		++this._available;
	}
}
