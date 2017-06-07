import { Global } from "./Global";
export var Sides;
(function (Sides) {
    Sides[Sides["Top"] = 0] = "Top";
    Sides[Sides["Bottom"] = 1] = "Bottom";
    Sides[Sides["Left"] = 2] = "Left";
    Sides[Sides["Right"] = 3] = "Right";
})(Sides || (Sides = {}));
class DomState {
}
DomState.Sides = Sides;
export class Dom {
    constructor() {
        if (Global.window !== null) {
            DomState._window = Global.window;
            DomState._document = DomState._window.document;
            DomState._el = DomState._document.createElement("div");
        }
    }
    static init(win) {
        Global.window = win;
        DomState._window = Global.window;
        DomState._document = DomState._window.document;
        DomState._el = DomState._document.createElement("div");
    }
    static toArray(a) {
        return Array.prototype.slice.call(a);
    }
    static create(html, attr) {
        let result, keys, i, k, styles, styleKeys;
        DomState._el.innerHTML = html;
        result = DomState._el.children[0];
        this.setAttr(result, attr);
        this.clear(DomState._el);
        return result;
    }
    static outerHTML(el) {
        DomState._el.appendChild(el);
        const result = DomState._el.innerHTML;
        this.clear(DomState._el);
        return result;
    }
    static setAttr(_el, attr) {
        let el;
        if (typeof (_el) === "string") {
            el = this.get(_el);
        }
        else {
            el = _el;
        }
        let keys, i, k, styles, styleKeys, style;
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
    }
    static remove(element) {
        return element.parentNode === undefined ? null : element.parentNode.removeChild(element);
    }
    static replace(src, target) {
        let result;
        if (src.parentNode) {
            src.parentNode.replaceChild(target, src);
        }
        return result;
    }
    static clear(element) {
        let i = element.children.length;
        while (i--) {
            element.removeChild(element.children[i]);
        }
    }
    static get(id) {
        let result = DomState._document.getElementById(id);
        if (result === null) {
            switch (id) {
                case "body":
                    result = DomState._document.body;
                    break;
            }
        }
        return result;
    }
    static find(selector) {
        return DomState._document.querySelector(selector);
    }
    static findAll(selector, root) {
        return this.toArray((root || DomState._document).querySelectorAll(selector));
    }
    static children(root, selector) {
        const children = this.toArray((root || DomState._document).children);
        return selector === undefined ? children : children.filter(this.is.bind(this, selector));
    }
    static position(el, x, y) {
        el.style.top = y + "px";
        el.style.left = x + "px";
    }
    static is(selector, element) {
        let result = false;
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
    }
    static setStylesExplicitly(element, ...styles) {
        const comp = DomState._window.getComputedStyle(element);
        for (const style of styles) {
            element.style[style] = comp[style];
        }
    }
}
//# sourceMappingURL=Dom.js.map