import {should} from "chai";
import { JSDOM } from "jsdom";
import { Global } from "../lib/Global";
import * as MocData from "../lib/MocData";
import * as Test from "../lib/Test";
import { Timer } from "../lib/Timer";
import * as Util from "../lib/Util";

should();

describe("Util",
	function() {
		before(
			function() {
				// this.window = jsdom().defaultView;
				// this.document = this.window.document;
				Util.init();
			});
		it("init sets Global.window object",
			function() {
				let org = Global.window;
				Util.init("foo" as any);
				Global.window.should.equal("foo");
				Global.window = org;
			});
		it("Assert writes to console.error and PipeOut catches it.",
			function() {
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
					function(...args: any[]){
						log.push.apply(log, args);
					},
					function(...args: any[]){
						warn.push.apply(warn, args);
					},
					function(...args: any[]){
						error.push.apply(error, args);
					}
				);
				Util.assert(true, "true is true");
				error.length.should.equal(0);
				Util.assert(false, "true is true");
				error.length.should.equal(1);
				error[0].should.contain("true is true");
				console.log("logged");
				log[0].should.contain("logged");
				console.warn("warned");
				warn[0].should.contain("warned");
				//cannot console.log here since that is overridden by Mocha

				Global.window = null;
				Util.pipeOut(
					function(...args: any[]){
						log.push.apply(log, args);
					},
					function(...args: any[]){
						warn.push.apply(warn, args);
					},
					function(...args: any[]){
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
			function() {
				let barCalled = 0;
				let proxyCalled = 0;
				class Foo {
					public bar(num: number) { barCalled += num; }
				}
				let foo = new Foo();
				foo.bar(1);
				Util.proxyFn(foo, foo.bar.name, (org, ...args) => { proxyCalled++; org(...args); } );
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
		it("GetFunctionName returns correct name",
				function() {
					Util.getFunctionName(function foo() {}).should.equal("foo");
					function fn() {}
					fn.hasOwnProperty = () => undefined as any;
					Util.getFunctionName(fn).should.equal("fn");
				});
		it("GetFunctionCode returns correct code as string",
				function() {
					// tslint:disable-next-line:no-var-keyword
					Util.getFunctionCode(function() {var a = 1; }).should.equal(" var a = 1; ");
				});
		it("IsArray detects correctly for array and object",
				function() {
					Test.isArray([1, 2, 3]).should.be.true;
					Test.isArray({a: 1}).should.be.false;
				});
		it("IsElement detects falsly for object",
				function() {
					Test.isElement({}).should.be.false;
				});
		it("IsFunction detects correctly",
				function() {
					Test.isFunction(function(){}).should.be.true;
					Test.isFunction({}).should.be.false;
				});
		it("NewInt starts at 0 and increases",
				function() {
					const s = Util.newInt();
					(typeof(s)).should.equal("number");
					Util.newInt().should.equal(s + 1);
					Util.newInt().should.equal(s + 2);
				});
		it("NewUUID is unique even when called fast",
				function() {
					Util.newUUID().should.not.equal(Util.newUUID());
				});
		it("ToArray return array",
				function() {
					Util.toArray([1, 2, 3]).should.be.instanceOf(Array);
				});
		it("Loop should pass correct index",
				function() {
					let sum = 0;
					Util.loop(10, (i) => sum += i);
					sum.should.equal(45);
				});
	}
);
