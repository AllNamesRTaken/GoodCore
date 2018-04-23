import { should } from "chai";
import { IndexedTree } from "../lib/struct/IndexedTree";
import { Tree } from "../lib/struct/Tree";
should();

describe("IndexedTree",
	function () {
		const asc = (a: Tree<string>, b: Tree<string>) => a.data! < b.data! ? -1 : a.data! > b.data! ? 1 : 0;
		const desc = (a: Tree<string>, b: Tree<string>) => a.data! < b.data! ? 1 : a.data! > b.data! ? -1 : 0
		before(function () {
			this.tree = IndexedTree.fromObject<string>({
				id: "root",
				data: "root",
				children: [
					{ id: "c3", data: "c3" },
					{
						id: "c2",
						data: "c2", children: [
							{ id: "c2-1", data: "c2-1" },
							{ id: "c2-2", data: "c2-2" }
						]
					},
					{ id: "c1", data: "c1" }
				]
			}, (node: Tree<string>) => node.id);
		});
		it("Tree.fromObject returns correct tree",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.children!.get(1)!.children!.get(1)!.data!.should.equal("c2-2");
				tree.children!.get(0)!.data!.should.equal("c3");
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
				let tree = IndexedTree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }) as IndexedTree<string>;
				tree.children!.get(0)!.children!.get(1)!.data!.should.deep.equal({ category: "drama" });
				tree = IndexedTree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true) as IndexedTree<string>;
				tree.virtual.should.be.true;
				tree.children!.get(0)!.id.should.equal("-");
				tree.count.should.equal(6);
			});
		it("Count returns the correct number of nodes",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.count.should.equal(6);
			});
		it("Indexer can be set and read",
			function () {
				const tree = new IndexedTree<string>("root");
				tree.contains("root").should.be.true;
				let indexer = (node: IndexedTree<string>) => node.id + "foo";
				tree.indexer = indexer
				tree.contains("rootfoo").should.be.true;
				(tree.indexer === indexer).should.be.true;
				tree.add("foo","foo", false);
				tree.indexer = indexer;
				tree.contains("foofoo").should.be.false;
				tree.reIndex();
				tree.contains("foofoo").should.be.true;
			});
		it("Find finds the correct node",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.find((node) => node.data === "c2-2")!.data!.should.equal("c2-2");
			});
		it("Filter returns filtered tree",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.count.should.equal(6);
				const filtered = tree.filter((node) => node.children !== null)!;
				filtered.children!.get(0)!.data!.should.equal("c2");
				filtered.children!.get(0)!.children!.count.should.equal(0);
				tree.count.should.equal(6);
				filtered.count.should.equal(2);
			});
		it("Contains is true if node exists otherwise false",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.contains("c2-2").should.be.true;
				tree.contains("c2-3").should.be.false;
				let c1 = new IndexedTree<string>("c1")
				tree.contains(c1)!.should.be.true;
			});
		it("Select returns a list of matching nodes",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.select((node) => node.children === null).count.should.equal(4);
				tree.count.should.equal(6);
			});
		it("Empty select returns all nodes",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.select().count.should.equal(6);
			});
		it("Add and Remove does add and remove, and modify index",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.count.should.equal(6);
				tree.add("c4", "c4");
				tree.count.should.equal(7);
				const c4 = tree.find((node) => node.data === "c4");
				c4!.data!.should.equal("c4");
				tree.contains("c4").should.be.true;
				(c4 as IndexedTree<string>).remove();
				tree.count.should.equal(6);
				tree.contains("c4").should.be.false;
				let node = new IndexedTree<string>("treenode").init({ data: "treenode" }) as IndexedTree<string>;
				tree.add(node);
				const treenode = tree.get("treenode");
				treenode!.data!.should.equal("treenode");
				(treenode as IndexedTree<string>).remove();
				tree.count.should.equal(6);
			});
		it("Add and AddTo with subtrees and reindexing",
			function () {
				const tree = this.tree as IndexedTree<string>;
				let subtree = new IndexedTree<string>("subtree", tree.indexer);
				subtree.add("c5", "c5");
				subtree.addTo("c5", "c6", "c6");
				subtree.contains("c6").should.be.true;
				let c7 = new IndexedTree<string>("c7", tree.indexer);
				subtree.addTo("c5", c7, undefined, false);
				subtree.contains("c7").should.be.false;
				subtree.reIndex();
				subtree.contains("c7").should.be.true;
				
				tree.add(subtree);
				tree.contains("c6").should.be.true;
				subtree.remove();
				tree.contains("c6").should.be.false;
				tree.count.should.equal(6);
				subtree.count.should.equal(4);

				let wIndex = new IndexedTree<string>("wIndex", tree.indexer, tree.index);
				tree.add(wIndex);
				wIndex.add(subtree);
				tree.count.should.equal(11);
				tree.contains("c6").should.be.true;
				subtree.remove();
				wIndex.remove();
				tree.contains("c6").should.be.false;
				tree.count.should.equal(6);

				tree.add(subtree, undefined, false);
				tree.contains("c6").should.be.false;
				tree.reIndex();
				tree.contains("c6").should.be.true;
				tree.count.should.equal(10);
				subtree.remove();
				tree.count.should.equal(6);
			});
		it("AddTo adds to a node by id",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.contains("newNode").should.be.false;
				let newNode = tree.addTo("c1", "new node", "newNode")!;
				tree.contains("newNode").should.be.true;
				tree.children!.get(2)!.children!.get(0)!.data!.should.equal("new node");
				(tree.addTo("no such parent", "data") === undefined).should.be.true;
				newNode.remove();
				tree.count.should.equal(6);
			});
		it("Get gets by id",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.get("c3")!.data!.should.equal("c3");
			});
		it("Clone clones deep",
			function () {
				const tree = this.tree as IndexedTree<string>;
				const orgc2t2 = tree.find((node) => node.data === "c2-2");
				const c2t2 = tree.clone().find((node) => node.data === "c2-2");
				c2t2!.data!.should.equal("c2-2");
				orgc2t2!.should.not.equal(c2t2);
				const clone = tree.clone();
				(clone.children!.get(1)!.parent === clone).should.be.true;
				tree.count.should.equal(6);
			});
		it("Reduce performs depth first reduction",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.count.should.equal(6);
				tree.reduce((acc, cur) => acc += "," + cur!.data, "").should.equal(",root,c3,c2,c2-1,c2-2,c1");
			});
		it("Reduce without parameters returns node list",
			function () {
				const tree = this.tree as IndexedTree<string>;
				let list: Array<IndexedTree<string>> = tree.reduce();
				list.length.should.equal(6);
				list[0].data!.should.equal("root");
				list[5].data!.should.equal("c1");
			});
		it("InsertAt inserts at the correct position",
			function () {
				const tree = this.tree as IndexedTree<string>;
				tree.insertAt(1, "c1.5");
				tree.children!.get(1)!.data!.should.equal("c1.5");
				tree.children!.get(2)!.data!.should.equal("c2");
				tree.children!.get(1)!.remove();
				tree.insertAt(100000, "c4");
				tree.children!.get(3)!.data!.should.equal("c4");
				tree.children!.get(3)!.remove();
			});
		it("Prune removes all children from a node",
			function () {
				const tree = (this.tree as IndexedTree<string>).clone() as IndexedTree<string>;
				tree.children!.get(1)!.prune();
				(tree.children!.get(1)!.children === null).should.be.true;
				tree.count.should.equal(4);
			});
		it("Cut returns a node without its parent",
			function () {
				const tree = (this.tree as IndexedTree<string>).clone() as IndexedTree<string>;
				let child = tree.children!.get(1)!.cut() as IndexedTree<string>;
				tree.children!.get(1)!.id.should.equal("c1");
				(child.parent === null).should.be.true;
				child.id.should.equal("c2");
				tree.count.should.equal(3);
				child.count.should.equal(3);

			});
		it("Depth returns correct depth",
			function () {
				const tree = (this.tree as IndexedTree<string>).clone();
				tree.depth().should.equal(0);
				tree.children!.get(1)!.depth().should.equal(1);
				tree.children!.get(1)!.children!.get(0)!.depth().should.equal(2);
			});
		it("Sort sorts all children recursivly",
			function () {
				const tree = (this.tree as IndexedTree<string>).clone();
				tree.sort(desc);
				tree.children!.get(0)!.data!.should.equal("c3");
				tree.children!.get(1)!.children!.get(1)!.data!.should.equal("c2-1");
			});

	}
);
