import { Tree } from "../lib/struct/Tree";
import { isNull } from "../lib/Test";

describe("Tree",
	() => {
		beforeAll(() => {
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
		test("Tree.fromObject returns correct tree",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.children!.get(1)!.children!.get(1)!.data!).toBe("c2-2");
				expect(tree.size).toBe(6);
				expect(tree.leafCount).toBe(4);
			});
		test("Aggregate does aggregate values",
			() => {
				const tree = this.tree as Tree<string>;
				let result = tree.aggregate<string | null>((cur, i, collected) => {
					return isNull(collected) ? cur.data : [cur.data, ...collected!].join(",");
				});
				expect(result!).toBe("root,c1,c2,c2-1,c2-2,c3");
			});
		test("Tree.fromNodeList returns correct tree in case with single root",
			() => {
				let nodeList = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				expect(tree.children!.get(0)!.children!.get(1)!.data!).toEqual({ category: "drama" });
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				expect(tree.virtual).toBe(true);
				expect(tree.children!.get(0)!.id).toBe("-");
				expect(tree.size).toBe(5);
				expect(tree.leafCount).toBe(3);
			});
		test("Tree.fromNodeList returns correct tree in case with single root and duplicate IDs",
			() => {
				let nodeList = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "0-1", parent: "1", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				expect(tree.children!.get(0)!.children!.get(1)!.data!).toEqual({ category: "drama" });
				expect(tree.children!.get(1)!.children!.get(0)!.data!).toEqual({ category: "drama" });
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				expect(tree.virtual).toBe(true);
				expect(tree.children!.get(0)!.id).toBe("-");
				expect(tree.size).toBe(6);
				expect(tree.leafCount).toBe(3);
			});
		test("Tree.fromNodeList returns correct tree in case with multiple roots",
			() => {
				let nodeList = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "foo", parent: null, category: "second root", children: ["0", "1"] },
				];
				let tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
				expect(tree.virtual).toBe(true);
				expect(tree.size).toBe(6);
				expect(tree.leafCount).toBe(4);
				expect(tree.children!.get(0)!.id).toBe("-");
				expect(tree.children!.get(1)!.id).toBe("foo");
				tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				expect(tree.virtual).toBe(false);
				expect(tree.id).toBe("-");
			});
		test("Root returns root of tree",
			() => {
				const tree = this.tree as Tree<string>;
				expect((tree.children!.get(1)!.children!.get(1)!.root === tree)).toBe(true);
			});
		test("Nodes are initable",
			() => {
				const tree = new Tree<string>("newNode");
				tree.init({ data: "dataString" });
				expect(tree.data!).toBe("dataString");
			});
		test("ForEach loops over all nodes and passes index in children",
			() => {
				const tree = this.tree as Tree<string>;
				let iList: number[] = [];
				let dList: string[] = [];
				tree.forEach((el, i) => {
					iList.push(i);
					dList.push(el.data!);
				});
				expect(iList).toEqual([0, 0, 1, 0, 1, 2]);
				expect(dList).toEqual(["root", "c1", "c2", "c2-1", "c2-2", "c3"]);
			});
		test("Find finds the correct node",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.find((node) => node.data === "c2-2")!.data!).toBe("c2-2");
				expect((tree.find((node) => node.data === "not there") === null)).toBe(true);
			});
		test("Find by size finds the correct node",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.find(0)!.data!).toBe("root");
				expect(tree.find(4)!.data!).toBe("c2-2");
				expect((tree.find(-1) === null)).toBe(true);
				expect((tree.find(11) === null)).toBe(true);
			});
		test("getLeaf gets a leaf by position",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.getLeaf(0)!.data!).toBe("c1");
				expect(tree.getLeaf(2)!.data!).toBe("c2-2");
				expect(isNull(tree.getLeaf(4))).toBe(true);
				expect(isNull(tree.find(-1))).toBe(true);
			});
		test("Filter returns filtered tree",
			() => {
				const tree = this.tree as Tree<string>;
				const filtered = tree.filter((node) => node.children !== null);
				expect(filtered!.size).toBe(2);
				expect(filtered!.leafCount).toBe(1);
				expect(filtered!.children!.get(0)!.data!).toBe("c2");
				expect(isNull(filtered!.children!.get(0)!.children)).toBe(true);
				const filtered2 = tree.filter((node) => node.children !== null && node.childCount > 42);
				expect((filtered2 === null)).toBe(true);
			});
		test("Select returns a list of matching nodes",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.select((node) => node.children === null).count).toBe(4);
			});
		test("Empty select returns all nodes",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.select().count).toBe(6);
			});
		test("Add and Remove does add and remove",
			() => {
				const tree = this.tree as Tree<string>;
				tree.add("c4");
				expect(tree!.size).toBe(7);
				expect(tree!.leafCount).toBe(5);
				const c4 = tree.find((node) => node.data === "c4");
				expect(c4!.data!).toBe("c4");
				(c4 as Tree<string>).remove();
				expect(tree!.size).toBe(6);
				expect(tree!.leafCount).toBe(4);

				expect((tree.find((node) => node.data === "c4") !== null)).toBe(false);
				let node = new Tree<string>().init({ data: "treenode" });
				tree.add(node);
				const treenode = tree.find((node) => node.data === "treenode");
				expect(treenode!.data!).toBe("treenode");
				(treenode as Tree<string>).remove();
			});
		test("Remove sets inner children list to null",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.children!.get(0)!.remove();
				c2.children!.get(0)!.remove();
				expect(isNull(c2.children)).toBe(true);
			});
		test("leafCount is recalculated after Add",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.add("c2-3");
				expect(tree.leafCount).toBe(5);
			});
		test("weight changes size but not leafCount",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				const c2 = tree.find((node) => node.data === "c2")!;
				c2.weight = 10;
				expect(c2.isDirty).toBe(true);
				expect(tree.size).toBe(15);
				expect(tree.leafCount).toBe(4);
			});
		test("Clone clones deep",
			() => {
				const tree = this.tree as Tree<string>;
				const orgc2t2 = tree.find((node) => node.data === "c2-2");
				const c2t2 = tree.clone().find((node) => node.data === "c2-2");
				expect(c2t2!.data!).toBe("c2-2");
				expect(orgc2t2!).not.toBe(c2t2);
			});
		test("Reduce performs depth first reduction",
			() => {
				const tree = this.tree as Tree<string>;
				expect(tree.reduce((acc, cur) => acc += "," + (cur!.data as string), "")).toBe(",root,c1,c2,c2-1,c2-2,c3");
			});
		test("Reduce without parameters returns node list",
			() => {
				const tree = this.tree as Tree<string>;
				let list: Array<Tree<string>> = tree.reduce();
				expect(list.length).toBe(6);
				expect(list[0].data!).toBe("root");
				expect(list[5].data!).toBe("c3");
			});
		test("InsertAt inserts at the correct position",
			() => {
				const tree = this.tree as Tree<string>;
				tree.insertAt(1, "c1.5");
				expect(tree!.size).toBe(7);
				expect(tree!.leafCount).toBe(5);
				expect(tree.children!.get(1)!.data!).toBe("c1.5");
				expect(tree.children!.get(2)!.data!).toBe("c2");
				tree.children!.get(1)!.remove();
				tree.insertAt(100000, "c4");
				expect(tree.children!.get(3)!.data!).toBe("c4");
				tree.children!.get(3)!.remove();
				tree.insertAt(2, new Tree<string>().init({ data: "c2.5" }));
				expect(tree.children!.get(2)!.data!).toBe("c2.5");
				tree.children!.get(2)!.remove();
			});
		test("Prune removes all children from a node",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				tree.children!.get(1)!.prune();
				expect(isNull(tree.children!.get(1)!.children)).toBe(true);
				expect(tree!.size).toBe(4);
				expect(tree!.leafCount).toBe(3);
			});
		test("Depth returns correct depth",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				expect(tree.depth()).toBe(0);
				expect(tree.children!.get(1)!.depth()).toBe(1);
				expect(tree.children!.get(1)!.children!.get(0)!.depth()).toBe(2);
			});
		test("Sort sorts all children recursivly",
			() => {
				const tree = (this.tree as Tree<string>).clone();
				tree.sort((a, b) => (a.data! < b.data! ? 1 : a.data! > b.data! ? -1 : 0));
				expect(tree.children!.get(0)!.data!).toBe("c3");
				expect(tree.children!.get(1)!.children!.get(1)!.data!).toBe("c2-1");
			});
		test("ToJson formats Tree correct",
			() => {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
					{ uid: "0-1", parent: "1", category: "drama", children: ["1-0-0", "1-0-1"] }
				];
				const tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				expect(JSON.stringify(tree)).toBe(JSON.stringify([
					{ id: "-", data: { category: "stuff" }, parent: null, children: ["0", "1"] },
					{ id: "0", data: { category: "books" }, parent: "-", children: ["0-0", "0-1"] },
					{ id: "0-0", data: { category: "adventure" }, parent: "0", children: null },
					{ id: "0-1", data: { category: "drama" }, parent: "0", children: null },
					{ id: "1", data: { category: "toys" }, parent: "-", children: ["0-1"] },
					{ id: "0-1", data: { category: "drama" }, parent: "1", children: null },
				]));
			});
		test("serialize works like a typed toJSON",
			() => {
				let nodeList: any[] = [
					{ uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
					{ uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
					{ uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
					{ uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
					{ uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
				];
				const tree = Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
				expect(tree.toJSON()).toEqual(tree.serialize());
			});
	}
);
