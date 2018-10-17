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
DomState._window = Global.window;
DomState._document = Global.window ? Global.window.document : undefined;
DomState._el = Global.window ? Global.window.document.createElement("div") : undefined;
DomState._parser = Global.window ? new DOMParser() : undefined;
DomState._template = Global.window ? Global.window.document.createElement("template") : undefined;
DomState._fragment = Global.window ? Global.window.document.createDocumentFragment() : undefined;
export function init(win) {
    Global.window = win;
    DomState._window = Global.window;
    DomState._document = DomState._window.document;
    DomState._el = DomState._document.createElement("div");
}
export function create(html, attr) {
    let result, keys, i, k, styles, styleKeys;
    let usesTemplate = DomState._template && DomState._template.content && true;
    let usesParser = DomState._parser && true;
    if (/^[a-zA-Z]+$/.test(html)) {
        result = Global.window.document.createElement(html);
    }
    else {
        if (usesTemplate) {
            let template = DomState._template;
            template.innerHTML = html;
            result = template.content.firstChild;
            clear(template.content);
        }
        else if (usesParser) {
            let parser = DomState._parser;
            let doc = parser.parseFromString(html, "text/xml"), fragment = DomState._fragment;
            fragment.appendChild(doc.documentElement);
            result = fragment.firstChild;
            clear(fragment);
        }
        else {
            DomState._el.innerHTML = html;
            result = DomState._el.firstChild;
            clear(DomState._el);
        }
    }
    setAttr(result, attr);
    return result;
}
export function outerHTML(el) {
    DomState._el.appendChild(el);
    const result = DomState._el.innerHTML;
    clear(DomState._el);
    return result;
}
export function setAttr(_el, attr) {
    let el;
    if (typeof (_el) === "string") {
        el = get(_el);
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
            else if ((keys[i] === "classes" || keys[i] === "class") && attr[keys[i]] !== undefined) {
                if (attr[keys[i]].join) {
                    el.setAttribute("className", attr[keys[i]].join(" "));
                }
                else {
                    el.setAttribute("className", attr[keys[i]]);
                }
            }
            else {
                el.setAttribute(keys[i], attr[keys[i]]);
            }
        }
    }
}
export function remove(element) {
    return element.parentNode === undefined ? null : element.parentNode.removeChild(element);
}
export function replace(src, target) {
    let result = target;
    if (src.parentNode) {
        src.parentNode.replaceChild(target, src);
    }
    return result;
}
export function clear(element) {
    let i = element.childNodes.length;
    while (i--) {
        element.removeChild(element.childNodes[i]);
    }
}
export function get(id) {
    let result = DomState._document.getElementById(id);
    if (result === null) {
        switch (id) {
            default:
                result = DomState._document.body;
                break;
        }
    }
    return result;
}
export function find(selector) {
    return DomState._document.querySelector(selector);
}
function toArray(arr) {
    return Array.prototype.slice.call(arr);
}
export function findAll(selector, root) {
    return toArray((root || DomState._document).querySelectorAll(selector));
}
export function children(root, selector) {
    const children = toArray((root || DomState._document).children);
    return selector === undefined ? children : children.filter(is.bind(this, selector));
}
export function findParent(root, selector) {
    let result = root.parentElement;
    while (result) {
        if (is(selector, result)) {
            break;
        }
        result = result.parentElement;
    }
    return result;
}
export function position(el, x, y) {
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
}
export function is(selector, element) {
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
        if (element.parentElement === null) {
            throw new Error("Element has no parent");
        }
        if (element.id !== "") {
            result = element.parentElement.querySelector("#" + element.id) !== null;
        }
        else {
            result = toArray(element.parentElement.querySelectorAll(selector)).indexOf(element) !== -1;
        }
    }
    return result;
}
export function setStylesExplicitly(element, ...styles) {
    const comp = DomState._window.getComputedStyle(element);
    for (const style of styles) {
        element.style[style] = comp[style];
    }
}
//# sourceMappingURL=Dom.js.map