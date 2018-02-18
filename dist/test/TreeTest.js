"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Tree_1 = require("../lib/struct/Tree");
chai_1.should();
describe("Tree", function () {
    before(function () {
        this.tree = Tree_1.Tree.fromObject({
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
    it("Tree.fromObject returns correct tree", function () {
        const tree = this.tree;
        tree.children.get(1).children.get(1).data.should.equal("c2-2");
    });
    it("Tree.fromNodeList returns correct tree in case with single root", function () {
        let nodeList = [
            { uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
            { uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
            { uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
            { uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
            { uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
        ];
        let tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
        tree.children.get(0).children.get(1).data.should.deep.equal({ category: "drama" });
        tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
        tree.virtual.should.be.true;
        tree.children.get(0).id.should.equal("-");
    });
    it("Tree.fromNodeList returns correct tree in case with single root and duplicate IDs", function () {
        let nodeList = [
            { uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
            { uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
            { uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
            { uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
            { uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
            { uid: "0-1", parent: "1", category: "drama", children: ["0-1-0", "0-1-1"] }
        ];
        let tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
        tree.children.get(0).children.get(1).data.should.deep.equal({ category: "drama" });
        tree.children.get(1).children.get(0).data.should.deep.equal({ category: "drama" });
        tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
        tree.virtual.should.be.true;
        tree.children.get(0).id.should.equal("-");
    });
    it("Tree.fromNodeList returns correct tree in case with multiple roots", function () {
        let nodeList = [
            { uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
            { uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
            { uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
            { uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
            { uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
            { uid: "foo", parent: null, category: "second root", children: ["0", "1"] },
        ];
        let tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) }, true);
        tree.virtual.should.be.true;
        tree.children.get(0).id.should.equal("-");
        tree.children.get(1).id.should.equal("foo");
        tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
        tree.virtual.should.be.false;
        tree.id.should.equal("-");
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
    it("Select returns a list of matching nodes", function () {
        const tree = this.tree;
        tree.select((node) => node.children === null).count.should.equal(4);
    });
    it("Empty select returns all nodes", function () {
        const tree = this.tree;
        tree.select().count.should.equal(6);
    });
    it("Add and Remove does add and remove", function () {
        const tree = this.tree;
        tree.add("c4");
        const c4 = tree.find((data) => data === "c4");
        c4.data.should.equal("c4");
        c4.remove();
        (tree.find((data) => data === "c4") !== null).should.be.false;
        let node = new Tree_1.Tree().init({ data: "treenode" });
        tree.add(node);
        const treenode = tree.find((data) => data === "treenode");
        treenode.data.should.equal("treenode");
        treenode.remove();
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
        tree.reduce((acc, cur) => acc += "," + cur.data, "").should.equal(",root,c1,c2,c2-1,c2-2,c3");
    });
    it("Reduce without parameters returns node list", function () {
        const tree = this.tree;
        let list = tree.reduce();
        list.length.should.equal(6);
        list[0].data.should.equal("root");
        list[5].data.should.equal("c3");
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
        tree.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
        tree.children.get(0).data.should.equal("c3");
        tree.children.get(1).children.get(1).data.should.equal("c2-1");
    });
    it("ToJson formats Tree correct", function () {
        let nodeList = [
            { uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
            { uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
            { uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
            { uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
            { uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] },
            { uid: "0-1", parent: "1", category: "drama", children: ["1-0-0", "1-0-1"] }
        ];
        const tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
        JSON.stringify(tree).should.equal(JSON.stringify([
            { id: "-", data: { category: "stuff" }, parent: null, children: ["0", "1"] },
            { id: "0", data: { category: "books" }, parent: "-", children: ["0-0", "0-1"] },
            { id: "0-0", data: { category: "adventure" }, parent: "0", children: null },
            { id: "0-1", data: { category: "drama" }, parent: "0", children: null },
            { id: "1", data: { category: "toys" }, parent: "-", children: ["0-1"] },
            { id: "0-1", data: { category: "drama" }, parent: "1", children: null },
        ]));
    });
    it("serialize works like a typed toJSON", function () {
        let nodeList = [
            { uid: "-", parent: null, category: "stuff", children: ["0", "1"] },
            { uid: "0", parent: "-", category: "books", children: ["0-0", "0-1"] },
            { uid: "1", parent: "-", category: "toys", children: ["1-0", "1-1"] },
            { uid: "0-0", parent: "0", category: "adventure", children: ["0-0-0", "0-0-1"] },
            { uid: "0-1", parent: "0", category: "drama", children: ["0-1-0", "0-1-1"] }
        ];
        const tree = Tree_1.Tree.fromNodeList(nodeList, { id: "uid", data: (el) => ({ category: el.category }) });
        tree.toJSON().should.deep.equal(tree.serialize());
    });
});
//# sourceMappingURL=TreeTest.js.map