var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Tree } from "./Tree";
import { Dictionary } from "./Dictionary";
import { isArray } from "../Test";
import { List } from "./List";
import { map } from "../Arr";
var IndexedTree = (function (_super) {
    __extends(IndexedTree, _super);
    function IndexedTree(id, indexer, index) {
        var _this = _super.call(this, id) || this;
        _this._indexer = indexer ? indexer : function (node) { return node.id; };
        _this._index = index;
        if (index !== undefined) {
            _this._index.set(_this.id, _this);
        }
        return _this;
    }
    Object.defineProperty(IndexedTree.prototype, "index", {
        get: function () {
            var _this = this;
            if (this._index === undefined) {
                var newIndex_1 = new Dictionary();
                this.forEach(function (node) {
                    if ((node)._index !== newIndex_1) {
                        (node)._index = newIndex_1;
                        _this._index.set(_this._indexer(node), node);
                    }
                });
            }
            return this._index;
        },
        set: function (v) {
            throw new Error("Not a settable property");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedTree.prototype, "indexer", {
        get: function () {
            return this._indexer;
        },
        set: function (v) {
            var hasChanged = this._indexer !== v;
            this._indexer = v;
            if (hasChanged) {
                this.reIndex();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedTree.prototype, "_count", {
        get: function () {
            return this.index.count;
        },
        enumerable: true,
        configurable: true
    });
    IndexedTree.prototype.reIndex = function () {
        var _this = this;
        var root = this.root;
        this.index.clear();
        root.forEach(function (node) {
            _this.index.set(_this._indexer(node), node);
        });
        return this;
    };
    IndexedTree.prototype.get = function (id) {
        return this.index.get(id);
    };
    IndexedTree.prototype.addTo = function (parentId, data, id, updateIndex) {
        if (updateIndex === void 0) { updateIndex = true; }
        var parent = this.index.get(parentId);
        var node;
        if (parent) {
            node = parent.add(data, id, updateIndex);
        }
        return node;
    };
    IndexedTree.prototype.add = function (data, id, updateIndex) {
        var _this = this;
        if (updateIndex === void 0) { updateIndex = true; }
        var node = _super.prototype.add.call(this, data, id);
        if (updateIndex) {
            var hasSameIndex = this.index === node.index;
            if (!hasSameIndex) {
                node._index = this.index;
            }
            this.index.set(this._indexer(node), node);
            if (!hasSameIndex) {
                node.forEach(function (el) {
                    el._index = _this._index;
                    el._indexer = _this._indexer;
                    _this.index.set(_this._indexer(el), el);
                });
            }
        }
        return node;
    };
    IndexedTree.prototype.remove = function () {
        var parent = this.parent;
        _super.prototype.remove.call(this);
        this.forEach(function (node) {
            if (parent !== null) {
                parent.index.delete(parent._indexer(node));
            }
            node._index = undefined;
        });
        this._index = undefined;
    };
    IndexedTree.prototype.insertAt = function (pos, data, id, updateIndex) {
        var _this = this;
        if (updateIndex === void 0) { updateIndex = true; }
        var node = _super.prototype.insertAt.call(this, pos, data, id);
        if (updateIndex) {
            this.index.set(this._indexer(node), node);
            node.forEach(function (el) {
                el._index = _this._index;
                el._indexer = _this._indexer;
                _this.index.set(_this._indexer(el), el);
            });
        }
        return node;
    };
    IndexedTree.prototype.clone = function () {
        var node = _super.prototype.clone.call(this);
        if (node.parent === null) {
            node._index = new Dictionary();
            node.forEach(function (n) { return n._index = node.index; });
            node.reIndex();
        }
        return node;
    };
    IndexedTree.prototype.contains = function (node) {
        return this.index.contains(node instanceof IndexedTree ? this._indexer(node) : node);
    };
    IndexedTree.prototype.prune = function () {
        var tree = _super.prototype.prune.call(this);
        this.reIndex();
        return tree;
    };
    IndexedTree.prototype.cut = function () {
        var cut = _super.prototype.cut.call(this);
        cut.reIndex();
        return cut;
    };
    IndexedTree.prototype.filter = function (condition, parent) {
        if (parent === void 0) { parent = null; }
        var root = _super.prototype.filter.call(this, condition, parent);
        if (root !== null && root.parent === null) {
            root.reIndex();
        }
        return root;
    };
    IndexedTree.fromObject = function (obj, indexer) {
        var parent = (this instanceof IndexedTree) ? this : null;
        var root = new IndexedTree(obj.id, indexer, parent ? parent._index : undefined).init({ data: obj.data, parent: parent });
        root.index.set(root._indexer(root), root);
        if (obj.children !== undefined && isArray(obj.children)) {
            root.children = new List(map(obj.children, function (el, i) { return IndexedTree.fromObject.call(root, el, indexer); }));
        }
        return root;
    };
    IndexedTree.fromNodeList = function (nodes, mapcfg, virtualRoot) {
        if (virtualRoot === void 0) { virtualRoot = false; }
        var tree = _super.fromNodeList.call(this, nodes, mapcfg, virtualRoot, IndexedTree);
        tree.reIndex();
        return tree;
    };
    return IndexedTree;
}(Tree));
export { IndexedTree };
//# sourceMappingURL=IndexedTree.js.map