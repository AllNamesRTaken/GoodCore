import {should} from "chai";
import {expect} from "chai";
import * as MocData from "../lib/MocData";
import * as Obj from "../lib/Obj";
import { proxyFn } from "../lib/Util";
should();

describe("Obj",
	function() {
		class Able {
			public a = 1;
			public b = {c: 2};
			public d = [3, 4, 5];
			public clone() {
				const result = new Able();
				result.a = this.a;
				result.b = { c: this.b.c };
				result.d = [this.d[0], this.d[1], this.d[2]];
				return result;
			}
			public destroy() {

			}
			public clear() {
				
			}
		}
		before(
			function() {
				this.obj1 = {a: 1, b: {c: 2}, d: [3, 4, 5]};
			});
		it("Clone clones POJOs as well as uses the Clone fn on Classes with Clone()",
			function() {
				const clone1 = Obj.clone(this.obj1);
				clone1.should.deep.equal(this.obj1);
				clone1.should.not.equal(this.obj1);
				clone1.b.should.not.equal(this.obj1.b);
				let usedClone = false;
				const cloneable = new Able();
				proxyFn(cloneable, "clone", function(superfn) {
					usedClone = true;
					return superfn();
				});
				const clone2 = Obj.clone(cloneable);
				Obj.equals(clone2, cloneable).should.be.true;
				clone2.should.not.equal(cloneable);
				clone2.b.should.not.equal(cloneable.b);
				usedClone.should.be.true;
				let date1 = new Date();
				let dateClone = Obj.clone(date1);
				Obj.equals(date1, dateClone).should.be.true;
				date1.should.not.equal(dateClone);
				let regex = new RegExp("");
				let regexClone = Obj.clone(regex);
				Obj.equals(regex, regexClone).should.be.true;
				regex.should.not.equal(regexClone);
			});
		it("CloneInto clones and reuses same values",
			function() {
				const target: any = {};
				Obj.cloneInto(this.obj1, target);
				target.should.deep.equal(this.obj1);
				const part = target.b;
				target.a = 2;
				Obj.cloneInto(this.obj1, target);
				target.a.should.equal(this.obj1.a);
				target.b.should.equal(part);
				let arrTarget: any[] = [5, {a: 7}];
				Obj.cloneInto([1, {a: 4}], arrTarget);
				arrTarget[0].should.equal(1);
				arrTarget[1].a.should.equal(4);
			});
		it("Equals compares values deep and ignores functions",
			function() {
				let equals = false;
				class Equalable {
					public equals() {
						equals = true;
					}		
				}
				let obj1 = new Equalable();
				let obj2 = new Equalable();
				Obj.equals(obj1, obj2);
				equals.should.be.true;
				Obj.equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5]}).should.be.true;
				Obj.equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 999, 5]}).should.be.false;
				Obj.equals({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5], e() {}}).should.be.true;
			});
		it("IsDifferent checks differences deep",
			function() {
				Obj.isDifferent({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 4, 5]}).should.be.false;
				Obj.isDifferent({a: 1, b: {c: 2}, d: [3, 4, 5]}, {a: 1, b: {c: 2}, d: [3, 999, 5]}).should.be.true;
			});
		it("IsClassOf for same class or inherit is true otherwise false",
			function() {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				const str = "text";
				Obj.isClassOf(c1, c1).should.be.true;
				Obj.isClassOf(c1, other).should.be.true;
				Obj.isClassOf(c1, str).should.be.false;
			});
		it("Inherits is true for parent but no for same",
			function() {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				Obj.inherits(c1, c1).should.be.false;
				Obj.inherits(c1, other).should.be.true;
			});
		it("IsSameClass for same class is true otherwise false",
			function() {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				Obj.isSameClass(c1, c1).should.be.true;
				Obj.isSameClass(c1, other).should.be.false;
			});
		it("Mixin overwrites target",
			function() {
				Obj.mixin({foo: "bar", a: 10}, null, this.obj1).should.deep.equal({foo: "bar", a: 1, b: {c: 2}, d: [3, 4, 5]});
				Obj.mixin({foo: "bar", a: 10}, {a: true}, this.obj1).should.deep.equal({foo: "bar", a: 10, b: {c: 2}, d: [3, 4, 5]});
			});
		it("destroy nulls object properties or calls destroy() on object",
			function() {
				let obj = new Able();
				let destroyed = false;
				obj.destroy = () => { destroyed = true; };
				Obj.destroy(obj);
				destroyed.should.be.true;
				const obj2 = {a: 1, b: "foo"};				
				Obj.destroy(obj2);
				expect(obj2.a).to.be.null;
				expect(obj2.b).to.be.null;
			});
		it("setNull nulls object properties",
			function() {
				const obj = {a: 1, b: "foo"};
				Obj.setNull(obj);
				expect(obj.a).to.be.null;
				expect(obj.b).to.be.null;
				let obj2 = new Able();
				let cleared = false;
				obj2.clear = () => { cleared = true; };
				Obj.setNull(obj2);
				cleared.should.be.true;
			});
		it("SetProperties copys values to existing properties by ref",
			function() {
				const obj = {a: 0, b: 0};
				const obj2 = {c: 6, d: 5};
				Obj.setProperties(obj, this.obj1);
				obj.should.deep.equal({a: 1, b: {c: 2}});
				obj.b.should.equal(this.obj1.b);
				Obj.setProperties(obj, obj2, {c: "a", d: "b"});
				obj.should.deep.equal({a: 6, b: 5});
			});
		it("Wipe deletes all properties",
			function() {
				const obj = {a: 1, b: "foo"};
				Obj.wipe(obj);
				obj.should.deep.equal({});
			});
		it("ShallowCopy copys by ref",
			function() {
				const copy = Obj.shallowCopy(this.obj1);
				copy.should.deep.equal(this.obj1);
				copy.should.not.equal(this.obj1);
				copy.b.should.equal(this.obj1.b);
			});
	}
);
