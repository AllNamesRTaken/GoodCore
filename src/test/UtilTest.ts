import {should} from "chai";
import { jsdom } from "jsdom";
import { MocData } from "../lib/MocData";
import { Timer } from "../lib/Timer";
import { _Util, Util } from "../lib/Util";
should();

describe("Util",
	function() {
		before(
			function() {
				this.window = jsdom().defaultView;
				this.document = this.window.document;
				this.Util = Util._(this.window);
			});
		it("Assert writes to console.error and PipeOut catches it.",
			function() {
				const Util = this.Util as _Util;
				const log: any[] = [];
				const warn: any[] = [];
				const error: any[] = [];
				Util.PipeOut(
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
				Util.Assert(true, "true is true");
				error.length.should.equal(0);
				Util.Assert(false, "true is true");
				error.length.should.equal(1);
				error[0].should.contain("true is true");
				this.window.console.log("logged");
				log[0].should.contain("logged");
				this.window.console.warn("warned");
				warn[0].should.contain("warned");
				//cannot console.log here since that is overridden by Mocha
			});
		it("GetFunctionName returns correct name",
				function() {
					Util.GetFunctionName(function foo() {}).should.equal("foo");
				});
		it("GetFunctionCode returns correct code as string",
				function() {
					Util.GetFunctionCode(function() {const a = 1; }).should.equal(" var a = 1; ");
				});
		it("IsArray detects correctly for array and object",
				function() {
					Util.IsArray([1, 2, 3]).should.be.true;
					Util.IsArray({a: 1}).should.be.false;
				});
		it("IsElement detects falsly for object",
				function() {
					Util.IsElement({}).should.be.false;
				});
		it("IsFunction detects correctly",
				function() {
					Util.IsFunction(function(){}).should.be.true;
					Util.IsFunction({}).should.be.false;
				});
		it("NewInt starts at 0 and increases",
				function() {
					const s = Util.NewInt();
					(typeof(s)).should.equal("number");
					Util.NewInt().should.equal(s + 1);
					Util.NewInt().should.equal(s + 2);
				});
		it("NewUUID is unique even when called fast",
				function() {
					Util.NewUUID().should.not.equal(Util.NewUUID());
				});
		it("ToArray return array",
				function() {
					Util.ToArray([1, 2, 3]).should.be.instanceOf(Array);
				});
		it("Async should be close to 0 timeout",
				function(done) {
					const Util = this.Util as _Util;
					Timer.Start();
					Util.Async(function() {
						Timer.Stop();
						Timer.Time.should.be.approximately(0, 5);
						done();
					});
			});
	}
);
