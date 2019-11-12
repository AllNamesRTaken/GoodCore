/**
 * @jest-environment jsdom
 */

import * as Cookie from "../lib/Cookie";
import { getDate } from "../lib/Util";

describe("Cookie",
	() => {
		beforeAll(() => {
			history.replaceState({}, 'path', '/path/index.html')
		});
		afterAll(() => {
			history.replaceState({}, 'back', '/')
		});
		test("setCookie sets a cookie",
			() => {
				Cookie.setCookie("cookie1", "value1", getDate("+1min"));
				expect(document.cookie).toBe("cookie1=value1");
			});
		test("getCookie gets a cookie",
			() => {
				Cookie.setCookie("cookie1", "value1", getDate("+1min"));
				expect(Cookie.getCookie("cookie1")).toBe("value1");
			});
		test("removeCookie removes a cookie",
			() => {
				Cookie.removeCookie("cookie1");
				expect(Cookie.getCookie("cookie1")).toBeUndefined();
			});
		test("setCookie with path sets a cookie with path",
			() => {
				Cookie.removeCookie("cookie1");
				Cookie.setCookie("pcookie", "pvalue", getDate("+5min"), "/");
				expect(document.cookie).toBe("pcookie=pvalue");
				Cookie.removeCookie("pcookie");
				expect(document.cookie).toBe("pcookie=pvalue");
				Cookie.removeCookie("pcookie", "/");
				expect(document.cookie).toBe("");
			});
		test("parseAllCookies returns a object with all cookies",
			() => {
				Cookie.setCookie("cookie1", "value1", getDate("+1min"));
				Cookie.setCookie("cookie2", "value2", getDate("+1min"));
				expect(Cookie.parseAllCookies()).toEqual({cookie1: "value1", cookie2: "value2"});
			});
		test("getMonster return new CookieMonster",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				expect("eatCookie" in monster).toBe(true);
			});
		test("getCookie on new CookieMonster gets defaults",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				expect(monster.getCookie("a")).toBe(1);
				expect(monster.getCookie("b")).toBe("2");
				monster.removeCookies();
			});
		test("monster.setCookie sets cookie",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				monster.setCookie("a", 2);
				expect(Cookie.getCookie("test")).toBe('{"0":2}');
				expect(monster.getCookie("a")).toBe(2);
				monster.removeCookies();
			});
		test("monster.setCookie escapes = and ;",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				let value = "a = 1; b = 2;";
				monster.setCookie("b", value);
				expect(Cookie.getCookie("test")).toBe('{"1":"a ¤e 1¤s b ¤e 2¤s"}');
				expect(monster.getCookie("b")).toBe("a = 1; b = 2;");
				monster.removeCookies();
			});
		test("monster.setCookie with path sets path",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}, path:"/"});
				monster.setCookie("a", 2);
				expect(monster.getCookie("b")).toBe("2");
				expect(Cookie.getCookie("test")).toBe('{"0":2}');
				Cookie.removeCookie("test");
				expect(Cookie.getCookie("test")).toBe('{"0":2}');
				Cookie.removeCookie("test", "/");
				expect(Cookie.getCookie("test")).toBeUndefined();
				monster.removeCookies();
			});
		test("monster.setCookie to default value removes cookie part",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				monster.setCookie("a", 2);
				expect(Cookie.getCookie("test")).toBe('{"0":2}');
				expect(monster.getCookie("a")).toBe(2);
				monster.setCookie("a", 1);
				expect(Cookie.getCookie("test")).toBe('{}');
				expect(monster.getCookie("a")).toBe(1);
				monster.removeCookies();
			});
		test("monster.eatCookie sets cookie part to default",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				monster.setCookie("a", 2);
				monster.eatCookie("a");
				expect(Cookie.getCookie("test")).toBe('{}');
				expect(monster.getCookie("a")).toBe(1);
				monster.removeCookies();
			});
		test("localStorage: true in options saves cookie to localStorage and removes from cookie",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				monster.setCookie("a", 2);
				expect(monster.getCookie("a")).toBe(2);
				let monster2 = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}, localStorage: true});
				monster2.setCookie("a", 2);
				expect(Cookie.getCookie("test")).toBeUndefined();
				expect(sessionStorage.getItem("test")).toBeNull();
				expect(localStorage.getItem("test")).toBe('{"0":2}');
				expect(monster2.getCookie("a")).toBe(2);
				monster.removeCookies();
			});
		test("localStorage: false in options saves cookie to cookie and removes from localStorage",
			() => {
				let monster2 = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}, localStorage: true});
				monster2.setCookie("b", "foo");
				expect(monster2.getCookie("b")).toBe("foo");
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}});
				monster.setCookie("b", "foo");
				expect(localStorage.getItem("test")).toBeNull();
				expect(sessionStorage.getItem("test")).toBeNull();
				expect(monster.getCookie("b")).toBe("foo");
				expect(Cookie.getCookie("test")).toBe('{"1":"foo"}');
				monster.removeCookies();
			});
		test("localStorage: saving cookie to sessionStorage removes it from localStorage",
			() => {
				let monster = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}, localStorage: true});
				monster.setCookie("b", "foo");
				expect(monster.getCookie("b")).toBe("foo");
				let monster2 = Cookie.getMonster({name: "test", defaults: {a: 1, b: "2"}, localStorage: true, session: true});
				monster2.setCookie("b", "foo");
				expect(localStorage.getItem("test")).toBeNull();
				expect(Cookie.getCookie("test")).toBeUndefined();
				expect(sessionStorage.getItem("test")).toBe('{"1":"foo"}');
				expect(monster.getCookie("b")).toBe("foo");
				monster.removeCookies();
			});
	}
);
