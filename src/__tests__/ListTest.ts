import * as MocData from "../lib/MocData";
import { List } from "../lib/struct/List";
import { Vec2 } from "../lib/struct/Vec2";
import { isUndefined, isNotNullOrUndefined } from "../lib/Test";

describe("List",
	() => {
		function values(obj: { [key: string]: any }): any[] {
			let keys = Object.keys(obj);
			return keys.map((k, i) => obj[k]);
		}
		function keys(obj: { [key: string]: any }): string[] {
			return Object.keys(obj);
		}
		beforeAll(
			() => {
				this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				this.list1 = new List([1, 4, 7, 2] as number[]);
				this.list2 = new List([4, 8, 1, 9] as number[]);
				this.list3 = new List(new List([{ a: 1 }, { a: 2 }] as any[]));
				this.indexed = new List();
				this.indexed.indexer = (el: number) => el;
			});
		test("setting indexer to null sets index to null",
			() => {
				const list = this.list1 as List<number>;
				expect((list.indexer === null)).toBe(true);
				expect(((list as any)._index === null)).toBe(true);
				list.indexer = (el) => el - 1;
				expect((isNotNullOrUndefined((list as any)._index))).toBe(true);
				list.indexer = null;
				expect(((list as any)._index === null)).toBe(true);
			});
		test("Copy copies values correctly into target",
			() => {
				const list = this.list1 as List<number>;
				const copy = new List<number>();
				const copy2 = new List<number>();
				copy.copy(list);
				expect(copy.values).toEqual(list.values);
				expect(copy.values).not.toBe(list.values);
				copy2.copy(list.values);
				expect(copy2.values).toEqual(list.values);
				expect(copy2.values).not.toBe(list.values);

				const indexed = (this.indexed as List<number>).clone();
				indexed.copy(list.values);
				expect(keys((indexed as any)._index)).toEqual(["1", "2", "4", "7"]);
				expect(values((indexed as any)._index)).toEqual([1, 2, 4, 7]);
				expect((indexed as any)._index[7]).toBe(7);
			});
		test("clone copies values correctly into a new List",
			() => {
				const list = this.list1 as List<number>;
				const copy = list.clone();
				expect(copy.values).toEqual(list.values);
				expect(copy.values).not.toBe(list.values);

				const org = (new List([1, 2, 3]));
				org.indexer = (el) => el - 1;
				const indexed = org.clone();
				expect(indexed.indexer!).toEqual(org.indexer);
			});
		test("trucate shortens the list to given length",
			() => {
				const list = (this.list1 as List<number>).clone();
				expect(list.truncate(2).length).toBe(2);
				expect(list.get(1)!).toBe(4);
			});
		test("trucate with no size empties array",
			() => {
				const list = (this.list1 as List<number>).clone();
				expect(list.truncate().length).toBe(0);
			});
		test("trucate with large size keeps List as is",
			() => {
				const list = (this.list1 as List<number>).clone();
				expect(list.truncate(123).length).toBe(4);
			});
		test("trucate with negative size takes elements from the end",
			() => {
				const list = (this.list1 as List<number>).clone();
				expect(list.truncate(-2).length).toBe(2);
				expect(list.get(1)!).toBe(2);
			});
		test("Fill fills an array with new data", () => {
			let list1 = new List([1, 4, 7, 2]);
			let list2 = new List<{ a: number }>();
			let obj = { a: 1 };

			expect(list1.fill(-1, 0).values).toEqual([]);
			expect(list1.fill(2, 0).values).toEqual([0, 0]);
			expect(list1.fill(2, () => 1).values).toEqual([1, 1]);
			expect(list1.fill(3, (i) => i).values).toEqual([0, 1, 2]);
			expect(list2.fill(2, obj).values).toEqual([{ a: 1 }, { a: 1 }]);
			expect(list2.get(0)!).not.toBe(obj);
		});
		test("Splice does splice",
			() => {
				let list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(-1, -1).values).toEqual([1, 4, 7, 2]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(-1).values).toEqual([]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice().values).toEqual([]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(100).values).toEqual([1, 4, 7, 2]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(1, 2).values).toEqual([1, 2]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(1, 2, [3, 4]).values).toEqual([1, 3, 4, 2]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(1, 2, new List([3, 4])).values).toEqual([1, 3, 4, 2]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(1, 100, [3, 4]).values).toEqual([1, 3, 4]);

				list1 = new List([1, 4, 7, 2]);
				expect(list1.splice(1, 1, [3, 4]).values).toEqual([1, 3, 4, 7, 2]);
			});
		test("ShallowCopy references same inner objects",
			() => {
				const list = this.list3 as List<any>;
				const copy = new List<number>();
				copy.shallowCopy(list);
				expect(copy.values[1]).toBe(list.values[1]);

				const indexed = new List<any>();
				indexed.indexer = (el: { a: number }) => 2 - el.a;
				indexed.shallowCopy(list.values);

				expect(keys((indexed as any)._index)).toEqual(["0", "1"]);
				expect(values((indexed as any)._index)).toEqual([{ a: 2 }, { a: 1 }]);
			});
		test("ShallowCopy can take array as input",
			() => {
				const arr = this.list3.values as any[];
				const copy = new List<number>();
				copy.shallowCopy(arr);
				expect(copy.values[1]).toBe(arr[1]);
			});
		test("Append appends a lists values or an array to another Lists values",
			() => {
				let list1 = this.list1.clone() as List<any>;
				const list2 = this.list2 as List<number>;
				expect(list1.append(list2).values).toEqual([1, 4, 7, 2, 4, 8, 1, 9]);
				list1 = this.list1.clone() as List<any>;
				expect(list1.append([4, 8, 1, 9]).values).toEqual([1, 4, 7, 2, 4, 8, 1, 9]);

				const indexed = (this.indexed as List<number>).clone();
				indexed.append(this.list1.values);

				expect(keys((indexed as any)._index)).toEqual(["1", "2", "4", "7"]);
				expect(values((indexed as any)._index)).toEqual([1, 2, 4, 7]);
			});
		test("Concat concatinates two lists values or arrays and returns as a new list",
			() => {
				const list1 = this.list1 as List<number>;
				const list2 = this.list2 as List<number>;
				expect(list1.concat(list2).values).toEqual([1, 4, 7, 2, 4, 8, 1, 9]);
				expect(list1.concat(list2.values).values).toEqual([1, 4, 7, 2, 4, 8, 1, 9]);
			});
		test("Get gets the value at a given position in the list",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.get(2)!).toBe(7);
			});
		test("getByIndex gets the value at a given index key in an indexed list",
			() => {
				const list1 = (this.list1 as List<number>).clone();
				expect((list1.getByIndex("k2") === undefined)).toBe(true);
				list1.indexer = (el: number) => `k${el}`;
				expect(list1.getByIndex("k2")!).toBe(2);
				expect((list1.getByIndex("k42") === undefined)).toBe(true);
			});
		test("Set sets a value at a given position if it exists in the list, or throws",
			() => {
				const list1 = (this.list1 as List<number>).clone();
				const list2 = (this.list1 as List<number>).clone();
				list2.indexer = (el) => el;
				expect(list1.set(2, 42).get(2)!).toBe(42);
				let err: Error | undefined;
				try {
					list1.set(4, 42);
				} catch (error) {
					err = error;
				}
				expect((err !== undefined)).toBe(true);
				expect(list2.set(2, 42).get(2)!).toBe(42);
			});
		test("Count returns the lists length",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.count).toBe(4);
			});
		test("Clear sets the size to 0",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.clear().count).toBe(0);
				expect(keys((list1 as any)._index)).toEqual([]);
				expect(values((list1 as any)._index)).toEqual([]);
			});
		test("Add pushes a value onto the List and returns the list",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.add(42).get(4)!).toBe(42);
				expect(list1.values).toEqual([1, 4, 7, 2, 42]);
				expect((list1 as any)._index[42]).toBe(42);
			});
		test("Push pushes a value onto the List and returns the index of the new element",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.push(42)).toBe(5);
				expect((list1 as any)._index[42]).toBe(42);
			});
		test("Pop removes the last element in the list and returns it",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect((list1 as any)._index[2]).toBe(2);
				expect(list1.pop()!).toBe(2);
				expect((list1 as any)._index[2] === undefined).toBe(true);
			});
		test("Shift removes the first element in the list and returns it",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect((list1 as any)._index[1]).toBe(1);
				expect(list1.shift()!).toBe(1);
				expect(((list1 as any)._index[1] === undefined)).toBe(true);
			});
		test("Contains checks if a list contains a certain element",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.contains(4)).toBe(true);
				expect(list1.contains(42)).toBe(false);
				expect(list1.contains((v) => v === 4)).toBe(true);
				expect(list1.contains((v) => v === 42)).toBe(false);

				const indexed = (this.indexed as List<number>).clone();
				indexed.add(4);
				expect(indexed.contains(4)).toBe(true);
				expect(indexed.contains(42)).toBe(false);
				expect((indexed as any)._index[4]).toBe(4);
			});
		test("Remove removes an element from the list",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.get(1)!).toBe(4);
				expect(list1.remove(4).contains(4)).toBe(false);
				expect(((list1 as any)._index[4] === undefined)).toBe(true);
			});
		test("RemoveFirst removes the first element from the list matching a function",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.get(1)!).toBe(4);
				expect(list1.removeFirst((el: number) => el === 4)!).toBe(4);
				expect(list1.contains(4)).toBe(false);
				expect(((list1 as any)._index[4] === undefined)).toBe(true);
				expect(isUndefined(list1.removeFirst((el: number) => el === -999))!).toBe(true);
			});
		test("RemoveAt removes the element at a given position",
			() => {
				const list1 = this.list1.clone() as List<number>;
				list1.indexer = (el) => el;
				expect(list1.get(2)!).toBe(7);
				expect(list1.removeAt(2)!).toBe(7);
				expect(list1.contains(7)).toBe(false);
				expect(((list1 as any)._index[7] === undefined)).toBe(true);
				expect(isUndefined(list1.removeAt(-1))!).toBe(true);
			});
		test("Filter returns filtered new list",
			() => {
				const list1 = this.list1 as List<number>;
				const list2 = list1.filter((el, i) => i > 1);
				expect(list2.values).toEqual([7, 2]);
			});
		test("Select returns filtered new list",
			() => {
				const list1 = this.list1 as List<number>;
				const list2 = list1.select((el, i) => i > 1);
				expect(list2.values).toEqual([7, 2]);
			});
		test("SelectInto uses supplied list",
			() => {
				const list1 = this.list1 as List<number>;
				const list2 = new List<number>();
				list2.selectInto(list1, (el, i) => i > 1);
				list2.indexer = (el) => el;
				expect(((list2 as any)._index[1] === undefined)).toBe(true);
				expect(((list2 as any)._index[7])).toBe(7);
				expect(list2.values).toEqual([7, 2]);
				const list3 = new List<number>();
				list3.selectInto(list1.values, (el, i) => i > 1);
				expect(list3.values).toEqual([7, 2]);
			});
		test("Head returns new list with fist x items",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.head(2).values).toEqual([1, 4]);
				expect(list1.head(-2).values).toEqual([]);
				expect(list1.head(20).values).toEqual([1, 4, 7, 2]);
			});
		test("Tail returns new list with last x items",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.tail(2).values).toEqual([7, 2]);
				expect(list1.tail(-2).values).toEqual([]);
				expect(list1.tail(20).values).toEqual([1, 4, 7, 2]);
			});
		test("OrderBy sorts the Lists values",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.orderBy((a, b) => a - b).values).toEqual([1, 2, 4, 7]);
			});
		test("ForEach loops correctly",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); });
				expect(listEl).toEqual(this.list1.values);
				expect(listi).toEqual([0, 1, 2, 3]);
			});
		test("ForEach with startIndex loops correctly",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); }, 1);
				expect(listEl).toEqual([4, 7, 2]);
				expect(listi).toEqual([1, 2, 3]);
				const listEl2 = new Array<number>();
				list1.forEach((el, i) => { listEl2.push(el); listi.push(i); }, 42);
				expect(listEl2).toEqual([]);
			});
		test("IndexOf returns elements index or -1",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.indexOf(2)).toBe(3);
				expect(list1.indexOf((el: number) => el === 2)).toBe(3);
				expect(list1.indexOf(42)).toBe(-1);
			});
		test("Map el and i are correct",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.map((el, i) => el).values).toEqual([1, 4, 7, 2]);
				expect(list1.map((el, i) => i).values).toEqual([0, 1, 2, 3]);
			});
		test("MapInto maps correctly and sets length",
			() => {
				const list1 = this.list1 as List<number>;
				let list2 = new List<number>([1, 2]);
				list2.indexer = (el) => el;
				list2.mapInto(list1, (el, i) => el);
				expect(list2.values).toEqual([1, 4, 7, 2]);
				expect(values((list2 as any)._index)).toEqual([1, 2, 4, 7]);

				list2 = new List<number>([1, 2, 3, 4, 5]);
				list2.mapInto(list1, (el, i) => i);
				expect(list2.values).toEqual([0, 1, 2, 3]);
				let list3 = new List<number>([1, 2]);
				list3.mapInto(list1.values, (el, i) => el);
				expect(list3.values).toEqual([1, 4, 7, 2]);
			});
		test("Reduce works on numbers",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.reduce((acc, cur) => cur + acc, 0)).toBe(14);
			});
		test("ReduceUntil works like reduce with condition",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.reduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 7, "")).toBe("14");
			});
		test("ReverseReduce works on numbers",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.reverseReduce((acc, cur) => (acc.push(cur), acc), [] as number[])).toEqual(list1.clone().reverse().values);
			});
		test("ReverseReduceUntil works like reverseReduce with condition",
			() => {
				const list1 = this.list1 as List<number>;
				expect(list1.reverseReduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 4, "")).toBe("27");
			});
		test("Reverse reverses the list elements",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.reverse().values).toEqual([2, 7, 4, 1]);
			});
		test("First returns first element or first matching element",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.first()!).toBe(1);
				expect(list1.first((el) => el > 3)!).toBe(4);
				expect((list1.first((el) => el > 8) === undefined)).toBe(true);
			});
		test("Find returns the first matching element",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.find((el) => el > 3)!).toBe(4);
				expect((list1.find((el) => el > 8) === undefined)).toBe(true);
			});
		test("Last returns last element",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.last()!).toBe(2);
			});
		test("Select filters out and returns new List",
			() => {
				const list1 = this.list1.clone() as List<number>;
				expect(list1.select((el, i) => el % 2 === 0).values).toEqual([4, 2]);
			});
		test("ForSome works like Filtered ForEach",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forSome((el, i) => i > 1, (el, i) => listEl.push(el));
				list1.forSome((el, i) => i > 1, (el, i) => listi.push(i));
				expect(listEl).toEqual([7, 2]);
				expect(listi).toEqual([2, 3]);
			});
		test("Until work like ForEach where returning true breaks the loop",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el));
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i));
				expect(listEl).toEqual([1, 4]);
				expect(listi).toEqual([0, 1]);
				const listEl2 = new Array<number>();
				const listi2 = new Array<number>();
				list1.until((el, i) => (listEl2.push(el), i >= 2));
				list1.until((el, i) => (listi2.push(i), i >= 2));
				expect(listEl2).toEqual([1, 4, 7]);
				expect(listi2).toEqual([0, 1, 2]);
				const listEl3 = new Array<number>();
				const listi3 = new Array<number>();
				list1.until((el: number, i) => el.valueOf() > 42, (el, i) => listEl3.push(el));
				list1.until((el: number, i) => el.valueOf() > 42, (el, i) => listi3.push(i));
				expect(listEl3).toEqual([1, 4, 7, 2]);
				expect(listi3).toEqual([0, 1, 2, 3]);
			});
		test("Until with startIndex work like ForEach with startIndex where returning true breaks the loop",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el), 1);
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i), 1);
				expect(listEl).toEqual([4]);
				expect(listi).toEqual([1]);
				const listEl2 = new Array<number>();
				const listi2 = new Array<number>();
				list1.until((el, i) => (listEl2.push(el), i >= 2), 1);
				list1.until((el, i) => (listi2.push(i), i >= 2), 1);
				expect(listEl2).toEqual([4, 7]);
				expect(listi2).toEqual([1, 2]);
				const listEl3 = new Array<number>();
				list1.until((el, i) => (listEl3.push(el), i >= 2), 42);
				expect(listEl3).toEqual([]);
			});
		test("reverseUntil work like Until in reverse",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				list1.reverseUntil((el, i) => i === 1, (el, i) => listEl.push(el));
				expect(listEl).toEqual([2, 7]);
				const listEl2 = new Array<number>();
				list1.reverseUntil((el, i) => (listEl2.push(el), i === 1));
				expect(listEl2).toEqual([2, 7, 4]);
			});
		test("reverseForEach work like ForEach in reverse",
			() => {
				const list1 = this.list1 as List<number>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.reverseForEach((el, i) => { listEl.push(el); listi.push(i); });
				expect(listEl).toEqual(this.list1.reverse().values);
			});
		test("Equals deep compares two lists",
			() => {
				const list1 = this.list1 as List<number>;
				const list2 = list1.clone() as List<number>;
				const list3 = this.list2 as List<number>;
				expect(list1.equals(list2)).toBe(true);
				expect(list1.equals(list3)).toBe(false);
			});
		test("Same checks if the same elements are in both lists",
			() => {
				const list1 = new List<number>([1, 4, 7, 2]);
				list1.indexer = (el) => el;
				const list2 = new List<number>([2, 4, 1, 7]);
				const list3 = new List<number>([1, 4, 7]);
				list3.indexer = (el) => el;
				const list4 = new List<number>([1, 4, 7, 3]);
				list4.indexer = (el) => el;
				const list5 = new List<number>();
				const list6 = new List<number>();

				expect(list1.same(list2)).toBe(true);
				expect(list2.same(list1)).toBe(true);
				expect(list1.same(list3)).toBe(false);
				expect(list1.same(list4)).toBe(false);
				expect(list5.same(list6)).toBe(true);
			});
		test("Union returns the union of two lists",
			() => {
				const list1 = new List<number>([1, 4, 7, 2]);
				list1.indexer = (el) => el;
				const list2 = new List<number>([4, 2, 8]);
				list2.indexer = (el) => el;
				const list3 = new List<number>([5, 4, 7, 8]);
				const list4 = new List<number>();

				expect(list1.union(list2).values).toEqual([1, 4, 7, 2, 8]);
				expect(list2.union(list3).values).toEqual([4, 2, 8, 5, 7]);
				expect(list1.union(list4).values).toEqual([1, 4, 7, 2]);
			});
		test("Intersect returns a list containing the intersection of 2 lists",
			() => {
				const list1 = new List<number>([1, 4, 7, 2]);
				list1.indexer = (el) => el;
				const list2 = new List<number>([4, 2, 8]);
				list2.indexer = (el) => el;
				const list3 = new List<number>([5, 4, 7, 8]);
				const list4 = new List<number>();

				expect(list1.intersect(list2).values).toEqual([4, 2]);
				expect(list2.intersect(list3).values).toEqual([4, 8]);
				expect(list1.intersect(list4).values).toEqual([]);
			});
		test("Subtract returns a list containing the the items of a - b",
			() => {
				const list1 = new List<number>([1, 4, 7, 2]);
				list1.indexer = (el) => el;
				const list2 = new List<number>([4, 2, 8]);
				list2.indexer = (el) => el;

				expect(list1.subtract(list2).values).toEqual([1, 7]);
			});
		test("Insert inserts an element at a position",
			() => {
				const list1 = new List([1, 2, 3, 4]);
				list1.indexer = (el) => el;
				list1.insertAt(2, 42);
				expect(list1.values).toEqual([1, 2, 42, 3, 4]);
				expect((list1 as any)._index[42]).toBe(42);
			});
		test("Some is true if any element is true",
			() => {
				const list1 = new List([1, 2, 3, 4]);
				expect(list1.some((el) => el === 3)).toBe(true);
				expect(list1.some((el) => el === 5)).toBe(false);
			});
		test("All is true if all elements are true",
			() => {
				const list1 = new List([1, 2, 3, 4]);
				expect(list1.all((el) => el > 0)).toBe(true);
				expect(list1.all((el) => el < 4)).toBe(false);
			});
		test("Zip zips two Lists",
			() => {
				const list1 = new List([1, 2, 3, 4]);
				const list2 = new List([5, 6, 7, 8]);
				const list3 = new List([5, 6, 7, 8, 9]);
				const list4 = new List([5, 6, 7]);
				expect(list1.zip(list2).values).toEqual([[1, 5], [2, 6], [3, 7], [4, 8]]);
				expect(list1.zip(list2, (t, u) => t - u).values).toEqual([-4, -4, -4, -4]);
				expect(list1.zip(list3, (t, u) => t - u).values).toEqual([-4, -4, -4, -4]);
				expect(list1.zip(list4, (t, u) => t - u).values).toEqual([-4, -4, -4]);
			});
		test("Unzip splits a list into 2 lists",
			() => {
				const list1 = new List([[1, 5], [2, 6], [3, 7], [4, 8]]);
				expect(list1.unzip()).toEqual([new List([1, 2, 3, 4]), new List([5, 6, 7, 8])]);
				expect(list1.unzip((el) => [el[1], el[0]])).toEqual([new List([5, 6, 7, 8]), new List([1, 2, 3, 4])]);
			});
		test("Flatten flattens any array or lists inside list",
			() => {
				const list1 = new List([[1, 2], 3, new List([4, [5, [6]]])]);
				expect(list1.flatten().values).toEqual([1, 2, 3, 4, 5, 6]);
			});
		test("Flatten flattens any array or lists inside list with max depth",
			() => {
				const list1 = new List([[1, 2], 3, new List([4, [5, [6]]])]);
				expect(list1.flatten(1).values).toEqual([1, 2, 3, 4, [5, [6]]]);
				expect(list1.flatten(0).equals(list1)).toBe(true);
			});
		test("toJSON formats List correct",
			() => {
				const list1 = new List([1, 2, 3, 4]);
				expect(JSON.stringify(list1)).toBe("[1,2,3,4]");
				class Serializable {
					public foo: number;
					public bar: number;
					constructor(foo: number, bar: number) {
						this.foo = foo;
						this.bar = bar;
					}
					public toJSON(): any {
						return this.foo;
					}
				}
				const list2 = new List([new Serializable(1, 2), new Serializable(3, 4)]);
				expect(JSON.stringify(list2)).toBe("[1,3]");
			});
		test("serialize works like a typed toJSON but deep",
			() => {
				const list1 = new List([1, 2, 3, 4]);
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
				const list2 = new List([new Serializable(1, 2), new Serializable(3, 4)]);
				expect(list2.serialize()).toEqual([1, 3]);
			});
		test("deserialize revives List<T>",
			() => {
				class Revivable {
					public foo: number;
					public deserialize(data: number): Revivable {
						this.foo = data + 1;
						return this;
					}
				}
				const list1 = new List<number>();
				const list2 = new List<Revivable>();
				const list3 = new List<Vec2>();
				list1.deserialize([1, 2, 3, 4]);
				expect(JSON.stringify(list1)).toBe("[1,2,3,4]");
				list2.deserialize([1, 2, 3, 4], Revivable);
				expect(JSON.stringify(list2)).toBe('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
				list3.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], Vec2);
				expect(JSON.stringify(list3)).toBe('[{"x":1,"y":1},{"x":2,"y":2}]');
			});
		test("should iterate correctly with for ... of",
			() => {
				let list = new List<number>([2, 4, 7, 1]);
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
