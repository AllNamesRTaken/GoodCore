"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Decorators_1 = require("../lib/Decorators");
chai_1.should();
describe("Decorators", function () {
    it("debounced should debounce the instance function", function (done) {
        class Foo {
            constructor() {
                this.value = 0;
            }
            setFoo() {
                ++this.value;
            }
        }
        __decorate([
            Decorators_1.debounced(20),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Foo.prototype, "setFoo", null);
        let foo1 = new Foo();
        let foo2 = new Foo();
        foo1.setFoo();
        foo1.setFoo();
        foo2.setFoo();
        setTimeout(() => {
            foo1.value.should.equal(1);
            foo2.value.should.equal(1);
            done();
        }, 20);
    });
    it("debounced on async with leading should return same promise", function () {
        return __awaiter(this, void 0, void 0, function* () {
            class Foo {
                constructor() {
                    this.value = 0;
                }
                setFoo() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return ++this.value;
                    });
                }
            }
            __decorate([
                Decorators_1.debounced(20, { leading: true }),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", Promise)
            ], Foo.prototype, "setFoo", null);
            let foo1 = new Foo();
            let val = 0;
            val = yield foo1.setFoo();
            val.should.equal(1);
            val = yield foo1.setFoo();
            val.should.equal(1);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                val = yield foo1.setFoo();
                val.should.equal(2);
            }), 20);
            return true;
        });
    });
});
//# sourceMappingURL=DecoratorTest.js.map