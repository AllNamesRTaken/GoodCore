import { map } from "../Arr";
import { clone, isSameClass, setProperties } from "../Obj";
import { isArray, isNullOrUndefined, isNotNullOrUndefined, isNumber, isNull } from "../Test";
import { newUUID } from "../Util";
import { Dictionary } from "./Dictionary";
import { List } from "./List";
import { Stack } from "./Stack";
export class Tree {
    constructor(id) {
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
    static fromObject(obj) {
        const parent = (this instanceof Tree) ? this : null;
        const root = new Tree(obj.id).init({ data: obj.data, parent, isDirty: true });
        if (obj.children !== undefined && isArray(obj.children)) {
            root.children = new List(map(obj.children, Tree.fromObject.bind(root)));
        }
        return root;
    }
    static fromNodeList(nodes, mapcfg, virtualRoot = false, ctor = Tree) {
        let result = new Tree();
        let mapResolver = (key) => {
            return !mapcfg || typeof (mapcfg[key]) === "undefined" ?
                (key === "id" ? newUUID() : (el) => el[key]) :
                typeof (mapcfg[key]) === "string" ? (el) => el[mapcfg[key]] :
                    mapcfg[key];
        };
        let map = {
            id: mapResolver("id"),
            parent: mapResolver("parent"),
            data: mapResolver("data")
        };
        let list = new List(nodes);
        let lookup = new Dictionary();
        let nodeList = list.map((el) => new ctor("").init({ id: map.id(el), data: map.data(el), isDirty: true }));
        nodeList.forEach((node, i) => {
            if (!lookup.has(node.id)) {
                lookup.set(node.id, []);
            }
            lookup.get(node.id).push(node);
        });
        let rootNodes = new List();
        list.forEach((el, i) => {
            let parentId = map.parent(el);
            if (lookup.contains(parentId)) {
                lookup.get(parentId).forEach((p) => p.add(nodeList.get(i)));
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
            rootNodes.forEach((el) => result.add(el));
        }
        return result;
    }
    get root() {
        let root = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }
    get childCount() {
        return isNull(this.children) ? 0 : this.children.count;
    }
    get size() {
        return this.isDirty ? this.reCalculateSize().size : this._size;
    }
    get leafCount() {
        return this.isDirty ? this.reCalculateSize().leafCount : this._leafCount;
    }
    get weight() {
        return this._weight;
    }
    set weight(value) {
        let changed = value !== this._weight;
        this._weight = value;
        if (changed) {
            this.markAsDirty();
        }
    }
    get virtual() {
        return this._virtual;
    }
    set virtual(value) {
        let changed = value !== this._virtual;
        this._virtual = value;
        if (changed) {
            this._weight = value ? 0 : 1;
            this.markAsDirty();
        }
    }
    markAsDirty() {
        if (!this.isDirty) {
            this.isDirty = true;
            if (this.parent !== null) {
                this.parent.markAsDirty();
            }
        }
    }
    create(id) {
        return new (this.constructor)(id);
    }
    init(obj, mapping) {
        setProperties(this, obj);
        return this;
    }
    insertAt(pos, data, id) {
        let node;
        if (this.children === null || this.children.count <= pos) {
            node = this.add(data);
        }
        else {
            if (data instanceof Tree) {
                node = data;
                data.parent = this;
            }
            else {
                node = this.create(id).init({ data, parent: this });
            }
            this.children.insertAt(pos, node);
            this.markAsDirty();
        }
        return node;
    }
    add(data, id) {
        let node;
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
    }
    remove() {
        if (this.parent !== null) {
            this.parent.children.remove(this);
            if (this.parent.children.count === 0) {
                this.parent.children = null;
            }
            this.parent.markAsDirty();
        }
    }
    prune() {
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
    }
    cut() {
        this.remove();
        this.parent = null;
        return this;
    }
    forEach(fn, _i = 0) {
        fn(this, _i);
        if (this.children) {
            this.children.forEach((child, i) => child.forEach(fn, i));
        }
        return this;
    }
    reCalculateSize() {
        this.aggregate((cur, i, agg) => {
            [cur._size, cur._leafCount] = isNull(agg) || agg.length === 0 ?
                [cur._size, cur._leafCount] :
                agg.reduce((acc, cur) => {
                    return [acc[0] + cur[0], acc[1] + cur[1]];
                }, [cur.weight, cur.children === null || cur.children.count === 0 ? 1 : 0]);
            cur.isDirty = false;
            return [cur._size, cur._leafCount];
        }, (cur, i) => !cur.isDirty);
        return this;
    }
    aggregate(fn, prune, i = 0) {
        let isPruned = isNotNullOrUndefined(prune) && prune(this, i);
        return fn(this, i, isPruned || this.children === null ?
            null :
            this.children.map(function (el, i) {
                return el.aggregate(fn, prune, i);
            }).values, isPruned);
    }
    reduce(fn, start) {
        const stack = new Stack();
        let acc = (start || []);
        if (!fn) {
            fn = (acc, cur) => (acc.push({ id: cur.id, parent: cur.parent ? cur.parent.id : null, data: cur.data }), acc);
        }
        let cur;
        let i;
        stack.push(this);
        while (cur = stack.pop()) {
            acc = fn(acc, cur);
            i = (cur.children && cur.children.count) || 0;
            while (i--) {
                stack.push(cur.children.get(i));
            }
        }
        return acc;
    }
    clone() {
        const result = this.create();
        result.id = this.id;
        result.children = this.children === null ? null : this.children.clone();
        if (result.children !== null) {
            result.children.forEach((node) => node.parent = result);
        }
        result.data = this.data === null || this.data === undefined ? this.data : clone(this.data);
        return result;
    }
    duplicateNode() {
        const result = this.create();
        result.id = this.id;
        result.data = this.data;
        return result;
    }
    filter(condition, parent = null) {
        let node = null;
        if (condition(this)) {
            node = this.duplicateNode();
            const children = this.children;
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
    }
    select(condition, acc = new List()) {
        const result = acc;
        const children = this.children;
        if (condition === undefined || condition(this)) {
            result.add(this);
        }
        if (children) {
            children.reduce(function (acc, cur) {
                return cur.select(condition, acc);
            }, result);
        }
        return result;
    }
    _findBySize(pos) {
        let result;
        if (pos < 0 || pos >= this.size) {
            result = null;
        }
        else if (this.children === null || this.children.count === 0 || pos < this.weight) {
            result = this;
        }
        else {
            let size = this.weight;
            let cur = 0;
            this.children.until((el, i) => size + el.size > pos, (el, i) => {
                ++cur;
                size += el.size;
            });
            result = this.children.get(cur)._findBySize(pos - size);
        }
        return result;
    }
    find(condition) {
        let result = null;
        if (isNumber(condition)) {
            result = this._findBySize(condition);
        }
        else {
            const children = this.children;
            if (children !== null) {
                let i = -1;
                const len = this.children.count;
                const val = this.children.values;
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
    }
    getLeaf(pos) {
        let result;
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
            let leaves = 0;
            let cur = 0;
            this.children.until((el, i) => leaves + el.leafCount > pos, (el, i) => {
                ++cur;
                leaves += el.leafCount;
            });
            result = this.children.get(cur).getLeaf(pos - leaves);
        }
        return result;
    }
    depth() {
        let result = 0;
        let node = this;
        while (node.parent) {
            node = node.parent;
            ++result;
        }
        return result;
    }
    sort(comparer) {
        if (this.children !== null) {
            this.children.orderBy(comparer);
            this.children.forEach((el) => el.sort(comparer));
        }
        return this;
    }
    toJSON() {
        let result = new List();
        this.forEach((node) => {
            result.push({
                id: node.id,
                data: node.data,
                parent: node.parent === null ? null : node.parent.id,
                children: node.children === null ? null : node.children.map((el) => el.id)
            });
        });
        return result.toJSON();
    }
    serialize() {
        let result = new List();
        result.push({
            id: this.id,
            data: this.data,
            parent: this.parent === null ? null : this.parent.id,
            children: this.children === null ? null : this.children.map((el) => el.id)
        });
        if (this.children !== null) {
            this.children.forEach((node) => result.append(node.serialize()));
        }
        return result.serialize();
    }
}
//# sourceMappingURL=Tree.js.map