import { Global } from "./Global";
export var Sides;
(function (Sides) {
    Sides[Sides["Top"] = 0] = "Top";
    Sides[Sides["Bottom"] = 1] = "Bottom";
    Sides[Sides["Left"] = 2] = "Left";
    Sides[Sides["Right"] = 3] = "Right";
})(Sides || (Sides = {}));
var _Dom = (function () {
    function _Dom() {
        this.Sides = Sides;
        if (Global.window !== null) {
            this._window = Global.window;
            this._document = this._window.document;
            this._el = this._document.createElement("div");
        }
    }
    _Dom.prototype.init = function (win) {
        Global.window = win;
        this._window = Global.window;
        this._document = this._window.document;
        this._el = this._document.createElement("div");
    };
    _Dom.prototype.toArray = function (a) {
        return Array.prototype.slice.call(a);
    };
    _Dom.prototype.create = function (html, attr) {
        var result, keys, i, k, styles, styleKeys;
        this._el.innerHTML = html;
        result = this._el.children[0];
        this.setAttr(result, attr);
        this.clear(this._el);
        return result;
    };
    _Dom.prototype.outerHTML = function (el) {
        this._el.appendChild(el);
        var result = this._el.innerHTML;
        this.clear(this._el);
        return result;
    };
    _Dom.prototype.setAttr = function (_el, attr) {
        var el;
        if (typeof (_el) === "string") {
            el = this.get(_el);
        }
        else {
            el = _el;
        }
        var keys, i, k, styles, styleKeys, style;
        if (attr !== undefined && typeof (attr) === "object") {
            keys = Object.keys(attr);
            for (i = 0; i < keys.length; i++) {
                if (keys[i] === "style") {
                    styles = attr[keys[i]];
                    styleKeys = Object.keys(styles);
                    for (k = 0; k < styleKeys.length; k++) {
                        style = styles[styleKeys[k]];
                        if (typeof (style) === "string") {
                            el.style.setProperty(styleKeys[k], style);
                        }
                        else {
                            el.style.setProperty(styleKeys[k], style[0], style[1]);
                        }
                    }
                }
                else if (keys[i] === "classes" && attr[keys[i]] !== undefined && attr[keys[i]].join) {
                    el.setAttribute("className", attr[keys[i]].join(" "));
                }
                else {
                    el.setAttribute(keys[i], attr[keys[i]]);
                }
            }
        }
    };
    _Dom.prototype.remove = function (element) {
        return element.parentNode === undefined ? null : element.parentNode.removeChild(element);
    };
    _Dom.prototype.replace = function (src, target) {
        var result;
        if (src.parentNode) {
            src.parentNode.replaceChild(target, src);
        }
        return result;
    };
    _Dom.prototype.clear = function (element) {
        var i = element.children.length;
        while (i--) {
            element.removeChild(element.children[i]);
        }
    };
    _Dom.prototype.get = function (id) {
        var result = this._document.getElementById(id);
        if (result === null) {
            switch (id) {
                case "body":
                    result = this._document.body;
                    break;
            }
        }
        return result;
    };
    _Dom.prototype.find = function (selector) {
        return this._document.querySelector(selector);
    };
    _Dom.prototype.findAll = function (selector, root) {
        return this.toArray((root || this._document).querySelectorAll(selector));
    };
    _Dom.prototype.children = function (root, selector) {
        var children = this.toArray((root || this._document).children);
        return selector === undefined ? children : children.filter(this.is.bind(this, selector));
    };
    _Dom.prototype.position = function (el, x, y) {
        el.style.top = y + "px";
        el.style.left = x + "px";
    };
    _Dom.prototype.is = function (selector, element) {
        var result = false;
        if (element.matches) {
            result = element.matches(selector);
        }
        else if (element.msMatchesSelector) {
            result = element.msMatchesSelector(selector);
        }
        else if (element.webkitMatchesSelector) {
            result = element.webkitMatchesSelector(selector);
        }
        else {
            if (element.id !== "") {
                result = element.parentElement.querySelector("#" + element.id) !== null;
            }
            else {
                result = this.toArray(element.parentElement.querySelectorAll(selector)).indexOf(element) !== -1;
            }
        }
        return result;
    };
    _Dom.prototype.setStylesExplicitly = function (element) {
        var styles = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            styles[_i - 1] = arguments[_i];
        }
        var comp = this._window.getComputedStyle(element);
        for (var _a = 0, styles_1 = styles; _a < styles_1.length; _a++) {
            var style = styles_1[_a];
            element.style[style] = comp[style];
        }
    };
    return _Dom;
}());
export { _Dom };
export var Dom = new _Dom();
//# sourceMappingURL=Dom.js.map