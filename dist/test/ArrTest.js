"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Arr = require("../lib/Arr");
const MocData = require("../lib/MocData");
const Vec2_1 = require("../lib/struct/Vec2");
const Util_1 = require("../lib/Util");
chai_1.should();
describe("Arrays", function () {
    before(function () {
        this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
        this.arr1 = [1, 4, 7, 2];
        this.arr2 = [4, 8, 1, 9];
        this.arr3 = [{ a: 1 }, { a: 2 }];
    });
    it("DeepCopy copies values correctly", function () {
        Util_1.assert(false, "this works");
        const arr = this.arr1;
        const copy = Arr.deepCopy(arr);
        Arr.deepCopy(null).should.deep.equal([]);
        copy.should.deep.equal(arr);
        copy.should.not.equal(arr);
    });
    it("ShallowCopy references same inner objects", function () {
        const arr = this.arr3;
        const copy = Arr.shallowCopy(arr);
        copy[1].should.equal(arr[1]);
        Arr.shallowCopy(null).should.deep.equal([]);
    });
    it("Append appends two arrays into the first", function () {
        const copy = Arr.shallowCopy(this.arr1);
        Arr.append(copy, this.arr2);
        const len = this.arr1.length + this.arr2.length;
        copy.length.should.equal(this.arr1.length + this.arr2.length);
        copy.should.deep.equal(this.arr1.concat(this.arr2));
        let arr = [1];
        Arr.append(arr, null);
        arr.should.deep.equal([1]);
    });
    it("Concat works and does not change the sources", function () {
        const copy1 = Arr.deepCopy(this.arr1);
        const copy2 = Arr.deepCopy(this.arr2);
        const result = Arr.concat(copy1, copy2);
        const len = this.arr1.length + this.arr2.length;
        result.length.should.equal(len);
        result.should.deep.equal(this.arr1.concat(this.arr2));
        copy1.should.deep.equal(this.arr1);
        copy2.should.deep.equal(this.arr2);
    });
    it("DeepCopyInto works and copies into target", function () {
        const copy = Arr.shallowCopy(this.arr1);
        Arr.deepCopyInto(this.arr2, copy);
        copy.should.deep.equal(this.arr2);
        copy.should.not.equal(this.arr2);
        let arr = [1];
        Arr.deepCopyInto(null, arr);
        arr.should.deep.equal([]);
    });
    it("Deepfill works like deepcopy at a position", function () {
        const copy = Arr.shallowCopy(this.arr1);
        Arr.deepFill(this.arr2, copy, 2);
        const len = 2 + this.arr2.length;
        copy.length.should.equal(len);
        copy.should.deep.equal([1, 4, 4, 8, 1, 9]);
        let arr = [1, 2];
        Arr.deepFill(null, arr, 1);
        arr.should.deep.equal([1, 2]);
    });
    it("IndexOf returns correct index", function () {
        Arr.indexOf(this.arr1, (el) => el === 7).should.equal(2);
        Arr.indexOf(this.arr1, (el) => el === 17).should.equal(-1);
        Arr.indexOf(null, (el) => true).should.equal(-1);
    });
    it("Filter returns correct array", function () {
        const copy = Arr.filter(this.arr1, (el, i) => i > 1);
        copy.should.deep.equal([7, 2]);
        Arr.filter(null, (el, i) => true).should.deep.equal([]);
    });
    it("FilterInto uses supplied array", function () {
        const copy = Arr.shallowCopy(this.arr1);
        Arr.filterInto(this.arr2, copy, (el, i) => i > 1);
        copy.should.deep.equal([1, 9]);
        Arr.filterInto(null, copy, (el, i) => i > 1);
        copy.should.deep.equal([]);
    });
    it("Flatten returns correct array", function () {
        const copy = Arr.flatten([1, [2, 3], 4]);
        copy.should.deep.equal([1, 2, 3, 4]);
        Arr.flatten(null).should.deep.equal([]);
    });
    it("ForEach loops correctly", function () {
        const arrEl = new Array();
        const arri = new Array();
        Arr.forEach(this.arr1, (el, i) => { arrEl.push(el); arri.push(i); });
        arrEl.should.deep.equal(this.arr1);
        arri.should.deep.equal([0, 1, 2, 3]);
        Arr.forEach(null, (el, i) => { arrEl.push(el); arri.push(i); });
        arri.should.deep.equal([0, 1, 2, 3]);
    });
    it("ForEach with startIndex loops correctly", function () {
        const arrEl = new Array();
        const arri = new Array();
        Arr.forEach(this.arr1, (el, i) => { arrEl.push(el); arri.push(i); }, 1);
        arrEl.should.deep.equal([4, 7, 2]);
        arri.should.deep.equal([1, 2, 3]);
        const arrEl2 = new Array();
        Arr.forEach(this.arr1, (el, i) => { arrEl2.push(el); }, 42);
        arrEl2.should.deep.equal([]);
        Arr.forEach(null, (el, i) => { arrEl2.push(el); }, 0);
        arrEl2.should.deep.equal([]);
    });
    it("ReverseForEach loops correctly", function () {
        const arrEl = new Array();
        const arri = new Array();
        Arr.reverseForEach(this.arr1, (el, i) => { arrEl.push(el); arri.push(i); });
        arrEl.should.deep.equal(Arr.reverse(Arr.shallowCopy(this.arr1)));
        arri.should.deep.equal([3, 2, 1, 0]);
        Arr.reverseForEach(null, (el, i) => { arrEl.push(el); arri.push(i); });
        arri.should.deep.equal([3, 2, 1, 0]);
    });
    it("IndexOfElement returns correct index", function () {
        Arr.indexOfElement(this.arr1, 7).should.equal(2);
        Arr.indexOfElement(this.arr1, 17).should.equal(-1);
        Arr.indexOfElement(null, 17).should.equal(-1);
    });
    it("Map el and i are correct", function () {
        Arr.map(this.arr1, (el, i) => el).should.deep.equal([1, 4, 7, 2]);
        Arr.map(this.arr1, (el, i) => i).should.deep.equal([0, 1, 2, 3]);
        Arr.map(null, (el, i) => i).should.deep.equal([]);
    });
    it("MapInto maps correctly and sets length", function () {
        let copy = [1, 2];
        Arr.mapInto(this.arr1, copy, (el, i) => el);
        copy.should.deep.equal([1, 4, 7, 2]);
        copy = [1, 2, 3, 4, 5];
        Arr.mapInto(this.arr1, copy, (el, i) => i);
        copy.should.deep.equal([0, 1, 2, 3]);
        copy = [1, 2, 3, 4, 5];
        Arr.mapInto(null, copy, (el, i) => i);
        copy.should.deep.equal([]);
    });
    it("Reduce works on numbers", function () {
        Arr.reduce(this.arr1, (acc, cur) => cur + acc, 0).should.equal(14);
        Arr.reduce(null, (acc, cur) => cur + acc, 0).should.equal(0);
    });
    it("Reduce works with from and to", function () {
        Arr.reduce(this.arr1, (acc, cur) => cur + acc, 0, 1, 2).should.equal(11);
    });
    it("ReduceUntil works on numbers", function () {
        Arr.reduceUntil(this.arr1, (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0).should.equal(5);
        Arr.reduceUntil(null, (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0).should.equal(0);
    });
    it("ReduceUntil works with from and to", function () {
        Arr.reduceUntil([9, 2, 3, 7, 5, 6], (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0, 1, 4).should.equal(5);
    });
    it("ReverseReduce works on numbers", function () {
        Arr.reverseReduce(this.arr1, (acc, cur) => cur + acc, 0).should.equal(14);
        Arr.reverseReduce(null, (acc, cur) => cur + acc, 0).should.equal(0);
    });
    it("ReverseReduceUntil works on numbers", function () {
        Arr.reverseReduceUntil(this.arr1, (acc, cur) => cur + acc, (acc, cur) => cur === 4, 0).should.equal(9);
        Arr.reverseReduceUntil(null, (acc, cur) => cur + acc, (acc, cur) => cur === 4, 0).should.equal(0);
    });
    it("RemoveAt removes correct item", function () {
        const arr = [1, 2, 3, 4];
        Arr.removeAt(arr, 2).should.equal(3);
        arr.should.deep.equal([1, 2, 4]);
        (Arr.removeAt(null, 2) === undefined).should.be.true;
    });
    it("Remove removes correct element", function () {
        const arr = [1, 2, 3, 4];
        Arr.remove(arr, 2);
        arr.should.deep.equal([1, 3, 4]);
        Arr.remove(null, 2);
    });
    it("RemoveOneByFn removes correct element", function () {
        const arr = [1, 2, 3, 4];
        Arr.removeOneByFn(arr, (el) => el > 2);
        arr.should.deep.equal([1, 2, 4]);
        Arr.removeOneByFn(null, (el) => el > 2);
    });
    it("Reverse reverses the array", function () {
        const arr = [1, 2, 3, 4];
        Arr.reverse(arr);
        arr.should.deep.equal([4, 3, 2, 1]);
        (Arr.reverse(null) === null).should.be.true;
    });
    it("ShallowCopyInto copys correctly and keeps references", function () {
        const copy = [1, 2, 3, 4];
        Arr.shallowCopyInto(this.arr3, copy);
        copy.should.deep.equal(this.arr3);
        copy[1].should.equal(this.arr3[1]);
        Arr.shallowCopyInto(null, copy);
        copy.should.deep.equal([]);
    });
    it("ShallowFill works like ShallowCopyInto but at a position", function () {
        const copy = [1, 2, 3, 4];
        Arr.shallowFill(this.arr3, copy, 2);
        copy.should.deep.equal([1, 2, { a: 1 }, { a: 2 }]);
        copy[2].should.equal(this.arr3[0]);
        Arr.shallowFill([5, 6, 7, 8, 9], copy, 0);
        copy[4].should.equal(9);
        Arr.shallowFill(null, copy, 0);
        copy.length.should.equal(5);
    });
    it("Slice does slice", function () {
        Arr.slice(this.arr1, 1, 2).should.deep.equal([4, 7]);
        Arr.slice(this.arr1, 10, 2).should.deep.equal([]);
        Arr.slice(null, 0, 2).should.deep.equal([]);
    });
    it("Splice does splice", function () {
        let arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, -1, -1);
        arr1.should.deep.equal([1, 4, 7, 2]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, -1);
        arr1.should.deep.equal([]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1);
        arr1.should.deep.equal([]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, 100);
        arr1.should.deep.equal([1, 4, 7, 2]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, 1, 2);
        arr1.should.deep.equal([1, 2]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, 1, 2, [3, 4]);
        arr1.should.deep.equal([1, 3, 4, 2]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, 1, 100, [3, 4]);
        arr1.should.deep.equal([1, 3, 4]);
        arr1 = [1, 4, 7, 2];
        Arr.splice(arr1, 1, 1, [3, 4]);
        arr1.should.deep.equal([1, 3, 4, 7, 2]);
        arr1 = null;
        try {
            Arr.splice(arr1, 1, 1, [3, 4]);
        }
        catch (err) {
            err.message.indexOf("Unable to splice").should.equal(0);
        }
    });
    it("ForSome works like Filtered ForEach", function () {
        const arrEl = new Array();
        const arri = new Array();
        Arr.forSome(this.arr1, (el, i) => i > 1, (el, i) => arrEl.push(el));
        Arr.forSome(this.arr1, (el, i) => i > 1, (el, i) => arri.push(i));
        arrEl.should.deep.equal([7, 2]);
        arri.should.deep.equal([2, 3]);
        Arr.forSome(null, (el, i) => i > 1, (el, i) => arri.push(i));
        arri.should.deep.equal([2, 3]);
    });
    it("Until work like ForEach where returning true breaks the loop", function () {
        const arrEl = new Array();
        const arri = new Array();
        const arrEl2 = new Array();
        const arri2 = new Array();
        Arr.until(this.arr1, (el, i) => i >= 2, (el, i) => arrEl.push(el));
        Arr.until(this.arr1, (el, i) => i >= 2, (el, i) => arri.push(i));
        arrEl.should.deep.equal([1, 4]);
        arri.should.deep.equal([0, 1]);
        Arr.until(this.arr1, (el, i) => (arrEl2.push(el), i >= 2));
        Arr.until(this.arr1, (el, i) => (arri2.push(i), i >= 2));
        arrEl2.should.deep.equal([1, 4, 7]);
        arri2.should.deep.equal([0, 1, 2]);
        Arr.until(null, (el, i) => (arri2.push(i), i >= 2));
        arri2.should.deep.equal([0, 1, 2]);
    });
    it("Until with startIndex work like ForEach with startIndex where returning true breaks the loop", function () {
        const arrEl = new Array();
        const arri = new Array();
        const arrEl2 = new Array();
        const arri2 = new Array();
        const arrEl3 = new Array();
        Arr.until(this.arr1, (el, i) => i >= 2, (el, i) => arrEl.push(el), 1);
        Arr.until(this.arr1, (el, i) => i >= 2, (el, i) => arri.push(i), 1);
        arrEl.should.deep.equal([4]);
        arri.should.deep.equal([1]);
        Arr.until(this.arr1, (el, i) => (arrEl2.push(el), i >= 2), 1);
        Arr.until(this.arr1, (el, i) => (arri2.push(i), i >= 2), 1);
        arrEl2.should.deep.equal([4, 7]);
        arri2.should.deep.equal([1, 2]);
        Arr.until(this.arr1, (el, i) => (arrEl3.push(el), i >= 2), 42);
        arrEl3.should.deep.equal([]);
    });
    it("ReverseUntil work like ReverseForEach where returning true breaks the loop", function () {
        const arrEl = new Array();
        const arri = new Array();
        const arrEl2 = new Array();
        const arri2 = new Array();
        Arr.reverseUntil(this.arr1, (el, i) => i === 1, (el, i) => arrEl.push(el));
        Arr.reverseUntil(this.arr1, (el, i) => i === 1, (el, i) => arri.push(i));
        arrEl.should.deep.equal([2, 7]);
        arri.should.deep.equal([3, 2]);
        Arr.reverseUntil(this.arr1, (el, i) => (arrEl2.push(el), i === 1));
        Arr.reverseUntil(this.arr1, (el, i) => (arri2.push(i), i === 1));
        arrEl2.should.deep.equal([2, 7, 4]);
        arri2.should.deep.equal([3, 2, 1]);
        Arr.reverseUntil(null, (el, i) => (arri2.push(i), i === 1));
        arri2.should.deep.equal([3, 2, 1]);
    });
    it("InsertAt inserts an element at a position", function () {
        const arr = [1, 2, 3, 4];
        Arr.insertAt(arr, 2, 42);
        arr.should.deep.equal([1, 2, 42, 3, 4]);
        Arr.insertAt(arr, 0, 7);
        arr.should.deep.equal([7, 1, 2, 42, 3, 4]);
        try {
            Arr.insertAt(null, 0, 7);
        }
        catch (err) {
            err.message.indexOf("Unable to insertAt").should.equal(0);
        }
    });
    it("BinarySearch should return correct index or -1", function () {
        const arr = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
        let i1 = Arr.binarySearch(arr, (el) => el.a - 2);
        i1.should.equal(1);
        let i2 = Arr.binarySearch(arr, (el) => el.a - 5);
        i2.should.equal(-1);
        Arr.binarySearch(null, (el) => 1).should.equal(-1);
    });
    it("Create creates an array of a given length and populates it using a function", function () {
        let arr = Arr.create(10, (i, arr) => i < 2 ? 1 : arr[i - 2] + arr[i - 1]);
        arr.should.deep.equal([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
        let arr2 = Arr.create(-10, (i, arr) => i < 2 ? 1 : arr[i - 2] + arr[i - 1]);
        arr2.should.deep.equal([]);
    });
    it("Some is true if any element is true", function () {
        const arr = [1, 2, 3, 4];
        Arr.some(arr, (el) => el === 3).should.be.true;
        Arr.some(arr, (el) => el === 5).should.be.false;
        Arr.some(null, (el) => el === 5).should.be.false;
    });
    it("All is true if all elements are true", function () {
        const arr = [1, 2, 3, 4];
        Arr.all(arr, (el) => el > 0).should.be.true;
        Arr.all(arr, (el) => el < 4).should.be.false;
        Arr.all(null, (el) => el < 4).should.be.true;
    });
    it("Zip zips 2 arrays", function () {
        Arr.zip([1, 2, 3], ["a", "b", "c"]).should.deep.equal([[1, "a"], [2, "b"], [3, "c"]]);
        Arr.zip([1, 2, 3], ["a", "b", "c"], (a, b, i) => b.repeat(a))
            .should.deep.equal(["a", "bb", "ccc"]);
    });
    it("Unzip unzips 1 array to a tuple of 2 arrays", function () {
        Arr.unzip([[1, "a"], [2, "b"], [3, "c"]]).should.deep.equal([[1, 2, 3], ["a", "b", "c"]]);
        Arr.unzip(["f", "fo", "foo"], (u, i, out) => [u.length, u])
            .should.deep.equal([[1, 2, 3], ["f", "fo", "foo"]]);
    });
    it("Deserialize revives Array<T>", function () {
        class Revivable {
            deserialize(data) {
                this.foo = data + 1;
                return this;
            }
        }
        const list1 = new Array();
        const list2 = new Array();
        const list3 = new Array();
        Arr.deserialize([1, 2, 3, 4], list1);
        JSON.stringify(list1).should.equal("[1,2,3,4]");
        Arr.deserialize([1, 2, 3, 4], list2, Revivable);
        JSON.stringify(list2).should.equal('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
        Arr.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], list3, Vec2_1.Vec2);
        JSON.stringify(list3).should.equal('[{"x":1,"y":1},{"x":2,"y":2}]');
    });
});
//# sourceMappingURL=ArrTest.js.map