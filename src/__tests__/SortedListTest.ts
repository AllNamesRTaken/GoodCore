
import * as MocData from "../lib/MocData";
import { List } from "../lib/struct/List";
import { Comparer, SortedList } from "../lib/struct/SortedList";
import { Vec2 } from "../lib/struct/Vec2";

describe("SortedList",
	() => {
		beforeAll(
			() => {
				this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				this.list1 = new SortedList(Comparer.NumberAsc, [1, 4, 7, 2] as number[]);
				this.list2 = new SortedList(Comparer.NumberDesc, [4, 8, 1, 9] as number[]);
				this.list3 = new SortedList(((a: { a: number }, b: { a: number }) => a.a < b.a ? -1 : a.a === b.a ? 0 : 1), [{ a: 2 }, { a: 1 }] as any[]);
				this.list4 = new SortedList(Comparer.NumberAsc, [4, 8, 1, 9] as number[]);
			});
		test("getter length returns the length",
			() => {
				const list = this.list1 as SortedList<number>;
				expect(list.length).toBe(4);
			});
		test("getter comparer returns the comparer",
			() => {
				const list = this.list1 as SortedList<number>;
				expect(list.comparer).toBe(Comparer.NumberAsc);
			});
		test("setter comparer sets the comparer and resorts",
			() => {
				const list = this.list1 as SortedList<number>;
				list.comparer = Comparer.NumberDesc;
				expect(list.comparer).toBe(Comparer.NumberDesc);
				expect(list.values).toEqual([7, 4, 2, 1]);
				list.comparer = Comparer.NumberAsc;
			});
		test("Copy copies values correctly into target",
			() => {
				const list = this.list1 as SortedList<number>;
				const copy = new SortedList<number>(Comparer.NumberAsc);
				copy.copy(this.list1);
				expect(copy.values).toEqual(list.values);
				expect(copy.values).not.toBe(list.values);
			});
		test("clone copies values correctly into a new SortedList",
			() => {
				const list = this.list1 as SortedList<number>;
				const copy = list.clone();
				expect(copy.values).toEqual(list.values);
				expect(copy.values).not.toBe(list.values);
			});
		test("trucate shortens the list to given length",
			() => {
				const list = (this.list1 as SortedList<number>).clone();
				expect(list.truncate(2).length).toBe(2);
				expect(list.get(1)!).toBe(2);
			});
		test("trucate with no size empties array",
			() => {
				const list = (this.list1 as SortedList<number>).clone();
				expect(list.truncate().length).toBe(0);
			});
		test("trucate with large size keeps List as is",
			() => {
				const list = (this.list1 as SortedList<number>).clone();
				expect(list.truncate(123).length).toBe(4);
			});
		test("trucate with negative size takes from end",
			() => {
				const list = (this.list1 as SortedList<number>).clone();
				expect(list.truncate(-2).length).toBe(2);
				expect(list.get(1)!).toBe(7);
			});
		test("Fill fills an array with new data",
			() => {
				let list1 = new SortedList(Comparer.NumberAsc, [1, 4, 7, 2]);
				interface IDummy { a: number; }
				let list2 = new SortedList<IDummy>((a: IDummy, b: IDummy) => a.a < b.a ? -1 : a.a === b.a ? 0 : 1);
				let obj = { a: 1 };

				expect(list1.fill(-1, 0).values).toEqual([]);
				expect(list1.fill(2, 0).values).toEqual([0, 0]);
				expect(list1.fill(2, () => 1).values).toEqual([1, 1]);
				expect(list1.fill(3, (i) => i).values).toEqual([0, 1, 2]);
				expect(list1.fill(3, (i) => 3 - i).values).toEqual([1, 2, 3]);
				expect(list2.fill(2, obj).values).toEqual([{ a: 1 }, { a: 1 }]);
				expect(list2.get(0)!).not.toBe(obj);
			});
		test("bulkAdd adds multiple values",
			() => {
				const list = this.list1 as SortedList<number>;
				const copy = list.clone();
				copy.bulkAdd([1, 2, 3]);
				expect(copy.values).toEqual([1, 1, 2, 2, 3, 4, 7]);
				copy.bulkAdd(new SortedList(Comparer.NumberAsc, [8, 9]));
				expect(copy.values).toEqual([1, 1, 2, 2, 3, 4, 7, 8, 9]);
			});
		test("reverseUntil work like Until in reverse",
			() => {
				const list = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list.reverseUntil((el, i) => i === 1, (el, i) => listEl.push(el));
				expect(listEl).toEqual([7, 4]);
				const listEl2 = new Array<number>();
				list.reverseUntil((el, i) => (listEl2.push(el), i === 1));
				expect(listEl2).toEqual([7, 4, 2]);
			});
		test("reverseForEach work like ForEach in reverse",
			() => {
				const list = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list.reverseForEach((el, i) => { listEl.push(el); listi.push(i); });
				expect(listEl).toEqual(list.toList().reverse().values);
			});
		test("Get gets the value at a given position in the list",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.get(2)!).toBe(4);
			});
		test("Count returns the lists length",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.count).toBe(4);
			});
		test("Clear sets the size to 0",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.clear().count).toBe(0);
			});
		test("Add pushes a value onto the SortedList and returns the list",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.add(42).get(4)!).toBe(42);
			});
		test("Pop removes the last element in the list and returns it",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.pop()!).toBe(7);
			});
		test("Shift removes the first element in the list and returns it",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.shift()!).toBe(1);
			});
		test("Contains checks if a list contains a certain element",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.contains(4)).toBe(true);
				expect(list1.contains(42)).toBe(false);
			});
		test("Remove removes an element from the list",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.get(1)!).toBe(2);
				expect(list1.remove(4).contains(4)).toBe(false);
			});
		test("RemoveAt removes the element at a given position",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.get(2)!).toBe(4);
				expect(list1.removeAt(2)!).toBe(4);
				expect(list1.contains(4)).toBe(false);
			});
		test("RemoveFirst removes the first element from the list matching a function",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.get(1)!).toBe(2);
				expect(list1.removeFirst((el: number) => el === 2)!).toBe(2);
				expect(list1.contains(2)).toBe(false);
			});
		test("Filter returns filtered new list",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = list1.filter((el, i) => i > 1);
				expect(list2.values).toEqual([4, 7]);
			});
		test("Select returns filtered new list",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = list1.select((el, i) => i > 1);
				expect(list2.values).toEqual([4, 7]);
			});
		test("SelectInto uses supplied list",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<number>(Comparer.NumberAsc);
				list2.selectInto(list1, (el, i) => i > 1);
				expect(list2.values).toEqual([4, 7]);
				const list3 = new SortedList<number>(Comparer.NumberAsc);
				list3.selectInto(list1.values, (el, i) => i > 1);
				expect(list3.values).toEqual([4, 7]);
			});
		test("Head returns new list with fist x items",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.head(2).values).toEqual([1, 2]);
				expect(list1.head(-2).values).toEqual([]);
				expect(list1.head(20).values).toEqual([1, 2, 4, 7]);
			});
		test("Tail returns new list with last x items",
			() => {
				const list1 = this.list1 as List<any>;
				expect(list1.tail(2).values).toEqual([4, 7]);
				expect(list1.tail(-2).values).toEqual([]);
				expect(list1.tail(20).values).toEqual([1, 2, 4, 7]);
			});

		test("ForEach loops correctly",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); });
				expect(listEl).toEqual(this.list1.values);
				expect(listi).toEqual([0, 1, 2, 3]);
			});
		test("ForEach with startIndex loops correctly",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); }, 1);
				expect(listEl).toEqual([2, 4, 7]);
				expect(listi).toEqual([1, 2, 3]);
				const listEl2 = new Array<number>();
				list1.forEach((el, i) => { listEl2.push(el); listi.push(i); }, 42);
				expect(listEl2).toEqual([]);
			});
		test("IndexOf returns elements index or -1",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.indexOf(2)).toBe(1);
				expect(list1.indexOf((el: number) => el === 2)).toBe(1);
				expect(list1.indexOf(42)).toBe(-1);
			});
		test("Map el and i are correct",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.map((el, i) => el).values).toEqual([1, 2, 4, 7]);
				expect(list1.map((el, i) => i).values).toEqual([0, 1, 2, 3]);
			});
		test("MapInto maps correctly and sets length",
			() => {
				const list1 = this.list1 as SortedList<number>;
				let list2 = new SortedList<number>(Comparer.NumberAsc, [1, 2]);
				list2.mapInto(list1, (el, i) => el);
				expect(list2.values).toEqual([1, 2, 4, 7]);
				list2 = new SortedList<number>(Comparer.NumberAsc, [1, 2, 3, 4, 5]);
				list2.mapInto(list1, (el, i) => i);
				expect(list2.values).toEqual([0, 1, 2, 3]);
				let list3 = new SortedList<number>(Comparer.NumberAsc, [1, 2]);
				list3.mapInto(list1.values, (el, i) => el);
				expect(list3.values).toEqual([1, 2, 4, 7]);
			});
		test("Reduce works on numbers",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.reduce((acc, cur) => cur + acc, 0)).toBe(14);
			});
		test("ReduceUntil works like reduce with condition",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.reduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 4, "")).toBe("12");
			});
		test("ReverseReduce works on numbers",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.reverseReduce((acc: any[], cur) => (acc.push(cur), acc), [])).toEqual(list1.toList().reverse().values);
			});
		test("ReverseReduceUntil works like reverseReduce with condition",
			() => {
				const list1 = this.list1 as SortedList<number>;
				expect(list1.reverseReduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 2, "")).toBe("74");
			});
		test("First returns first element or first matching element",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.first()!).toBe(1);
				expect(list1.first((el) => el > 3)!).toBe(4);
				expect((list1.first((el) => el > 8) === undefined)).toBe(true);
			});
		test("Find returns the first matching element",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.find((el) => el > 3)!).toBe(4);
				expect((list1.find((el) => el > 8) === undefined)).toBe(true);
			});
		test("Last returns last element",
			() => {
				const list1 = this.list1.clone() as SortedList<number>;
				expect(list1.last()!).toBe(7);
			});
		test("ForSome works like Filtered ForEach",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forSome((el, i) => i > 1, (el, i) => listEl.push(el));
				list1.forSome((el, i) => i > 1, (el, i) => listi.push(i));
				expect(listEl).toEqual([4, 7]);
				expect(listi).toEqual([2, 3]);
			});
		test("Until work like ForEach where returning true breaks the loop",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el));
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i));
				expect(listEl).toEqual([1, 2]);
				expect(listi).toEqual([0, 1]);
			});
		test("Until with startIndex work like ForEach with startIndex where returning true breaks the loop",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el), 1);
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i), 1);
				expect(listEl).toEqual([2]);
				expect(listi).toEqual([1]);
				const listEl3 = new Array<number>();
				list1.until((el, i) => (listEl3.push(el), i >= 2), 42);
				expect(listEl3).toEqual([]);
			});
		test("Equals deep compares two lists",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<any>(list1.comparer, this.list1.toList().clone().reverse());
				const list3 = this.list2 as SortedList<number>;
				expect(list1.equals(list2)).toBe(true);
				expect(list1.equals(list3)).toBe(false);
			});
		test("Same deep compares two lists",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = new SortedList<any>(list1.comparer, this.list1.toList().clone().reverse());
				const list3 = this.list2 as SortedList<number>;
				expect(list1.same(list2)).toBe(true);
				expect(list1.same(list3)).toBe(false);
			});
		test("Union returns the union of two lists",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = this.list4 as SortedList<number>;
				const list3 = new SortedList(list1.comparer, []);
				const list4 = new List([3, 4]);
				const list5 = new List([3, 4, 8, 9, 10]);
				expect(list1.union(list2).values).toEqual([1, 2, 4, 7, 8, 9]);
				expect(list1.union(list3).values).toEqual([1, 2, 4, 7]);
				expect(list3.union(list1).values).toEqual([1, 2, 4, 7]);
				expect(list3.union(list3).values).toEqual([]);
				expect(list1.union(list4).values).toEqual([1, 2, 3, 4, 7]);
				expect(list1.union(list5).values).toEqual([1, 2, 3, 4, 7, 8, 9, 10]);
			});
		test("Intersect returns a list containing the intersection of 2 lists",
			() => {
				const list1 = this.list1 as SortedList<number>;
				const list2 = this.list4 as SortedList<number>;
				const list3 = new SortedList(list1.comparer, []);
				const list4 = new List<number>([2, 4, 42]);
				const list5 = new List<number>([100, 7, 2, 4, 42]);
				expect(list1.intersect(list2).values).toEqual([1, 4]);
				expect(list1.intersect(list3).values).toEqual([]);
				expect(list3.intersect(list1).values).toEqual([]);
				expect(list1.intersect(list4).values).toEqual([2, 4]);
				expect(list1.intersect(list5).values).toEqual([2, 4, 7]);
			});
		test("Some is true if any element is true",
			() => {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				expect(list1.some((el) => el === 3)).toBe(true);
				expect(list1.some((el) => el === 5)).toBe(false);
			});
		test("All is true if all elements are true",
			() => {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				expect(list1.all((el) => el > 0)).toBe(true);
				expect(list1.all((el) => el < 4)).toBe(false);
			});
		test("ToJson formats SortedList correct",
			() => {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				expect(JSON.stringify(list1)).toBe("[1,2,3,4]");
			});
		test("serialize works like a typed toJSON but deep",
			() => {
				const list1 = new SortedList(Comparer.NumberAsc, [1, 2, 3, 4]);
				expect(list1.toJSON()).toEqual(list1.serialize());

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
				expect(list2.serialize()).toEqual([1, 3]);
			});
		test("deserialize revives SortedList<T>",
			() => {
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
				expect(JSON.stringify(list1)).toBe("[1,2,3,4]");
				list2.deserialize([2, 1, 3, 4], Revivable);
				expect(JSON.stringify(list2)).toBe('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
				list3.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], Vec2);
				expect(JSON.stringify(list3)).toBe('[{"x":1,"y":1},{"x":2,"y":2}]');
			});
		test("descending string sort does sort descending",
			() => {
				let list5 = new SortedList(Comparer.StringDesc, ["b", "a", "b", "d", "c"] as string[]);
				expect(list5.values).toEqual(["d", "c", "b", "b", "a"]);
			});
		test("ascending string sort does sort ascending",
			() => {
				let list5 = new SortedList(Comparer.StringAsc, ["b", "a", "b", "d", "c"] as string[]);
				expect(list5.values).toEqual(["a", "b", "b", "c", "d"]);
			});
		test("descending number sort does sort descending",
			() => {
				let list5 = new SortedList(Comparer.NumberDesc, [2, 1, 2, 4, 3]);
				expect(list5.values).toEqual([4, 3, 2, 2, 1]);
			});
		test("ascending number sort does sort ascending",
			() => {
				let list5 = new SortedList(Comparer.NumberAsc, [2, 1, 2, 4, 3]);
				expect(list5.values).toEqual([1, 2, 2, 3, 4]);
			});
		test("should iterate correctly with for ... of",
			() => {
				let list = new SortedList(Comparer.NumberDesc, [2, 4, 7, 1]);
				let sum = 0;
				for (let v of list) {
					sum += v;
				}
				for (let v of list) {
					sum += v;
				}
				expect(sum).toBe(28);
			});

	}
);
