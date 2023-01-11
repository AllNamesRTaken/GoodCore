import { JSDOM } from "jsdom";
import { create } from "../lib/Dom";
import { Global } from "../lib/Global";
import * as Test from "../lib/Test";
import { Dom } from "../lib";

describe("Test",
	() => {
		let win: Window;
		beforeAll(() => {
			const dom = new JSDOM();
			win = dom.window as any;
			Global.window = null;
		});
		test("Env.isNode should be true",
			() => {
				expect(Test.Env.isNode()).toBe(true);
			});
		test("hasWindow returns false when no window is available",
			() => {
				expect(Test.hasWindow()).toBe(false);
			});
		test("hasConsole returns true if console is available available",
			() => {
				expect(Test.hasConsole()).toBe(true);
			});
		test("hasWindow returns true when window is available",
			() => {
				Global.window = win as Window;
				expect(Test.hasWindow()).toBe(true);
			});
		test("hasConsole returns true when window is available",
			() => {
				expect(Test.hasConsole()).toBe(true);
			});
		test("All is<browser>).toBe(false) in node",
			() => {
				expect(Test.Env.isBlink()).toBe(false);
				expect(Test.Env.isChrome()).toBe(false);
				expect(Test.Env.isEdge()).toBe(false);
				expect(Test.Env.isFirefox()).toBe(false);
				expect(Test.Env.isIE()).toBe(false);
				expect(Test.Env.isOpera()).toBe(false);
				expect(Test.Env.isSafari()).toBe(false);
			});
		test("isObject identifies Objects correctly",
			() => {
				expect(Test.isObject({})).toBe(true);
				expect(Test.isObject([])).toBe(true);
				expect(Test.isObject(new class { }())).toBe(true);
				// tslint:disable-next-line:no-construct
				expect(Test.isObject(new Number(2))).toBe(true);
				// tslint:disable-next-line:no-construct
				expect(Test.isObject(new String("foo"))).toBe(true);
				expect(Test.isObject(undefined)).toBe(false);
				expect(Test.isObject(null)).toBe(false);
				expect(Test.isObject("")).toBe(false);
				expect(Test.isObject(1)).toBe(false);
				expect(Test.isObject(true)).toBe(false);
			});
		test("isArray identifies arrays correctly",
			() => {
				expect(Test.isArray({})).toBe(false);
				expect(Test.isArray(null)).toBe(false);
				expect(Test.isArray(undefined)).toBe(false);
				expect(Test.isArray(1)).toBe(false);
				expect(Test.isArray("foo")).toBe(false);
				expect(Test.isArray([])).toBe(true);
			});
		test("isElement identifies html elements",
			() => {
				Dom.init(win);
				let div = create("<div id='foo'></div>");
				expect(Test.isElement(undefined)).toBe(false);
				expect(Test.isElement(null)).toBe(false);
				expect(Test.isElement({})).toBe(false);
				expect(Test.isElement(() => { })).toBe(false);
				expect(Test.isElement(1)).toBe(false);
				expect(Test.isElement("foo")).toBe(false);
				expect(Test.isElement(div)).toBe(true);
			});
		test("isFunction identifies functions",
			() => {
				expect(Test.isFunction(undefined)).toBe(false);
				expect(Test.isFunction(null)).toBe(false);
				expect(Test.isFunction({})).toBe(false);
				expect(Test.isFunction(() => { })).toBe(true);
				expect(Test.isFunction(() => 0)).toBe(true);
			});
		test("isNumber identifies numbers",
			() => {
				expect(Test.isNumber(undefined)).toBe(false);
				expect(Test.isNumber(null)).toBe(false);
				expect(Test.isNumber({})).toBe(false);
				expect(Test.isNumber(() => { })).toBe(false);
				expect(Test.isNumber(true)).toBe(false);
				expect(Test.isNumber("0")).toBe(false);
				expect(Test.isNumber(Infinity)).toBe(true);
				expect(Test.isNumber(-Infinity)).toBe(true);
				expect(Test.isNumber(0)).toBe(true);
				expect(Test.isNumber(42)).toBe(true);
				expect(Test.isNumber(42.2)).toBe(true);
			});
		test("isInt identifies integers",
			() => {
				expect(Test.isInt(undefined)).toBe(false);
				expect(Test.isInt(null)).toBe(false);
				expect(Test.isInt({})).toBe(false);
				expect(Test.isInt(() => { })).toBe(false);
				expect(Test.isInt(true)).toBe(false);
				expect(Test.isInt("0")).toBe(false);
				expect(Test.isInt(Infinity)).toBe(false);
				expect(Test.isInt(-Infinity)).toBe(false);
				expect(Test.isInt(0)).toBe(true);
				expect(Test.isInt(42)).toBe(true);
				expect(Test.isInt(42.2)).toBe(false);
			});
		test("isString identifies strings",
			() => {
				expect(Test.isString(undefined)).toBe(false);
				expect(Test.isString(null)).toBe(false);
				expect(Test.isString({})).toBe(false);
				expect(Test.isString(() => { })).toBe(false);
				expect(Test.isString(42)).toBe(false);
				expect(Test.isString("")).toBe(true);
				expect(Test.isString("42")).toBe(true);
			});
		test("areNullOrUndefined is true if any arg is null or undefined",
			() => {
				expect(Test.areNullOrUndefined(1, {}, 0, false)).toBe(false);
				expect(Test.areNullOrUndefined(1, {}, null, false)).toBe(true);
				expect(Test.areNullOrUndefined(1, undefined, 0, false)).toBe(true);
			});
		test("areNotNullOrUndefined is true if no arg is null or undefined",
			() => {
				expect(Test.areNotNullOrUndefined(1, {}, 0, false)).toBe(true);
				expect(Test.areNotNullOrUndefined(1, {}, null, false)).toBe(false);
				expect(Test.areNotNullOrUndefined(1, undefined, 0, false)).toBe(false);
			});
		test("areUndefined is true if any arg is undefined",
			() => {
				expect(Test.areUndefined(1, {}, 0, false)).toBe(false);
				expect(Test.areUndefined(1, {}, null, false)).toBe(false);
				expect(Test.areUndefined(1, undefined, 0, false)).toBe(true);
			});
		test("areNotUndefined is true if no arg is undefined",
			() => {
				expect(Test.areNotUndefined(1, {}, 0, false)).toBe(true);
				expect(Test.areNotUndefined(1, {}, null, false)).toBe(true);
				expect(Test.areNotUndefined(1, undefined, 0, false)).toBe(false);
			});
		test("IsNullOrUndefined is true if any arg is null or undefined",
			() => {
				expect(Test.isNullOrUndefined(0)).toBe(false);
				expect(Test.isNullOrUndefined(null)).toBe(true);
				expect(Test.isNullOrUndefined(undefined)).toBe(true);
			});
		test("IsNotNullOrUndefined is true if no arg is null or undefined",
			() => {
				expect(Test.isNotNullOrUndefined(0)).toBe(true);
				expect(Test.isNotNullOrUndefined(null)).toBe(false);
				expect(Test.isNotNullOrUndefined(undefined)).toBe(false);
			});
		test("IsNull is true if any arg is null",
			() => {
				expect(Test.isNull(0)).toBe(false);
				expect(Test.isNull(null)).toBe(true);
				expect(Test.isNull(undefined)).toBe(false);
			});
		test("IsNotNull is true if no arg is null",
			() => {
				expect(Test.isNotNull(0)).toBe(true);
				expect(Test.isNotNull(null)).toBe(false);
				expect(Test.isNotNull(undefined)).toBe(true);
			});
		test("IsUndefined is true if any arg is undefined",
			() => {
				expect(Test.isUndefined(0)).toBe(false);
				expect(Test.isUndefined(null)).toBe(false);
				expect(Test.isUndefined(undefined)).toBe(true);
			});
		test("IsNotUndefined is true if no arg is undefined",
			() => {
				expect(Test.isNotUndefined(0)).toBe(true);
				expect(Test.isNotUndefined(null)).toBe(true);
				expect(Test.isNotUndefined(undefined)).toBe(false);
			});

	}
);
