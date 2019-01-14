import { Global } from "../lib/Global";
import * as Test from "../lib/Test";
import * as Util from "../lib/Util";

describe("Util",
	() => {
		beforeAll(
			() => {
				// this.window = jsdom().defaultView;
				// this.document = this.window.document;
				Util.init();
			});
		test("init sets Global.window object",
			() => {
				let org = Global.window;
				Util.init("foo" as any);
				expect(Global.window!).toBe("foo");
				Global.window = org;
			});
		test("Assert throws.",
			() => {
				try {
					Util.assert(false, "message");
				} catch (err) {
					expect((err instanceof Util.AssertError)).toBe(true);
					expect(err.message).toBe("message");
				}
				Util.assert(true, "message");
				expect(true).toBe(true);
			});
		test("SoftAssert writes to console.error and PipeOut catches it.",
			() => {
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
				expect(error.length).toBe(0);
				Util.assert(false, "true is true", true);
				expect(error.length).toBe(1);
				expect(error[0]).toContain("true is true");
				console.log("logged");
				expect(log[0]).toContain("logged");
				console.warn("warned");
				expect(warn[0]).toContain("warned");
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
				expect(log[1]).toContain("logged2");

				Global.window = real.window;
				console.log = real.log;
				console.warn = real.warn;
				console.error = real.error;

			});
		test("proxyFn wraps object method",
			() => {
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
				expect(barCalled).toBe(3);
				expect(proxyCalled).toBe(1);
				let foo2 = new Foo();
				foo2.bar(1);
				expect(proxyCalled).toBe(1);
				Util.proxyFn(Foo, Foo.prototype.bar.name, (org, ...args) => {
					proxyCalled++;
					org.call(this, ...args);
				});
				foo2.bar(2);
				expect(barCalled).toBe(6);
				expect(proxyCalled).toBe(2);
			});
		test("GetFunctionName returns correct name",
			() => {
				expect(Util.getFunctionName(function foo() { })).toBe("foo");
				function fn() { }
				fn.hasOwnProperty = () => undefined as any;
				expect(Util.getFunctionName(fn)).toBe("fn");
			});
		test("GetFunctionCode returns correct code as string",
			() => {
				// tslint:disable-next-line:no-var-keyword
				expect(Util.getFunctionCode(() => { var a = 1; })).toBe(" var a = 1; ");
			});
		test("IsArray detects correctly for array and object",
			() => {
				expect(Test.isArray([1, 2, 3])).toBe(true);
				expect(Test.isArray({ a: 1 })).toBe(false);
			});
		test("IsElement detects falsly for object",
			() => {
				expect(Test.isElement({})).toBe(false);
			});
		test("IsFunction detects correctly",
			() => {
				expect(Test.isFunction(() => { })).toBe(true);
				expect(Test.isFunction({})).toBe(false);
			});
		test("NewInt starts at 0 and increases",
			() => {
				const s = Util.newInt();
				expect(s).toBe(0);
				expect(typeof s).toBe("number");
				expect(Util.newInt()).toBe(s + 1);
				expect(Util.newInt()).toBe(s + 2);
				const keyed = Util.newInt("somekey");
				expect(keyed).toBe(0);
			});
		test("NewUUID is unique even when called fast",
			() => {
				expect(Util.newUUID()).not.toBe(Util.newUUID());
			});
		test("ToArray return array",
			() => {
				expect(Util.toArray([1, 2, 3])).toBeInstanceOf(Array);
			});
		test("Loop should pass correct index",
			() => {
				let sum = 0;
				Util.loop(10, (i) => sum += i);
				expect(sum).toBe(45);
			});
		test("Loop should stop if fn is returning false",
			() => {
				let sum = 0;
				Util.loop(10, (i) => {
					sum += i;
					return i === 5;
				});
				expect(sum).toBe(15);
			});
		test("Count should increase",
			() => {
				let sum = 0;
				Util.loop(10, (i) => Util.count());
				expect((+Util.counter())).toBe(10);
			});
		test("Count with name should be resetable",
			() => {
				let sum = 0;
				Util.count("one");
				Util.loop(10, (i) => Util.count("loop"));
				expect((+Util.counter("loop"))).toBe(10);
				expect((+Util.counter("loop").reset())).toBe(0);
				expect((+Util.counter("one"))).toBe(1);
			});
		test("Counter.log should log to console",
			() => {
				let output = "";
				let log = console.log;
				console.log = (text: string) => output = text;
				Util.counter().reset();
				Util.count().log();
				output.endsWith("1");
				console.log = log;
			});
		test("debounce debounces function",
			function (done) {
				let value = 0;
				let plus1 = Util.debounce((amount?: number) => {
					return ++value;
				}, 20);
				plus1();
				plus1();
				expect(value).toBe(0);
				setTimeout(() => {
					expect(value).toBe(1);
					done();
				}, 20);
			});
		test("debounce with leading executes once immediately and returns value",
			function (done) {
				let value = 0;
				let plus1 = Util.debounce(function inc() {
					return ++value;
				}, 20, { leading: true });

				expect(plus1()!).toBe(1);
				expect(plus1()!).toBe(1);
				expect(plus1()!).toBe(1);
				expect(value).toBe(1);
				setTimeout(() => {
					expect(plus1()!).toBe(2);
					expect(value).toBe(2);
					done();
				}, 20);
			});
		test("debounce without leading returns and resolves promise",
			function (done) {
				let value = 0;
				let plus1 = Util.debounce(function inc(): number {
					return ++value;
				}, 20);
				let result = plus1();
				result.then((v) => expect(v).toBe(1));
				expect(value).toBe(0);
				(plus1() as Promise<number>).then((v) => expect(v).toBe(1));
				expect(value).toBe(0);
				result.then(() => {
					expect(value).toBe(1);
					done();
				});
			});
		test("debounce without leading on async function returns and resolves promise",
			async function (done) {
				let value = 0;
				let plus1 = Util.debounce(async function inc() {
					return await new Promise<number>((resolve, reject) => setTimeout(() => {
						++value;
						resolve(value);
					}, 10));
				}, 20);
				let result = await plus1();
				expect(result).toBe(1);
				expect(value).toBe(1);
				let promise = plus1();
				plus1();
				expect(result).toBe(1);
				expect(value).toBe(1);
				promise.then((val) => {
					expect(val).toBe(2);
					expect(value).toBe(2);
					done();
				});
			});
		test("throttle with trailing = false throttles a function",
			function (done) {
				let value = 0;
				let plus1 = Util.throttle(function inc() {
					++value;
				}, 20, { trailing: false });
				plus1();
				plus1();
				expect(value).toBe(1);
				setTimeout(() => {
					expect(value).toBe(1);
					plus1();
					expect(value).toBe(2);
					done();
				}, 20);
			});
		test("throttle with trailing = true repeats last action",
			function (done) {
				let value = 0;
				let plus1 = Util.throttle(function inc() {
					return ++value;
				}, 20, /*{ trailing: true }*/);

				plus1();
				expect(value).toBe(1);
				setTimeout(() => {
					expect(value).toBe(2);
					done();
				}, 20);
			});
		test("throttle with trailing = true repeats last action with correct parameters",
			function (done) {
				let value = 0;
				let plus1 = Util.throttle(function inc(amount: number = 1) {
					value += amount;
					return value;
				}, 20, { trailing: true });

				plus1();
				plus1(10);
				expect(value).toBe(1);
				setTimeout(() => {
					expect(value).toBe(11);
					done();
				}, 20);
			});
	}
);
