import {should} from "chai";
import { MocData } from "../lib/MocData";
import { List } from "../lib/struct/List";
should();

describe("List",
	function() {
		before(
			function() {
				this.longArr = MocData.NumericArray(100, MocData.Type.RandomInt);
				this.list1 = new List([1, 4, 7, 2] as number[]);
				this.list2 = new List([4, 8, 1, 9] as number[]);
				this.list3 = new List([{a: 1}, {a: 2}] as any[]);
			});
		it("Copy copies values correctly into target",
			function() {
				const list = this.list1 as List<number>;
				const copy = new List<number>();
				copy.Copy(this.list1);
				copy.Values.should.deep.equal(list.Values);
				copy.Values.should.not.equal(list.Values);
			});
		it("Clone copies values correctly into a new List",
			function() {
				const list = this.list1 as List<number>;
				const copy = list.Clone();
				copy.Values.should.deep.equal(list.Values);
				copy.Values.should.not.equal(list.Values);
			});
		it("ShallowCopy references same inner objects",
			function() {
				const list = this.list3 as List<any>;
				const copy = new List<number>();
				copy.ShallowCopy(list);
				copy.Values[1].should.equal(list.Values[1]);
			});
		it("ShallowCopy can take array as input",
			function() {
				const arr = this.list3.Values as any[];
				const copy = new List<number>();
				copy.ShallowCopy(arr);
				copy.Values[1].should.equal(arr[1]);
			});
		it("Append appends a lists values or an array to another Lists values",
			function() {
				let list1 = this.list1.Clone() as List<any>;
				const list2 = this.list2 as List<any>;
				list1.Append(list2).Values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
				list1 = this.list1.Clone() as List<any>;
				list1.Append([4, 8, 1, 9]).Values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
			});
		it("Concat concatinates two lists values or arrays and returns as a new list",
			function() {
				const list1 = this.list1 as List<any>;
				const list2 = this.list2 as List<any>;
				list1.Concat(list2).Values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
				list1.Concat(list2.Values).Values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
			});
		it("Get gets the value at a given position in the list",
			function() {
				const list1 = this.list1 as List<any>;
				list1.Get(2).should.equal(7);
			});
		it("Count returns the lists length",
			function() {
				const list1 = this.list1 as List<any>;
				list1.Count.should.equal(4);
			});
		it("Clear sets the size to 0",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Clear().Count.should.equal(0);
			});
		it("Add pushes a value onto the List and returns the list",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Add(42).Get(4).should.equal(42);
			});
		it("Push pushes a value onto the List and returns the index of the new element",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Push(42).should.equal(5);
			});
		it("Pop removes the last element in the list and returns it",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Pop().should.equal(2);
			});
		it("Shift removes the first element in the list and returns it",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Shift().should.equal(1);
			});
		it("Contains checks if a list contains a certain element",
			function() {
				const list1 = this.list1 as List<any>;
				list1.Contains(4).should.be.true;
				list1.Contains(42).should.be.false;
			});
		it("Remove removes an element from the list",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Get(1).should.equal(4);
				list1.Remove(4).Contains(4).should.be.false;
			});
		it("RemoveAt removes the element at a given position",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Get(2).should.equal(7);
				list1.RemoveAt(2).Contains(7).should.be.false;
			});
		it("Select returns filtered new list",
			function() {
				const list1 = this.list1 as List<any>;
				const list2 = list1.Select((el, i) => i > 1);
				list2.Values.should.deep.equal([7, 2]);
			});
		it("SelectInto uses supplied list",
			function() {
				const list1 = this.list1 as List<any>;
				const list2 = new List<number>();
				list2.SelectInto(list1, (el, i) => i > 1);
				list2.Values.should.deep.equal([7, 2]);
			});
		it("OrderBy sorts the Lists values",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.OrderBy((a, b) => a - b).Values.should.deep.equal([1, 2, 4, 7]);
			});
		it("ForEach loops correctly",
			function() {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.ForEach((el, i) => {listEl.push(el); listi.push(i); });
				listEl.should.deep.equal(this.list1.Values);
				listi.should.deep.equal([0, 1, 2, 3]);
			});
		it("IndexOf returns elements index or -1",
			function() {
				const list1 = this.list1 as List<any>;
				list1.IndexOf(2).should.equal(3);
				list1.IndexOf(42).should.equal(-1);
			});
		it("Map el and i are correct",
			function() {
				const list1 = this.list1 as List<any>;
				list1.Map((el, i) => el).Values.should.deep.equal([1, 4, 7, 2]);
				list1.Map((el, i) => i).Values.should.deep.equal([0, 1, 2, 3]);
			});
		it("MapInto maps correctly and sets length",
			function() {
				const list1 = this.list1 as List<any>;
				let list2 = new List<number>([1, 2]);
				list2.MapInto(list1, (el, i) => el);
				list2.Values.should.deep.equal([1, 4, 7, 2]);
				list2 = new List<number>([1, 2, 3, 4, 5]);
				list2.MapInto(list1, (el, i) => i);
				list2.Values.should.deep.equal([0, 1, 2, 3]);
			});
		it("Reduce works on numbers",
			function() {
				const list1 = this.list1 as List<any>;
				list1.Reduce((acc, cur) => cur + acc).should.equal(14);
			});

		it("Reverse reverses the list elements",
			function() {
				const list1 = this.list1.Clone() as List<any>;
				list1.Reverse().Values.should.deep.equal([2, 7, 4, 1]);
			});
		it("Some works like Filtered ForEach",
			function() {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.Some((el, i) => i > 1, (el, i) => listEl.push(el));
				list1.Some((el, i) => i > 1, (el, i) => listi.push(i));
				listEl.should.deep.equal([7, 2]);
				listi.should.deep.equal([2, 3]);
			});
		it("Until work like ForEach where returning true breaks the loop",
			function() {
				const list1 = this.list1 as List<any>;
				const listEl = new Array<number>();
				const listi = new Array<number>();
				list1.Until((el, i) => { listEl.push(el); return i >= 1; });
				list1.Until((el, i) => { listi.push(i); return i >= 1; });
				listEl.should.deep.equal([1, 4]);
				listi.should.deep.equal([0, 1]);
			});
		it("Equals deep compares two lists",
			function(){
				const list1 = this.list1 as List<any>;
				const list2 = this.list1.Clone() as List<any>;
				const list3 = this.list2 as List<any>;
				list1.Equals(list2).should.be.true;
				list1.Equals(list3).should.be.false;
			});
		it("Insert inserts an element at a position",
			function() {
				const list1 = new List([1, 2, 3, 4]);
				list1.InsertAt(2, 42);
				list1.Values.should.deep.equal([1, 2, 42, 3, 4]);
			});
	}
);
