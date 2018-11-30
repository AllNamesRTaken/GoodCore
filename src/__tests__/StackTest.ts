import { Stack } from "../lib/struct/Stack";
import { Vec2 } from "../lib/struct/Vec2";

describe("Stack",
	() => {
		test("Push and Pop should change Depth to show correct number of pushed items",
			() => {
				const stack = new Stack();
				expect(stack.depth).toBe(0);
				stack.push(1);
				expect(stack.depth).toBe(1);
				stack.pop();
				expect(stack.depth).toBe(0);
			});
		test("size === depth",
			() => {
				const stack = new Stack();
				expect(stack.depth).toBe(stack.size);
				stack.push(1);
				expect(stack.depth).toBe(stack.size);
				stack.pop();
				expect(stack.depth).toBe(stack.size);
			});
		test("isEmpty is true when empty",
			() => {
				const stack = new Stack();
				expect(stack.isEmpty).toBe(true);
				stack.push(1);
				expect(stack.isEmpty).toBe(false);
				stack.pop();
				expect(stack.isEmpty).toBe(true);
			});
		test("Peek and PeekAt only lets you look at data inside stack",
			() => {
				const stack = new Stack();
				expect((stack.peek() === undefined)).toBe(true);
				stack.push(1);
				stack.push(5);
				stack.push(3);
				stack.pop();
				expect(stack.peek()!).toBe(5);
				expect(stack.peekAt(1)!).toBe(1);
				expect((stack.peekAt(2) === undefined)).toBe(true);
				expect((stack.peekAt(-1) === undefined)).toBe(true);
			});
		test("Values returns an array of the pushed elements in order",
			() => {
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				expect(stack.values).toEqual([1, 2]);
			});
		test("ToList returns values as list",
			() => {
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				expect(stack.toList().values).toEqual([1, 2]);
			});
		test("Setting a limit limits the list by shifting",
			() => {
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				stack.push(3);
				stack.limit = 2;
				//setting limit evicts the oldest
				expect(stack.toList().values).toEqual([2, 3]);
				stack.push(4);
				//pushing on a limited stack evicts the oldest
				expect(stack.toList().values).toEqual([3, 4]);
				stack.limit = 0;
				stack.push(5);
				//setting the limit to 0 removes the limit
				expect(stack.toList().values).toEqual([3, 4, 5]);
				stack.limit = -1;
				//limit is >= 0
				expect(stack.limit).toBe(0);
			});
		test("clear sets the pos to 0",
			() => {
				const stack = new Stack(2);
				stack.push(1);
				stack.push(2);
				stack.push(3);
				expect(stack.size).toBe(3);
				expect(stack.peek()!).toBe(3);
				stack.clear();
				expect(stack.size).toBe(0);
				expect((stack.peek() === undefined)).toBe(true);
			});
		test("clone clones the tree",
			() => {
				const stack = new Stack(2);
				stack.push(1);
				stack.push(2);
				stack.push(3);
				let stack2 = stack.clone();
				expect(stack.toList().equals(stack2.toList())).toBe(true);
			});
		test("ToJson formats Stack correct",
			() => {
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				stack.push(3);
				stack.pop();
				expect(JSON.stringify(stack)).toBe("[1,2]");
			});
		test("serialize works like a typed toJSON",
			() => {
				const stack = new Stack<number>();
				stack.push(1);
				stack.push(2);
				stack.push(3);
				stack.pop();
				expect(stack.toJSON()).toEqual(stack.serialize());

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
				const stack2 = new Stack();
				stack2.push(new Serializable(1, 2));
				stack2.push(new Serializable(3, 4));
				expect(stack2.serialize()).toEqual([1, 3]);
			});
		test("Revive revives Stack<T>",
			() => {
				class Revivable {
					public foo: number;
					public deserialize(data: number): Revivable {
						this.foo = data + 1;
						return this;
					}
				}
				const stack1 = new Stack<number>();
				const stack2 = new Stack<Revivable>();
				const stack3 = new Stack<Vec2>();
				stack1.deserialize([1, 2, 3, 4]);
				expect(JSON.stringify(stack1)).toBe("[1,2,3,4]");
				stack2.deserialize([1, 2, 3, 4], Revivable);
				expect(JSON.stringify(stack2)).toBe('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
				stack3.deserialize([{x:1, y:1}, {x:2, y:2}], Vec2);
				expect(JSON.stringify(stack3)).toBe('[{"x":1,"y":1},{"x":2,"y":2}]');
			});
	}
);
