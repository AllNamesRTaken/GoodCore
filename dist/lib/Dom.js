export var Sides;
(function (Sides) {
    Sides[Sides["Top"] = 0] = "Top";
    Sides[Sides["Bottom"] = 1] = "Bottom";
    Sides[Sides["Left"] = 2] = "Left";
    Sides[Sides["Right"] = 3] = "Right";
})(Sides || (Sides = {}));
var _Dom = (function () {
    function _Dom(win) {
        this.Sides = Sides;
        this.Init(win);
    }
    _Dom.prototype._ = function (win) {
        return new _Dom(win);
    };
    _Dom.prototype.Init = function (win) {
        if (win !== undefined) {
            this._window = win;
            this._document = this._window.document;
            this._el = this._document.createElement("div");
        }
    };
    _Dom.prototype.ToArray = function (a) {
        return Array.prototype.slice.call(a);
    };
    _Dom.prototype.Create = function (html, attr) {
        var result, keys, i, k, styles, styleKeys;
        this._el.innerHTML = html;
        result = this._el.children[0];
        this.SetAttr(result, attr);
        this.Clear(this._el);
        return result;
    };
    _Dom.prototype.OuterHTML = function (el) {
        this._el.appendChild(el);
        var result = this._el.innerHTML;
        this.Clear(this._el);
        return result;
    };
    _Dom.prototype.SetAttr = function (_el, attr) {
        var el;
        if (typeof (_el) === "string") {
            el = this.Get(_el);
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
    _Dom.prototype.Remove = function (element) {
        return element.parentNode === undefined ? null : element.parentNode.removeChild(element);
    };
    _Dom.prototype.Replace = function (src, target) {
        var result;
        if (src.parentNode) {
            src.parentNode.replaceChild(target, src);
        }
        return result;
    };
    _Dom.prototype.Clear = function (element) {
        var i = element.children.length;
        while (i--) {
            element.removeChild(element.children[i]);
        }
    };
    _Dom.prototype.Get = function (id) {
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
    _Dom.prototype.Find = function (selector) {
        return this._document.querySelector(selector);
    };
    _Dom.prototype.FindAll = function (selector, root) {
        return this.ToArray((root || this._document).querySelectorAll(selector));
    };
    _Dom.prototype.Children = function (root, selector) {
        var children = this.ToArray((root || this._document).children);
        return selector === undefined ? children : children.filter(this.Is.bind(this, selector));
    };
    _Dom.prototype.Position = function (el, x, y) {
        el.style.top = y + "px";
        el.style.left = x + "px";
    };
    _Dom.prototype.Is = function (selector, element) {
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
                result = this.ToArray(element.parentElement.querySelectorAll(selector)).indexOf(element) !== -1;
            }
        }
        return result;
    };
    _Dom.prototype.SetStylesExplicitly = function (element) {
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
export var Dom = new _Dom(typeof (window) === "undefined" ? undefined : window);
//# sourceMappingURL=Dom.js.map