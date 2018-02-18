"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Rect_1 = require("../lib/struct/Rect");
const Vec2_1 = require("../lib/struct/Vec2");
chai_1.should();
describe("Rect", function () {
    it("Clone returns a clone", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const r2 = r1.clone();
        let r3 = new Rect_1.Rect();
        r1.clone(r3);
        r2.start.equals(new Vec2_1.Vec2(1, 1)).should.be.true;
        r2.stop.equals(new Vec2_1.Vec2(3, 4)).should.be.true;
        r1.should.not.equal(r2);
        r1.equals(r3).should.be.true;
    });
    it("Equals is true when comparing equal rectangles", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const r2 = new Rect_1.Rect(1, 1, 3, 4);
        const r3 = new Rect_1.Rect(10, 1, 3, 4);
        r1.equals(r2).should.be.true;
        r1.equals(r3).should.be.false;
    });
    it("Left out constructor parameters are set to 0", function () {
        const r1 = new Rect_1.Rect();
        r1.equals(new Rect_1.Rect(0, 0, 0, 0)).should.be.true;
    });
    it("Scale scales each dimension by the factors of a vector", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const r2 = r1.scale(new Vec2_1.Vec2(2, 3), false);
        r2.start.equals(new Vec2_1.Vec2(1, 1)).should.be.true;
        r2.stop.equals(new Vec2_1.Vec2(5, 10)).should.be.true;
    });
    it("Scale can keep the center position by default", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const r2 = r1.scale(new Vec2_1.Vec2(2, 3));
        r2.start.equals(new Vec2_1.Vec2(0, -2)).should.be.true;
        r2.stop.equals(new Vec2_1.Vec2(4, 7)).should.be.true;
    });
    it("ToInt floors each vector", function () {
        const r1 = new Rect_1.Rect(1.1, 1.2, 3.7, 4.8);
        r1.toInt().equals(new Rect_1.Rect(1, 1, 3, 4)).should.be.true;
    });
    it("ToDecimal is decimal", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        r1.toDecimal();
        r1.equals(new Rect_1.Rect(1, 1, 3, 4)).should.be.false;
        r1.toInt().equals(new Rect_1.Rect(1, 1, 3, 4)).should.be.true;
    });
    it("Translate converts the rect into a new system defined by a vector", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        r1.translate(new Vec2_1.Vec2(2, 3)).equals(new Rect_1.Rect(2, 3, 6, 12)).should.be.true;
    });
    it("ToRange returns the correct Range", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const range1 = r1.toRange2();
        range1.pos.equals(new Vec2_1.Vec2(1, 1)).should.be.true;
        range1.size.equals(new Vec2_1.Vec2(2, 3)).should.be.true;
    });
    it("ToRange returns the correct Range with end inclusive", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4, true);
        const range1 = r1.toRange2();
        range1.pos.equals(new Vec2_1.Vec2(1, 1)).should.be.true;
        range1.size.equals(new Vec2_1.Vec2(3, 4)).should.be.true;
        const r2 = new Rect_1.Rect(3, 4, 1, 1, true);
        const range2 = r2.toRange2();
        range2.pos.equals(new Vec2_1.Vec2(3, 4)).should.be.true;
        range2.size.equals(new Vec2_1.Vec2(-3, -4)).should.be.true;
        r1.endInclusive = false;
        let endInclusive = r1.toRange2();
        endInclusive.pos.equals(new Vec2_1.Vec2(1, 1)).should.be.true;
        endInclusive.size.equals(new Vec2_1.Vec2(2, 3)).should.be.true;
    });
    it("Area return the correct size of the rectangle", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        r1.area().should.equal(6);
    });
    it("Move adds a vector to each point in the rectangle", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        r1.move(new Vec2_1.Vec2(2, 3)).equals(new Rect_1.Rect(3, 4, 5, 7)).should.be.true;
    });
    it("Set sets start and stop vectors of Rect to that of another rect", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const r2 = new Rect_1.Rect(4, 5, 6, 7);
        r2.set(r1);
        r2.equals(new Rect_1.Rect(1, 1, 3, 4)).should.be.true;
    });
    it("Contains is true if another rect is fully contained", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const inside = new Rect_1.Rect(1, 1, 3, 3);
        const partially = new Rect_1.Rect(1, 1, 3, 5);
        r1.contains(inside).should.be.true;
        r1.contains(partially).should.be.false;
    });
    it("Intersect is true if another rect is partially contained", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        const inside = new Rect_1.Rect(1, 1, 3, 3);
        const partially = new Rect_1.Rect(1, 1, 3, 5);
        const outside = new Rect_1.Rect(10, 10, 13, 15);
        r1.intersect(inside).should.be.true;
        r1.intersect(partially).should.be.true;
        r1.intersect(outside).should.be.false;
    });
    it("isZero checks if both vectors are zero", function () {
        const r1 = new Rect_1.Rect(0, 0, 3, 4);
        r1.isZero.should.be.false;
        const r2 = new Rect_1.Rect(0, 0, 0, 0);
        r2.isZero.should.be.true;
    });
    it("Zero zeroes both vectors", function () {
        const r1 = new Rect_1.Rect(1, 1, 3, 4);
        r1.zero();
        r1.isZero.should.be.true;
    });
});
//# sourceMappingURL=RectTest.js.map