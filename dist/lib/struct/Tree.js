import { map } from "../Arr";
import { clone, setProperties } from "../Obj";
import { isArray } from "../Test";
import { newUUID } from "../Util";
import { List } from "./List";
import { Stack } from "./Stack";
export class Tree {
    constructor() {
        this.id = null;
        this.parent = null;
        this.children = null;
        this.data = null;
        this.id = this.newId();
    }
    static fromObject(obj) {
        const parent = (this instanceof Tree) ? this : null;
        const root = new Tree().init({ data: obj.data !== undefined ? obj.data : null, parent });
        if (obj.children !== undefined && isArray(obj.children)) {
            root.children = new List(map(obj.children, Tree.fromObject.bind(root)));
        }
        return root;
    }
    init(obj) {
        setProperties(this, obj);
        return this;
    }
    newId() {
        return newUUID();
    }
    insertAt(pos, data) {
        if (this.children === null || this.children.count <= pos) {
            this.add(data);
        }
        else {
            this.children.insertAt(pos, new Tree().init({ data, parent: this }));
        }
    }
    add(data) {
        if (this.children === null) {
            this.children = new List();
        }
        this.children.add((new Tree()).init({ data, parent: this }));
    }
    remove() {
        if (this.parent !== null) {
            this.parent.children.remove(this);
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
        return this;
    }
    reduce(fn, start) {
        const stack = new Stack();
        let acc = start;
        if (start === undefined) {
            acc = 0;
        }
        let cur;
        let i;
        stack.push(this);
        while (cur = stack.pop()) {
            acc = fn(acc, cur.data);
            i = (cur.children && cur.children.count) || 0;
            while (i--) {
                stack.push(cur.children.get(i));
            }
        }
        return acc;
    }
    clone() {
        const result = new this.constructor();
        result.id = this.id;
        result.parent = this.parent;
        result.children = this.children === null ? null : this.children.clone();
        result.data = this.data === null || this.data === undefined ? this.data : clone(this.data);
        return result;
    }
    duplicateNode() {
        const result = new this.constructor();
        result.id = this.id;
        result.parent = this.parent;
        result.children = this.children;
        result.data = this.data;
        return result;
    }
    filter(condition) {
        const root = this.duplicateNode();
        const children = this.children;
        if (children !== null) {
            root.children =
                root.children
                    .select(condition)
                    .map(function (el, i) {
                    return el.filter(condition);
                });
        }
        return root;
    }
    select(condition, acc = new List()) {
        const result = acc;
        const children = this.children;
        if (condition === undefined || condition(this)) {
            result.add(this);
        }
        else {
            children.reduce(function (acc, cur) {
                return cur.select(condition, acc);
            }, result);
        }
        return result;
    }
    find(condition) {
        let result = null;
        const children = this.children;
        if (children !== null) {
            let i = -1;
            const len = this.children.count;
            const val = this.children.values;
            while (++i < len) {
                if (condition(val[i].data)) {
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
        return result;
    }
    contains(condition) {
        return this.find(condition) !== null;
    }
}
//# sourceMappingURL=Tree.js.map