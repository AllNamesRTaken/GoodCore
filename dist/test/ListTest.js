"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const MocData = require("../lib/MocData");
const List_1 = require("../lib/struct/List");
const Vec2_1 = require("../lib/struct/Vec2");
chai_1.should();
describe("List", function () {
    function values(obj) {
        let keys = Object.keys(obj);
        return keys.map((k, i) => obj[k]);
    }
    function keys(obj) {
        return Object.keys(obj);
    }
    before(function () {
        this.longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
        this.list1 = new List_1.List([1, 4, 7, 2]);
        this.list2 = new List_1.List([4, 8, 1, 9]);
        this.list3 = new List_1.List(new List_1.List([{ a: 1 }, { a: 2 }]));
        this.indexed = new List_1.List();
        this.indexed.indexer = (el) => el;
    });
    it("Copy copies values correctly into target", function () {
        const list = this.list1;
        const copy = new List_1.List();
        const copy2 = new List_1.List();
        copy.copy(list);
        copy.values.should.deep.equal(list.values);
        copy.values.should.not.equal(list.values);
        copy2.copy(list.values);
        copy2.values.should.deep.equal(list.values);
        copy2.values.should.not.equal(list.values);
        const indexed = this.indexed.clone();
        indexed.copy(list.values);
        keys(indexed._index).should.deep.equal(["1", "2", "4", "7"]);
        values(indexed._index).should.deep.equal([1, 2, 4, 7]);
        indexed._index[7].should.equal(7);
    });
    it("clone copies values correctly into a new List", function () {
        const list = this.list1;
        const copy = list.clone();
        copy.values.should.deep.equal(list.values);
        copy.values.should.not.equal(list.values);
        const org = (new List_1.List([1, 2, 3]));
        org.indexer = (el) => el - 1;
        const indexed = org.clone();
        indexed.indexer.should.deep.equal(org.indexer);
    });
    it("trucate shortens the list to given length", function () {
        const list = this.list1.clone();
        list.truncate(2).length.should.equal(2);
        list.get(1).should.equal(4);
    });
    it("trucate with no size empties array", function () {
        const list = this.list1.clone();
        list.truncate().length.should.equal(0);
    });
    it("trucate with large size keeps List as is", function () {
        const list = this.list1.clone();
        list.truncate(123).length.should.equal(4);
    });
    it("trucate with negative size takes elements from the end", function () {
        const list = this.list1.clone();
        list.truncate(-2).length.should.equal(2);
        list.get(1).should.equal(2);
    });
    it("Fill fills an array with new data", function () {
        let list1 = new List_1.List([1, 4, 7, 2]);
        let list2 = new List_1.List();
        let obj = { a: 1 };
        list1.fill(-1, 0).values.should.deep.equal([]);
        list1.fill(2, 0).values.should.deep.equal([0, 0]);
        list1.fill(2, () => 1).values.should.deep.equal([1, 1]);
        list1.fill(3, (i) => i).values.should.deep.equal([0, 1, 2]);
        list2.fill(2, obj).values.should.deep.equal([{ a: 1 }, { a: 1 }]);
        list2.get(0).should.not.equal(obj);
    });
    it("Splice does splice", function () {
        let list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(-1, -1).values.should.deep.equal([1, 4, 7, 2]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(-1).values.should.deep.equal([]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice().values.should.deep.equal([]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(100).values.should.deep.equal([1, 4, 7, 2]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(1, 2).values.should.deep.equal([1, 2]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(1, 2, [3, 4]).values.should.deep.equal([1, 3, 4, 2]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(1, 2, new List_1.List([3, 4])).values.should.deep.equal([1, 3, 4, 2]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(1, 100, [3, 4]).values.should.deep.equal([1, 3, 4]);
        list1 = new List_1.List([1, 4, 7, 2]);
        list1.splice(1, 1, [3, 4]).values.should.deep.equal([1, 3, 4, 7, 2]);
    });
    it("ShallowCopy references same inner objects", function () {
        const list = this.list3;
        const copy = new List_1.List();
        copy.shallowCopy(list);
        copy.values[1].should.equal(list.values[1]);
        const indexed = new List_1.List();
        indexed.indexer = (el) => 2 - el.a;
        indexed.shallowCopy(list.values);
        keys(indexed._index).should.deep.equal(["0", "1"]);
        values(indexed._index).should.deep.equal([{ a: 2 }, { a: 1 }]);
    });
    it("ShallowCopy can take array as input", function () {
        const arr = this.list3.values;
        const copy = new List_1.List();
        copy.shallowCopy(arr);
        copy.values[1].should.equal(arr[1]);
    });
    it("Append appends a lists values or an array to another Lists values", function () {
        let list1 = this.list1.clone();
        const list2 = this.list2;
        list1.append(list2).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
        list1 = this.list1.clone();
        list1.append([4, 8, 1, 9]).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
        const indexed = this.indexed.clone();
        indexed.append(this.list1.values);
        keys(indexed._index).should.deep.equal(["1", "2", "4", "7"]);
        values(indexed._index).should.deep.equal([1, 2, 4, 7]);
    });
    it("Concat concatinates two lists values or arrays and returns as a new list", function () {
        const list1 = this.list1;
        const list2 = this.list2;
        list1.concat(list2).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
        list1.concat(list2.values).values.should.deep.equal([1, 4, 7, 2, 4, 8, 1, 9]);
    });
    it("Get gets the value at a given position in the list", function () {
        const list1 = this.list1;
        list1.get(2).should.equal(7);
    });
    it("getByIndex gets the value at a given index key in an indexed list", function () {
        const list1 = this.list1.clone();
        (list1.getByIndex("k2") === undefined).should.be.true;
        list1.indexer = (el) => "k" + el;
        list1.getByIndex("k2").should.equal(2);
        (list1.getByIndex("k42") === undefined).should.be.true;
    });
    it("Set sets a value at a given position if it exists in the list, or throws", function () {
        const list1 = this.list1.clone();
        const list2 = this.list1.clone();
        list2.indexer = (el) => el;
        list1.set(2, 42).get(2).should.equal(42);
        let err;
        try {
            list1.set(4, 42);
        }
        catch (error) {
            err = error;
        }
        (err !== undefined).should.be.true;
        list2.set(2, 42).get(2).should.equal(42);
    });
    it("Count returns the lists length", function () {
        const list1 = this.list1;
        list1.count.should.equal(4);
    });
    it("Clear sets the size to 0", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.clear().count.should.equal(0);
        keys(list1._index).should.deep.equal([]);
        values(list1._index).should.deep.equal([]);
    });
    it("Add pushes a value onto the List and returns the list", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.add(42).get(4).should.equal(42);
        list1.values.should.deep.equal([1, 4, 7, 2, 42]);
        list1._index[42].should.equal(42);
    });
    it("Push pushes a value onto the List and returns the index of the new element", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.push(42).should.equal(5);
        list1._index[42].should.equal(42);
    });
    it("Pop removes the last element in the list and returns it", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1._index[2].should.equal(2);
        list1.pop().should.equal(2);
        (list1._index[2] === undefined).should.be.true;
    });
    it("Shift removes the first element in the list and returns it", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1._index[1].should.equal(1);
        list1.shift().should.equal(1);
        (list1._index[1] === undefined).should.be.true;
    });
    it("Contains checks if a list contains a certain element", function () {
        const list1 = this.list1;
        list1.contains(4).should.be.true;
        list1.contains(42).should.be.false;
        list1.contains((v) => v === 4).should.be.true;
        list1.contains((v) => v === 42).should.be.false;
        const indexed = this.indexed.clone();
        indexed.add(4);
        indexed.contains(4).should.be.true;
        indexed.contains(42).should.be.false;
        indexed._index[4].should.equal(4);
    });
    it("Remove removes an element from the list", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.get(1).should.equal(4);
        list1.remove(4).contains(4).should.be.false;
        (list1._index[4] === undefined).should.be.true;
    });
    it("RemoveFirst removes the first element from the list matching a function", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.get(1).should.equal(4);
        list1.removeFirst((el) => el === 4).should.equal(4);
        list1.contains(4).should.be.false;
        (list1._index[4] === undefined).should.be.true;
    });
    it("RemoveAt removes the element at a given position", function () {
        const list1 = this.list1.clone();
        list1.indexer = (el) => el;
        list1.get(2).should.equal(7);
        list1.removeAt(2).should.equal(7);
        list1.contains(7).should.be.false;
        (list1._index[7] === undefined).should.be.true;
    });
    it("Filter returns filtered new list", function () {
        const list1 = this.list1;
        const list2 = list1.filter((el, i) => i > 1);
        list2.values.should.deep.equal([7, 2]);
    });
    it("Select returns filtered new list", function () {
        const list1 = this.list1;
        const list2 = list1.select((el, i) => i > 1);
        list2.values.should.deep.equal([7, 2]);
    });
    it("SelectInto uses supplied list", function () {
        const list1 = this.list1;
        const list2 = new List_1.List();
        list2.selectInto(list1, (el, i) => i > 1);
        list2.indexer = (el) => el;
        (list2._index[1] === undefined).should.be.true;
        (list2._index[7]).should.equal(7);
        list2.values.should.deep.equal([7, 2]);
        const list3 = new List_1.List();
        list3.selectInto(list1.values, (el, i) => i > 1);
        list3.values.should.deep.equal([7, 2]);
    });
    it("Head returns new list with fist x items", function () {
        const list1 = this.list1;
        list1.head(2).values.should.deep.equal([1, 4]);
        list1.head(-2).values.should.deep.equal([]);
        list1.head(20).values.should.deep.equal([1, 4, 7, 2]);
    });
    it("Tail returns new list with last x items", function () {
        const list1 = this.list1;
        list1.tail(2).values.should.deep.equal([7, 2]);
        list1.tail(-2).values.should.deep.equal([]);
        list1.tail(20).values.should.deep.equal([1, 4, 7, 2]);
    });
    it("OrderBy sorts the Lists values", function () {
        const list1 = this.list1.clone();
        list1.orderBy((a, b) => a - b).values.should.deep.equal([1, 2, 4, 7]);
    });
    it("ForEach loops correctly", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.forEach((el, i) => { listEl.push(el); listi.push(i); });
        listEl.should.deep.equal(this.list1.values);
        listi.should.deep.equal([0, 1, 2, 3]);
    });
    it("ForEach with startIndex loops correctly", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.forEach((el, i) => { listEl.push(el); listi.push(i); }, 1);
        listEl.should.deep.equal([4, 7, 2]);
        listi.should.deep.equal([1, 2, 3]);
        const listEl2 = new Array();
        list1.forEach((el, i) => { listEl2.push(el); listi.push(i); }, 42);
        listEl2.should.deep.equal([]);
    });
    it("IndexOf returns elements index or -1", function () {
        const list1 = this.list1;
        list1.indexOf(2).should.equal(3);
        list1.indexOf((el) => el === 2).should.equal(3);
        list1.indexOf(42).should.equal(-1);
    });
    it("Map el and i are correct", function () {
        const list1 = this.list1;
        list1.map((el, i) => el).values.should.deep.equal([1, 4, 7, 2]);
        list1.map((el, i) => i).values.should.deep.equal([0, 1, 2, 3]);
    });
    it("MapInto maps correctly and sets length", function () {
        const list1 = this.list1;
        let list2 = new List_1.List([1, 2]);
        list2.indexer = (el) => el;
        list2.mapInto(list1, (el, i) => el);
        list2.values.should.deep.equal([1, 4, 7, 2]);
        values(list2._index).should.deep.equal([1, 2, 4, 7]);
        list2 = new List_1.List([1, 2, 3, 4, 5]);
        list2.mapInto(list1, (el, i) => i);
        list2.values.should.deep.equal([0, 1, 2, 3]);
        let list3 = new List_1.List([1, 2]);
        list3.mapInto(list1.values, (el, i) => el);
        list3.values.should.deep.equal([1, 4, 7, 2]);
    });
    it("Reduce works on numbers", function () {
        const list1 = this.list1;
        list1.reduce((acc, cur) => cur + acc, 0).should.equal(14);
    });
    it("ReduceUntil works like reduce with condition", function () {
        const list1 = this.list1;
        list1.reduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 7, "").should.equal("14");
    });
    it("ReverseReduce works on numbers", function () {
        const list1 = this.list1;
        list1.reverseReduce((acc, cur) => (acc.push(cur), acc), []).should.deep.equal(list1.clone().reverse().values);
    });
    it("ReverseReduceUntil works like reverseReduce with condition", function () {
        const list1 = this.list1;
        list1.reverseReduceUntil((acc, cur) => `${acc}${cur}`, (acc, cur) => cur === 4, "").should.equal("27");
    });
    it("Reverse reverses the list elements", function () {
        const list1 = this.list1.clone();
        list1.reverse().values.should.deep.equal([2, 7, 4, 1]);
    });
    it("First returns first element or first matching element", function () {
        const list1 = this.list1.clone();
        list1.first().should.equal(1);
        list1.first((el) => el > 3).should.equal(4);
        (list1.first((el) => el > 8) === undefined).should.be.true;
    });
    it("Find returns the first matching element", function () {
        const list1 = this.list1.clone();
        list1.find((el) => el > 3).should.equal(4);
        (list1.find((el) => el > 8) === undefined).should.be.true;
    });
    it("Last returns last element", function () {
        const list1 = this.list1.clone();
        list1.last().should.equal(2);
    });
    it("Select filters out and returns new List", function () {
        const list1 = this.list1.clone();
        list1.select((el, i) => el % 2 === 0).values.should.deep.equal([4, 2]);
    });
    it("ForSome works like Filtered ForEach", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.forSome((el, i) => i > 1, (el, i) => listEl.push(el));
        list1.forSome((el, i) => i > 1, (el, i) => listi.push(i));
        listEl.should.deep.equal([7, 2]);
        listi.should.deep.equal([2, 3]);
    });
    it("Until work like ForEach where returning true breaks the loop", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.until((el, i) => i >= 2, (el, i) => listEl.push(el));
        list1.until((el, i) => i >= 2, (el, i) => listi.push(i));
        listEl.should.deep.equal([1, 4]);
        listi.should.deep.equal([0, 1]);
        const listEl2 = new Array();
        const listi2 = new Array();
        list1.until((el, i) => (listEl2.push(el), i >= 2));
        list1.until((el, i) => (listi2.push(i), i >= 2));
        listEl2.should.deep.equal([1, 4, 7]);
        listi2.should.deep.equal([0, 1, 2]);
        const listEl3 = new Array();
        const listi3 = new Array();
        list1.until((el, i) => el.valueOf() > 42, (el, i) => listEl3.push(el));
        list1.until((el, i) => el.valueOf() > 42, (el, i) => listi3.push(i));
        listEl3.should.deep.equal([1, 4, 7, 2]);
        listi3.should.deep.equal([0, 1, 2, 3]);
    });
    it("Until with startIndex work like ForEach with startIndex where returning true breaks the loop", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.until((el, i) => i >= 2, (el, i) => listEl.push(el), 1);
        list1.until((el, i) => i >= 2, (el, i) => listi.push(i), 1);
        listEl.should.deep.equal([4]);
        listi.should.deep.equal([1]);
        const listEl2 = new Array();
        const listi2 = new Array();
        list1.until((el, i) => (listEl2.push(el), i >= 2), 1);
        list1.until((el, i) => (listi2.push(i), i >= 2), 1);
        listEl2.should.deep.equal([4, 7]);
        listi2.should.deep.equal([1, 2]);
        const listEl3 = new Array();
        list1.until((el, i) => (listEl3.push(el), i >= 2), 42);
        listEl3.should.deep.equal([]);
    });
    it("reverseUntil work like Until in reverse", function () {
        const list1 = this.list1;
        const listEl = new Array();
        list1.reverseUntil((el, i) => i === 1, (el, i) => listEl.push(el));
        listEl.should.deep.equal([2, 7]);
        const listEl2 = new Array();
        list1.reverseUntil((el, i) => (listEl2.push(el), i === 1));
        listEl2.should.deep.equal([2, 7, 4]);
    });
    it("reverseForEach work like ForEach in reverse", function () {
        const list1 = this.list1;
        const listEl = new Array();
        const listi = new Array();
        list1.reverseForEach((el, i) => { listEl.push(el); listi.push(i); });
        listEl.should.deep.equal(this.list1.reverse().values);
    });
    it("Equals deep compares two lists", function () {
        const list1 = this.list1;
        const list2 = this.list1.clone();
        const list3 = this.list2;
        list1.equals(list2).should.be.true;
        list1.equals(list3).should.be.false;
    });
    it("Same checks if the same elements are in both lists", function () {
        const list1 = new List_1.List([1, 4, 7, 2]);
        list1.indexer = (el) => el;
        const list2 = new List_1.List([2, 4, 1, 7]);
        const list3 = new List_1.List([1, 4, 7]);
        list3.indexer = (el) => el;
        const list4 = new List_1.List([1, 4, 7, 3]);
        list4.indexer = (el) => el;
        const list5 = new List_1.List();
        const list6 = new List_1.List();
        list1.same(list2).should.be.true;
        list2.same(list1).should.be.true;
        list1.same(list3).should.be.false;
        list1.same(list4).should.be.false;
        list5.same(list6).should.be.true;
    });
    it("Union returns the union of two lists", function () {
        const list1 = new List_1.List([1, 4, 7, 2]);
        list1.indexer = (el) => el;
        const list2 = new List_1.List([4, 2, 8]);
        list2.indexer = (el) => el;
        const list3 = new List_1.List([5, 4, 7, 8]);
        const list4 = new List_1.List();
        list1.union(list2).values.should.deep.equal([1, 4, 7, 2, 8]);
        list2.union(list3).values.should.deep.equal([4, 2, 8, 5, 7]);
        list1.union(list4).values.should.deep.equal([1, 4, 7, 2]);
    });
    it("Intersect returns a list containing the intersection of 2 lists", function () {
        const list1 = new List_1.List([1, 4, 7, 2]);
        list1.indexer = (el) => el;
        const list2 = new List_1.List([4, 2, 8]);
        list2.indexer = (el) => el;
        const list3 = new List_1.List([5, 4, 7, 8]);
        const list4 = new List_1.List();
        list1.intersect(list2).values.should.deep.equal([4, 2]);
        list2.intersect(list3).values.should.deep.equal([4, 8]);
        list1.intersect(list4).values.should.deep.equal([]);
    });
    it("Subtract returns a list containing the the items of a - b", function () {
        const list1 = new List_1.List([1, 4, 7, 2]);
        list1.indexer = (el) => el;
        const list2 = new List_1.List([4, 2, 8]);
        list2.indexer = (el) => el;
        list1.subtract(list2).values.should.deep.equal([1, 7]);
    });
    it("Insert inserts an element at a position", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        list1.indexer = (el) => el;
        list1.insertAt(2, 42);
        list1.values.should.deep.equal([1, 2, 42, 3, 4]);
        list1._index[42].should.equal(42);
    });
    it("Some is true if any element is true", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        list1.some((el) => el === 3).should.be.true;
        list1.some((el) => el === 5).should.be.false;
    });
    it("All is true if all elements are true", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        list1.all((el) => el > 0).should.be.true;
        list1.all((el) => el < 4).should.be.false;
    });
    it("Zip zips two Lists", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        const list2 = new List_1.List([5, 6, 7, 8]);
        const list3 = new List_1.List([5, 6, 7, 8, 9]);
        const list4 = new List_1.List([5, 6, 7]);
        list1.zip(list2).values.should.deep.equal([[1, 5], [2, 6], [3, 7], [4, 8]]);
        list1.zip(list2, (t, u) => t - u).values.should.deep.equal([-4, -4, -4, -4]);
        list1.zip(list3, (t, u) => t - u).values.should.deep.equal([-4, -4, -4, -4]);
        list1.zip(list4, (t, u) => t - u).values.should.deep.equal([-4, -4, -4]);
    });
    it("Unzip splits a list into 2 lists", function () {
        const list1 = new List_1.List([[1, 5], [2, 6], [3, 7], [4, 8]]);
        list1.unzip().should.deep.equal([new List_1.List([1, 2, 3, 4]), new List_1.List([5, 6, 7, 8])]);
        list1.unzip((el) => [el[1], el[0]]).should.deep.equal([new List_1.List([5, 6, 7, 8]), new List_1.List([1, 2, 3, 4])]);
    });
    it("Flatten flattens any array or lists inside list", function () {
        const list1 = new List_1.List([[1, 2], 3, new List_1.List([4, [5, [6]]])]);
        list1.flatten().values.should.deep.equal([1, 2, 3, 4, 5, 6]);
    });
    it("Flatten flattens any array or lists inside list with max depth", function () {
        const list1 = new List_1.List([[1, 2], 3, new List_1.List([4, [5, [6]]])]);
        list1.flatten(1).values.should.deep.equal([1, 2, 3, 4, [5, [6]]]);
        list1.flatten(0).equals(list1).should.be.true;
    });
    it("toJSON formats List correct", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        JSON.stringify(list1).should.equal("[1,2,3,4]");
        class Serializable {
            constructor(foo, bar) {
                this.foo = foo;
                this.bar = bar;
            }
            toJSON() {
                return this.foo;
            }
        }
        const list2 = new List_1.List([new Serializable(1, 2), new Serializable(3, 4)]);
        JSON.stringify(list2).should.equal("[1,3]");
    });
    it("serialize works like a typed toJSON but deep", function () {
        const list1 = new List_1.List([1, 2, 3, 4]);
        list1.toJSON().should.deep.equal(list1.serialize());
        class Serializable {
            constructor(foo, bar) {
                this.foo = foo;
                this.bar = bar;
            }
            serialize() {
                return this.foo;
            }
        }
        const list2 = new List_1.List([new Serializable(1, 2), new Serializable(3, 4)]);
        list2.serialize().should.deep.equal([1, 3]);
    });
    it("deserialize revives List<T>", function () {
        class Revivable {
            deserialize(data) {
                this.foo = data + 1;
                return this;
            }
        }
        const list1 = new List_1.List();
        const list2 = new List_1.List();
        const list3 = new List_1.List();
        list1.deserialize([1, 2, 3, 4]);
        JSON.stringify(list1).should.equal("[1,2,3,4]");
        list2.deserialize([1, 2, 3, 4], Revivable);
        JSON.stringify(list2).should.equal('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
        list3.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], Vec2_1.Vec2);
        JSON.stringify(list3).should.equal('[{"x":1,"y":1},{"x":2,"y":2}]');
    });
    it("should iterate correctly with for ... of", function () {
        let list = new List_1.List([2, 4, 7, 1]);
        let sum = 0;
        for (let v of list) {
            sum += v;
        }
        for (let v of list) {
            sum += v;
        }
        sum.should.equal(28);
    });
});
//# sourceMappingURL=ListTest.js.map