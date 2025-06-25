import { beforeAll, expect, describe, test } from 'vitest'
import { IndexedTree } from "../lib/struct/IndexedTree.js";
import { Tree } from "../lib/struct/Tree.js";
import { isNotUndefined } from "../lib/Test.js";

describe("IndexedTree",
	() => {
		const asc = (a: Tree<string>, b: Tree<string>) => a.data! < b.data! ? -1 : a.data! > b.data! ? 1 : 0;
		const desc = (a: Tree<string>, b: Tree<string>) => a.data! < b.data! ? 1 : a.data! > b.data! ? -1 : 0;
		let myTree: IndexedTree<any>;
		beforeAll(() => {
			myTree = IndexedTree.fromObject<string>({
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
			}, (node: Tree<string>) => node.id) as IndexedTree<string>;
		});
		test("Tree.fromObject returns correct tree",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.children![1]!.children![1]!.data!).toBe("c2-2");
				expect(tree.children![0]!.data!).toBe("c3");
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
				let tree = IndexedTree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }) as IndexedTree<string>;
				expect(tree.children![0]!.children![1]!.data!).toEqual({ category: "drama" });
				tree = IndexedTree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true) as IndexedTree<string>;
				expect(tree.virtual).toBe(true);
				expect(tree.children![0]!.id).toBe("-");
				expect(tree._count).toBe(6);
			});
		test("Count returns the correct number of nodes",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree._count).toBe(6);
			});
		test("Indexer can be set and read",
			() => {
				const tree = new IndexedTree<string>("root");
				expect(tree.contains("root")).toBe(true);
				let indexer = (node: IndexedTree<string>) => `${node.id}foo`;
				tree.indexer = indexer;
				expect(tree.contains("rootfoo")).toBe(true);
				expect((tree.indexer === indexer)).toBe(true);
				tree.add("foo", "foo", false);
				tree.indexer = indexer;
				expect(tree.contains("foofoo")).toBe(false);
				tree.reIndex();
				expect(tree.contains("foofoo")).toBe(true);
			});
		test("index can be read but not set",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.index["root"]!).toBe(tree);
				try {
					tree.index = Object.create(null);
				} catch (err) {
					expect(isNotUndefined(err)).toBe(true);
				}
			});
		test("Find finds the correct node",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.find((node) => node.data === "c2-2")!.data!).toBe("c2-2");
			});
		test("Filter returns filtered tree",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree._count).toBe(6);
				const filtered = tree.filter((node) => node.children !== null)!;
				expect(filtered.children![0]!.data!).toBe("c2");
				expect(filtered.children![0]!.childCount).toBe(0);
				expect(tree._count).toBe(6);
				expect(filtered._count).toBe(2);
			});
		test("Contains is true if node exists otherwise false",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.contains("c2-2")).toBe(true);
				expect(tree.contains("c2-3")).toBe(false);
				let c1 = new IndexedTree<string>("c1");
				expect(tree.contains(c1)!).toBe(true);
			});
		test("Select returns a list of matching nodes",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.select((node) => node.children === null).length).toBe(4);
				expect(tree._count).toBe(6);
			});
		test("Empty select returns all nodes",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.select().length).toBe(6);
			});
		test("Add and Remove does add and remove, and modify index",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree._count).toBe(6);
				tree.add("c4", "c4");
				expect(tree._count).toBe(7);
				const c4 = tree.find((node) => node.data === "c4");
				expect(c4!.data!).toBe("c4");
				expect(tree.contains("c4")).toBe(true);
				(c4 as IndexedTree<string>).remove();
				expect(tree._count).toBe(6);
				expect(tree.contains("c4")).toBe(false);
				let node = new IndexedTree<string>("treenode").init({ data: "treenode" }) as IndexedTree<string>;
				tree.add(node);
				const treenode = tree.get("treenode");
				expect(treenode!.data!).toBe("treenode");
				(treenode as IndexedTree<string>).remove();
				expect(tree._count).toBe(6);
			});
		test("Add and AddTo with subtrees and reindexing",
			() => {
				const tree = myTree as IndexedTree<string>;
				let subtree = new IndexedTree<string>("subtree", tree.indexer);
				subtree.add("c5", "c5");
				subtree.addTo("c5", "c6", "c6");
				expect(subtree.contains("c6")).toBe(true);
				let c7 = new IndexedTree<string>("c7", tree.indexer);
				subtree.addTo("c5", c7, undefined, false);
				expect(subtree.contains("c7")).toBe(false);
				subtree.reIndex();
				expect(subtree.contains("c7")).toBe(true);
				
				tree.add(subtree);
				expect(tree.contains("c6")).toBe(true);
				subtree.remove();
				expect(tree.contains("c6")).toBe(false);
				expect(tree._count).toBe(6);
				expect(subtree._count).toBe(4);

				let wIndex = new IndexedTree<string>("wIndex", tree.indexer, tree.index);
				tree.add(wIndex);
				wIndex.add(subtree);
				expect(tree._count).toBe(11);
				expect(tree.contains("c6")).toBe(true);
				subtree.remove();
				wIndex.remove();
				expect(tree.contains("c6")).toBe(false);
				expect(tree._count).toBe(6);

				tree.add(subtree, undefined, false);
				expect(tree.contains("c6")).toBe(false);
				tree.reIndex();
				expect(tree.contains("c6")).toBe(true);
				expect(tree._count).toBe(10);
				subtree.remove();
				expect(tree._count).toBe(6);
			});
		test("AddTo adds to a node by id",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.contains("newNode")).toBe(false);
				let newNode = tree.addTo("c1", "new node", "newNode")!;
				expect(tree.contains("newNode")).toBe(true);
				expect(tree.children![2]!.children![0]!.data!).toBe("new node");
				expect((tree.addTo("no such parent", "data") === undefined)).toBe(true);
				newNode.remove();
				expect(tree._count).toBe(6);
			});
		test("Get gets by id",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree.get("c3")!.data!).toBe("c3");
			});
		test("Clone clones deep",
			() => {
				const tree = myTree as IndexedTree<string>;
				const orgc2t2 = tree.find((node) => node.data === "c2-2");
				const c2t2 = tree.clone().find((node) => node.data === "c2-2");
				expect(c2t2!.data!).toBe("c2-2");
				expect(orgc2t2!).not.toBe(c2t2);
				const clone = tree.clone();
				expect((clone.children![1]!.parent === clone)).toBe(true);
				expect(tree._count).toBe(6);
			});
		test("Reduce performs depth first reduction",
			() => {
				const tree = myTree as IndexedTree<string>;
				expect(tree._count).toBe(6);
				expect(tree.reduce((acc, cur) => acc += `,${cur!.data}`, "")).toBe(",root,c3,c2,c2-1,c2-2,c1");
			});
		test("Reduce without parameters returns node list",
			() => {
				const tree = myTree as IndexedTree<string>;
				let list: Array<IndexedTree<string>> = tree.reduce();
				expect(list.length).toBe(6);
				expect(list[0].data!).toBe("root");
				expect(list[5].data!).toBe("c1");
			});
		test("InsertAt inserts at the correct position",
			() => {
				const tree = myTree as IndexedTree<string>;
				tree.insertAt(1, "c1.5");
				expect(tree.children![1]!.data!).toBe("c1.5");
				expect(tree.children![2]!.data!).toBe("c2");
				tree.children![1]!.remove();
				tree.insertAt(100000, "c4");
				expect(tree.children![3]!.data!).toBe("c4");
				tree.children![3]!.remove();
			});
		test("Prune removes all children from a node",
			() => {
				const tree = (myTree as IndexedTree<string>).clone() as IndexedTree<string>;
				tree.children![1]!.prune();
				expect((tree.children![1]!.children === null)).toBe(true);
				expect(tree._count).toBe(4);
			});
		test("Cut returns a node without its parent",
			() => {
				const tree = (myTree as IndexedTree<string>).clone() as IndexedTree<string>;
				let child = tree.children![1]!.cut() as IndexedTree<string>;
				expect(tree.children![1]!.id).toBe("c1");
				expect((child.parent === null)).toBe(true);
				expect(child.id).toBe("c2");
				expect(tree._count).toBe(3);
				expect(child._count).toBe(3);

			});
		test("Depth returns correct depth",
			() => {
				const tree = (myTree as IndexedTree<string>).clone();
				expect(tree.depth()).toBe(0);
				expect(tree.children![1]!.depth()).toBe(1);
				expect(tree.children![1]!.children![0]!.depth()).toBe(2);
			});
		test("Sort sorts all children recursivly",
			() => {
				const tree = (myTree as IndexedTree<string>).clone();
				tree.sort(desc);
				expect(tree.children![0]!.data!).toBe("c3");
				expect(tree.children![1]!.children![1]!.data!).toBe("c2-1");
			});

	}
);
