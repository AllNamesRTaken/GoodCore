import Range2 from "../lib/struct/Range2";
import Rect from "../lib/struct/Rect";
import Vec2 from "../lib/struct/Vec2";
import assert = require("assert");
import {should} from "chai";
should();

describe("Range2",
	function() {
		it("Equals return true if 2 ranges are the same",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				const r3 = new Range2(10, 1, 2, 3);
				r1.Equals(r2).should.be.true;
				r1.Equals(r3).should.be.false;
			});
		it("Left out constructor parameters are set to 0",
			function(){
				const r1 = new Range2();
				r1.Equals(new Range2(0, 0, 0, 0)).should.be.true;
			});
		it("Clone returns a clone",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = r1.Clone();
				r1.Equals(r1).should.be.true;
				r1.should.not.equal(r2);
			});
		it("Contains is true when a point is inside the range",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1.Contains(new Vec2(2, 2)).should.be.true;
			});

		it("First returns first point that fulfills a condition",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1
					.First(function(p){
						return p.Equals(new Vec2(2, 2));
					})
					.Equals(new Vec2(2, 2)).should.be.true;
			});
		it("ForEach loops over all points",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.ForEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return false;
				});
				x.should.deep.equal([1, 2, 1, 2, 1, 2]);
				y.should.deep.equal([1, 1, 2, 2, 3, 3]);
			});
		it("ForEach loops until function returns true",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.ForEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return p.Equals(new Vec2(2, 2));
				});
				x.should.deep.equal([1, 2, 1, 2]);
				y.should.deep.equal([1, 1, 2, 2]);
			});
		it("ForEach starts at given point if within range",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.ForEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return false;
				}, new Vec2(2, 2));
				x.should.deep.equal([2, 1, 2]);
				y.should.deep.equal([2, 3, 3]);
			});
		it("Scale multiplies size with the components of a vector",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1.Scale(new Vec2(2, 3), false).Equals(new Range2(1, 1, 4, 9)).should.be.true;
			});
		it("Scale can keep the center position",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1.Scale(new Vec2(2, 3)).Equals(new Range2(0, -2, 4, 9)).should.be.true;
			});
		it("Set copies all values into the target range",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(2, 3, 4, 5);
				r1.Set(r2);
				r1.Equals(r2).should.be.true;
				r1.should.not.equal(r2);
			});
		it("ToInt floors position to Integer",
			function(){
				const r1 = new Range2(1.2, 1.8, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				r1.ToInt().Equals(r2).should.be.true;
			});
		it("Decimal is not int",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				r1.ToDecimal().Equals(r2).should.be.false;
				r1.ToDecimal().ToInt().Equals(r2).should.be.true;
			});
		it("Translate treats the range as a rectangle and multiplies each point with a vector",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1.Translate(new Vec2(2, 3)).Equals(new Range2(2, 3, 4, 9)).should.be.true;
			});
		it("ToRect converts the range into a rect with end non-inclusive",
			function(){
				const r1 = new Range2(1, 1, 2, 3);
				r1.ToRect().Equals(new Rect(1, 1, 3, 4)).should.be.true;
			});
	}
);
