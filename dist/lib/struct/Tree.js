var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { map } from "../Arr";
import { clone, isSameClass, setProperties } from "../Obj";
import { isArray, isNullOrUndefined, isNotNullOrUndefined, isNumber, isNull } from "../Test";
import { newUUID } from "../Util";
import { Dictionary } from "./Dictionary";
import { List } from "./List";
import { Stack } from "./Stack";
var Tree = (function () {
    function Tree(id) {
        this.id = "";
        this.parent = null;
        this.children = null;
        this.data = null;
        this.isDirty = false;
        this._virtual = false;
        this._size = 1;
        this._leafCount = 1;
        this._weight = 1;
        this.id = isNullOrUndefined(id) ? newUUID() : id;
    }
    Tree.fromObject = function (obj) {
        var parent = (this instanceof Tree) ? this : null;
        var root = new Tree(obj.id).init({ data: obj.data, parent: parent, isDirty: true });
        if (obj.children !== undefined && isArray(obj.children)) {
            root.children = new List(map(obj.children, Tree.fromObject.bind(root)));
        }
        return root;
    };
    Tree.fromNodeList = function (nodes, mapcfg, virtualRoot, ctor) {
        if (virtualRoot === void 0) { virtualRoot = false; }
        if (ctor === void 0) { ctor = Tree; }
        var result = new Tree();
        var mapResolver = function (key) {
            return !mapcfg || typeof (mapcfg[key]) === "undefined" ?
                (key === "id" ? newUUID() : function (el) { return el[key]; }) :
                typeof (mapcfg[key]) === "string" ? function (el) { return el[mapcfg[key]]; } :
                    mapcfg[key];
        };
        var map = {
            id: mapResolver("id"),
            parent: mapResolver("parent"),
            data: mapResolver("data")
        };
        var list = new List(nodes);
        var lookup = new Dictionary();
        var nodeList = list.map(function (el) { return new ctor("").init({ id: map.id(el), data: map.data(el), isDirty: true }); });
        nodeList.forEach(function (node, i) {
            if (!lookup.has(node.id)) {
                lookup.set(node.id, []);
            }
            lookup.get(node.id).push(node);
        });
        var rootNodes = new List();
        list.forEach(function (el, i) {
            var parentId = map.parent(el);
            if (lookup.contains(parentId)) {
                lookup.get(parentId).forEach(function (p) { return p.add(nodeList.get(i)); });
            }
            else {
                rootNodes.add(nodeList.get(i));
            }
        });
        if (virtualRoot === false) {
            result = rootNodes.first();
        }
        else {
            result = new ctor().init({ virtual: true });
            rootNodes.forEach(function (el) { return result.add(el); });
        }
        return result;
    };
    Object.defineProperty(Tree.prototype, "root", {
        get: function () {
            var root = this;
            while (root.parent) {
                root = root.parent;
            }
            return root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "childCount", {
        get: function () {
            return isNull(this.children) ? 0 : this.children.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "size", {
        get: function () {
            return this.isDirty ? this.reCalculateSize().size : this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "leafCount", {
        get: function () {
            return this.isDirty ? this.reCalculateSize().leafCount : this._leafCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        set: function (value) {
            var changed = value !== this._weight;
            this._weight = value;
            if (changed) {
                this.markAsDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "virtual", {
        get: function () {
            return this._virtual;
        },
        set: function (value) {
            var changed = value !== this._virtual;
            this._virtual = value;
            if (changed) {
                this._weight = value ? 0 : 1;
                this.markAsDirty();
            }
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.markAsDirty = function () {
        if (!this.isDirty) {
            this.isDirty = true;
            if (this.parent !== null) {
                this.parent.markAsDirty();
            }
        }
    };
    Tree.prototype.create = function (id) {
        return new (this.constructor)(id);
    };
    Tree.prototype.init = function (obj, mapping) {
        setProperties(this, obj);
        return this;
    };
    Tree.prototype.insertAt = function (pos, data, id) {
        var node;
        if (this.children === null || this.children.count <= pos) {
            node = this.add(data);
        }
        else {
            if (data instanceof Tree) {
                node = data;
                data.parent = this;
            }
            else {
                node = this.create(id).init({ data: data, parent: this });
            }
            this.children.insertAt(pos, node);
            this.markAsDirty();
        }
        return node;
    };
    Tree.prototype.add = function (data, id) {
        var node;
        if (this.children === null) {
            this.children = new List();
        }
        if (isSameClass(data, this)) {
            node = data;
            node.parent = this;
            this.children.add(node);
        }
        else {
            node = (this.create(id)).init({ data: data, parent: this });
            this.children.add(node);
        }
        this.markAsDirty();
        return node;
    };
    Tree.prototype.remove = function () {
        if (this.parent !== null) {
            this.parent.children.remove(this);
            if (this.parent.children.count === 0) {
                this.parent.children = null;
            }
            this.parent.markAsDirty();
        }
    };
    Tree.prototype.prune = function () {
        if (this.children !== null) {
            this.children
                .forEach(function (el, i) {
                el.parent = null;
            })
                .clear();
        }
        this.children = null;
        this.markAsDirty();
        return this;
    };
    Tree.prototype.cut = function () {
        this.remove();
        this.parent = null;
        return this;
    };
    Tree.prototype.forEach = function (fn, _i) {
        if (_i === void 0) { _i = 0; }
        fn(this, _i);
        if (this.children) {
            this.children.forEach(function (child, i) { return child.forEach(fn, i); });
        }
        return this;
    };
    Tree.prototype.reCalculateSize = function () {
        this.aggregate(function (cur, i, agg) {
            var _a;
            _a = __read(isNull(agg) || agg.length === 0 ?
                [cur._size, cur._leafCount] :
                agg.reduce(function (acc, cur) {
                    return [acc[0] + cur[0], acc[1] + cur[1]];
                }, [cur.weight, cur.children === null || cur.children.count === 0 ? 1 : 0]), 2), cur._size = _a[0], cur._leafCount = _a[1];
            cur.isDirty = false;
            return [cur._size, cur._leafCount];
        }, function (cur, i) { return !cur.isDirty; });
        return this;
    };
    Tree.prototype.aggregate = function (fn, prune, i) {
        if (i === void 0) { i = 0; }
        var isPruned = isNotNullOrUndefined(prune) && prune(this, i);
        return fn(this, i, isPruned || this.children === null ?
            null :
            this.children.map(function (el, i) {
                return el.aggregate(fn, prune, i);
            }).values, isPruned);
    };
    Tree.prototype.reduce = function (fn, start) {
        var stack = new Stack();
        var acc = (start || []);
        if (!fn) {
            fn = function (acc, cur) { return (acc.push({ id: cur.id, parent: cur.parent ? cur.parent.id : null, data: cur.data }), acc); };
        }
        var cur;
        var i;
        stack.push(this);
        while (cur = stack.pop()) {
            acc = fn(acc, cur);
            i = (cur.children && cur.children.count) || 0;
            while (i--) {
                stack.push(cur.children.get(i));
            }
        }
        return acc;
    };
    Tree.prototype.clone = function () {
        var result = this.create();
        result.id = this.id;
        result.children = this.children === null ? null : this.children.clone();
        if (result.children !== null) {
            result.children.forEach(function (node) { return node.parent = result; });
        }
        result.data = this.data === null || this.data === undefined ? this.data : clone(this.data);
        return result;
    };
    Tree.prototype.duplicateNode = function () {
        var result = this.create();
        result.id = this.id;
        result.data = this.data;
        return result;
    };
    Tree.prototype.filter = function (condition, parent) {
        if (parent === void 0) { parent = null; }
        var node = null;
        if (condition(this)) {
            node = this.duplicateNode();
            var children = this.children;
            node.parent = parent;
            if (children !== null) {
                node.children =
                    children
                        .select(condition)
                        .map(function (el, i) {
                        return el.filter(condition, node);
                    });
                if (node.children.length === 0) {
                    node.children = null;
                }
            }
            node.markAsDirty();
        }
        return node;
    };
    Tree.prototype.select = function (condition, acc) {
        if (acc === void 0) { acc = new List(); }
        var result = acc;
        var children = this.children;
        if (condition === undefined || condition(this)) {
            result.add(this);
        }
        if (children) {
            children.reduce(function (acc, cur) {
                return cur.select(condition, acc);
            }, result);
        }
        return result;
    };
    Tree.prototype._findBySize = function (pos) {
        var result;
        if (pos < 0 || pos >= this.size) {
            result = null;
        }
        else if (this.children === null || this.children.count === 0 || pos < this.weight) {
            result = this;
        }
        else {
            var size_1 = this.weight;
            var cur_1 = 0;
            this.children.until(function (el, i) {
                return size_1 + el.size > pos;
            }, function (el, i) {
                ++cur_1;
                size_1 += el.size;
            });
            result = this.children.get(cur_1)._findBySize(pos - size_1);
        }
        return result;
    };
    Tree.prototype.find = function (condition) {
        var result = null;
        if (isNumber(condition)) {
            result = this._findBySize(condition);
        }
        else {
            var children = this.children;
            if (children !== null) {
                var i = -1;
                var len = this.children.count;
                var val = this.children.values;
                while (++i < len) {
                    if (condition(val[i])) {
                        result = val[i];
                        break;
                    }
                    else {
                        result = val[i].children !== null ? val[i].find(condition) : null;
                        if (result !== null) {
                            break;
                        }
                    }
                }
            }
        }
        return result;
    };
    Tree.prototype.getLeaf = function (pos) {
        var result;
        if (isNull(this.children)) {
            result = this;
        }
        else if (pos < 0 || pos >= this.leafCount) {
            result = null;
        }
        else if (this.leafCount === this.children.count) {
            return this.children.get(pos);
        }
        else {
            var leaves_1 = 0;
            var cur_2 = 0;
            this.children.until(function (el, i) {
                return leaves_1 + el.leafCount > pos;
            }, function (el, i) {
                ++cur_2;
                leaves_1 += el.leafCount;
            });
            result = this.children.get(cur_2).getLeaf(pos - leaves_1);
        }
        return result;
    };
    Tree.prototype.depth = function () {
        var result = 0;
        var node = this;
        while (node.parent) {
            node = node.parent;
            ++result;
        }
        return result;
    };
    Tree.prototype.sort = function (comparer) {
        if (this.children !== null) {
            this.children.orderBy(comparer);
            this.children.forEach(function (el) { return el.sort(comparer); });
        }
        return this;
    };
    Tree.prototype.toJSON = function () {
        var result = new List();
        this.forEach(function (node) {
            result.push({
                id: node.id,
                data: node.data,
                parent: node.parent === null ? null : node.parent.id,
                children: node.children === null ? null : node.children.map(function (el) { return el.id; })
            });
        });
        return result.toJSON();
    };
    Tree.prototype.serialize = function () {
        var result = new List();
        result.push({
            id: this.id,
            data: this.data,
            parent: this.parent === null ? null : this.parent.id,
            children: this.children === null ? null : this.children.map(function (el) { return el.id; })
        });
        if (this.children !== null) {
            this.children.forEach(function (node) { return result.append(node.serialize()); });
        }
        return result.serialize();
    };
    return Tree;
}());
export { Tree };
//# sourceMappingURL=Tree.js.map