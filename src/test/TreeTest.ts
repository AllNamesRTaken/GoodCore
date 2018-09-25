import { should } from "chai";
import { Tree } from "../lib/struct/Tree";
import { isNull } from "util";
should();

describe("Tree",
	function () {
		before(function () {
			this.tree = Tree.fromObject({
				data: "root",
				children: [
					{ data: "c1" },
					{
						data: "c2", children: [
							{ data: "c2-1" },
							{ data: "c2-2" }
						]
					},
					{ data: "c3" }
				]
			});
		});
		it("Tree.fromObject returns correct tree",
			function () {
				const tree = this.tree as Tree<string>;
				tree.children!.get(1)!.children!.get(1)!.data!.should.equal("c2-2");
				tree.size.should.equal(6);
				tree.leafCount.should.equal(4);
			});
		it("Collect does aggregate values",
			function () {
				const tree = this.tree as Tree<string>;
				let result = tree.collect((cur, i, collected) => {
					return [cur.data, ...collected.values].join(",");
				});
				result.should.equal("root,c1,c2,c2-1,c2-2,c3");
			});
		it("Tree.fromNodeList returns correct tree in case with single root",
			function () {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				tree.children!.get(0)!.children!.get(1)!.data!.should.deep.equal({ category: "drama" });
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				tree.virtual.should.be.true;
				tree.children!.get(0)!.id.should.equal("-");
				tree.size.should.equal(5);
				tree.leafCount.should.equal(3);
			});
		it("Tree.fromNodeList returns correct tree in case with single root and duplicate IDs",
			function () {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "0-1", parent: "1", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				tree.children!.get(0)!.children!.get(1)!.data!.should.deep.equal({ category: "drama" });
				tree.children!.get(1)!.children!.get(0)!.data!.should.deep.equal({ category: "drama" });
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				tree.virtual.should.be.true;
				tree.children!.get(0)!.id.should.equal("-");
				tree.size.should.equal(6);
				tree.leafCount.should.equal(3);
			});
		it("Tree.fromNodeList returns correct tree in case with multiple roots",
			function () {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "foo", parent: null, category: "second root", children: ["0", "1"] },
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				tree.virtual.should.be.true;
				tree.size.should.equal(6);
				tree.leafCount.should.equal(4);
				tree.children!.get(0)!.id.should.equal("-");
				tree.children!.get(1)!.id.should.equal("foo");
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				tree.virtual.should.be.false;
				tree.id.should.equal("-");
			});
		it("Root returns root of tree",
			function () {
				const tree = this.tree as Tree<string>;
				(tree.children!.get(1)!.children!.get(1)!.root === tree).should.be.true;
			});
		it("Nodes are initable",
			function () {
				const tree = new Tree<string>("newNode");
				tree.init( { data: "dataString" } );
				tree.data!.should.equal("dataString");
			});
		it("ForEach loops over all nodes and passes index in children",
			function () {
				const tree = this.tree as Tree<string>;
				let iList: number[] = []
				let dList: string[] = []
				tree.forEach((el, i) => {
					iList.push(i);
					dList.push(el.data!);
				});
				iList.should.deep.equal([0,0,1,0,1,2]);
				dList.should.deep.equal(["root", "c1", "c2", "c2-1", "c2-2", "c3"]);
			});
		it("Find finds the correct node",
			function () {
				const tree = this.tree as Tree<string>;
				tree.find((node) => node.data === "c2-2")!.data!.should.equal("c2-2");
				(tree.find((node) => node.data === "not there") === null).should.be.true;
			});
		it("Find by size finds the correct node",
			function () {
				const tree = this.tree as Tree<string>;
				tree.find(0)!.data!.should.equal("root");
				tree.find(4)!.data!.should.equal("c2-2");
				(tree.find(-1) === null).should.be.true;
				(tree.find(11) === null).should.be.true;
			});
		it("getLeaf gets a leaf by position",
			function () {
				const tree = this.tree as Tree<string>;
				tree.getLeaf(0)!.data!.should.equal("c1");
				tree.getLeaf(2)!.data!.should.equal("c2-2");
				isNull(tree.getLeaf(4)).should.be.true;
				isNull(tree.find(-1)).should.be.true;
			});
		it("Filter returns filtered tree",
			function () {
				const tree = this.tree as Tree<string>;
				const filtered = tree.filter((node) => node.children !== null);
				filtered!.size.should.equal(2);
				filtered!.leafCount.should.equal(1);
				filtered!.children!.get(0)!.data!.should.equal("c2");
				isNull(filtered!.children!.get(0)!.children).should.be.true;
				const filtered2 = tree.filter((node) => node.children !== null && node.childCount > 42);
				(filtered2 === null).should.be.true;
			});
		it("Select returns a list of matching nodes",
			function () {
				const tree = this.tree as Tree<string>;
				tree.select((node) => node.children === null).count.should.equal(4);
			});
		it("Empty select returns all nodes",
			function () {
				const tree = this.tree as Tree<string>;
				tree.select().count.should.equal(6);
			});
		it("Add and Remove does add and remove",
			function () {
				const tree = this.tree as Tree<string>;
				tree.add("c4");
				tree!.size.should.equal(7);
				tree!.leafCount.should.equal(5);
				const c4 = tree.find((node) => node.data === "c4");
				c4!.data!.should.equal("c4");
				(c4 as Tree<string>).remove();
				tree!.size.should.equal(6);
				tree!.leafCount.should.equal(4);

				(tree.find((node) => node.data === "c4") !== null).should.be.false;
				let node = new Tree<string>().init({ data: "treenode" });
				tree.add(node);
				const treenode = tree.find((node) => node.data === "treenode");
				treenode!.data!.should.equal("treenode");
				(treenode as Tree<string>).remove();
			});
		it("Remove sets inner children list to null",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.children!.get(0)!.remove();
				c2.children!.get(0)!.remove();
				isNull(c2.children).should.be.true;
			});
		it("leafCount is recalculated after Add",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.add("c2-3");
				tree.leafCount.should.equal(5);
			});
		it("weight changes size but not leafCount",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.weight = 10;
				c2.isDirty.should.be.true;
				tree.size.should.equal(15);
				tree.leafCount.should.equal(4);
			});
		it("Clone clones deep",
			function () {
				const tree = this.tree as Tree<string>;
				const orgc2t2 = tree.find((node) => node.data === "c2-2");
				const c2t2 = tree.clone().find((node) => node.data === "c2-2");
				c2t2!.data!.should.equal("c2-2");
				orgc2t2!.should.not.equal(c2t2);
			});
		it("Reduce performs depth first reduction",
			function () {
				const tree = this.tree as Tree<string>;
				tree.reduce((acc, cur) => acc += "," + cur!.data, "").should.equal(",root,c1,c2,c2-1,c2-2,c3");
			});
		it("Reduce without parameters returns node list",
			function () {
				const tree = this.tree as Tree<string>;
				let list: Array<Tree<string>> = tree.reduce();
				list.length.should.equal(6);
				list[0].data!.should.equal("root");
				list[5].data!.should.equal("c3");
			});
		it("InsertAt inserts at the correct position",
			function () {
				const tree = this.tree as Tree<string>;
				tree.insertAt(1, "c1.5");
				tree!.size.should.equal(7);
				tree!.leafCount.should.equal(5);
				tree.children!.get(1)!.data!.should.equal("c1.5");
				tree.children!.get(2)!.data!.should.equal("c2");
				tree.children!.get(1)!.remove();
				tree.insertAt(100000, "c4");
				tree.children!.get(3)!.data!.should.equal("c4");
				tree.children!.get(3)!.remove();
				tree.insertAt(2, new Tree<string>().init({data: "c2.5"}));
				tree.children!.get(2)!.data!.should.equal("c2.5");
				tree.children!.get(2)!.remove();
			});
		it("Prune removes all children from a node",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				tree.children!.get(1)!.prune();
				isNull(tree.children!.get(1)!.children).should.be.true;
				tree!.size.should.equal(4);
				tree!.leafCount.should.equal(3);
			});
		it("Depth returns correct depth",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				tree.depth().should.equal(0);
				tree.children!.get(1)!.depth().should.equal(1);
				tree.children!.get(1)!.children!.get(0)!.depth().should.equal(2);
			});
		it("Sort sorts all children recursivly",
			function () {
				const tree = (this.tree as Tree<string>).clone();
				tree.sort((a, b) => (a.data! < b.data! ? 1 : a.data! > b.data! ? -1 : 0));
				tree.children!.get(0)!.data!.should.equal("c3");
				tree.children!.get(1)!.children!.get(1)!.data!.should.equal("c2-1");
			});
		it("ToJson formats Tree correct",
			function () {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "0-1", parent: "1", category: "drama", children: ["1-0-0", "1-0-1"] }
				];
				const tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				JSON.stringify(tree).should.equal(JSON.stringify([
					{ id: "-", data: {category: "stuff"}, parent: null, children: ["0", "1"] },
					{ id: "0", data: {category: "books"}, parent: "-", children: ["0-0", "0-1"] },
					{ id: "0-0", data: {category: "adventure"}, parent: "0", children: null },
					{ id: "0-1", data: {category: "drama"}, parent: "0", children: null },
					{ id: "1", data: {category: "toys"}, parent: "-", children: ["0-1"] },
					{ id: "0-1", data: {category: "drama"}, parent: "1", children: null },
				]));
			});
		it("serialize works like a typed toJSON",
			function () {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				const tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				tree.toJSON().should.deep.equal(tree.serialize());
			});
	}
);
