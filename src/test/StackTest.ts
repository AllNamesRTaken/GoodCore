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
		it("Setting a limit limits the list by shifting",
			function(){
				const stack = new Stack();
				stack.push(1);
				stack.push(2);
				stack.push(3);
				stack.limit = 2;
				//setting limit evicts the oldest
				stack.toList().values.should.deep.equal([2, 3]);
				stack.push(4);
				//pushing on a limited stack evicts the oldest
				stack.toList().values.should.deep.equal([3, 4]);
				stack.limit = 0;
				stack.push(5);
				//setting the limit to 0 removes the limit
				stack.toList().values.should.deep.equal([3, 4, 5]);
				stack.limit = -1;
				//limit is >= 0
				stack.limit.should.equal(0);
			});
	}
);
