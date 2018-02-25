"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Poolable_1 = require("../lib/standard/mixins/Poolable");
const Pool_1 = require("../lib/standard/Pool");
chai_1.should();
describe("Poolable", function () {
    before(function () {
    });
    it("Poolable has all the methods and does what i should", function () {
        let PoolableFoo = class PoolableFoo {
            constructor() {
                this.Foo = "foo";
            }
            release() {
                throw new Error("Method not implemented.");
            }
            initPool(pool) {
                throw new Error("Method not implemented.");
            }
        };
        PoolableFoo = __decorate([
            Poolable_1.Poolable
        ], PoolableFoo);
        const pool = new Pool_1.Pool(PoolableFoo);
        const obj = new PoolableFoo();
        obj.Foo.should.equal("foo");
        obj.initPool(pool);
        obj.__pool__.should.equal(pool);
        const available = pool.available;
        obj.release();
        pool.available.should.equal(available + 1);
    });
});
//# sourceMappingURL=PoolableTest.js.map