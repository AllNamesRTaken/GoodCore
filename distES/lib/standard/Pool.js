export class Pool {
    constructor(cls, growthStep = 10) {
        this._pool = [];
        this._available = 0;
        this._size = 0;
        this._cls = cls;
        this._growthStep = growthStep;
        this.createNewInstances();
    }
    get available() {
        return this._available;
    }
    get size() {
        return this._size;
    }
    createNewInstances() {
        let i = 0;
        for (; i < this._growthStep; i++) {
            this._pool.push(new this._cls());
        }
        this._size += this._growthStep;
        this._available += this._growthStep;
    }
    get() {
        let result;
        if (this._pool.length === 0) {
            this.createNewInstances();
        }
        result = this._pool.pop();
        --this._available;
        result.initPool(this);
        return result;
    }
    release(obj) {
        this._pool.push(obj);
        ++this._available;
    }
}
//# sourceMappingURL=Pool.js.map