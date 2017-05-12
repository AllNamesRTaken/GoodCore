import {should} from "chai";
import { Tree } from "../lib/struct/Tree";
should();

describe("Tree",
	function() {
		before(function() {
			this.tree = Tree.FromObject({
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
				tree.Children.Get(1).Children.Get(1).Data.should.equal("c2-2");
			});
		it("Find finds the correct node",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Find((data) => data === "c2-2").Data.should.equal("c2-2");
			});
		it("Filter returns filtered tree",
			function(){
				const tree = this.tree as Tree<string>;
				const filtered = tree.Filter((node) => node.Children !== null);
				filtered.Children.Get(0).Data.should.equal("c2");
				filtered.Children.Get(0).Children.Count.should.equal(0);
			});
		it("Contains is true if node exists otherwise false",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Contains((data) => data === "c2-2").should.be.true;
				tree.Contains((data) => data === "c2-3").should.be.false;
			});
		it("Select returns a list of matching nodes",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Select((node) => node.Children === null).Count.should.equal(4);
			});
		it("Add and Remove does add and remove",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Add("c4");
				const c4 = tree.Find((data) => data === "c4");
				c4.Data.should.equal("c4");
				(c4 as Tree<string>).Remove();
				tree.Contains((data) => data === "c4").should.be.false;

			});
		it("Clone clones deep",
			function(){
				const tree = this.tree as Tree<string>;
				const orgc2_2 = tree.Find((data) => data === "c2-2");
				const c2_2 = tree.Clone().Find((data) => data === "c2-2");
				c2_2.Data.should.equal("c2-2");
				orgc2_2.should.not.equal(c2_2);
			});
		it("Reduce performs depth first reduction",
			function(){
				const tree = this.tree as Tree<string>;
				tree.Reduce((acc, cur) => acc += "," + cur, "").should.equal(",root,c1,c2,c2-1,c2-2,c3");
			});
		it("InsertAt inserts at the correct position",
			function(){
				const tree = this.tree as Tree<string>;
				tree.InsertAt(1, "c1.5");
				tree.Children.Get(1).Data.should.equal("c1.5");
				tree.Children.Get(2).Data.should.equal("c2");
				tree.Children.Get(1).Remove();
				tree.InsertAt(100000, "c4");
				tree.Children.Get(3).Data.should.equal("c4");
				tree.Children.Get(3).Remove();
			});
		it("Prune removes all children from a node",
			function(){
				const tree = (this.tree as Tree<string>).Clone();
				tree.Children.Get(1).Prune();
				(tree.Children.Get(1).Children === null).should.be.true;
			});
	}
);
