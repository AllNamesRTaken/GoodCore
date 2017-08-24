import {should} from "chai";
import { jsdom } from "jsdom";
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
		it("Assert writes to console.error and PipeOut catches it.",
			function() {
				const log: any[] = [];
				const warn: any[] = [];
				const error: any[] = [];
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
			});
		it("GetFunctionName returns correct name",
				function() {
					Util.getFunctionName(function foo() {}).should.equal("foo");
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
