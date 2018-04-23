"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Global_1 = require("../lib/Global");
const Test = require("../lib/Test");
const Util = require("../lib/Util");
chai_1.should();
describe("Util", function () {
    before(function () {
        Util.init();
    });
    it("init sets Global.window object", function () {
        let org = Global_1.Global.window;
        Util.init("foo");
        Global_1.Global.window.should.equal("foo");
        Global_1.Global.window = org;
    });
    it("Assert writes to console.error and PipeOut catches it.", function () {
        const log = [];
        const warn = [];
        const error = [];
        let real = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            window: Global_1.Global.window
        };
        Util.pipeOut(function (...args) {
            log.push.apply(log, args);
        }, function (...args) {
            warn.push.apply(warn, args);
        }, function (...args) {
            error.push.apply(error, args);
        });
        Util.assert(true, "true is true");
        error.length.should.equal(0);
        Util.assert(false, "true is true");
        error.length.should.equal(1);
        error[0].should.contain("true is true");
        console.log("logged");
        log[0].should.contain("logged");
        console.warn("warned");
        warn[0].should.contain("warned");
        Global_1.Global.window = null;
        Util.pipeOut(function (...args) {
            log.push.apply(log, args);
        }, function (...args) {
            warn.push.apply(warn, args);
        }, function (...args) {
            error.push.apply(error, args);
        });
        console.log("logged2");
        log[1].should.contain("logged2");
        Global_1.Global.window = real.window;
        console.log = real.log;
        console.warn = real.warn;
        console.error = real.error;
    });
    it("proxyFn wraps object method", function () {
        let barCalled = 0;
        let proxyCalled = 0;
        class Foo {
            bar(num) { barCalled += num; }
        }
        let foo = new Foo();
        foo.bar(1);
        Util.proxyFn(foo, foo.bar.name, (org, ...args) => { proxyCalled++; org(...args); });
        foo.bar(2);
        barCalled.should.equal(3);
        proxyCalled.should.equal(1);
        let foo2 = new Foo();
        foo2.bar(1);
        proxyCalled.should.equal(1);
        Util.proxyFn(Foo, Foo.prototype.bar.name, (org, ...args) => { proxyCalled++; org.call(this, ...args); });
        foo2.bar(2);
        barCalled.should.equal(6);
        proxyCalled.should.equal(2);
    });
    it("GetFunctionName returns correct name", function () {
        Util.getFunctionName(function foo() { }).should.equal("foo");
        function fn() { }
        fn.hasOwnProperty = () => undefined;
        Util.getFunctionName(fn).should.equal("fn");
    });
    it("GetFunctionCode returns correct code as string", function () {
        Util.getFunctionCode(function () { var a = 1; }).should.equal(" var a = 1; ");
    });
    it("IsArray detects correctly for array and object", function () {
        Test.isArray([1, 2, 3]).should.be.true;
        Test.isArray({ a: 1 }).should.be.false;
    });
    it("IsElement detects falsly for object", function () {
        Test.isElement({}).should.be.false;
    });
    it("IsFunction detects correctly", function () {
        Test.isFunction(function () { }).should.be.true;
        Test.isFunction({}).should.be.false;
    });
    it("NewInt starts at 0 and increases", function () {
        const s = Util.newInt();
        (typeof (s)).should.equal("number");
        Util.newInt().should.equal(s + 1);
        Util.newInt().should.equal(s + 2);
    });
    it("NewUUID is unique even when called fast", function () {
        Util.newUUID().should.not.equal(Util.newUUID());
    });
    it("ToArray return array", function () {
        Util.toArray([1, 2, 3]).should.be.instanceOf(Array);
    });
    it("Loop should pass correct index", function () {
        let sum = 0;
        Util.loop(10, (i) => sum += i);
        sum.should.equal(45);
    });
    it("Loop should stop if fn is returning false", function () {
        let sum = 0;
        Util.loop(10, (i) => {
            sum += i;
            return i === 5;
        });
        sum.should.equal(15);
    });
    it("Count should increase", function () {
        let sum = 0;
        Util.loop(10, (i) => Util.count());
        (+Util.counter()).should.equal(10);
    });
    it("Count with name should be resetable", function () {
        let sum = 0;
        Util.count("one");
        Util.loop(10, (i) => Util.count("loop"));
        (+Util.counter("loop")).should.equal(10);
        (+Util.counter("loop").reset()).should.equal(0);
        (+Util.counter("one")).should.equal(1);
    });
    it("Counter.log should log to console", function () {
        let output = "";
        let log = console.log;
        console.log = (text) => output = text;
        Util.counter().reset();
        Util.count().log();
        output.endsWith("1");
        console.log = log;
    });
    it("debounce debounces function", function (done) {
        let value = 0;
        let plus1 = Util.debounce(function inc() {
            ++value;
        }, 20);
        plus1();
        plus1();
        value.should.equal(0);
        setTimeout(() => {
            value.should.equal(1);
            done();
        }, 20);
    });
    it("debounce with leading executes once immediately and returns value", function (done) {
        let value = 0;
        let plus1 = Util.debounce(function inc() {
            return ++value;
        }, 20, { leading: true });
        plus1().should.equal(1);
        plus1().should.equal(1);
        plus1().should.equal(1);
        value.should.equal(1);
        setTimeout(() => {
            plus1().should.equal(2);
            value.should.equal(2);
            done();
        }, 20);
    });
});
//# sourceMappingURL=UtilTest.js.map