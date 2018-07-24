"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Range2_1 = require("../lib/struct/Range2");
const Rect_1 = require("../lib/struct/Rect");
const Vec2_1 = require("../lib/struct/Vec2");
chai_1.should();
describe("Range2", function () {
    it("Equals return true if 2 ranges are the same", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const r2 = new Range2_1.Range2(1, 1, 2, 3);
        const r3 = new Range2_1.Range2(10, 1, 2, 3);
        r1.equals(r2).should.be.true;
        r1.equals(r3).should.be.false;
    });
    it("Left out constructor parameters are set to 0", function () {
        const r1 = new Range2_1.Range2();
        r1.equals(new Range2_1.Range2(0, 0, 0, 0)).should.be.true;
    });
    it("Clone returns a clone", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const r2 = r1.clone();
        let r3 = new Range2_1.Range2();
        r1.clone(r3);
        r1.equals(r1).should.be.true;
        r1.should.not.equal(r2);
        r1.equals(r3).should.be.true;
    });
    it("Contains is true when a point is inside the range", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1.containsPoint(new Vec2_1.Vec2(2, 2)).should.be.true;
    });
    it("First returns first point that fulfills a condition or null", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1
            .first(function (p) {
            return p.equals(new Vec2_1.Vec2(2, 2));
        })
            .equals(new Vec2_1.Vec2(2, 2)).should.be.true;
        let notFound = r1
            .first(function (p) {
            return p.equals(new Vec2_1.Vec2(200, 200));
        });
        (notFound === null).should.be.true;
    });
    it("ForEach loops over all points", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const x = [];
        const y = [];
        r1.forEach(function (p) {
            x.push(p.x);
            y.push(p.y);
            return false;
        });
        x.should.deep.equal([1, 2, 1, 2, 1, 2]);
        y.should.deep.equal([1, 1, 2, 2, 3, 3]);
    });
    it("ForEach loops until function returns true", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const x = [];
        const y = [];
        r1.forEach(function (p) {
            x.push(p.x);
            y.push(p.y);
            return p.equals(new Vec2_1.Vec2(2, 2));
        });
        x.should.deep.equal([1, 2, 1, 2]);
        y.should.deep.equal([1, 1, 2, 2]);
    });
    it("ForEach starts at given point if within range", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const x = [];
        const y = [];
        r1.forEach(function (p) {
            x.push(p.x);
            y.push(p.y);
            return false;
        }, new Vec2_1.Vec2(2, 2));
        x.should.deep.equal([2, 1, 2]);
        y.should.deep.equal([2, 3, 3]);
    });
    it("Scale multiplies size with the components of a vector", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1.scale(new Vec2_1.Vec2(2, 3), false).equals(new Range2_1.Range2(1, 1, 4, 9)).should.be.true;
    });
    it("Scale can keep the center position", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1.scale(new Vec2_1.Vec2(2, 3)).equals(new Range2_1.Range2(0, -2, 4, 9)).should.be.true;
    });
    it("Set copies all values into the target range", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const r2 = new Range2_1.Range2(2, 3, 4, 5);
        r1.set(r2);
        r1.equals(r2).should.be.true;
        r1.should.not.equal(r2);
    });
    it("ToInt floors position to Integer", function () {
        const r1 = new Range2_1.Range2(1.2, 1.8, 2, 3);
        const r2 = new Range2_1.Range2(1, 1, 2, 3);
        r1.toInt().equals(r2).should.be.true;
    });
    it("Decimal is not int", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const r2 = new Range2_1.Range2(1, 1, 2, 3);
        r1.toDecimal().equals(r2).should.be.false;
        r1.toDecimal().toInt().equals(r2).should.be.true;
    });
    it("Translate scales both pos and size by a system vector", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1.translate(new Vec2_1.Vec2(2, 3)).equals(new Range2_1.Range2(2, 3, 4, 9)).should.be.true;
    });
    it("Move adds a vector to the position", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        r1.move(new Vec2_1.Vec2(2, 3)).equals(new Range2_1.Range2(3, 4, 2, 3)).should.be.true;
    });
    it("FromRect converts the a Rect to a range with end non-inclusive", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        let range1 = new Range2_1.Range2().fromRect(r1);
        range1.equals(new Range2_1.Range2(1, 1, 2, 3)).should.be.true;
        const r2 = new Rect_1.Rect(1, 1, 3, 4, true);
        let range2 = new Range2_1.Range2().fromRect(r2);
        range2.equals(new Range2_1.Range2(1, 1, 3, 4)).should.be.true;
        const r3 = new Rect_1.Rect(1, 1, -2, -3, true);
        let range3 = new Range2_1.Range2().fromRect(r3);
        range3.equals(new Range2_1.Range2(1, 1, -4, -5)).should.be.true;
    });
    it("Contains is true if another range is fully contained", function () {
        const r1 = new Range2_1.Range2(1, 1, 2, 3);
        const inside = new Range2_1.Range2(1, 1, 2, 2);
        const partially = new Range2_1.Range2(1, 1, 2, 4);
        r1.contains(inside).should.be.true;
        r1.contains(partially).should.be.false;
    });
    it("isZero checks if both vectors are zero", function () {
        const r1 = new Range2_1.Range2(0, 0, 3, 4);
        r1.isZero.should.be.false;
        const r2 = new Range2_1.Range2(0, 0, 0, 0);
        r2.isZero.should.be.true;
    });
    it("Zero zeroes both vectors", function () {
        const r1 = new Range2_1.Range2(1, 1, 3, 4);
        r1.zero();
        r1.isZero.should.be.true;
    });
});
//# sourceMappingURL=RangeTest.js.map