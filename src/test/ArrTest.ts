import { MocData } from "../lib/MocData";
import { Arr } from "../lib/Arr";
import { Obj } from "../lib/Obj";
import assert = require('assert');
import {should} from 'chai';
should();

describe('Arrays',
    function() {
        before(
            function() {
                this.longArr = MocData.NumericArray(100, MocData.Type.RandomInt);
                this.arr1 = <Array<number>>[1,4,7,2];
                this.arr2 = <Array<number>>[4,8,1,9];
                this.arr3 = <Array<any>>[{a:1}, {a:2}];
            });
        it('DeepCopy copies values correctly',
            function() {
                let arr = this.arr1;
                let copy = Arr.DeepCopy(arr);
                copy.should.deep.equal(arr);
                copy.should.not.equal(arr);
            });
        it('ShallowCopy references same inner objects', 
            function() {
                let arr = this.arr3;
                let copy = Arr.ShallowCopy(arr);
                copy[1].should.equal(arr[1]);
            });
        it('Append appends two arrays into the first', 
            function() {
                let copy = Arr.ShallowCopy(this.arr1);
                Arr.Append(copy, this.arr2);
                let len = this.arr1.length + this.arr2.length;
                copy.length.should.equal(this.arr1.length + this.arr2.length);
                copy.should.deep.equal(this.arr1.concat(this.arr2));
            });
        it('Concat works and does not change the sources', 
            function() {
                let copy1 = Arr.DeepCopy(this.arr1);
                let copy2 = Arr.DeepCopy(this.arr2);
                let result = Arr.Concat(copy1, copy2);
                let len = this.arr1.length + this.arr2.length;
                result.length.should.equal(len);
                result.should.deep.equal(this.arr1.concat(this.arr2));
                copy1.should.deep.equal(this.arr1);
                copy2.should.deep.equal(this.arr2);
            });
        it('DeepCopyInto works and copies into target', 
            function() {
                let copy = Arr.ShallowCopy(this.arr1);
                Arr.DeepCopyInto(this.arr2, copy);
                copy.should.deep.equal(this.arr2);
                copy.should.not.equal(this.arr2);
            });
        it('Deepfill works like deepcopy at a position', 
            function() {
                let copy = Arr.ShallowCopy(this.arr1);
                Arr.DeepFill(this.arr2, copy, 2);
                let len = 2 + this.arr2.length;
                copy.length.should.equal(len);
                copy.should.deep.equal([1,4,4,8,1,9]);
            });
        it('IndexOf returns correct index', 
            function() {
                Arr.IndexOf(this.arr1, (el)=>el===7).should.equal(2);
                Arr.IndexOf(this.arr1, (el)=>el===17).should.equal(-1);
            });
        it('Filter returns correct array', 
            function() {
                let copy = Arr.Filter(this.arr1, (el,i)=>i>1);
                copy.should.deep.equal([7,2]);
            });
        it('FilterInto uses supplied array', 
            function() {
                let copy = Arr.ShallowCopy(this.arr1);
                Arr.FilterInto(this.arr2, copy, (el,i)=>i>1);
                copy.should.deep.equal([1,9]);
            });
        it('Flatten returns correct array', 
            function() {
                let copy = Arr.Flatten([1,[2,3],4]);
                copy.should.deep.equal([1,2,3,4]);
            });
        it('ForEach loops correctly', 
            function() {
                let arrEl = new Array<number>();
                let arri = new Array<number>();
                Arr.ForEach(<Array<number>>this.arr1, (el, i) => {arrEl.push(el); arri.push(i);});
                arrEl.should.deep.equal(this.arr1);
                arri.should.deep.equal([0,1,2,3]);
            });
        it('IndexOfElement returns correct index', 
            function() {
                Arr.IndexOfElement(this.arr1, 7).should.equal(2);
                Arr.IndexOfElement(this.arr1, 17).should.equal(-1);
            });
        it('Map el and i are correct', 
            function() {
                Arr.Map(<Array<number>>this.arr1, (el, i)=>el).should.deep.equal([1,4,7,2]);
                Arr.Map(<Array<number>>this.arr1, (el, i)=>i).should.deep.equal([0,1,2,3]);
            });
        it('MapInto maps correctly and sets length', 
            function() {
                let copy = [1,2];
                Arr.MapInto(<Array<number>>this.arr1, copy, (el, i)=>el);
                copy.should.deep.equal([1,4,7,2]);
                copy = [1,2,3,4,5];
                Arr.MapInto(<Array<number>>this.arr1, copy, (el, i)=>i);
                copy.should.deep.equal([0,1,2,3]);
            });
        it('Reduce works on numbers', 
            function() {
                Arr.Reduce(<Array<number>>this.arr1, (acc, cur)=>cur + acc).should.equal(14);
            });
        it('RemoveOneAt removes correct item', 
            function() {
                let arr = [1,2,3,4];
                Arr.RemoveOneAt(arr, 2);
                arr.should.deep.equal([1,2,4]);
            });
        it('RemoveOneByElement removes correct element', 
            function() {
                let arr = [1,2,3,4];
                Arr.RemoveOneByElement(arr, 2);
                arr.should.deep.equal([1,3,4]);
            });
        it('RemoveOneByFn removes correct element', 
            function() {
                let arr = [1,2,3,4];
                Arr.RemoveOneByFn(arr, (el) => el > 2);
                arr.should.deep.equal([1,2,4]);
            });
        it('Reverse reverses the array', 
            function() {
                let arr = [1,2,3,4];
                Arr.Reverse(arr);
                arr.should.deep.equal([4,3,2,1]);
            });
        it('ShallowCopyInto copys correctly and keeps references', 
            function() {
                let copy = [1,2,3,4];
                Arr.ShallowCopyInto(this.arr3, copy);
                copy.should.deep.equal(this.arr3);
                copy[1].should.equal(this.arr3[1]);
            });
        it('ShallowFill works like ShallowCopyInto but at a position', 
            function() {
                let copy = [1,2,3,4];
                Arr.ShallowFill(this.arr3, copy, 2);
                copy.should.deep.equal([1,2,{a:1}, {a:2}]);
                copy[2].should.equal(this.arr3[0]);
            });
        it('Slice does slice', 
            function() {
                Arr.Slice(this.arr1, 1, 2).should.deep.equal([4,7]);
            });
        it('Some works like Filtered ForEach', 
            function() {
                let arrEl = new Array<number>();
                let arri = new Array<number>();
                Arr.Some(<Array<number>>this.arr1, (el, i)=>i>1, (el, i)=>arrEl.push(el));
                Arr.Some(<Array<number>>this.arr1, (el, i)=>i>1, (el, i)=>arri.push(i));                
                arrEl.should.deep.equal([7,2]);
                arri.should.deep.equal([2,3]);
            });
        it('Until work like ForEach where returning true breaks the loop', 
            function() {
                let arrEl = new Array<number>();
                let arri = new Array<number>();
                Arr.Until(<Array<number>>this.arr1, (el, i)=>{ arrEl.push(el); return i>=1;});
                Arr.Until(<Array<number>>this.arr1, (el, i)=>{ arri.push(i); return i>=1;});
                arrEl.should.deep.equal([1,4]);
                arri.should.deep.equal([0,1]);
            });
        it('Insert inserts an element at a position', 
            function() {
                let arr = [1,2,3,4];
                Arr.InsertAt(arr, 2, 42);
                arr.should.deep.equal([1,2,42,3,4]);
            });
});