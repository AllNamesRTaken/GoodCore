"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Initable_1 = require("../lib/standard/mixins/Initable");
chai_1.should();
describe("Initable", function () {
    it("Initable works as function wrapper around anon class", function () {
        class Person extends Initable_1.Initable(class {
            constructor() {
                this.name = "";
                this.age = 0;
                this.superPower = null;
            }
        }) {
        }
        let sam = new Person();
        sam.init({ age: 17, name: "Sam", superPower: "badassery" });
        console.log(JSON.stringify(new Person()), JSON.stringify(sam));
        sam.age.should.equal(17);
    });
    it("Initable works as function wrapper around named class", function () {
        class Human {
            constructor() {
                this.name = "";
                this.age = 0;
                this.superPower = null;
            }
        }
        class Person extends Initable_1.Initable(Human) {
        }
        let sam = new Person();
        sam.init({ age: 17, name: "Sam", superPower: "badassery" });
        console.log(JSON.stringify(new Person()), JSON.stringify(sam));
        sam.age.should.equal(17);
    });
    it("Initable works as decorator", function () {
        let Person = class Person {
            constructor() {
                this.name = "";
                this.age = 0;
                this.superPower = null;
            }
        };
        Person = __decorate([
            Initable_1.Initable
        ], Person);
        let sam = new Person();
        sam.init({ age: 17, name: "Sam", superPower: "badassery" });
        console.log(JSON.stringify(new Person()), JSON.stringify(sam));
        sam.age.should.equal(17);
    });
});
//# sourceMappingURL=InitableTest-JBRAGE3.js.map