"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Arr_1 = require("../Arr");
var Obj_1 = require("../Obj");
var Initable_1 = require("../standard/mixins/Initable");
var Util_1 = require("../Util");
var List_1 = require("./List");
var Stack_1 = require("./Stack");
var BaseTree = (function () {
    function BaseTree() {
        this.Id = null;
        this.Parent = null;
        this.Children = null;
        this.Data = null;
    }
    return BaseTree;
}());
exports.BaseTree = BaseTree;
exports._InitableTree = Initable_1.Initable(BaseTree);
var Tree = (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super.call(this) || this;
        _this.Id = _this.NewId();
        return _this;
    }
    Tree.FromObject = function (obj) {
        var parent = (this instanceof Tree) ? this : null;
        var root = new Tree().Init({ Data: obj.data !== undefined ? obj.data : null, Parent: parent });
        if (obj.children !== undefined && Util_1.Util.IsArray(obj.children)) {
            root.Children = new List_1.List(Arr_1.Arr.Map(obj.children, Tree.FromObject.bind(root)));
        }
        return root;
    };
    Tree.prototype.NewId = function () {
        return Util_1.Util.NewUUID();
    };
    Tree.prototype.InsertAt = function (pos, data) {
        if (this.Children === null || this.Children.Count <= pos) {
            this.Add(data);
        }
        else {
            this.Children.InsertAt(pos, new Tree().Init({ Data: data, Parent: this }));
        }
    };
    Tree.prototype.Add = function (data) {
        if (this.Children === null) {
            this.Children = new List_1.List();
        }
        this.Children.Add((new Tree()).Init({ Data: data, Parent: this }));
    };
    Tree.prototype.Remove = function () {
        if (this.Parent !== null) {
            this.Parent.Children.Remove(this);
        }
    };
    Tree.prototype.Prune = function () {
        if (this.Children !== null) {
            this.Children
                .ForEach(function (el, i) {
                el.Parent = null;
            })
                .Clear();
        }
        this.Children = null;
        return this;
    };
    Tree.prototype.Reduce = function (fn, start) {
        var stack = new Stack_1.Stack();
        var acc = start;
        if (start === undefined) {
            acc = 0;
        }
        var cur;
        var i;
        stack.Push(this);
        while (cur = stack.Pop()) {
            acc = fn(acc, cur.Data);
            i = (cur.Children && cur.Children.Count) || 0;
            while (i--) {
                stack.Push(cur.Children.Get(i));
            }
        }
        return acc;
    };
    Tree.prototype.Clone = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children === null ? null : this.Children.Clone();
        result.Data = this.Data === null || this.Data === undefined ? this.Data : Obj_1.Obj.Clone(this.Data);
        return result;
    };
    Tree.prototype.DuplicateNode = function () {
        var result = new this.constructor();
        result.Id = this.Id;
        result.Parent = this.Parent;
        result.Children = this.Children;
        result.Data = this.Data;
        return result;
    };
    Tree.prototype.Filter = function (condition) {
        var root = this.DuplicateNode();
        var children = this.Children;
        if (children !== null) {
            root.Children =
                root.Children
                    .Select(condition)
                    .Map(function (el, i) {
                    return el.Filter(condition);
                });
        }
        return root;
    };
    Tree.prototype.Select = function (condition, acc) {
        if (acc === void 0) { acc = new List_1.List(); }
        var result = acc;
        var children = this.Children;
        if (condition === undefined || condition(this)) {
            result.Add(this);
        }
        else {
            children.Reduce(function (acc, cur) {
                return cur.Select(condition, acc);
            }, result);
        }
        return result;
    };
    Tree.prototype.Find = function (condition) {
        var result = null;
        var children = this.Children;
        if (children !== null) {
            var i = -1;
            var len = this.Children.Count;
            var val = this.Children.Values;
            while (++i < len) {
                if (condition(val[i].Data)) {
                    result = val[i];
                    break;
                }
                else {
                    result = val[i].Children !== null ? val[i].Find(condition) : null;
                    if (result !== null) {
                        break;
                    }
                }
            }
        }
        return result;
    };
    Tree.prototype.Contains = function (condition) {
        return this.Find(condition) !== null;
    };
    return Tree;
}(exports._InitableTree));
exports.Tree = Tree;
//# sourceMappingURL=Tree.js.map