import { should } from "chai";
import * as MocData from "../lib/MocData";
import { List } from "../lib/struct/List";
import { Comparer, SortedList } from "../lib/struct/SortedList";
import { Vec2 } from "../lib/struct/Vec2";
import { proxyFn } from "../lib/Util";
should();

describe("SortedList",
	function () {
		before(
			function () {
				this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				this.list1 = new SortedList(Comparer.NumberAsc, [1, 4, 7, 2] as number[]);
				this.list2 = new SortedList(Comparer.NumberDesc, [4, 8, 1, 9] as number[]);
				this.list3 = new SortedList(((a: { a: number }, b: { a: number }) => a.a < b.a ? -1 : a.a === b.a ? 0 : 1), [{ a: 2 }, { a: 1 }] as any[]);
				this.list4 = new SortedList(Comparer.NumberAsc, [4, 8, 1, 9] as number[]);
			});
		it("getter length returns the length",
			function () {
				const list = this.list1 as SortedList<number>;
				list.length.should.equal(4);
			});
		it("getter comparer returns the comparer",
			function () {
				const list = this.list1 as SortedList<number>;
				list.comparer.should.equal(Comparer.NumberAsc);
			});
		it("setter comparer sets the comparer and resorts",
			function () {
				const list = this.list1 as SortedList<number>;
				list.comparer = Comparer.NumberDesc;
				list.comparer.should.equal(Comparer.NumberDesc);
				list.values.should.deep.equal([7, 4, 2, 1]);
				list.comparer = Comparer.NumberAsc;
			});
		it("Copy copies values correctly into target",
			function () {
				const list = this.list1 as SortedList<number>;
				const copy = new SortedList<number>(Comparer.NumberAsc);
				copy.copy(this.list1);
				copy.values.should.deep.equal(list.values);
				copy.values.should.not.equal(list.values);
			});
		it("clone copies values correctly into a new SortedList",
			function () {
				const list = this.list1 as SortedList<number>;
				const copy = list.clone();
				copy.values.should.deep.equal(list.values);
				copy.values.should.not.equal(list.values);
			});
		it("trucate shortens the list to given length",
			function () {
				const list = (this.list1 as SortedList<number>).clone();
				list.truncate(2).length.should.equal(2);
				list.get(1)!.should.equal(2);
			});
		it("trucate with no size empties array",
			function () {
				const list = (this.list1 as SortedList<number>).clone();
				list.truncate().length.should.equal(0);
			});
		it("trucate with large size keeps List as is",
			function () {
				const list = (this.list1 as SortedList<number>).clone();
				list.truncate(123).length.should.equal(4);
			});
		it("trucate with negative size takes from end",
			function () {
				const list = (this.list1 as SortedList<number>).clone();
				list.truncate(-2).length.should.equal(2);
				list.get(1)!.should.equal(7);
			});
		it("Fill fills an array with new data",
			function () {
				let list1 = new SortedList(Comparer.NumberAsc, [1, 4, 7, 2]);
				interface IDummy { a: number; }
				let list2 = new SortedList<IDummy>((a: IDummy, b: IDummy) => a.a < b.a ? -1 : a.a === b.a ? 0 : 1);
				let obj = { a: 1 };

				list1.fill(-1, 0).values.should.deep.equal([]);
				list1.fill(2, 0).values.should.deep.equal([0, 0]);
				list1.fill(2, () => 1).values.should.deep.equal([1, 1]);
				list1.fill(3, (i) => i).values.should.deep.equal([0, 1, 2]);
				list1.fill(3, (i) => 3 - i).values.should.deep.equal([1, 2, 3]);
				list2.fill(2, obj).values.should.deep.equal([{ a: 1 }, { a: 1 }]);
				list2.get(0)!.should.not.equal(obj);
			});
		it("bulkAdd adds multiple values",
			function () {
				const list = this.list1 as SortedList<number>;
				const copy = list.clone();
				copy.bulkAdd([1, 2, 3]);
				copy.values.should.deep.equal([1, 1, 2, 2, 3, 4, 7]);
				copy.bulkAdd(new SortedList(Comparer.NumberAsc, [8, 9]));
				copy.values.should.deep.equal([1, 1, 2, 2, 3, 4, 7, 8, 9]);
			});
		it("reverseUntil work like Until in reverse",
			function () {
				const list = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list.reverseUntil((el, i) => i === 1, (el, i) => listEl.push(el));
				listEl.should.deep.equal([7, 4]);
				const listEl2 = new Array<number>();
				list.reverseUntil((el, i) => (listEl2.push(el), i === 1));
				listEl2.should.deep.equal([7, 4, 2]);
			});
		it("reverseForEach work like ForEach in reverse",
			function () {
				const list = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list.reverseForEach((el, i) => { listEl.push(el); listi.push(i); });
				listEl.should.deep.equal(list.toList().reverse().values);
			});
		it("Get gets the value at a given position in the list",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.get(2)!.should.equal(4);
			});
		it("Count returns the lists length",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.count.should.equal(4);
			});
		it("Clear sets the size to 0",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.clear().count.should.equal(0);
			});
		it("Add pushes a value onto the SortedList and returns the list",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.add(42).get(4)!.should.equal(42);
			});
		it("Pop removes the last element in the list and returns it",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.pop()!.should.equal(7);
			});
		it("Shift removes the first element in the list and returns it",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.shift()!.should.equal(1);
			});
		it("Contains checks if a list contains a certain element",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.contains(4).should.be.true;
				list1.contains(42).should.be.false;
			});
		it("Remove removes an element from the list",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.get(1)!.should.equal(2);
				list1.remove(4).contains(4).should.be.false;
			});
		it("RemoveAt removes the element at a given position",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.get(2)!.should.equal(4);
				list1.removeAt(2)!.should.equal(4);
				list1.contains(4).should.be.false;
			});
		it("RemoveFirst removes the first element from the list matching a function",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.get(1)!.should.equal(2);
				list1.removeFirst((el: number) => el === 2)!.should.equal(2);
				list1.contains(2).should.be.false;
			});
		it("Filter returns filtered new list",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = list1.filter((el, i) => i > 1);
				list2.values.should.deep.equal([4, 7]);
			});
		it("Select returns filtered new list",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = list1.select((el, i) => i > 1);
				list2.values.should.deep.equal([4, 7]);
			});
		it("SelectInto uses supplied list",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<number>(Comparer.NumberAsc);
				list2.selectInto(list1, (el, i) => i > 1);
				list2.values.should.deep.equal([4, 7]);
				const list3 = new SortedList<number>(Comparer.NumberAsc);
				list3.selectInto(list1.values, (el, i) => i > 1);
				list3.values.should.deep.equal([4, 7]);
			});
		it("Head returns new list with fist x items",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.head(2).values.should.deep.equal([1, 2]);
				list1.head(-2).values.should.deep.equal([]);
				list1.head(20).values.should.deep.equal([1, 2, 4, 7]);
			});		
		it("Tail returns new list with last x items",
			function () {
				const list1 = this.list1 as List<any>;
				list1.tail(2).values.should.deep.equal([4, 7]);
				list1.tail(-2).values.should.deep.equal([]);
				list1.tail(20).values.should.deep.equal([1, 2, 4, 7]);
			});		

		it("ForEach loops correctly",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); });
				listEl.should.deep.equal(this.list1.values);
				listi.should.deep.equal([0, 1, 2, 3]);
			});
		it("ForEach with startIndex loops correctly",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); }, 1);
				listEl.should.deep.equal([2, 4, 7]);
				listi.should.deep.equal([1, 2, 3]);
				const listEl2 = new Array<number>();
				list1.forEach((el, i) => { listEl2.push(el); listi.push(i); }, 42);
				listEl2.should.deep.equal([]);
			});
		it("IndexOf returns elements index or -1",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.indexOf(2).should.equal(1);
				list1.indexOf((el: number) => el === 2).should.equal(1);
				list1.indexOf(42).should.equal(-1);
			});
		it("Map el and i are correct",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.map((el, i) => el).values.should.deep.equal([1, 2, 4, 7]);
				list1.map((el, i) => i).values.should.deep.equal([0, 1, 2, 3]);
			});
		it("MapInto maps correctly and sets length",
			function () {
				const list1 = this.list1 as SortedList<number>;
				let list2 = new SortedList<number>(Comparer.NumberAsc, [1, 2]);
				list2.mapInto(list1, (el, i) => el);
				list2.values.should.deep.equal([1, 2, 4, 7]);
				list2 = new SortedList<number>(Comparer.NumberAsc, [1, 2, 3, 4, 5]);
				list2.mapInto(list1, (el, i) => i);
				list2.values.should.deep.equal([0, 1, 2, 3]);
				let list3 = new SortedList<number>(Comparer.NumberAsc, [1, 2]);
				list3.mapInto(list1.values, (el, i) => el);
				list3.values.should.deep.equal([1, 2, 4, 7]);
			});
		it("Reduce works on numbers",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.reduce((acc, cur) => cur + acc, 0).should.equal(14);
			});
		it("ReduceUntil works like reduce with condition",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.reduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 4, "").should.equal("12");
			});
		it("ReverseReduce works on numbers",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.reverseReduce((acc: any[], cur) => (acc.push(cur), acc), []).should.deep.equal(list1.toList().reverse().values);
			});
		it("ReverseReduceUntil works like reverseReduce with condition",
			function () {
				const list1 = this.list1 as SortedList<number>;
				list1.reverseReduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 2, "").should.equal("74");
			});
		it("First returns first element or first matching element",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.first()!.should.equal(1);
				list1.first((el) => el > 3)!.should.equal(4);
				(list1.first((el) => el > 8) === undefined).should.be.true;
			});
		it("Find returns the first matching element",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.find((el) => el > 3)!.should.equal(4);
				(list1.find((el) => el > 8) === undefined).should.be.true;
			});
		it("Last returns last element",
			function () {
				const list1 = this.list1.clone() as SortedList<number>;
				list1.last()!.should.equal(7);
			});
		it("ForSome works like Filtered ForEach",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forSome((el, i) => i > 1, (el, i) => listEl.push(el));
				list1.forSome((el, i) => i > 1, (el, i) => listi.push(i));
				listEl.should.deep.equal([4, 7]);
				listi.should.deep.equal([2, 3]);
			});
		it("Until work like ForEach where returning true breaks the loop",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el));
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i));
				listEl.should.deep.equal([1, 2]);
				listi.should.deep.equal([0, 1]);
			});
		it("Until with startIndex work like ForEach with startIndex where returning true breaks the loop",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el), 1);
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i), 1);
				listEl.should.deep.equal([2]);
				listi.should.deep.equal([1]);
				const listEl3 = new Array<number>();
				list1.until((el, i) => (listEl3.push(el), i >= 2), 42);
				listEl3.should.deep.equal([]);
			});
		it("Equals deep compares two lists",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<any>(list1.comparer, this.list1.toList().clone().reverse());
				const list3 = this.list2 as SortedList<number>;
				list1.equals(list2).should.be.true;
				list1.equals(list3).should.be.false;
			});
		it("Same deep compares two lists",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<any>(list1.comparer, this.list1.toList().clone().reverse());
				const list3 = this.list2 as SortedList<number>;
				list1.same(list2).should.be.true;
				list1.same(list3).should.be.false;
			});
		it("Union returns the union of two lists",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = this.list4 as SortedList<number>;
				const list3 = new SortedList(list1.comparer, []);
				const list4 = new List([3, 4]);
				const list5 = new List([3, 4, 8, 9, 10]);
				list1.union(list2).values.should.deep.equal([1, 2, 4, 7, 8, 9]);
				list1.union(list3).values.should.deep.equal([1, 2, 4, 7]);
				list3.union(list1).values.should.deep.equal([1, 2, 4, 7]);
				list3.union(list3).values.should.deep.equal([]);
				list1.union(list4).values.should.deep.equal([1, 2, 3, 4, 7]);
				list1.union(list5).values.should.deep.equal([1, 2, 3, 4, 7, 8, 9, 10]);
			});
		it("Intersect returns a list containing the intersection of 2 lists",
			function () {
				const list1 = this.list1 as SortedList<number>;
				const list2 = this.list4 as SortedList<number>;
				const list3 = new SortedList(list1.comparer, []);
				const list4 = new List<number>([2, 4, 42]);
				const list5 = new List<number>([100, 7, 2, 4, 42]);
				list1.intersect(list2).values.should.deep.equal([1, 4]);
				list1.intersect(list3).values.should.deep.equal([]);
				list3.intersect(list1).values.should.deep.equal([]);
				list1.intersect(list4).values.should.deep.equal([2, 4]);
				list1.intersect(list5).values.should.deep.equal([2, 4, 7]);
			});
		it("Some is true if any element is true",
			function () {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				list1.some((el) => el === 3).should.be.true;
				list1.some((el) => el === 5).should.be.false;
			});
		it("All is true if all elements are true",
			function () {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				list1.all((el) => el > 0).should.be.true;
				list1.all((el) => el < 4).should.be.false;
			});
		it("ToJson formats SortedList correct",
			function () {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				JSON.stringify(list1).should.equal("[1,2,3,4]");
			});
		it("serialize works like a typed toJSON but deep",
			function () {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				list1.toJSON().should.deep.equal(list1.serialize());

				class Serializable {
					public foo: number;
					public bar: number;
					constructor(foo: number, bar: number) {
						this.foo = foo;
						this.bar = bar;
					}
					public serialize(): any {
						return this.foo;
					}
				}
				const list2 = new SortedList((a, b) => a.foo < b.foo ? -1 : a.foo === b.foo ? 0 : 1, [new Serializable(1, 2), new Serializable(3, 4)]);
				list2.serialize().should.deep.equal([1, 3]);
			});
		it("deserialize revives SortedList<T>",
			function () {
				class Revivable {
					public foo: number;
					public deserialize(data: number): Revivable {
						this.foo = data + 1;
						return this;
					}
				}
				const list1 = new SortedList<number>(Comparer.NumberAsc);
				const list2 = new SortedList<Revivable>((a, b) => a.foo < b.foo ? -1 : a.foo === b.foo ? 0 : 1);
				const list3 = new SortedList<Vec2>((a, b) => a.x < b.x ? -1 : a.x === b.x ? 0 : 1);
				list1.deserialize([2, 1, 3, 4]);
				JSON.stringify(list1).should.equal("[1,2,3,4]");
				list2.deserialize([2, 1, 3, 4], Revivable);
				JSON.stringify(list2).should.equal('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
				list3.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], Vec2);
				JSON.stringify(list3).should.equal('[{"x":1,"y":1},{"x":2,"y":2}]');
			});
		it("descending string sort does sort descending",
			function () {
				let list5 = new SortedList(Comparer.StringDesc, ["b", "a", "b", "d", "c"] as string[]);
				list5.values.should.deep.equal(["d", "c", "b", "b", "a"]);
			});
		it("ascending string sort does sort ascending",
			function () {
				let list5 = new SortedList(Comparer.StringAsc, ["b", "a", "b", "d", "c"] as string[]);
				list5.values.should.deep.equal(["a", "b", "b", "c", "d"]);
			});
		it("descending number sort does sort descending",
			function () {
				let list5 = new SortedList(Comparer.NumberDesc, [2, 1, 2, 4, 3]);
				list5.values.should.deep.equal([4, 3, 2, 2, 1]);
			});
		it("ascending number sort does sort ascending",
			function () {
				let list5 = new SortedList(Comparer.NumberAsc, [2, 1, 2, 4, 3]);
				list5.values.should.deep.equal([1, 2, 2, 3, 4]);
			});
		it("should iterate correctly with for ... of", 
			function () {
				let list = new SortedList(Comparer.NumberDesc, [2, 4, 7, 1]);
				let sum = 0;
				for (let v of list) {
					sum += v;
				}
				for (let v of list) {
					sum += v;
				}
				sum.should.equal(28);
			});

	}
);
