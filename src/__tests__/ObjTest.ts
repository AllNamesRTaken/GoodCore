
import * as Obj from "../lib/Obj";
import { proxyFn } from "../lib/Util";

describe("Obj",
	() => {
		class Able {
			public a = 1;
			public b = { c: 2 };
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
		let myObj: {
			a: number;
			b: {
				c: number;
			};
			d: number[];
		}; 
		beforeAll(
			() => {
				myObj = { a: 1, b: { c: 2 }, d: [3, 4, 5] };
			});
		test("Clone clones POJOs as well as uses the Clone fn on Classes with Clone()",
			() => {
				const clone1 = Obj.clone(myObj);
				expect(clone1).toEqual(myObj);
				expect(clone1).not.toBe(myObj);
				expect(clone1.b).not.toBe(myObj.b);
				let usedClone = false;
				const cloneable = new Able();
				proxyFn(cloneable, "clone", function (superfn) {
					usedClone = true;
					return superfn();
				});
				const clone2 = Obj.clone(cloneable);
				expect(Obj.equals(clone2, cloneable)).toBe(true);
				expect(clone2).not.toBe(cloneable);
				expect(clone2.b).not.toBe(cloneable.b);
				expect(usedClone).toBe(true);
				let date1 = new Date();
				let dateClone = Obj.clone(date1);
				expect(Obj.equals(date1, dateClone)).toBe(true);
				expect(date1).not.toBe(dateClone);
				let regex = new RegExp("");
				let regexClone = Obj.clone(regex);
				expect(Obj.equals(regex, regexClone)).toBe(true);
				expect(regex).not.toBe(regexClone);
			});
		test("CloneInto clones and reuses same values",
			() => {
				const target = {};
				Obj.cloneInto(myObj, target);
				expect(target).toEqual(myObj);
				const part = (target as any).b as any;
				(target as any).a = 2;
				Obj.cloneInto(myObj, target);
				expect((target as any).a).toBe(myObj.a);
				expect((target as any).b).toBe(part);
				let arrTarget: any[] = [5, { a: 7 }];
				Obj.cloneInto([1, { a: 4 }], arrTarget);
				expect(arrTarget[0]).toBe(1);
				expect((arrTarget[1] as any).a).toBe(4);
			});
		test("Equals compares values deep and ignores functions",
			() => {
				let equals = false;
				class Equalable {
					public equals() {
						equals = true;
					}
				}
				let obj1 = new Equalable();
				let obj2 = new Equalable();
				Obj.equals(obj1, obj2);
				expect(equals).toBe(true);
				expect(Obj.equals({ a: 1, b: { c: 2 }, d: [3, 4, 5] }, { a: 1, b: { c: 2 }, d: [3, 4, 5] })).toBe(true);
				expect(Obj.equals({ a: 1, b: { c: 2 }, d: [3, 4, 5] }, { a: 1, b: { c: 2 }, d: [3, 999, 5] })).toBe(false);
				expect(Obj.equals({ a: 1, b: { c: 2 }, d: [3, 4, 5] }, { a: 1, b: { c: 2 }, d: [3, 4, 5], e() { } })).toBe(true);
			});
		test("IsDifferent checks differences deep",
			() => {
				expect(Obj.isDifferent({ a: 1, b: { c: 2 }, d: [3, 4, 5] }, { a: 1, b: { c: 2 }, d: [3, 4, 5] })).toBe(false);
				expect(Obj.isDifferent({ a: 1, b: { c: 2 }, d: [3, 4, 5] }, { a: 1, b: { c: 2 }, d: [3, 999, 5] })).toBe(true);
			});
		test("IsClassOf for same class or inherit is true otherwise false",
			() => {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				const str = "text";
				expect(Obj.isClassOf(c1, c1)).toBe(true);
				expect(Obj.isClassOf(c1, other)).toBe(true);
				expect(Obj.isClassOf(c1, str)).toBe(false);
			});
		test("Inherits is true for parent but no for same",
			() => {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				expect(Obj.inherits(c1, c1)).toBe(false);
				expect(Obj.inherits(c1, other)).toBe(true);
			});
		test("IsSameClass for same class is true otherwise false",
			() => {
				const c1 = new Able();
				const c2 = new Able();
				const other = new Object();
				expect(Obj.isSameClass(c1, c1)).toBe(true);
				expect(Obj.isSameClass(c1, other)).toBe(false);
			});
		test("Mixin overwrites target",
			() => {
				expect(Obj.mixin({ foo: "bar", a: 10 }, null, myObj)).toEqual({ foo: "bar", a: 1, b: { c: 2 }, d: [3, 4, 5] });
				expect(Obj.mixin({ foo: "bar", a: 10 }, { a: true }, myObj)).toEqual({ foo: "bar", a: 10, b: { c: 2 }, d: [3, 4, 5] });
			});
		test("Mixin handles functions",
			() => {
				expect(Obj.mixin({ foo: "bar", a: 10 }, null, function someFn() { })).toEqual({ foo: "bar", a: 10 });
			});
		test("Mixin ignores undefined",
			() => {
				expect(Obj.mixin({ foo: "bar", a: 10 }, null, undefined as any, { b: 20 })).toEqual({ foo: "bar", a: 10, b: 20 });
			});
		test("destroy nulls object properties or calls destroy() on object",
			() => {
				let obj = new Able();
				let destroyed = false;
				obj.destroy = () => { destroyed = true; };
				Obj.destroy(obj);
				expect(destroyed).toBe(true);
				const obj2 = { a: 1, b: "foo" };
				Obj.destroy(obj2);
				expect(obj2.a).toBe(null);
				expect(obj2.b).toBe(null);
			});
		test("setNull nulls object properties",
			() => {
				const obj = { a: 1, b: "foo" };
				Obj.setNull(obj);
				expect(obj.a).toBe(null);
				expect(obj.b).toBe(null);
				let obj2 = new Able();
				let cleared = false;
				obj2.clear = () => { cleared = true; };
				Obj.setNull(obj2);
				expect(cleared).toBe(true);
			});
		test("SetProperties copys values to all properties by ref",
			() => {
				const obj = { a: 0, b: 0 };
				const obj2 = { c: 6, d: 5 };
				Obj.setProperties(obj, myObj as any);
				expect(obj).toEqual({ a: 1, b: { c: 2 }, d: [3, 4, 5] });
				expect(obj.b).toBe(myObj.b);
				Obj.setProperties(obj, obj2, { c: "a", d: "b" });
				expect(obj).toEqual({ a: 6, b: 5, d: [3, 4, 5] });
				const obj3 = {a: 1};
				Obj.setProperties(obj3, {b: 2});
				expect((obj3 as any).b).toEqual(2);
			});
		test("SetProperties with limitToExisting=true copys values only to existing properties by ref",
			() => {
				const obj = { a: 0, b: 0 };
				const obj2 = { c: 6, d: 5 };
				Obj.setProperties(obj, myObj as any, undefined, true);
				expect(obj).toEqual({ a: 1, b: { c: 2 } });
				expect(obj.b).toBe(myObj.b);
				Obj.setProperties(obj, obj2, { c: "a", d: "b" }, true);
				expect(obj).toEqual({ a: 6, b: 5 });
				const obj3 = {a: 1};
				Obj.setProperties(obj3, {b: 2}, undefined, true);
				expect((obj3 as any).b).toBeUndefined();
			});
		test("Wipe deletes all properties",
			() => {
				const obj = { a: 1, b: "foo" };
				Obj.wipe(obj);
				expect(obj).toEqual({});
			});
		test("ShallowCopy copys by ref",
			() => {
				const copy = Obj.shallowCopy(myObj);
				expect(copy).toEqual(myObj);
				expect(copy).not.toBe(myObj);
				expect(copy.b).toBe(myObj.b);
			});
		test("forEach loops over all keys",
			() => {
				const obj = { a: 1, b: "2", c: false, d: "never this" };
				let result: Indexable<any> = {};
				Obj.forEach(obj, (value: any, key: string) => {
					result[key] = value;
					if (value === false) { return false; }
				});
				expect(result.a).toBe(obj.a);
				expect(result.b).toBe(obj.b);
				expect(result.c).toBe(obj.c);
				expect((result.d === undefined)).toBe(true);

			});
		test("forEach handles arrays",
			() => {
				const obj = [10, 20, 30, null];
				let result: any = {};
				Obj.forEach(obj, (value: any, key: string | number) => {
					if (value === null) { return false; }
					(result as any)[key] = value;
				});
				expect((result as any)["0"]).toBe(10);
				expect((result as any)["1"]).toBe(20);
				expect((result as any)["2"]).toBe(30);
				expect(((result as any)["3"] === undefined)).toBe(true);

			});
		test("Transform returns object with correct prototype and properties",
			() => {
				class Iter {
					public a = 1;
					public b = "2";
					public c = "string";
				}
				const iteratee = new Iter();
				let result = Obj.transform<Indexable<any>>(iteratee, (result: Indexable<any>, value: any, key: string) => {
					result[key] = !isNaN(parseInt(value as string, 10)) ? parseInt(value as string, 10) : value;
				});
				expect(result.a).toBe(1);
				expect(result.b).toBe(2);
				expect(result.c).toBe("string");
				expect(Obj.isSameClass(result, iteratee)).toBe(true);

				let result2 = Obj.transform(iteratee, (result: Indexable<any>, value: any, key: string) => {
					result[key] = !isNaN(parseInt(value as string, 10)) ? parseInt(value as string, 10) : value;
				}, {});
				expect(result2.a).toBe(1);
				expect(result2.b).toBe(2);
				expect(result2.c).toBe("string");
				expect(Obj.isSameClass(result2, iteratee)).toBe(false);
			});
		test("Difference returns object with correct properties",
			() => {
				const iteratee = { a: 1, b: "2" };
				const base = { a: 4, b: "2", c: false };
				let result = Obj.difference(iteratee, base);
				expect(result.a).toBe(1);
				expect(result.b).toBe("2");
				expect(result.hasOwnProperty("b")).toBe(false);
				expect(((result as any).c === undefined)).toBe(true);
			});
		test("Difference returns object with correct prototype",
			() => {
				class Iter {
					public a = 1;
					public b = "2";
				}
				const iteratee = new Iter();
				const base = { a: 4, b: "2", c: false };
				let result = Obj.difference(iteratee, base);
				expect(result.a).toBe(1);
				expect(result.b).toBe("2");
				expect(result.hasOwnProperty("b")).toBe(false);
				expect(((result as any).c === undefined)).toBe(true);
				expect(Obj.isSameClass(result, iteratee)).toBe(true);
			});
	}
);
