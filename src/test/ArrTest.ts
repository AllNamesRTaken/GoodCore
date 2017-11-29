import {should} from "chai";
import * as Arr from "../lib/Arr";
import * as MocData from "../lib/MocData";
import { assert } from "../lib/Util";
should();

describe("Arrays",
	function() {
		before(
			function() {
				this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				this.arr1 = [1, 4, 7, 2] as number[];
				this.arr2 = [4, 8, 1, 9] as number[];
				this.arr3 = [{a: 1}, {a: 2}] as any[];
			});
		it("DeepCopy copies values correctly",
			function() {
				assert(false, "this works");
				const arr = this.arr1;
				const copy = Arr.deepCopy(arr);
				copy.should.deep.equal(arr);
				copy.should.not.equal(arr);
			});
		it("ShallowCopy references same inner objects",
			function() {
				const arr = this.arr3;
				const copy = Arr.shallowCopy(arr);
				copy[1].should.equal(arr[1]);
			});
		it("Append appends two arrays into the first",
			function() {
				const copy = Arr.shallowCopy(this.arr1);
				Arr.append(copy, this.arr2);
				const len = this.arr1.length + this.arr2.length;
				copy.length.should.equal(this.arr1.length + this.arr2.length);
				copy.should.deep.equal(this.arr1.concat(this.arr2));
			});
		it("Concat works and does not change the sources",
			function() {
				const copy1 = Arr.deepCopy(this.arr1);
				const copy2 = Arr.deepCopy(this.arr2);
				const result = Arr.concat(copy1, copy2);
				const len = this.arr1.length + this.arr2.length;
				result.length.should.equal(len);
				result.should.deep.equal(this.arr1.concat(this.arr2));
				copy1.should.deep.equal(this.arr1);
				copy2.should.deep.equal(this.arr2);
			});
		it("DeepCopyInto works and copies into target",
			function() {
				const copy = Arr.shallowCopy(this.arr1);
				Arr.deepCopyInto(this.arr2, copy);
				copy.should.deep.equal(this.arr2);
				copy.should.not.equal(this.arr2);
			});
		it("Deepfill works like deepcopy at a position",
			function() {
				const copy = Arr.shallowCopy(this.arr1);
				Arr.deepFill(this.arr2, copy, 2);
				const len = 2 + this.arr2.length;
				copy.length.should.equal(len);
				copy.should.deep.equal([1, 4, 4, 8, 1, 9]);
			});
		it("IndexOf returns correct index",
			function() {
				Arr.indexOf(this.arr1, (el) => el === 7).should.equal(2);
				Arr.indexOf(this.arr1, (el) => el === 17).should.equal(-1);
			});
		it("Filter returns correct array",
			function() {
				const copy = Arr.filter(this.arr1, (el, i) => i > 1);
				copy.should.deep.equal([7, 2]);
			});
		it("FilterInto uses supplied array",
			function() {
				const copy = Arr.shallowCopy(this.arr1);
				Arr.filterInto(this.arr2, copy, (el, i) => i > 1);
				copy.should.deep.equal([1, 9]);
			});
		it("Flatten returns correct array",
			function() {
				const copy = Arr.flatten([1, [2, 3], 4]);
				copy.should.deep.equal([1, 2, 3, 4]);
			});
		it("ForEach loops correctly",
			function() {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.forEach(this.arr1 as number[], (el, i) => {arrEl.push(el); arri.push(i); });
				arrEl.should.deep.equal(this.arr1);
				arri.should.deep.equal([0, 1, 2, 3]);
			});
		it("ReverseForEach loops correctly",
			function() {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.reverseForEach(this.arr1 as number[], (el, i) => {arrEl.push(el); arri.push(i); });
				arrEl.should.deep.equal(Arr.reverse(Arr.shallowCopy(this.arr1)));
				arri.should.deep.equal([3, 2, 1, 0]);
			});
		it("IndexOfElement returns correct index",
			function() {
				Arr.indexOfElement(this.arr1, 7).should.equal(2);
				Arr.indexOfElement(this.arr1, 17).should.equal(-1);
			});
		it("Map el and i are correct",
			function() {
				Arr.map(this.arr1 as number[], (el, i) => el).should.deep.equal([1, 4, 7, 2]);
				Arr.map(this.arr1 as number[], (el, i) => i).should.deep.equal([0, 1, 2, 3]);
			});
		it("MapInto maps correctly and sets length",
			function() {
				let copy = [1, 2];
				Arr.mapInto(this.arr1 as number[], copy, (el, i) => el);
				copy.should.deep.equal([1, 4, 7, 2]);
				copy = [1, 2, 3, 4, 5];
				Arr.mapInto(this.arr1 as number[], copy, (el, i) => i);
				copy.should.deep.equal([0, 1, 2, 3]);
			});
		it("Reduce works on numbers",
			function() {
				Arr.reduce(this.arr1 as number[], (acc, cur) => cur + acc, 0).should.equal(14);
			});
		it("RemoveAt removes correct item",
			function() {
				const arr = [1, 2, 3, 4];
				Arr.removeAt(arr, 2).should.equal(3);
				arr.should.deep.equal([1, 2, 4]);
			});
		it("Remove removes correct element",
			function() {
				const arr = [1, 2, 3, 4];
				Arr.remove(arr, 2);
				arr.should.deep.equal([1, 3, 4]);
			});
		it("RemoveOneByFn removes correct element",
			function() {
				const arr = [1, 2, 3, 4];
				Arr.removeOneByFn(arr, (el) => el > 2);
				arr.should.deep.equal([1, 2, 4]);
			});
		it("Reverse reverses the array",
			function() {
				const arr = [1, 2, 3, 4];
				Arr.reverse(arr);
				arr.should.deep.equal([4, 3, 2, 1]);
			});
		it("ShallowCopyInto copys correctly and keeps references",
			function() {
				const copy = [1, 2, 3, 4];
				Arr.shallowCopyInto(this.arr3, copy);
				copy.should.deep.equal(this.arr3);
				copy[1].should.equal(this.arr3[1]);
			});
		it("ShallowFill works like ShallowCopyInto but at a position",
			function() {
				const copy = [1, 2, 3, 4];
				Arr.shallowFill(this.arr3, copy, 2);
				copy.should.deep.equal([1, 2, {a: 1}, {a: 2}]);
				copy[2].should.equal(this.arr3[0]);
			});
		it("Slice does slice",
			function() {
				Arr.slice(this.arr1, 1, 2).should.deep.equal([4, 7]);
			});
		it("ForSome works like Filtered ForEach",
			function() {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.forSome(this.arr1 as number[], (el, i) => i > 1, (el, i) => arrEl.push(el));
				Arr.forSome(this.arr1 as number[], (el, i) => i > 1, (el, i) => arri.push(i));
				arrEl.should.deep.equal([7, 2]);
				arri.should.deep.equal([2, 3]);
			});
		it("Until work like ForEach where returning true breaks the loop",
			function() {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.until(this.arr1 as number[], (el, i) => i >= 2, (el, i) => arrEl.push(el) );
				Arr.until(this.arr1 as number[], (el, i) => i >= 2, (el, i) => arri.push(i) );
				arrEl.should.deep.equal([1, 4]);
				arri.should.deep.equal([0, 1]);
			});
		it("ReverseUntil work like ReverseForEach where returning true breaks the loop",
			function() {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.reverseUntil(this.arr1 as number[], (el, i) => i <= 1, (el, i) => arrEl.push(el) );
				Arr.reverseUntil(this.arr1 as number[], (el, i) => i <= 1, (el, i) => arri.push(i) );
				arrEl.should.deep.equal([2, 7]);
				arri.should.deep.equal([3, 2]);
			});
		it("Insert inserts an element at a position",
			function() {
				const arr = [1, 2, 3, 4];
				Arr.insertAt(arr, 2, 42);
				arr.should.deep.equal([1, 2, 42, 3, 4]);
				Arr.insertAt(arr, 0, 7);
				arr.should.deep.equal([7, 1, 2, 42, 3, 4]);
			});
		it("BinarySearch should return correct index or -1",
			function() {
				const arr = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
				let i1 = Arr.binarySearch(arr, (el) => el.a - 2);
				i1.should.equal(1);
				let i2 = Arr.binarySearch(arr, (el) => el.a - 5);
				i2.should.equal(-1);
			});
		it("Create creates an array of a given length and populates it using a function",
			function() {
				let arr = Arr.create<number>(10, (i, arr) => i < 2 ? 1 : arr[i - 2] + arr[i - 1]);
				arr.should.deep.equal([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
			});
		it("Some is true if any element is true",
		function() {
			const arr = [1, 2, 3, 4];
			Arr.some(arr, (el) => el === 3).should.be.true;
			Arr.some(arr, (el) => el === 5).should.be.false;
		});
		it("All is true if all elements are true",
		function() {
			const arr = [1, 2, 3, 4];
			Arr.all(arr, (el) => el > 0).should.be.true;
			Arr.all(arr, (el) => el < 4).should.be.false;
		});
});
