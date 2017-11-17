import { should } from "chai";
import * as MocData from "../lib/MocData";
import { List } from "../lib/struct/List";
should();

describe("List",
	function () {
		before(
			function () {
				this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				this.list1 = new List([1, 4, 7, 2] as number[]);
				this.list2 = new List([4, 8, 1, 9] as number[]);
				this.list3 = new List(new List([{ a: 1 }, { a: 2 }] as any[]));
			});
		it("Copy copies values correctly into target",
			function () {
				const list = this.list1 as List<number>;
				const copy = new List<number>();
				const copy2 = new List<number>();
				copy.copy(list);
				copy.values.should.deep.equal(list.values);
				copy.values.should.not.equal(list.values);
				copy2.copy(list.values);
				copy2.values.should.deep.equal(list.values);
				copy2.values.should.not.equal(list.values);
			});
		it("clone copies values correctly into a new List",
			function () {
				const list = this.list1 as List<number>;
				const copy = list.clone();
				copy.values.should.deep.equal(list.values);
				copy.values.should.not.equal(list.values);
			});
		it("ShallowCopy references same inner objects",
			function () {
				const list = this.list3 as List<any>;
				const copy = new List<number>();
				copy.shallowCopy(list);
				copy.values[1].should.equal(list.values[1]);
			});
		it("ShallowCopy can take array as input",
			function () {
				const arr = this.list3.values as any[];
				const copy = new List<number>();
				copy.shallowCopy(arr);
				copy.values[1].should.equal(arr[1]);
			});
		it("Append appends a lists values or an array to another Lists values",
			function () {
				let list1 = this.list1.clone() as List<any>;
				const list2 = this.list2 as List<any>;
				list1.append(list2).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
				list1 = this.list1.clone() as List<any>;
				list1.append([4, 8, 1, 9]).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
			});
		it("Concat concatinates two lists values or arrays and returns as a new list",
			function () {
				const list1 = this.list1 as List<any>;
				const list2 = this.list2 as List<any>;
				list1.concat(list2).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
				list1.concat(list2.values).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
			});
		it("Get gets the value at a given position in the list",
			function () {
				const list1 = this.list1 as List<any>;
				list1.get(2).should.equal(7);
			});
		it("Count returns the lists length",
			function () {
				const list1 = this.list1 as List<any>;
				list1.count.should.equal(4);
			});
		it("Clear sets the size to 0",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.clear().count.should.equal(0);
			});
		it("Add pushes a value onto the List and returns the list",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.add(42).get(4).should.equal(42);
			});
		it("Push pushes a value onto the List and returns the index of the new element",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.push(42).should.equal(5);
			});
		it("Pop removes the last element in the list and returns it",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.pop().should.equal(2);
			});
		it("Shift removes the first element in the list and returns it",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.shift().should.equal(1);
			});
		it("Contains checks if a list contains a certain element",
			function () {
				const list1 = this.list1 as List<any>;
				list1.contains(4).should.be.true;
				list1.contains(42).should.be.false;
			});
		it("Remove removes an element from the list",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.get(1).should.equal(4);
				list1.remove(4).contains(4).should.be.false;
			});
		it("RemoveFirst removes the first element from the list matching a function",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.get(1).should.equal(4);
				list1.removeFirst((el: number) => el === 4).should.equal(4);
				list1.contains(4).should.be.false;
			});
		it("RemoveAt removes the element at a given position",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.get(2).should.equal(7);
				list1.removeAt(2).should.equal(7);
				list1.contains(7).should.be.false;
			});
		it("Filter returns filtered new list",
			function () {
				const list1 = this.list1 as List<any>;
				const list2 = list1.filter((el, i) => i > 1);
				list2.values.should.deep.equal([7, 2]);
			});
		it("Select returns filtered new list",
			function () {
				const list1 = this.list1 as List<any>;
				const list2 = list1.select((el, i) => i > 1);
				list2.values.should.deep.equal([7, 2]);
			});
		it("SelectInto uses supplied list",
			function () {
				const list1 = this.list1 as List<any>;
				const list2 = new List<number>();
				list2.selectInto(list1, (el, i) => i > 1);
				list2.values.should.deep.equal([7, 2]);
				const list3 = new List<number>();
				list3.selectInto(list1.values, (el, i) => i > 1);
				list3.values.should.deep.equal([7, 2]);
			});
		it("OrderBy sorts the Lists values",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.orderBy((a, b) => a - b).values.should.deep.equal([1, 2, 4, 7]);
			});
		it("ForEach loops correctly",
			function () {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forEach((el, i) => { listEl.push(el); listi.push(i); });
				listEl.should.deep.equal(this.list1.values);
				listi.should.deep.equal([0, 1, 2, 3]);
			});
		it("IndexOf returns elements index or -1",
			function () {
				const list1 = this.list1 as List<any>;
				list1.indexOf(2).should.equal(3);
				list1.indexOf((el: number) => el === 2).should.equal(3);
				list1.indexOf(42).should.equal(-1);
			});
		it("Map el and i are correct",
			function () {
				const list1 = this.list1 as List<any>;
				list1.map((el, i) => el).values.should.deep.equal([1, 4, 7, 2]);
				list1.map((el, i) => i).values.should.deep.equal([0, 1, 2, 3]);
			});
		it("MapInto maps correctly and sets length",
			function () {
				const list1 = this.list1 as List<any>;
				let list2 = new List<number>([1, 2]);
				list2.mapInto(list1, (el, i) => el);
				list2.values.should.deep.equal([1, 4, 7, 2]);
				list2 = new List<number>([1, 2, 3, 4, 5]);
				list2.mapInto(list1, (el, i) => i);
				list2.values.should.deep.equal([0, 1, 2, 3]);
				let list3 = new List<number>([1, 2]);
				list3.mapInto(list1.values, (el, i) => el);
				list3.values.should.deep.equal([1, 4, 7, 2]);
			});
		it("Reduce works on numbers",
			function () {
				const list1 = this.list1 as List<any>;
				list1.reduce((acc, cur) => cur + acc).should.equal(14);
			});

		it("Reverse reverses the list elements",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.reverse().values.should.deep.equal([2, 7, 4, 1]);
			});
		it("First returns first element or first matching element",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.first().should.equal(1);
				list1.first((el) => el > 3).should.equal(4);
				(list1.first((el) => el > 8) === undefined).should.be.true;
			});
		it("Select filters out and returns new List",
			function () {
				const list1 = this.list1.clone() as List<any>;
				list1.select((el, i) => el % 2 === 0).values.should.deep.equal([4, 2]);
			});
		it("ForSome works like Filtered ForEach",
			function () {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.forSome((el, i) => i > 1, (el, i) => listEl.push(el));
				list1.forSome((el, i) => i > 1, (el, i) => listi.push(i));
				listEl.should.deep.equal([7, 2]);
				listi.should.deep.equal([2, 3]);
			});
		it("Until work like ForEach where returning true breaks the loop",
			function () {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.until((el, i) => i >= 2, (el, i) => listEl.push(el));
				list1.until((el, i) => i >= 2, (el, i) => listi.push(i));
				listEl.should.deep.equal([1, 4]);
				listi.should.deep.equal([0, 1]);
			});
		it("reverseUntil work like Until in reverse",
			function () {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.reverseUntil((el, i) => i < 2, (el, i) => listEl.push(el));
				listEl.should.deep.equal([2, 7]);
			});
		it("reverseForEach work like ForEach in reverse",
			function () {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.reverseForEach((el, i) => { listEl.push(el); listi.push(i); });
				listEl.should.deep.equal(this.list1.reverse().values);
			});
		it("Equals deep compares two lists",
			function () {
				const list1 = this.list1 as List<any>;
				const list2 = this.list1.clone() as List<any>;
				const list3 = this.list2 as List<any>;
				list1.equals(list2).should.be.true;
				list1.equals(list3).should.be.false;
			});
		it("Insert inserts an element at a position",
			function () {
				const list1 = new List([1, 2, 3, 4]);
				list1.insertAt(2, 42);
				list1.values.should.deep.equal([1, 2, 42, 3, 4]);
			});
		it("Some is true if any element is true",
			function () {
				const list1 = new List([1, 2, 3, 4]);
				list1.some((el) => el === 3).should.be.true;
				list1.some((el) => el === 5).should.be.false;
			});
		it("All is true if all elements are true",
			function () {
				const list1 = new List([1, 2, 3, 4]);
				list1.all((el) => el > 0).should.be.true;
				list1.all((el) => el < 4).should.be.false;
			});
		it("Zip zips two Lists",
			function () {
				const list1 = new List([1, 2, 3, 4]);
				const list2 = new List([5, 6, 7, 8]);
				const list3 = new List([5, 6, 7, 8, 9]);
				const list4 = new List([5, 6, 7]);
				list1.zip(list2).values.should.deep.equal([[1, 5], [2, 6], [3, 7], [4, 8]]);
				list1.zip(list2, (t, u) => t - u).values.should.deep.equal([-4, -4, -4, -4]);
				list1.zip(list3, (t, u) => t - u).values.should.deep.equal([-4, -4, -4, -4]);
				list1.zip(list4, (t, u) => t - u).values.should.deep.equal([-4, -4, -4]);
			});
		it("Unzip splits a list into 2 lists",
			function () {
				const list1 = new List([[1, 5], [2, 6], [3, 7], [4, 8]]);
				list1.unzip().should.deep.equal([new List([1, 2, 3, 4]), new List([5, 6, 7, 8])]);
				list1.unzip((el) => [el[1], el[0]]).should.deep.equal([new List([5, 6, 7, 8]), new List([1, 2, 3, 4])]);
			});
		it("Flatten flattens any array or lists inside list",
			function () {
				const list1 = new List([[1, 2], 3, new List([4, [5, [6]]])]);
				list1.flatten().values.should.deep.equal([1, 2, 3, 4, 5, 6]);
			});
		it("Flatten flattens any array or lists inside list with max depth",
			function () {
				const list1 = new List([[1, 2], 3, new List([4, [5, [6]]])]);
				list1.flatten(1).values.should.deep.equal([1, 2, 3, 4, [5, [6]]]);
			});
		it("ToJson formats List correct",
			function () {
				const list1 = new List([1, 2, 3, 4]);
				JSON.stringify(list1).should.equal("[1,2,3,4]");
			});
	}
);
