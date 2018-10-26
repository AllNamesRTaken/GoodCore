import { should } from "chai";
import { debounced, once, asserts, deprecated } from "../lib/Decorators";
import { assert, AssertError, pipeOut } from "../lib/Util";
import { isNumber } from "../lib/Test";
import { isSameClass } from "../lib/Obj";
should();

describe("Decorators",
	function () {
		it("debounced should debounce the instance function",
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
					foo1.value.should.equal(1);
					foo2.value.should.equal(1);
					done();
				}, 20);
			});
		it("debounced on async with leading should return same promise",
			async function () {
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
				val.should.equal(1);
				val = await foo1.setFoo();
				val.should.equal(1);
				setTimeout(async () => {
					val = await foo1.setFoo();
					val.should.equal(2);
				}, 20);
				return true;
			});
		it("debounced on async without leading should return same promise",
			async function () {
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
				val.should.equal(0);
				val = await foo1.setFoo();
				val.should.equal(1);
				let result = foo1.setFoo();
				setTimeout(async () => {
					val = await result;
					val.should.equal(2);
				}, 20);
				await result;
				return true;
			});
		it("once returns first value",
			function () {
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
				sam.anxiety.should.equal(1);
			});
		it("deprecate warns on first use",
			function () {
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
				warning.should.equal("Function Person::dep1 is deprecated");
				sam.dep2();
				warning.should.equal("Function Person::dep2 is deprecated please use nonDep instead");
				sam.dep3();
				warning.should.equal("please change Person.dep3 into nonDep");
			});
		it("assert decorated function throws",
			function () {
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
				sam.anxiety.should.equal(1);
				try {
					sam.fret(-1);
				} catch (err) {
					(err instanceof AssertError).should.be.true;
					err.message.should.contain("howMuch > 0");
				}
				try {
					sam.fret(20);
				} catch (err) {
					(err instanceof AssertError).should.be.true;
					err.message.should.contain("anxiety has to be below 10");
				}
				sam.anxiety.should.equal(1);
			});
		it("assert with result returns result",
			function () {
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
				sam.anxiety.should.equal(1);
				sam.fret(-1).should.equal(-999);
				sam.fret("foo" as any).should.equal(-10);
				sam.anxiety.should.equal(1);
			});
	}
);
