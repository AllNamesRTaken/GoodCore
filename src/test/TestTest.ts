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
		it("hasFastNativeArrays should be true in node",
			function () {
				Test.Env.hasFastNativeArrays().should.be.true;
			});
		it("hasConsole returns false when no window is available",
			function () {
				Test.hasConsole().should.be.false;
			});
		it("hasWindow returns true when window is available",
			function () {
				Global.window = this.win as Window;
				Test.hasWindow().should.be.true;
			});
		it("hasConsole returns true when window is available",
			function () {
				Test.hasConsole().should.be.true;
			});
		it("All is<browser> should be false in node",
			function () {
				Test.Env.isBlink().should.be.false;
				Test.Env.isChrome().should.be.false;
				Test.Env.isEdge().should.be.false;
				Test.Env.isFirefox().should.be.false;
				Test.Env.isIE().should.be.false;
				Test.Env.isOpera().should.be.false;
				Test.Env.isSafari().should.be.false;
			});
		it("isObject identifies Objects correctly",
			function () {
				Test.isObject({}).should.be.true;
				Test.isObject([]).should.be.true;
				Test.isObject(new class {}()).should.be.true;
				// tslint:disable-next-line:no-construct
				Test.isObject(new Number(2)).should.be.true;
				// tslint:disable-next-line:no-construct
				Test.isObject(new String("foo")).should.be.true;
				Test.isObject(undefined).should.be.false;
				Test.isObject(null).should.be.false;
				Test.isObject("").should.be.false;
				Test.isObject(1).should.be.false;
				Test.isObject(true).should.be.false;
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
				Test.isElement(function () { }).should.be.false;
				Test.isElement(1).should.be.false;
				Test.isElement("foo").should.be.false;
				Test.isElement(div).should.be.true;
			});
		it("isFunction identifies functions",
			function () {
				Test.isFunction(undefined).should.be.false;
				Test.isFunction(null).should.be.false;
				Test.isFunction({}).should.be.false;
				Test.isFunction(function () { }).should.be.true;
				Test.isFunction(() => 0).should.be.true;
			});
		it("isNumber identifies numbers",
			function () {
				Test.isNumber(undefined).should.be.false;
				Test.isNumber(null).should.be.false;
				Test.isNumber({}).should.be.false;
				Test.isNumber(function () { }).should.be.false;
				Test.isNumber(true).should.be.false;
				Test.isNumber("0").should.be.false;
				Test.isNumber(Infinity).should.be.true;
				Test.isNumber(-Infinity).should.be.true;
				Test.isNumber(0).should.be.true;
				Test.isNumber(42).should.be.true;
				Test.isNumber(42.2).should.be.true;
			});
		it("isInt identifies integers",
			function () {
				Test.isInt(undefined).should.be.false;
				Test.isInt(null).should.be.false;
				Test.isInt({}).should.be.false;
				Test.isInt(function () { }).should.be.false;
				Test.isInt(true).should.be.false;
				Test.isInt("0").should.be.false;
				Test.isInt(Infinity).should.be.false;
				Test.isInt(-Infinity).should.be.false;
				Test.isInt(0).should.be.true;
				Test.isInt(42).should.be.true;
				Test.isInt(42.2).should.be.false;
			});
		it("isString identifies strings",
			function () {
				Test.isString(undefined).should.be.false;
				Test.isString(null).should.be.false;
				Test.isString({}).should.be.false;
				Test.isString(function () { }).should.be.false;
				Test.isString(42).should.be.false;
				Test.isString("").should.be.true;
				Test.isString("42").should.be.true;
			});
		it("areNullOrUndefined is true if any arg is null or undefined",
			function () {
				Test.areNullOrUndefined(1, {}, 0, false).should.be.false;
				Test.areNullOrUndefined(1, {}, null, false).should.be.true;
				Test.areNullOrUndefined(1, undefined, 0, false).should.be.true;
			});
		it("areNotNullOrUndefined is true if no arg is null or undefined",
			function () {
				Test.areNotNullOrUndefined(1, {}, 0, false).should.be.true;
				Test.areNotNullOrUndefined(1, {}, null, false).should.be.false;
				Test.areNotNullOrUndefined(1, undefined, 0, false).should.be.false;
			});
		it("areUndefined is true if any arg is undefined",
			function () {
				Test.areUndefined(1, {}, 0, false).should.be.false;
				Test.areUndefined(1, {}, null, false).should.be.false;
				Test.areUndefined(1, undefined, 0, false).should.be.true;
			});
		it("areNotUndefined is true if no arg is undefined",
			function () {
				Test.areNotUndefined(1, {}, 0, false).should.be.true;
				Test.areNotUndefined(1, {}, null, false).should.be.true;
				Test.areNotUndefined(1, undefined, 0, false).should.be.false;
			});
		it("IsNullOrUndefined is true if any arg is null or undefined",
			function () {
				Test.isNullOrUndefined(0).should.be.false;
				Test.isNullOrUndefined(null).should.be.true;
				Test.isNullOrUndefined(undefined).should.be.true;
			});
		it("IsNotNullOrUndefined is true if no arg is null or undefined",
			function () {
				Test.isNotNullOrUndefined(0).should.be.true;
				Test.isNotNullOrUndefined(null).should.be.false;
				Test.isNotNullOrUndefined(undefined).should.be.false;
			});
		it("IsNull is true if any arg is null",
			function () {
				Test.isNull(0).should.be.false;
				Test.isNull(null).should.be.true;
				Test.isNull(undefined).should.be.false;
			});
		it("IsNotNull is true if no arg is null",
			function () {
				Test.isNotNull(0).should.be.true;
				Test.isNotNull(null).should.be.false;
				Test.isNotNull(undefined).should.be.true;
			});
		it("IsUndefined is true if any arg is undefined",
			function () {
				Test.isUndefined(0).should.be.false;
				Test.isUndefined(null).should.be.false;
				Test.isUndefined(undefined).should.be.true;
			});
		it("IsNotUndefined is true if no arg is undefined",
			function () {
				Test.isNotUndefined(0).should.be.true;
				Test.isNotUndefined(null).should.be.true;
				Test.isNotUndefined(undefined).should.be.false;
			});

	}
);
