import { Tree } from "./Tree";
import { Dictionary } from "./Dictionary";
import { isArray } from "../Test";
import { List } from "./List";
import { map } from "../Arr";
export class IndexedTree extends Tree {
    constructor(id, indexer, index) {
        super(id);
        this._indexer = indexer ? indexer : (node) => node.id;
        this._index = index;
        if (index !== undefined) {
            this._index.set(this.id, this);
        }
    }
    get index() {
        if (this._index === undefined) {
            let newIndex = new Dictionary();
            this.forEach((node) => {
                if ((node)._index !== newIndex) {
                    (node)._index = newIndex;
                    this._index.set(this._indexer(node), node);
                }
            });
        }
        return this._index;
    }
    set index(v) {
        throw new Error("Not a settable property");
    }
    get indexer() {
        return this._indexer;
    }
    set indexer(v) {
        let hasChanged = this._indexer !== v;
        this._indexer = v;
        if (hasChanged) {
            this.reIndex();
        }
    }
    get _count() {
        return this.index.count;
    }
    reIndex() {
        let root = this.root;
        this.index.clear();
        root.forEach((node) => {
            this.index.set(this._indexer(node), node);
        });
        return this;
    }
    get(id) {
        return this.index.get(id);
    }
    addTo(parentId, data, id, updateIndex = true) {
        let parent = this.index.get(parentId);
        let node;
        if (parent) {
            node = parent.add(data, id, updateIndex);
        }
        return node;
    }
    add(data, id, updateIndex = true) {
        let node = super.add(data, id);
        if (updateIndex) {
            let hasSameIndex = this.index === node.index;
            if (!hasSameIndex) {
                node._index = this.index;
            }
            this.index.set(this._indexer(node), node);
            if (!hasSameIndex) {
                node.forEach((el) => {
                    el._index = this._index;
                    el._indexer = this._indexer;
                    this.index.set(this._indexer(el), el);
                });
            }
        }
        return node;
    }
    remove() {
        let parent = this.parent;
        super.remove();
        this.forEach((node) => {
            if (parent !== null) {
                parent.index.delete(parent._indexer(node));
            }
            node._index = undefined;
        });
        this._index = undefined;
    }
    insertAt(pos, data, id, updateIndex = true) {
        const node = super.insertAt(pos, data, id);
        if (updateIndex) {
            this.index.set(this._indexer(node), node);
            node.forEach((el) => {
                el._index = this._index;
                el._indexer = this._indexer;
                this.index.set(this._indexer(el), el);
            });
        }
        return node;
    }
    clone() {
        const node = super.clone();
        if (node.parent === null) {
            node._index = new Dictionary();
            node.forEach((n) => n._index = node.index);
            node.reIndex();
        }
        return node;
    }
    contains(node) {
        return this.index.contains(node instanceof IndexedTree ? this._indexer(node) : node);
    }
    prune() {
        let tree = super.prune();
        this.reIndex();
        return tree;
    }
    cut() {
        let cut = super.cut();
        cut.reIndex();
        return cut;
    }
    filter(condition, parent = null) {
        let root = super.filter(condition, parent);
        if (root !== null && root.parent === null) {
            root.reIndex();
        }
        return root;
    }
    static fromObject(obj, indexer) {
        const parent = (this instanceof IndexedTree) ? this : null;
        const root = new IndexedTree(obj.id, indexer, parent ? parent._index : undefined).init({ data: obj.data, parent: parent });
        root.index.set(root._indexer(root), root);
        if (obj.children !== undefined && isArray(obj.children)) {
            root.children = new List(map(obj.children, (el, i) => IndexedTree.fromObject.call(root, el, indexer)));
        }
        return root;
    }
    static fromNodeList(nodes, mapcfg, virtualRoot = false) {
        let tree = super.fromNodeList(nodes, mapcfg, virtualRoot, IndexedTree);
        tree.reIndex();
        return tree;
    }
}
//# sourceMappingURL=IndexedTree.js.map