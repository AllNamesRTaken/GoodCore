import { Vec2 } from "../lib/struct/Vec2";
import assert = require("assert");
import {should} from "chai";
should();

describe("Vec2",
	function() {
		before(function() {

		});
		it("new should create correct sized vec2",
			function(){
				const v1 = new Vec2(2, 3);
				v1.x.should.equal(2);
				v1.y.should.equal(3);
			});
		it("Add adds correctly",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.Add(v2);
				v1.x.should.equal(6);
				v1.y.should.equal(8);
			});
		it("Subtract subtracts correctly",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.Subtract(v2);
				v1.x.should.equal(-2);
				v1.y.should.equal(-2);
			});
		it("Scale multiplies each factor with the corresponding factor in the scale vector",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.Scale(v2);
				v1.x.should.equal(8);
				v1.y.should.equal(15);
			});
		it("Multiply multiplies both factors with a scalar",
			function(){
				const v1 = new Vec2(2, 3);
				v1.Multiply(2);
				v1.x.should.equal(4);
				v1.y.should.equal(6);
			});
		it("Clone returns an exact clone",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = v1.Clone();
				v1.x.should.equal(v2.x);
				v1.y.should.equal(v2.y);
				v1.should.not.equal(v2);
			});
		it("Ceil performs ceiling on both factors",
			function(){
				const v1 = new Vec2(2.2, 3.8);
				v1.Ceil();
				v1.x.should.equal(3);
				v1.y.should.equal(4);
			});
		it("Equal compares 2 vectors",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(2, 3);
				const v3 = new Vec2(1, 1);
				v1.Equals(v2).should.be.true;
				v1.Equals(v3).should.be.false;
			});
		it("Equal compares 2 vectors with Epislon fault tolerance",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(2, 3 + Vec2.EPSILON);
				const v3 = new Vec2(2, 3 + 2 * Vec2.EPSILON);
				v1.AlmostEquals(v2).should.be.true;
				v1.AlmostEquals(v3).should.be.false;
			});
		it("Invert inverts both factors",
			function(){
				const v1 = new Vec2(2, 4);
				v1.Invert();
				v1.x.should.equal(-2);
				v1.y.should.equal(-4);
			});
		it("LengthSq = x^2 + y^2",
			function(){
				const v1 = new Vec2(2, 3);
				v1.LengthSq().should.equal(2 * 2 + 3 * 3);
			});
		it("Length = sqrt(x^2 + y^2)",
			function(){
				const v1 = new Vec2(2, 3);
				v1.Length().should.equal(Math.sqrt(2 * 2 + 3 * 3));
			});
		it("Set sets each factor to that of another vector",
			function(){
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(1, 2);
				v1.Set(v2);
				v1.x.should.equal(1);
				v1.y.should.equal(2);
			});
		it("Int makes it to an Int by flooring it",
			function(){
				const v1 = new Vec2(2.2, 3.8);
				v1.ToInt();
				v1.x.should.equal(2);
				v1.y.should.equal(3);
			});
		it("Decimal makes it to a decimal",
			function(){
				const v1 = new Vec2(2, 3);
				v1.ToDecimal();
				((v1.x) | 0).should.not.equal(v1.x);
				((v1.y) | 0).should.not.equal(v1.y);
				v1.ToInt();
				v1.x.should.equal(2);
				v1.y.should.equal(3);
			});
		it("Relate divides each factor by the corresponding factor in another vector",
			function(){
				const v1 = new Vec2(4, 12);
				const v2 = new Vec2(2, 4);
				v1.Relate(v2);
				v1.x.should.equal(2);
				v1.y.should.equal(3);
			});
		it("Normalize returns length 1 vector",
			function() {
				const v1 = new Vec2(3, 12);
				v1.Normalize().Length().should.equal(1);
			});
		it("Normalize of zero length vector returns 1,0",
			function() {
				const v1 = new Vec2(0, 0);
				v1.Normalize().Equals(new Vec2(1, 0)).should.be.true;
			});
		it("Rotate 1,0 Pi/2 returns correct vector 0,1",
			function() {
				const v1 = new Vec2(1, 0);
				v1.Rotate(Math.PI / 2).AlmostEquals(new Vec2(0, 1)).should.be.true;
			});
		it("HorizontalAngle returns Radians rotated counter clockwise from 1,0",
			function() {
				const v1 = new Vec2(1, 0);
				const v2 = new Vec2(0, 1);
				const v3 = new Vec2(-1, 0);
				const v4 = new Vec2(0, -1);
				v1.HorizontalAngle().should.equal(0);
				v2.HorizontalAngle().should.equal(Math.PI / 2);
				v3.HorizontalAngle().should.equal(Math.PI);
				v4.HorizontalAngle().should.equal(-Math.PI / 2);
			});
		it("VerticalAngle returns Radians rotated clockwise from 0,1",
			function() {
				const v1 = new Vec2(1, 0);
				const v2 = new Vec2(0, 1);
				const v3 = new Vec2(-1, 0);
				const v4 = new Vec2(0, -1);
				v1.VerticalAngle().should.equal(Math.PI / 2);
				v2.VerticalAngle().should.equal(0);
				v3.VerticalAngle().should.equal(-Math.PI / 2);
				v4.VerticalAngle().should.equal(Math.PI);
			});
		it("RotateAround returns vector rotated around a given point",
			function() {
				const v1 = new Vec2(1, 0);
				v1.RotateAround(new Vec2(-1, 0), Math.PI).AlmostEquals(new Vec2(-3, 0)).should.be.true;
			});
		it("GetNormal returns 0,-1 for 10,0",
			function() {
				const v1 = new Vec2(10, 0);
				const v2 = v1.GetNormal();
				v2.AlmostEquals(new Vec2(0, -1)).should.be.true;
			});
		it("RotateBy returns vector rotated from 1,0",
			function() {
				const v1 = new Vec2(0, 1);
				v1.RotateBy(Math.PI).AlmostEquals(new Vec2(-1, 0)).should.be.true;
			});
		it("ProjectOnto projects a vector onto another vector",
			function() {
				const v1 = new Vec2(2, 2);
				v1.ProjectOnto(new Vec2(3, 0)).Equals(new Vec2(2, 0)).should.be.true;
			});
		it("Dot returns the dotproduct of two vectors",
			function() {
				const v1 = new Vec2(2, 2);
				const v2 = new Vec2(-1, 3);
				v1.Dot(v2).should.equal(4);
			});
		it("Cross returns scalar value of the z component of the cross product in 3d ",
			function() {
				const v1 = new Vec2(2, 2);
				const v2 = new Vec2(-1, 3);
				v1.Cross(v2).should.equal(8);
			});

	}
);
