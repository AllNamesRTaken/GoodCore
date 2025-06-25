import { expect, describe, test } from 'vitest'
import { Dictionary } from "../lib/struct/Dictionary.js";
import { Vec2 } from "../lib/struct/Vec2.js";

describe("Dictionary",
	() => {
		test("Get returns Set value or undefined",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				expect(d.lookup("key1")!).toBe("value1");
				expect((d.lookup("key2") === undefined)).toBe(true);
				d.add("key1", undefined!);
				expect(d.lookup("key1")!).toBe("value1");
			});
		test("Values return array of values",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(d.values).toEqual(["value1", "value2"]);
			});
		test("Keys return array of Keys",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(d.keys).toEqual(["key1", "key2"]);
			});
		test("Clear empties the dictionary",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(d.clear().values.length).toBe(0);
			});
		test("Has returns true if dictionary has key otherwise false",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				expect(d.has("key1")).toBe(true);
				expect(d.has("key2")).toBe(false);
			});
		test("Contains returns true if dictionary has key otherwise false",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				expect(d.contains("key1")).toBe(true);
				expect(d.contains("key2")).toBe(false);
			});
		test("Delete removes a value from the dictionary",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.remove("key1");
				expect(d.has("key1")).toBe(false);
				expect(d.values).toEqual([]);
			});
		test("Count returns the corrent number of values",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(d.count).toBe(2);
				d.remove("key1");
				expect(d.count).toBe(1);
			});
		test("Should return undefined for object prototype functions ",
			() => {
				const d = new Dictionary<string>();
				expect((d.lookup("toString") === undefined)).toBe(true);
			});
		test("clone returns clone",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				let d2 = d.clone();
				expect(d2.has("key1")).toBe(true);
				expect(d2.has("key2")).toBe(true);
			});
		test("clone has a correct list",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				let d2 = d.clone();
				expect(d2.values).toEqual(["value1", "value2"]);
			});
		test("ToJson formats Dict correct",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(JSON.stringify(d)).toBe('{"key1":"value1","key2":"value2"}');
			});
		test("serialize works like a typed toJSON but deep",
			() => {
				const d = new Dictionary<string>();
				d.add("key1", "value1");
				d.add("key2", "value2");
				expect(JSON.stringify(d.serialize())).toBe('{"key1":"value1","key2":"value2"}');

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
				d2.add("key1", new Serializable(1, 2));
				d2.add("key2", new Serializable(3, 4));
				expect(JSON.stringify(d2.serialize())).toBe('{"key1":1,"key2":3}');
			});
		test("deserialize revives Dictionary<T>",
			() => {
				class Revivable {
					public value: number;
					public deserialize(data: number): Revivable {
						this.value = data + 1;
						return this;
					}
				}
				const d1 = new Dictionary<number>();
				const d2 = new Dictionary<Revivable>();
				const d3 = new Dictionary<Vec2>();
				d1.deserialize({a:1, b:2, c:3, d:4});
				expect(JSON.stringify(d1)).toBe('{"a":1,"b":2,"c":3,"d":4}');
				d2.deserialize({a:1, b:2, c:3, d:4}, Revivable);
				expect(JSON.stringify(d2)).toBe('{"a":{"value":2},"b":{"value":3},"c":{"value":4},"d":{"value":5}}');
				d3.deserialize({a:{x:1, y:1}, b:{x:2, y:2}}, Vec2);
				expect(JSON.stringify(d3)).toBe('{"a":{"x":1,"y":1},"b":{"x":2,"y":2}}');
			});
		test("deserialize Dictionary<T> populates the values",
			() => {
				const d1 = new Dictionary<number>();
				d1.deserialize({a:1, b:2, c:3, d:4});
				expect(d1.values).toEqual([1, 2, 3, 4]);
			});
	}

);
