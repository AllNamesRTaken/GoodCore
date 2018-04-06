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
describe("Pool", function () {
    it("Get gets first free instance", function () {
        let Obj = class Obj {
        };
        Obj = __decorate([
            Poolable_1.Poolable
        ], Obj);
        const pool = new Pool_1.Pool(Obj);
        const first = pool.get();
        first.should.be.instanceOf(Obj);
        const second = pool.get();
        second.should.be.instanceOf(Obj);
        first.should.not.equal(second);
        first.release();
        const third = pool.get();
        third.should.equal(first);
    });
    it("Getting more than growthStep increases the pool by growthStep", function () {
        let Obj = class Obj {
        };
        Obj = __decorate([
            Poolable_1.Poolable
        ], Obj);
        const pool = new Pool_1.Pool(Obj, 2);
        pool.size.should.equal(2);
        pool.available.should.equal(2);
        const first = pool.get();
        const second = pool.get();
        const third = pool.get();
        pool.size.should.equal(4);
        pool.available.should.equal(1);
        third.release();
        first.release();
        pool.available.should.equal(3);
    });
});
//# sourceMappingURL=PoolTest.js.map