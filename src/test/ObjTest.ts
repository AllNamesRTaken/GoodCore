import {should} from "chai";
import {expect} from "chai";
import { MocData } from "../lib/MocData";
import { Obj } from "../lib/Obj";
import { Util } from "../lib/Util";
should();

describe("Obj",
	function() {
		class Cloneable {
			public a = 1;
			public b = {c: 2};
			public d = [3, 4, 5];
			public Clone() {
				const result = new Cloneable();
				result.a = this.a;
				result.b = { c: this.b.c };
				result.d = [this.d[0], this.d[1], this.d[2]];
				return result;
			}
		}
		before(
			function() {
				this.obj1 = {a: 1, b: {c: 2}, d: [3, 4, 5]};
			});
		it("Clone clones POJOs as well as uses the Clone fn on Classes with Clone()",
			function() {
				const clone1 = Obj.Clone(this.obj1);
				clone1.should.deep.equal(this.obj1);
				clone1.should.not.equal(this.obj1);
				clone1.b.should.not.equal(this.obj1.b);
				let usedClone = false;
				const cloneable = new Cloneable();
				Util.ProxyFn((cloneable as any), "Clone", function(superfn) {
					usedClone = true;
					return superfn();
				});
				const clone2 = Obj.Clone(cloneable);
				Obj.Equals(clone2, cloneable).should.be.true;
				clone2.should.not.equal(cloneable);
				clone2.b.should.not.equal(cloneable.b);
				usedClone.should.be.true;
			});
		it("CloneInto clones and reuses same values",
			function() {
				const target: any = {};
				Obj.CloneInto(this.obj1, target);
				target.should.deep.equal(this.obj1);
				const part = target.b;
				target.a = 2;
				Obj.CloneInto(this.obj1, target);
				target.a.should.equal(this.obj1.a);
				target.b.should.equal(part);
			});
		it("Equals compares values deep and ignores functions",
			function() {
				Obj.Equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5]}).should.be.true;
				Obj.Equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 999, 5]}).should.be.false;
				Obj.Equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5], e() {}}).should.be.true;
			});
		it("IsDifferent checks differences deep",
			function() {
				Obj.IsDifferent({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5]}).should.be.false;
				Obj.IsDifferent({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 999, 5]}).should.be.true;
			});
		it("IsClassOf for same class or inherit is true otherwise false",
			function() {
				const c1 = new Cloneable();
				const c2 = new Cloneable();
				const other = new Object();
				const str = "text";
				Obj.IsClassOf(c1, c1).should.be.true;
				Obj.IsClassOf(c1, other).should.be.true;
				Obj.IsClassOf(c1, str).should.be.false;
			});
		it("Inherits is true for parent but no for same",
			function() {
				const c1 = new Cloneable();
				const c2 = new Cloneable();
				const other = new Object();
				Obj.Inherits(c1, c1).should.be.false;
				Obj.Inherits(c1, other).should.be.true;
			});
		it("IsSameClass for same class is true otherwise false",
			function() {
				const c1 = new Cloneable();
				const c2 = new Cloneable();
				const other = new Object();
				Obj.IsSameClass(c1, c1).should.be.true;
				Obj.IsSameClass(c1, other).should.be.false;
			});
		it("IsNullOrUndefined is true if any arg is null or undefined",
			function() {
				Obj.IsNullOrUndefined(1, {}, 0, false).should.be.false;
				Obj.IsNullOrUndefined(1, {}, null, false).should.be.true;
				Obj.IsNullOrUndefined(1, undefined, 0, false).should.be.true;
			});
		it("IsNotNullOrUndefined is true if no arg is null or undefined",
			function() {
				Obj.IsNotNullOrUndefined(1, {}, 0, false).should.be.true;
				Obj.IsNotNullOrUndefined(1, {}, null, false).should.be.false;
				Obj.IsNotNullOrUndefined(1, undefined, 0, false).should.be.false;
			});
		it("Mixin overwrites target",
			function() {
				Obj.Mixin({foo: "bar", a: 10}, null, this.obj1).should.deep.equal({foo: "bar", a: 1, b: {c: 2}, d: [3, 4, 5]});
				Obj.Mixin({foo: "bar", a: 10}, {a: true}, this.obj1).should.deep.equal({foo: "bar", a: 10, b: {c: 2}, d: [3, 4, 5]});
			});
		it("Null nulls object properties",
			function() {
				const obj = {a: 1, b: "foo"};
				Obj.Null(obj);
				expect(obj.a).to.be.null;
				expect(obj.b).to.be.null;
			});
		it("SetProperties copys values to existing properties by ref",
			function() {
				const obj = {a: 0, b: 0};
				Obj.SetProperties(obj, this.obj1);
				obj.should.deep.equal({a: 1, b: {c: 2}});
				obj.b.should.equal(this.obj1.b);
			});
		it("Wipe deletes all properties",
			function() {
				const obj = {a: 1, b: "foo"};
				Obj.Wipe(obj);
				obj.should.deep.equal({});
			});
		it("ShallowCopy copys by ref",
			function() {
				const copy = Obj.ShallowCopy(this.obj1);
				copy.should.deep.equal(this.obj1);
				copy.should.not.equal(this.obj1);
				copy.b.should.equal(this.obj1.b);
			});
	}
);
