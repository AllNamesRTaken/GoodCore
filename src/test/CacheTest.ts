import {should} from "chai";
import { Cache } from "../lib/standard/Cache";
should();

describe("Cache",
	function() {
		it("Hit Should Only Hit When Pushed In Cache",
			function(){
				const fifo = new Cache<string>();
				fifo.push("in fifo", "data");
				fifo.hit("not in fifo").should.be.false;
				fifo.hit("in fifo").should.be.true;
			});
		it("Stage Should Require Publish To Push In Cache",
			function(){
				const fifo = new Cache<string>();
				fifo.stage("in fifo", "data");
				fifo.hit("in fifo").should.be.false;
				fifo.publish("in fifo");
				fifo.hit("in fifo").should.be.true;
			});
		it("Push Should Remove Overflowing Data FIFO",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "1");
				fifo.push("2", "2");
				fifo.hit("1").should.be.true;
				fifo.hit("2").should.be.true;
				fifo.push("3", "3");
				fifo.hit("1").should.be.false;
				fifo.hit("2").should.be.true;
				fifo.hit("3").should.be.true;
			});
		it("Get Should Get Data Or Null",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				fifo.get("1").should.equal("data1");
				(fifo.get("2") === null).should.be.true;
			});
		it("Count and StageCount returns correct values",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				fifo.push("2", "data1");
				fifo.stage("1", "data1");
				fifo.count.should.equal(2);
				fifo.stageCount.should.equal(1);
			});
		it("Clear invalidates the cache",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				fifo.clear();
				fifo.count.should.equal(0);
				fifo.stageCount.should.equal(0);
			});
		it("CacheFn makes a function cached",
			function() {
				const fifo = new Cache<string>(10);
				class TestClass {
					public i = 0;
					public TestFn(param: string) {
						return param + this.i++;
					}
				}
				const test = new TestClass();
				test.TestFn("test").should.equal("test0");
				fifo.cache(test, "TestFn");
				test.TestFn("test").should.equal("test1");
				test.TestFn("another").should.equal("another2");
				test.TestFn("test").should.equal("test1");
			});
		it("Size returns the max size of the Cache",
			function(){
				const fifo = new Cache<string>(10);
				fifo.size.should.equal(10);
			});
		it("Setting Size trims the cache content to set value",
			function(){
				const fifo = new Cache<string>(10);
				fifo.size.should.equal(10);
				fifo.push("1", "data1");
				fifo.push("2", "data1");
				fifo.push("3", "data1");
				fifo.count.should.equal(3);
				fifo.size = 2;
				fifo.count.should.equal(2);
				fifo.size.should.equal(2);
			});
		it("Size returns the max size of the Cache",
			function(){
				const fifo = new Cache<string>(10);
				fifo.stage("1", "data1");
				fifo.getStaged("1").should.equal("data1");
			});
		it("Remove removes one value from the cache",
			function(){
				const fifo = new Cache<string>(10);
				fifo.push("1", "data1");
				fifo.remove("1");
				fifo.count.should.equal(0);
			});
	}
);
