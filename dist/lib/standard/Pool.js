var Pool = (function () {
    function Pool(cls, growthStep) {
        if (growthStep === void 0) { growthStep = 10; }
        this._pool = [];
        this._available = 0;
        this._size = 0;
        this._cls = cls;
        this._growthStep = growthStep;
        this.create();
    }
    Object.defineProperty(Pool.prototype, "available", {
        get: function () {
            return this._available;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Pool.prototype.create = function () {
        var i = 0;
        for (; i < this._growthStep; i++) {
            this._pool.push(new this._cls());
        }
        this._size += this._growthStep;
        this._available += this._growthStep;
    };
    Pool.prototype.get = function () {
        var result;
        if (this._pool.length === 0) {
            this.create();
        }
        result = this._pool.pop();
        --this._available;
        result.initPool(this);
        return result;
    };
    Pool.prototype.release = function (obj) {
        this._pool.push(obj);
        ++this._available;
    };
    return Pool;
}());
export { Pool };
//# sourceMappingURL=Pool.js.map