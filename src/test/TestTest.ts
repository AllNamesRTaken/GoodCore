import { should } from "chai";
import { JSDOM } from "jsdom";
import { create } from "../lib/Dom";
import { Global } from "../lib/Global";
import * as Test from "../lib/Test";
should();

describe("Test",
	function () {
		before(function () {
			const dom = new JSDOM();
			const win = dom.window;
			this.win = win;
			Global.window = null;
		});
		it("hasWindow returns false when no window is available",
			function () {
				Test.hasWindow().should.be.false;
			});
		it("hasConsole returns false when no window is available",
			function () {
				Test.hasConsole().should.be.false;
			});
		it("hasWindow returns true when window is available",
			function () {
				Global.window = this.win;
				Test.hasWindow().should.be.true;
			});
		it("hasConsole returns true when window is available",
			function () {
				Test.hasConsole().should.be.true;
			});
		it("isArray identifies arrays correctly",
			function () {
				Test.isArray({}).should.be.false;
				Test.isArray(null).should.be.false;
				Test.isArray(undefined).should.be.false;
				Test.isArray(1).should.be.false;
				Test.isArray("foo").should.be.false;
				Test.isArray([]).should.be.true;
			});
		it("isElement identifies html elements",
			function () {
				let div = create("<div id='foo'></div>");
				Test.isElement(undefined).should.be.false;
				Test.isElement(null).should.be.false;
				Test.isElement({}).should.be.false;
				Test.isElement(function() {}).should.be.false;
				Test.isElement(1).should.be.false;
				Test.isElement("foo").should.be.false;
				Test.isElement(div).should.be.true;
			});
		it("isFunction identifies functions",
			function () {
				Test.isFunction(undefined).should.be.false;
				Test.isFunction(null).should.be.false;
				Test.isFunction({}).should.be.false;
				Test.isFunction(function() {}).should.be.true;
				Test.isFunction(() => 0).should.be.true;
			});
	}
);
