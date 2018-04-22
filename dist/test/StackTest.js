"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Stack_1 = require("../lib/struct/Stack");
const Vec2_1 = require("../lib/struct/Vec2");
chai_1.should();
describe("Stack", function () {
    it("Push and Pop should change Depth to show correct number of pushed items", function () {
        const stack = new Stack_1.Stack();
        stack.depth.should.equal(0);
        stack.push(1);
        stack.depth.should.equal(1);
        stack.pop();
        stack.depth.should.equal(0);
    });
    it("size === depth", function () {
        const stack = new Stack_1.Stack();
        stack.depth.should.equal(stack.size);
        stack.push(1);
        stack.depth.should.equal(stack.size);
        stack.pop();
        stack.depth.should.equal(stack.size);
    });
    it("isEmpty is true when empty", function () {
        const stack = new Stack_1.Stack();
        stack.isEmpty.should.be.true;
        stack.push(1);
        stack.isEmpty.should.be.false;
        stack.pop();
        stack.isEmpty.should.be.true;
    });
    it("Peek and PeekAt only lets you look at data inside stack", function () {
        const stack = new Stack_1.Stack();
        (stack.peek() === undefined).should.be.true;
        stack.push(1);
        stack.push(5);
        stack.push(3);
        stack.pop();
        stack.peek().should.equal(5);
        stack.peekAt(1).should.equal(1);
        (stack.peekAt(2) === undefined).should.be.true;
        (stack.peekAt(-1) === undefined).should.be.true;
    });
    it("Values returns an array of the pushed elements in order", function () {
        const stack = new Stack_1.Stack();
        stack.push(1);
        stack.push(2);
        stack.values.should.deep.equal([1, 2]);
    });
    it("ToList returns values as list", function () {
        const stack = new Stack_1.Stack();
        stack.push(1);
        stack.push(2);
        stack.toList().values.should.deep.equal([1, 2]);
    });
    it("Setting a limit limits the list by shifting", function () {
        const stack = new Stack_1.Stack();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.limit = 2;
        stack.toList().values.should.deep.equal([2, 3]);
        stack.push(4);
        stack.toList().values.should.deep.equal([3, 4]);
        stack.limit = 0;
        stack.push(5);
        stack.toList().values.should.deep.equal([3, 4, 5]);
        stack.limit = -1;
        stack.limit.should.equal(0);
    });
    it("clear sets the pos to 0", function () {
        const stack = new Stack_1.Stack(2);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.size.should.equal(3);
        stack.peek().should.equal(3);
        stack.clear();
        stack.size.should.equal(0);
        (stack.peek() === undefined).should.be.true;
    });
    it("clone clones the tree", function () {
        const stack = new Stack_1.Stack(2);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        let stack2 = stack.clone();
        stack.toList().equals(stack2.toList()).should.be.true;
    });
    it("ToJson formats Stack correct", function () {
        const stack = new Stack_1.Stack();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.pop();
        JSON.stringify(stack).should.equal("[1,2]");
    });
    it("serialize works like a typed toJSON", function () {
        const stack = new Stack_1.Stack();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.pop();
        stack.toJSON().should.deep.equal(stack.serialize());
        class Serializable {
            constructor(foo, bar) {
                this.foo = foo;
                this.bar = bar;
            }
            serialize() {
                return this.foo;
            }
        }
        const stack2 = new Stack_1.Stack();
        stack2.push(new Serializable(1, 2));
        stack2.push(new Serializable(3, 4));
        stack2.serialize().should.deep.equal([1, 3]);
    });
    it("Revive revives Stack<T>", function () {
        class Revivable {
            deserialize(data) {
                this.foo = data + 1;
                return this;
            }
        }
        const stack1 = new Stack_1.Stack();
        const stack2 = new Stack_1.Stack();
        const stack3 = new Stack_1.Stack();
        stack1.deserialize([1, 2, 3, 4]);
        JSON.stringify(stack1).should.equal("[1,2,3,4]");
        stack2.deserialize([1, 2, 3, 4], Revivable);
        JSON.stringify(stack2).should.equal('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
        stack3.deserialize([{ x: 1, y: 1 }, { x: 2, y: 2 }], Vec2_1.Vec2);
        JSON.stringify(stack3).should.equal('[{"x":1,"y":1},{"x":2,"y":2}]');
    });
});
//# sourceMappingURL=StackTest.js.map