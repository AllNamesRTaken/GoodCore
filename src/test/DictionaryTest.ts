import { should } from "chai";
import { equals } from "../lib/Obj";
import { Dictionary } from "../lib/struct/Dictionary";
import { Vec2 } from "../lib/struct/Vec2";
import { proxyFn } from "../lib/Util";
should();

describe("Dictionary",
	function () {
		it("Get returns Set value or undefined",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.get("key1").should.equal("value1");
				(d.get("key2") === undefined).should.be.true;
				d.set("key1", undefined);
				d.get("key1").should.equal("value1");
			});
		it("Values return array of values",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.values.should.deep.equal(["value1", "value2"]);
			});
		it("Keys return array of Keys",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.keys.should.deep.equal(["key1", "key2"]);
			});
		it("List return List of values",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.list.values.should.deep.equal(["value1", "value2"]);
			});
		it("Clear empties the dictionary",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.clear().values.length.should.equal(0);
			});
		it("Has returns true if dictionary has key otherwise false",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.has("key1").should.be.true;
				d.has("key2").should.be.false;
			});
		it("Contains returns true if dictionary has key otherwise false",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.contains("key1").should.be.true;
				d.contains("key2").should.be.false;
			});
		it("Delete removes a value from the dictionary",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.delete("key1");
				d.has("key1").should.be.false;
				d.values.should.deep.equal([]);
			});
		it("Count returns the corrent number of values",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.count.should.be.equal(2);
				d.delete("key1");
				d.count.should.be.equal(1);
			});
		it("Should return undefined for object prototype functions ",
			function () {
				const d = new Dictionary<string>();
				(d.get("toString") === undefined).should.be.true;
			});
		it("clone returns clone",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				let d2 = d.clone();
				d2.has("key1").should.be.true;
				d2.has("key2").should.be.true;
			});
		it("ToJson formats Dict correct",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				JSON.stringify(d).should.equal('{"key1":"value1","key2":"value2"}');
			});
		it("serialize works like a typed toJSON but deep",
			function () {
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				JSON.stringify(d.serialize()).should.equal('{"key1":"value1","key2":"value2"}');

				class Serializable {
					public foo: number;
					public bar: number;
					constructor(foo: number, bar: number) {
						this.foo = foo;
						this.bar = bar;
					}
					public serialize(): any {
						return this.foo;
					}
				}
				const d2 = new Dictionary<Serializable>();
				d2.set("key1", new Serializable(1, 2));
				d2.set("key2", new Serializable(3, 4));
				JSON.stringify(d2.serialize()).should.equal('{"key1":1,"key2":3}');
			});
		it("Revive revives Dictionary<T>",
			function () {
				class Revivable {
					public value: number;
					public revive(data: any): Revivable {
						this.value = data + 1;
						return this;
					}
				}
				const d1 = new Dictionary<number>();
				const d2 = new Dictionary<Revivable>();
				const d3 = new Dictionary<Vec2>();
				d1.revive({a:1, b:2, c:3, d:4});
				JSON.stringify(d1).should.equal('{"a":1,"b":2,"c":3,"d":4}');
				d2.revive({a:1, b:2, c:3, d:4}, Revivable);
				JSON.stringify(d2).should.equal('{"a":{"value":2},"b":{"value":3},"c":{"value":4},"d":{"value":5}}');
				d3.revive({a:{x:1, y:1}, b:{x:2, y:2}}, Vec2);
				JSON.stringify(d3).should.equal('{"a":{"x":1,"y":1},"b":{"x":2,"y":2}}');
			});
		it("deserialize calls revive",
			function () {
				let called = false;
				const d = new Dictionary<Deserializable>();
				proxyFn(d, "revive", (org, ...args) => { called = true; org(...args); } );
				class Deserializable {
					public foo: number;
					public deserialize(data: any): Deserializable {
						this.foo = data + 1;
						return this;
					}
				}
				d.deserialize({key1: 1, key2: 2}, Deserializable);
				called.should.be.true;
				JSON.stringify(d).should.equal('{"key1":{"foo":2},"key2":{"foo":3}}');
			});
	}

);
