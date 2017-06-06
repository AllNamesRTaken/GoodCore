import {should} from "chai";
import { Tree } from "../lib/struct/Tree";
should();

describe("Tree",
	function() {
		before(function() {
			this.tree = Tree.fromObject({
				data: "root",
				children: [
					{data: "c1"},
					{data: "c2", children: [
						{data: "c2-1"},
						{data: "c2-2"}
					]},
					{data: "c3"}
				]
			});
		});
		it("Tree.FromObject returns correct tree",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Children.get(1).Children.get(1).Data.should.equal("c2-2");
			});
		it("Find finds the correct node",
			function(){
				const tree = this.tree as Tree<string>;
				tree.find((data) => data === "c2-2").Data.should.equal("c2-2");
			});
		it("Filter returns filtered tree",
			function(){
				const tree = this.tree as Tree<string>;
				const filtered = tree.filter((node) => node.Children !== null);
				filtered.Children.get(0).Data.should.equal("c2");
				filtered.Children.get(0).Children.count.should.equal(0);
			});
		it("Contains is true if node exists otherwise false",
			function(){
				const tree = this.tree as Tree<string>;
				tree.contains((data) => data === "c2-2").should.be.true;
				tree.contains((data) => data === "c2-3").should.be.false;
			});
		it("Select returns a list of matching nodes",
			function(){
				const tree = this.tree as Tree<string>;
				tree.select((node) => node.Children === null).count.should.equal(4);
			});
		it("Add and Remove does add and remove",
			function(){
				const tree = this.tree as Tree<string>;
				tree.add("c4");
				const c4 = tree.find((data) => data === "c4");
				c4.Data.should.equal("c4");
				(c4 as Tree<string>).remove();
				tree.contains((data) => data === "c4").should.be.false;

			});
		it("Clone clones deep",
			function(){
				const tree = this.tree as Tree<string>;
				const orgc2_2 = tree.find((data) => data === "c2-2");
				const c2_2 = tree.clone().find((data) => data === "c2-2");
				c2_2.Data.should.equal("c2-2");
				orgc2_2.should.not.equal(c2_2);
			});
		it("Reduce performs depth first reduction",
			function(){
				const tree = this.tree as Tree<string>;
				tree.reduce((acc, cur) => acc += "," + cur, "").should.equal(",root,c1,c2,c2-1,c2-2,c3");
			});
		it("InsertAt inserts at the correct position",
			function(){
				const tree = this.tree as Tree<string>;
				tree.insertAt(1, "c1.5");
				tree.Children.get(1).Data.should.equal("c1.5");
				tree.Children.get(2).Data.should.equal("c2");
				tree.Children.get(1).remove();
				tree.insertAt(100000, "c4");
				tree.Children.get(3).Data.should.equal("c4");
				tree.Children.get(3).remove();
			});
		it("Prune removes all children from a node",
			function(){
				const tree = (this.tree as Tree<string>).clone();
				tree.Children.get(1).prune();
				(tree.Children.get(1).Children === null).should.be.true;
			});
	}
);
