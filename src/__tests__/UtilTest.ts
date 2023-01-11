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
		test("deprecate warns once",
			() => {
				Global.noDeprecationWarnings = false;

				const bar = Util.deprecate("<foo>", function bar(a: string) {return a})

				const warn: any[] = [];
				let real = {
					warn: console.warn,
				};
				Util.pipeOut(
					null,
					function (...args: any[]) {
						warn.push.apply(warn, args);
					},
				);

				expect(warn.length).toBe(0);
				bar("test")
				expect(warn.length).toBe(1);
				bar("test")
				expect(warn.length).toBe(1);
				let result = bar("test")
				expect(warn[0]).toContain("<foo>");
				expect(result).toBe("test");

				// reset
				console.warn = real.warn;
				Global.noDeprecationWarnings = true;
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
		test("PipeOut with catchDefault = true catches console log/warn/error.",
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
				let trueLog = "";
				console.log = function(...args: string[]) {
					trueLog = args.join();
				}

				Util.pipeOut(
					function (...args: any[]) {
						log.push.apply(log, args);
					},
					function (...args: any[]) {
						warn.push.apply(warn, args);
					},
					function (...args: any[]) {
						error.push.apply(error, args);
					},
					true
				);
				console.error("true is true");
				expect(error[0]).toContain("true is true");
				console.log("logged");
				expect(log[0]).toContain("logged");
				console.warn("warned");
				expect(warn[0]).toContain("warned");
				expect(trueLog).toBe("");

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
		test("getDate returns the correct date object", 
			() => {
				const now = new Date("Thu, 18 Apr 2019 08:34:06 GMT");
				let empty = Util.getDate("", now);
				expect(now.getTime() - empty.getTime()).toBe(0);
				let defaultPos = Util.getDate("1h", now);
				expect(now.getTime() - defaultPos.getTime()).toBe(-3600000);
				let defaultNow = Util.getDate("1h");
				expect(((new Date()).getTime() - defaultNow.getTime())/10000).toBeCloseTo(-360);
				let defaultValue = Util.getDate();
				expect(((new Date()).getTime() - defaultValue.getTime())/10000).toBeCloseTo(0);
				let posYear = Util.getDate("+1Y", now);
				expect(posYear.getFullYear() - now.getFullYear()).toBe(1);
				let posMonth = Util.getDate("+1M", now);
				expect(posMonth.getMonth() - now.getMonth()).toBe(1);
				let posMonthDst = Util.getDate("+7M", now);
				let wasDst = Util.isDaylightSavingTime(now);
				let isDst = Util.isDaylightSavingTime(posMonthDst);
				if(wasDst === isDst) {
					expect(posMonthDst.getTime() - now.getTime()).toBe(18493200000 - 3600000);
				} else {
					expect(posMonthDst.getTime() - now.getTime()).toBe(18493200000);
				}
				let posDay = Util.getDate("+1d", now);
				expect(posDay.getDate() - now.getDate()).toBe(1);
				let posHour = Util.getDate("+1h", now);
				expect(posHour.getHours() - now.getHours()).toBe(1);
				let posMinute = Util.getDate("+1m", now);
				expect(posMinute.getMinutes() - now.getMinutes()).toBe(1);
				let posSecond = Util.getDate("+1s", now);
				expect(posSecond.getSeconds() - now.getSeconds()).toBe(1);
				let negYear = Util.getDate("-1Y", now);
				expect(negYear.getFullYear() - now.getFullYear()).toBe(-1);
				let negMonth = Util.getDate("-1M", now);
				expect(negMonth.getMonth() - now.getMonth()).toBe(-1);
				let negMonthDst = Util.getDate("-2M", now);
				wasDst = Util.isDaylightSavingTime(now);
				isDst = Util.isDaylightSavingTime(negMonthDst);
				if(wasDst === isDst) {
					expect(negMonthDst.getTime() - now.getTime()).toBe(-5094000000 - 3600000);
				} else {
					expect(negMonthDst.getTime() - now.getTime()).toBe(-5094000000);
				}				let negDay = Util.getDate("-1d", now);
				expect(negDay.getDate() - now.getDate()).toBe(-1);
				let negHour = Util.getDate("-1h", now);
				expect(negHour.getHours() - now.getHours()).toBe(-1);
				let negMinute = Util.getDate("-1m", now);
				expect(negMinute.getMinutes() - now.getMinutes()).toBe(-1);
				let negSecond = Util.getDate("-1s", now);
				expect(negSecond.getSeconds() - now.getSeconds()).toBe(-1);
				let pos = Util.getDate("+1Y2M3d4h5m6s", now);
				expect(pos.getTime() - now.getTime()).toBe(37166706000);
				let neg = Util.getDate("-1Y2M3d4h5m6s", now);
				wasDst = Util.isDaylightSavingTime(now);
				isDst = Util.isDaylightSavingTime(neg);
				if(wasDst === isDst) {
					expect(neg.getTime() - now.getTime()).toBe(-36903906000 - 3600000);
				} else {
					expect(neg.getTime() - now.getTime()).toBe(-36903906000);
				}
				let holey = Util.getDate("+2M4h6s", now);
				expect(now.getTime() - holey.getTime()).toBe(-5284806000);
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
			async function () {
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
				}, 20 );

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
		test("throttle with leading = false only runs trailing",
			function (done) {
				let value = 0;
				let plus1 = Util.throttle(function inc() {
					return ++value;
				}, 20, { leading: false });

				plus1();
				plus1();
				expect(value).toBe(0);
				setTimeout(() => {
					expect(value).toBe(1);
					done();
				}, 20);
			});
		test("throttle with leading = false and trailing false still runs trailing",
			function (done) {
				let value = 0;
				let plus1 = Util.throttle(function inc() {
					return ++value;
				}, 20, { leading: false });

				plus1();
				plus1();
				expect(value).toBe(0);
				setTimeout(() => {
					expect(value).toBe(1);
					done();
				}, 20);
			});
	}
);
