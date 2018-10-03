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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Combinators_1 = require("../lib/standard/Combinators");
chai_1.should();
describe("Combinators", function () {
    it("before acts before", function () {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety.should.equal(1);
                this.anxiety++;
            }
        }
        __decorate([
            Combinators_1.before(function () {
                this.anxiety++;
            }),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        let sam = new Person();
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(2);
    });
    it("after acts after", function () {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety.should.equal(0);
                this.anxiety++;
            }
        }
        __decorate([
            Combinators_1.after(function (name) {
                this.anxiety++;
                name.should.equal("fret");
            }),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        let sam = new Person();
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(2);
    });
    it("around acts around", function () {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety.should.equal(1);
                this.anxiety++;
            }
        }
        __decorate([
            Combinators_1.around(function (callback) {
                this.anxiety++;
                callback();
                this.anxiety++;
            }),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        let sam = new Person();
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(3);
    });
    it("provided acts if provided", function () {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety++;
            }
        }
        __decorate([
            Combinators_1.provided(function (name) {
                return this.anxiety === 0;
            }),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        let sam = new Person();
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(1);
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(1);
    });
    it("combination acts from outer to inner", function () {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety++;
            }
        }
        __decorate([
            Combinators_1.provided(function () {
                return this.anxiety === 0;
            }),
            Combinators_1.before(function () {
                this.anxiety++;
            }),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        let sam = new Person();
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(2);
        sam.fret(1, 2, 3);
        sam.anxiety.should.equal(2);
    });
});
//# sourceMappingURL=CombinatorTest.js.map