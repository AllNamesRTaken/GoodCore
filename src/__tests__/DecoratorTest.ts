import { debounced, once, asserts, deprecated, throttled } from "../lib/Decorators";
import { assert, AssertError, pipeOut } from "../lib/Util";
import { isNumber } from "../lib/Test";

describe("Decorators",
	() => {
		test("debounced should debounce the instance function",
			function (done) {
				class Foo {
					public value = 0;
					@debounced(20)
					public setFoo() {
						++this.value;
					}
				}
				let foo1 = new Foo();
				let foo2 = new Foo();
				foo1.setFoo();
				foo1.setFoo();
				foo2.setFoo();
				setTimeout(() => {
					expect(foo1.value).toBe(1);
					expect(foo2.value).toBe(1);
					done();
				}, 20);
			});
		test("debounced on async with leading should return same promise",
			async () => {
				class Foo {
					public value = 0;
					@debounced(20, { leading: true })
					public async setFoo() {
						return ++this.value;
					}
				}
				let foo1 = new Foo();
				let val: number = 0;
				val = await foo1.setFoo();
				expect(val).toBe(1);
				val = await foo1.setFoo();
				expect(val).toBe(1);
				setTimeout(async () => {
					val = await foo1.setFoo();
					expect(val).toBe(2);
				}, 20);
				return true;
			});
		test("debounced on async without leading should return same promise",
			async () => {
				class Foo {
					public value = 0;
					@debounced(20)
					public async setFoo() {
						return ++this.value;
					}
				}
				let foo1 = new Foo();
				let val: number = 0;
				foo1.setFoo();
				expect(val).toBe(0);
				val = await foo1.setFoo();
				expect(val).toBe(1);
				let result = foo1.setFoo();
				setTimeout(async () => {
					val = await result;
					expect(val).toBe(2);
				}, 20);
				await result;
				return true;
			});
		test("throttle should throttle the instance function",
			function (done) {
				class Foo {
					public value1 = 0;
					public value2 = 0;
					@throttled(20)
					public withTrailing() {
						++this.value1;
					}
					@throttled(20, { trailing: false })
					public noTrailing() {
						++this.value2;
					}
				}
				let foo1 = new Foo();
				let foo2 = new Foo();
				foo1.withTrailing();
				foo1.withTrailing();
				foo2.withTrailing();
				foo1.noTrailing();
				foo1.noTrailing();
				foo2.noTrailing();
				expect(foo1.value1).toBe(1);
				expect(foo2.value1).toBe(1);
				expect(foo1.value2).toBe(1);
				expect(foo2.value2).toBe(1);
				setTimeout(() => {
					expect(foo1.value1).toBe(2);
					expect(foo2.value1).toBe(2);
					expect(foo1.value2).toBe(1);
					expect(foo2.value2).toBe(1);
					done();
				}, 20);
			});
		test("once returns first value",
			() => {
				class Person {
					public anxiety: number = 0;
					@once
					public fret(...args: any[]) {
						return ++this.anxiety;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(1);
			});
		test("deprecate warns on first use",
			() => {
				class Person {
					@deprecated()
					public dep1() {
					}
					@deprecated("nonDep")
					public dep2() {
					}
					@deprecated("nonDep", "please change {class}.{name} into {instead}")
					public dep3() {
					}
				}
				let warning = "";
				pipeOut(null, (message: string) => warning = message);
				let sam = new Person();
				sam.dep1();
				expect(warning).toBe("Function Person::dep1 is deprecated");
				sam.dep2();
				expect(warning).toBe("Function Person::dep2 is deprecated please use nonDep instead");
				sam.dep3();
				expect(warning).toBe("please change Person.dep3 into nonDep");
			});
		test("assert decorated function throws",
			() => {
				class Person {
					public anxiety: number = 0;
					@asserts(function(howMuch: number) {
						assert(howMuch + (this.anxiety as number) < 10, "anxiety has to be below 10");
						assert(isNumber(howMuch), "nowMuch is not a number");
						assert(howMuch > 0, "howMuch > 0");
					})
					public fret(howMuch: number) {
						return this.anxiety += howMuch;
					}
				}
				let sam = new Person();
				sam.fret(1);
				expect(sam.anxiety).toBe(1);
				try {
					sam.fret(-1);
				} catch (err) {
					expect((err instanceof AssertError)).toBe(true);
					expect(err.message).toContain("howMuch > 0");
				}
				try {
					sam.fret(20);
				} catch (err) {
					expect((err instanceof AssertError)).toBe(true);
					expect(err.message).toContain("anxiety has to be below 10");
				}
				expect(sam.anxiety).toBe(1);
			});
		test("assert with result returns result",
			() => {
				class Person {
					public anxiety: number = 0;
					@asserts((howMuch: number) => {
						assert(isNumber(howMuch));
					}, (err: AssertError) => -10)
					@asserts((howMuch: number) => {
						assert(howMuch > 0, "howMuch > 0");
					}, -999)
					public fret(howMuch: number) {
						return this.anxiety += howMuch;
					}
				}
				let sam = new Person();
				sam.fret(1);
				expect(sam.anxiety).toBe(1);
				expect(sam.fret(-1)).toBe(-999);
				expect(sam.fret("foo" as any)).toBe(-10);
				expect(sam.anxiety).toBe(1);
			});
	}
);
