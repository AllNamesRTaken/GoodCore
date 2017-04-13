import { Cache } from "../lib/standard/Cache";
import assert = require('assert');
import {should} from 'chai';
should();

describe('Cache',
    function() {
        it('Hit Should Only Hit When Pushed In Cache',
            function(){
                let fifo = new Cache<string>();
                fifo.Push("in fifo", "data");
                fifo.Hit("not in fifo").should.be.false;
                fifo.Hit("in fifo").should.be.true;
            });
        it('Stage Should Require Publish To Push In Cache',
            function(){
                let fifo = new Cache<string>();
                fifo.Stage("in fifo", "data");
                fifo.Hit("in fifo").should.be.false;
                fifo.Publish("in fifo");
                fifo.Hit("in fifo").should.be.true;
            });
        it('Push Should Remove Overflowing Data FIFO',
            function(){
                let fifo = new Cache<string>(2);
                fifo.Push("1", "1");
                fifo.Push("2", "2");
                fifo.Hit("1").should.be.true;
                fifo.Hit("2").should.be.true;
                fifo.Push("3", "3");
                fifo.Hit("1").should.be.false;
                fifo.Hit("2").should.be.true;
                fifo.Hit("3").should.be.true;
            });
        it('Get Should Get Data Or Null',
            function(){
                let fifo = new Cache<string>(2);
                fifo.Push("1", "data1");
                fifo.Get("1").should.equal("data1");
                (fifo.Get("2") === null).should.be.true;
            });
        it('Count and StageCount returns correct values',
            function(){
                let fifo = new Cache<string>(2);
                fifo.Push("1", "data1");
                fifo.Push("2", "data1");
                fifo.Stage("1", "data1");
                fifo.Count.should.equal(2);
                fifo.StageCount.should.equal(1);
            });
        it('Clear invalidates the cache',
            function(){
                let fifo = new Cache<string>(2);
                fifo.Push("1", "data1");
                fifo.Clear();
                fifo.Count.should.equal(0);
                fifo.StageCount.should.equal(0);
            });
        it('CacheFn makes a function cached', 
            function() {
                let fifo = new Cache<string>(10);
                class TestClass {
                    public i = 0;
                    TestFn(param: string){
                        return param + this.i++;
                    }
                }
                var test = new TestClass();
                test.TestFn("test").should.equal("test0");
                fifo.Cache(test, "TestFn");
                test.TestFn("test").should.equal("test1");
                test.TestFn("another").should.equal("another2");
                test.TestFn("test").should.equal("test1");
            });
        it('Size returns the max size of the Cache',
            function(){
                let fifo = new Cache<string>(10);
                fifo.Size.should.equal(10);
            });
        it('Setting Size trims the cache content to set value',
            function(){
                let fifo = new Cache<string>(10);
                fifo.Size.should.equal(10);
                fifo.Push("1", "data1");
                fifo.Push("2", "data1");
                fifo.Push("3", "data1");
                fifo.Count.should.equal(3);
                fifo.Size = 2;
                fifo.Count.should.equal(2);
                fifo.Size.should.equal(2);
            });
        it('Size returns the max size of the Cache',
            function(){
                let fifo = new Cache<string>(10);
                fifo.Stage("1", "data1");
                fifo.GetStaged("1").should.equal("data1");
            });
        it('Remove removes one value from the cache',
            function(){
                let fifo = new Cache<string>(10);
                fifo.Push("1", "data1");
                fifo.Remove("1");
                fifo.Count.should.equal(0);
            });
    }
);
