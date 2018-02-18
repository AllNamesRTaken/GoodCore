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
const AsyncCombinators_1 = require("../lib/standard/AsyncCombinators");
chai_1.should();
describe("AsyncCombinators", function () {
    it("before acts before", function (done) {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety.should.equal(1);
                this.anxiety++;
            }
            error(...args) {
                throw new Error("reason");
            }
        }
        __decorate([
            AsyncCombinators_1.async.before(function () {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.anxiety++;
                        resolve();
                    });
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        __decorate([
            AsyncCombinators_1.async.before(function () {
                return new Promise((resolve, reject) => {
                    reject();
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "error", null);
        let sam = new Person();
        sam.fret(1).then(() => {
            sam.anxiety.should.equal(2);
        });
        sam.error(1)
            .then(() => {
        })
            .catch((reason) => {
            done();
        });
        sam.anxiety.should.equal(0);
    });
    it("after acts after", function (done) {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety++;
                this.anxiety.should.equal(1);
            }
            error(...args) {
                throw new Error("reason");
            }
        }
        __decorate([
            AsyncCombinators_1.async.after(function (value, reason) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.anxiety++;
                        resolve();
                    });
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        __decorate([
            AsyncCombinators_1.async.after(function (_, reason) {
                return new Promise((resolve, reject) => {
                    reject(reason);
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "error", null);
        let sam = new Person();
        sam.fret(1).then(() => {
            sam.anxiety.should.equal(2);
        });
        sam.error(1).then(() => {
        })
            .catch((reason) => {
            done();
        });
    });
    it("provided acts if provided", function (done) {
        class Person {
            constructor() {
                this.anxiety = 0;
            }
            fret(...args) {
                this.anxiety++;
            }
            error(ok) {
                throw new Error("reason");
            }
        }
        __decorate([
            AsyncCombinators_1.async.provided(function () {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(this.anxiety === 0);
                    });
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "fret", null);
        __decorate([
            AsyncCombinators_1.async.provided(function (name, ok) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (ok) {
                            resolve(true);
                        }
                        else {
                            reject("reject");
                        }
                    });
                });
            }),
            AsyncCombinators_1.async,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Boolean]),
            __metadata("design:returntype", void 0)
        ], Person.prototype, "error", null);
        let sam = new Person();
        sam.fret(1).then(() => {
            sam.anxiety.should.equal(1);
            sam.fret(1).then(() => {
            }).catch((reason) => {
                sam.anxiety.should.equal(1);
            });
        });
        sam.error(true).catch((reason) => {
            reason.message.should.equal("reason");
            sam.error(false).catch((reason) => {
                reason.should.equal("reject");
                done();
            });
        });
    });
});
//# sourceMappingURL=AsyncCombinatorTest.js.map