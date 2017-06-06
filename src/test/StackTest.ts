import {should} from "chai";
import { Stack } from "../lib/struct/Stack";
should();

describe("Stack",
	function() {
		it("Push and Pop should change Depth to show correct number of pushed items",
			function(){
				const stack = new Stack();
				stack.depth.should.equal(0);
				stack.push(1);
				stack.depth.should.equal(1);
				stack.pop();
				stack.depth.should.equal(0);
			});
		it("Values returns an array of the pushed elements in order",
			function(){
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				stack.values.should.deep.equal([1, 2]);
			});
		it("ToList returns values as list",
			function(){
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				stack.toList().values.should.deep.equal([1, 2]);
			});
	}
);
