import { Rect } from "../lib/struct/Rect";
import { Vec2 } from "../lib/struct/Vec2";
import assert = require("assert");
import {should} from "chai";
should();

describe("Rect",
	function() {
		it("Clone returns a clone",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.Clone();
				r2.start.Equals(new Vec2(1, 1)).should.be.true;
				r2.stop.Equals(new Vec2(3, 4)).should.be.true;
				r1.should.not.equal(r2);
			});
		it("Equals is true when comparing equal rectangles",
			function() {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = new Rect(1, 1, 3, 4);
				const r3 = new Rect(10, 1, 3, 4);
				r1.Equals(r2).should.be.true;
				r1.Equals(r3).should.be.false;
			});
		it("Left out constructor parameters are set to 0",
			function() {
				const r1 = new Rect();
				r1.Equals(new Rect(0, 0, 0, 0)).should.be.true;
			});
		it("Scale scales each dimension by the factors of a vector",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.Scale(new Vec2(2, 3), false);
				r2.start.Equals(new Vec2(1, 1)).should.be.true;
				r2.stop.Equals(new Vec2(5, 10)).should.be.true;
			});
		it("Scale can keep the center position by default",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.Scale(new Vec2(2, 3));
				r2.start.Equals(new Vec2(0, -2)).should.be.true;
				r2.stop.Equals(new Vec2(4, 7)).should.be.true;
			});
		it("ToInt floors each vector",
			function(){
				const r1 = new Rect(1.1, 1.2, 3.7, 4.8);
				r1.ToInt().Equals(new Rect(1, 1, 3, 4)).should.be.true;
			});
		it("ToDecimal is decimal",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				r1.ToDecimal();
				r1.Equals(new Rect(1, 1, 3, 4)).should.be.false;
				r1.ToInt().Equals(new Rect(1, 1, 3, 4)).should.be.true;
			});
		it("Translate converts the rect into a new system defined by a vector",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				r1.Translate(new Vec2(2, 3)).Equals(new Rect(2, 3, 6, 12)).should.be.true;
			});
		it("ToRange returns the correct Range",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				const range1 = r1.ToRange2();
				range1.pos.Equals(new Vec2(1, 1)).should.be.true;
				range1.size.Equals(new Vec2(2, 3)).should.be.true;
			});
		it("ToRange returns the correct Range with end inclusive",
			function(){
				const r1 = new Rect(1, 1, 3, 4, true);
				const range1 = r1.ToRange2();
				range1.pos.Equals(new Vec2(1, 1)).should.be.true;
				range1.size.Equals(new Vec2(3, 4)).should.be.true;
			});
		it("Area return the correct size of the rectangle",
			function(){
				const r1 = new Rect(1, 1, 3, 4);
				r1.Area().should.equal(6);
			});
		it("Move adds a vector to each point in the rectangle",
			function() {
				const r1 = new Rect(1, 1, 3, 4);
				r1.Move(new Vec2(2, 3)).Equals(new Rect(3, 4, 5, 7)).should.be.true;
			});
		it("Set sets start and stop vectors of Rect to that of another rect",
			function() {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = new Rect(4, 5, 6, 7);
				r2.Set(r1);
				r2.Equals(new Rect(1, 1, 3, 4)).should.be.true;
			});
	}
);
