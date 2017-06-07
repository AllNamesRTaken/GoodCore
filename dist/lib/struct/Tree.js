import { Arr } from "../Arr";
import { Obj } from "../Obj";
import { Test } from "../Test";
import { Util } from "../Util";
import { List } from "./List";
import { Stack } from "./Stack";
export class Tree {
    constructor() {
        this.Id = null;
        this.Parent = null;
        this.Children = null;
        this.Data = null;
        this.Id = this.newId();
    }
    static fromObject(obj) {
        const parent = (this instanceof Tree) ? this : null;
        const root = new Tree().init({ Data: obj.data !== undefined ? obj.data : null, Parent: parent });
        if (obj.children !== undefined && Test.isArray(obj.children)) {
            root.Children = new List(Arr.map(obj.children, Tree.fromObject.bind(root)));
        }
        return root;
    }
    init(obj) {
        Obj.setProperties(this, obj);
        return this;
    }
    newId() {
        return Util.newUUID();
    }
    insertAt(pos, data) {
        if (this.Children === null || this.Children.count <= pos) {
            this.add(data);
        }
        else {
            this.Children.insertAt(pos, new Tree().init({ Data: data, Parent: this }));
        }
    }
    add(data) {
        if (this.Children === null) {
            this.Children = new List();
        }
        this.Children.add((new Tree()).init({ Data: data, Parent: this }));
    }
    remove() {
        if (this.Parent !== null) {
            this.Parent.Children.remove(this);
        }
    }
    prune() {
        if (this.Children !== null) {
            this.Children
                .forEach(function (el, i) {
                el.Parent = null;
            })
                .clear();
        }
        this.Children = null;
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
            acc = fn(acc, cur.Data);
            i = (cur.Children && cur.Children.count) || 0;
            while (i--) {
                stack.push(cur.Children.get(i));
            }
        }
        return acc;
    }
    clone() {
        const result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children === null ? null : this.Children.clone();
        result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj.clone(this.Data);
        return result;
    }
    duplicateNode() {
        const result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children;
        result.Data = this.Data;
        return result;
    }
    filter(condition) {
        const root = this.duplicateNode();
        const children = this.Children;
        if (children !== null) {
            root.Children =
                root.Children
                    .select(condition)
                    .map(function (el, i) {
                    return el.filter(condition);
                });
        }
        return root;
    }
    select(condition, acc = new List()) {
        const result = acc;
        const children = this.Children;
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
        const children = this.Children;
        if (children !== null) {
            let i = -1;
            const len = this.Children.count;
            const val = this.Children.values;
            while (++i < len) {
                if (condition(val[i].Data)) {
                    result = val[i];
                    break;
                }
                else {
                    result = val[i].Children !== null ? val[i].find(condition) : null;
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