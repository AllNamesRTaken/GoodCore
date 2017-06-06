var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Arr } from "../Arr";
import { Obj } from "../Obj";
import { Initable } from "../standard/mixins/Initable";
import { Test } from "../Test";
import { Util } from "../Util";
import { List } from "./List";
import { Stack } from "./Stack";
var BaseTree = (function () {
    function BaseTree() {
        this.Id = null;
        this.Parent = null;
        this.Children = null;
        this.Data = null;
    }
    return BaseTree;
}());
export { BaseTree };
export var _InitableTree = Initable(BaseTree);
var Tree = (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super.call(this) || this;
        _this.Id = _this.newId();
        return _this;
    }
    Tree.fromObject = function (obj) {
        var parent = (this instanceof Tree) ? this : null;
        var root = new Tree().init({ Data: obj.data !== undefined ? obj.data : null, Parent: parent });
        if (obj.children !== undefined && Test.isArray(obj.children)) {
            root.Children = new List(Arr.map(obj.children, Tree.fromObject.bind(root)));
        }
        return root;
    };
    Tree.prototype.newId = function () {
        return Util.newUUID();
    };
    Tree.prototype.insertAt = function (pos, data) {
        if (this.Children === null || this.Children.count <= pos) {
            this.add(data);
        }
        else {
            this.Children.insertAt(pos, new Tree().init({ Data: data, Parent: this }));
        }
    };
    Tree.prototype.add = function (data) {
        if (this.Children === null) {
            this.Children = new List();
        }
        this.Children.add((new Tree()).init({ Data: data, Parent: this }));
    };
    Tree.prototype.remove = function () {
        if (this.Parent !== null) {
            this.Parent.Children.remove(this);
        }
    };
    Tree.prototype.prune = function () {
        if (this.Children !== null) {
            this.Children
                .forEach(function (el, i) {
                el.Parent = null;
            })
                .clear();
        }
        this.Children = null;
        return this;
    };
    Tree.prototype.reduce = function (fn, start) {
        var stack = new Stack();
        var acc = start;
        if (start === undefined) {
            acc = 0;
        }
        var cur;
        var i;
        stack.push(this);
        while (cur = stack.pop()) {
            acc = fn(acc, cur.Data);
            i = (cur.Children && cur.Children.count) || 0;
            while (i--) {
                stack.push(cur.Children.get(i));
            }
        }
        return acc;
    };
    Tree.prototype.clone = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children === null ? null : this.Children.clone();
        result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj.clone(this.Data);
        return result;
    };
    Tree.prototype.duplicateNode = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children;
        result.Data = this.Data;
        return result;
    };
    Tree.prototype.filter = function (condition) {
        var root = this.duplicateNode();
        var children = this.Children;
        if (children !== null) {
            root.Children =
                root.Children
                    .select(condition)
                    .map(function (el, i) {
                    return el.filter(condition);
                });
        }
        return root;
    };
    Tree.prototype.select = function (condition, acc) {
        if (acc === void 0) { acc = new List(); }
        var result = acc;
        var children = this.Children;
        if (condition === undefined || condition(this)) {
            result.add(this);
        }
        else {
            children.reduce(function (acc, cur) {
                return cur.select(condition, acc);
            }, result);
        }
        return result;
    };
    Tree.prototype.find = function (condition) {
        var result = null;
        var children = this.Children;
        if (children !== null) {
            var i = -1;
            var len = this.Children.count;
            var val = this.Children.values;
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
    };
    Tree.prototype.contains = function (condition) {
        return this.find(condition) !== null;
    };
    return Tree;
}(_InitableTree));
export { Tree };
//# sourceMappingURL=Tree.js.map