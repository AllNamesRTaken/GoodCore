import { should } from "chai";
import { JSDOM } from "jsdom";
import { Global } from "../lib/Global";
import * as Test from "../lib/Test";
import * as Util from "../lib/Util";

should();

describe("Util",
	function () {
		before(
			function () {
				// this.window = jsdom().defaultView;
				// this.document = this.window.document;
				Util.init();
			});
		it("init sets Global.window object",
			function () {
				let org = Global.window;
				Util.init("foo" as any);
				Global.window!.should.equal("foo");
				Global.window = org;
			});
		it("Assert throws.",
			function () {
				try {
					Util.assert(false, "message");
				} catch (err) {
					(err instanceof Util.AssertError).should.be.true;
					err.message.should.equal("message");
				}
				Util.assert(true, "message");
				true.should.be.true;
			});
		it("SoftAssert writes to console.error and PipeOut catches it.",
			function () {
				const log: any[] = [];
				const warn: any[] = [];
				const error: any[] = [];
				let real = {
					log: console.log,
					warn: console.warn,
					error: console.error,
					window: Global.window
				};
				Util.pipeOut(
					function (...args: any[]) {
						log.push.apply(log, args);
					},
					function (...args: any[]) {
						warn.push.apply(warn, args);
					},
					function (...args: any[]) {
						error.push.apply(error, args);
					}
				);
				Util.assert(true, "true is true", true);
				error.length.should.equal(0);
				Util.assert(false, "true is true", true);
				error.length.should.equal(1);
				error[0].should.contain("true is true");
				console.log("logged");
				log[0].should.contain("logged");0
				console.warn("warned");
				warn[0].should.contain("warned");
				//cannot console.log here since that is overridden by Mocha

				(Global.window as any) = null;
				Util.pipeOut(
					function (...args: any[]) {
						log.push.apply(log, args);
					},
					function (...args: any[]) {
						warn.push.apply(warn, args);
					},
					function (...args: any[]) {
						error.push.apply(error, args);
					}
				);
				console.log("logged2");
				log[1].should.contain("logged2");

				Global.window = real.window;
				console.log = real.log;
				console.warn = real.warn;
				console.error = real.error;

			});
		it("proxyFn wraps object method",
			function () {
				let barCalled = 0;
				let proxyCalled = 0;
				class Foo {
					public bar(num: number) { barCalled += num; }
				}
				let foo = new Foo();
				foo.bar(1);
				Util.proxyFn(foo, foo.bar.name, (org, ...args) => { 
					proxyCalled++; 
					org(...args); 
				});
				foo.bar(2);
				barCalled.should.equal(3);
				proxyCalled.should.equal(1);
				let foo2 = new Foo();
				foo2.bar(1);
				proxyCalled.should.equal(1);
				Util.proxyFn(Foo, Foo.prototype.bar.name, (org, ...args) => { 
					proxyCalled++; 
					org.call(this, ...args); 
				});
				foo2.bar(2);
				barCalled.should.equal(6);
				proxyCalled.should.equal(2);
			});
		it("GetFunctionName returns correct name",
			function () {
				Util.getFunctionName(function foo() { }).should.equal("foo");
				function fn() { }
				fn.hasOwnProperty = () => undefined as any;
				Util.getFunctionName(fn).should.equal("fn");
			});
		it("GetFunctionCode returns correct code as string",
			function () {
				// tslint:disable-next-line:no-var-keyword
				Util.getFunctionCode(function () { var a = 1; }).should.equal(" var a = 1; ");
			});
		it("IsArray detects correctly for array and object",
			function () {
				Test.isArray([1, 2, 3]).should.be.true;
				Test.isArray({ a: 1 }).should.be.false;
			});
		it("IsElement detects falsly for object",
			function () {
				Test.isElement({}).should.be.false;
			});
		it("IsFunction detects correctly",
			function () {
				Test.isFunction(function () { }).should.be.true;
				Test.isFunction({}).should.be.false;
			});
		it("NewInt starts at 0 and increases",
			function () {
				const s = Util.newInt();
				s.should.equal(0);
				(typeof (s)).should.equal("number");
				Util.newInt().should.equal(s + 1);
				Util.newInt().should.equal(s + 2);
				const keyed = Util.newInt("somekey");
				keyed.should.equal(0);
			});
		it("NewUUID is unique even when called fast",
			function () {
				Util.newUUID().should.not.equal(Util.newUUID());
			});
		it("ToArray return array",
			function () {
				Util.toArray([1, 2, 3]).should.be.instanceOf(Array);
			});
		it("Loop should pass correct index",
			function () {
				let sum = 0;
				Util.loop(10, (i) => sum += i);
				sum.should.equal(45);
			});
		it("Loop should stop if fn is returning false",
			function () {
				let sum = 0;
				Util.loop(10, (i) => {
					sum += i;
					return i === 5;
				});
				sum.should.equal(15);
			});
		it("Count should increase",
			function () {
				let sum = 0;
				Util.loop(10, (i) => Util.count());
				(+Util.counter()).should.equal(10);
			});
		it("Count with name should be resetable",
			function () {
				let sum = 0;
				Util.count("one");
				Util.loop(10, (i) => Util.count("loop"));
				(+Util.counter("loop")).should.equal(10);
				(+Util.counter("loop").reset()).should.equal(0);
				(+Util.counter("one")).should.equal(1);
			});
		it("Counter.log should log to console",
			function () {
				let output = "";
				let log = console.log;
				console.log = (text: string) => output = text;
				Util.counter().reset();
				Util.count().log();
				output.endsWith("1");
				console.log = log;
			});
		it("debounce debounces function",
			function (done) {
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
		it("debounce with leading executes once immediately and returns value",
			function (done) {
				let value = 0;
				let plus1 = Util.debounce(function inc() {
					return ++value;
				}, 20, { leading: true });
				plus1()!.should.equal(1);
				plus1()!.should.equal(1);
				plus1()!.should.equal(1);
				value.should.equal(1);
				setTimeout(() => {
					plus1()!.should.equal(2);
					value.should.equal(2);
					done();
				}, 20);
			});
		it("debounce without leading returns and resolves promise",
			function (done) {
				let value = 0;
				let plus1 = Util.debounce(function inc(): number {
					return ++value;
				}, 20);
				let result = (plus1() as Promise<number>);
				result.then((v) => v.should.equal(1));
				value.should.equal(0);
				(plus1() as Promise<number>).then((v) => v.should.equal(1));
				value.should.equal(0);
				result.then(() => {
					value.should.equal(1);
					done();
				});
			});
	}
);
