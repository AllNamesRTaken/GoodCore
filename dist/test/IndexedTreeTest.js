"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IndexedTree_1 = require("../lib/struct/IndexedTree");
const Tree_1 = require("../lib/struct/Tree");
chai_1.should();
describe("IndexedTree", function () {
    const asc = (a, b) => a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
    const desc = (a, b) => a.data < b.data ? 1 : a.data > b.data ? -1 : 0;
    before(function () {
        this.tree = IndexedTree_1.IndexedTree.fromObject({
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
        }, (node) => node.id);
    });
    it("Tree.fromObject returns correct tree", function () {
        const tree = this.tree;
        tree.children.get(1).children.get(1).data.should.equal("c2-2");
        tree.children.get(0).data.should.equal("c3");
    });
    it("Find finds the correct node", function () {
        const tree = this.tree;
        tree.find((data) => data === "c2-2").data.should.equal("c2-2");
    });
    it("Filter returns filtered tree", function () {
        const tree = this.tree;
        const filtered = tree.filter((node) => node.children !== null);
        filtered.children.get(0).data.should.equal("c2");
        filtered.children.get(0).children.count.should.equal(0);
    });
    it("Contains is true if node exists otherwise false", function () {
        const tree = this.tree;
        tree.contains("c2-2").should.be.true;
        tree.contains("c2-3").should.be.false;
        let c1 = new Tree_1.Tree("c1");
        tree.contains(c1).should.be.true;
    });
    it("Select returns a list of matching nodes", function () {
        const tree = this.tree;
        tree.select((node) => node.children === null).count.should.equal(4);
    });
    it("Empty select returns all nodes", function () {
        const tree = this.tree;
        tree.select().count.should.equal(6);
    });
    it("Add and Remove does add and remove, and modify index", function () {
        const tree = this.tree;
        tree.add("c4", "c4");
        const c4 = tree.find((data) => data === "c4");
        c4.data.should.equal("c4");
        tree.contains("c4").should.be.true;
        c4.remove();
        tree.contains("c4").should.be.false;
        let node = new IndexedTree_1.IndexedTree("treenode").init({ data: "treenode" });
        tree.add(node);
        const treenode = tree.get("treenode");
        treenode.data.should.equal("treenode");
        treenode.remove();
    });
    it("AddTo adds to a node by id", function () {
        const tree = this.tree;
        tree.contains("newNode").should.be.false;
        let newNode = tree.addTo("c1", "new node", "newNode");
        tree.contains("newNode").should.be.true;
        tree.children.get(2).children.get(0).data.should.equal("new node");
        newNode.remove();
    });
    it("Get gets by id", function () {
        const tree = this.tree;
        tree.get("c3").data.should.equal("c3");
    });
    it("Clone clones deep", function () {
        const tree = this.tree;
        const orgc2t2 = tree.find((data) => data === "c2-2");
        const c2t2 = tree.clone().find((data) => data === "c2-2");
        c2t2.data.should.equal("c2-2");
        orgc2t2.should.not.equal(c2t2);
    });
    it("Reduce performs depth first reduction", function () {
        const tree = this.tree;
        tree.reduce((acc, cur) => acc += "," + cur.data, "").should.equal(",root,c3,c2,c2-1,c2-2,c1");
    });
    it("Reduce without parameters returns node list", function () {
        const tree = this.tree;
        let list = tree.reduce();
        list.length.should.equal(6);
        list[0].data.should.equal("root");
        list[5].data.should.equal("c1");
    });
    it("InsertAt inserts at the correct position", function () {
        const tree = this.tree;
        tree.insertAt(1, "c1.5");
        tree.children.get(1).data.should.equal("c1.5");
        tree.children.get(2).data.should.equal("c2");
        tree.children.get(1).remove();
        tree.insertAt(100000, "c4");
        tree.children.get(3).data.should.equal("c4");
        tree.children.get(3).remove();
    });
    it("Prune removes all children from a node", function () {
        const tree = this.tree.clone();
        tree.children.get(1).prune();
        (tree.children.get(1).children === null).should.be.true;
    });
    it("Depth returns correct depth", function () {
        const tree = this.tree.clone();
        tree.depth().should.equal(0);
        tree.children.get(1).depth().should.equal(1);
        tree.children.get(1).children.get(0).depth().should.equal(2);
    });
    it("Sort sorts all children recursivly", function () {
        const tree = this.tree.clone();
        tree.sort(desc);
        tree.children.get(0).data.should.equal("c3");
        tree.children.get(1).children.get(1).data.should.equal("c2-1");
    });
});
//# sourceMappingURL=IndexedTreeTest.js.map