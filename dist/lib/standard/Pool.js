"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pool = (function () {
    function Pool(cls, growthStep) {
        if (growthStep === void 0) { growthStep = 10; }
        this.pool = [];
        this.available = 0;
        this.size = 0;
        this.cls = cls;
        this.growthStep = growthStep;
        this.Create();
    }
    Object.defineProperty(Pool.prototype, "Available", {
        get: function () {
            return this.available;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "Size", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    Pool.prototype.Create = function () {
        var i = 0;
        for (; i < this.growthStep; i++) {
            this.pool.push(new this.cls());
        }
        this.size += this.growthStep;
        this.available += this.growthStep;
    };
    Pool.prototype.Get = function () {
        var result;
        if (this.pool.length === 0) {
            this.Create();
        }
        result = this.pool.pop();
        --this.available;
        result.InitPool(this);
        return result;
    };
    Pool.prototype.Release = function (obj) {
        this.pool.push(obj);
        ++this.available;
    };
    return Pool;
}());
exports.default = Pool;
//# sourceMappingURL=Pool.js.map