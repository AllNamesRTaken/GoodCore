import { Global } from "./Global";
import { isNullOrUndefined } from "./Test";

export enum Sides {
	Top,
	Bottom,
	Left,
	Right
}
class DomState {
	public static Sides = Sides;
	public static _window: Window = Global.window!;
	public static _document: Document | undefined = Global.window ? Global.window.document : undefined;
	public static _el: Element | undefined = Global.window ? Global.window.document.createElement("div") : undefined;
	public static _parser: DOMParser | undefined = Global.window ? new DOMParser() : undefined;
	public static _template: HTMLTemplateElement | undefined = Global.window ? Global.window.document.createElement("template") : undefined;
	public static _fragment: DocumentFragment | undefined = Global.window ? Global.window.document.createDocumentFragment() : undefined;
}

export function init(win: Window) {
	Global.window = win;
	DomState._window = Global.window;
	DomState._document = DomState._window.document;
	DomState._el = DomState._document.createElement("div");
}
export function create(html: string, attr?: Indexable<any>): HTMLElement {
	// tslint:disable-next-line:prefer-const
	let result: HTMLElement, keys: string[], i: number, k: number, styles: any, styleKeys: string[];
	let usesTemplate = DomState._template && DomState._template!.content && true;
	let usesParser = DomState._parser && true;
	html = html.trim();
	if (/^[a-zA-Z]+$/.test(html)) {
		result = Global.window!.document.createElement(html);
	} else {
		if (usesTemplate) {
			let template = DomState._template!;
			template.innerHTML = html;
			result = template.content.firstChild as HTMLElement;
			clear(template.content);
		} else if (usesParser) {
			let parser = DomState._parser!;
			let doc = parser.parseFromString(html, "text/html"),
			fragment = DomState._fragment!;
			fragment.appendChild( doc.documentElement as Node);
			result = fragment.firstChild as HTMLElement;
			clear(fragment);
		} else {
			DomState._el!.innerHTML = html;
			result = DomState._el!.firstChild as HTMLElement;
			clear(DomState._el!);
		}
	}
	setAttr(result, attr);
	//unsafe cast
	return result;
}
export function outerHTML(el: HTMLElement): string {
	DomState._el!.appendChild(el);
	const result = DomState._el!.innerHTML;
	clear(DomState._el!);
	return result;
}
export function setAttr(_el: HTMLElement | Node | String, attr?: Indexable<any>) {
	let el: HTMLElement | null;
	if (typeof (_el) === "string") {
		el = get(_el);
	} else {
		el = _el as HTMLElement;
	}
	let keys: string[], 
		i: number, 
		k: number, 
		styles: Indexable<Indexable<string | null>>, 
		styleKeys: string[], 
		style: Indexable<string | null>;
	if (el !== null && attr !== undefined && typeof (attr) === "object") {
		keys = Object.keys(attr);
		for (i = 0; i < keys.length; i++) {
			if (keys[i] === "style") {
				styles = attr[keys[i]] as Indexable<Indexable<string | null>>;
				styleKeys = Object.keys(styles);
				for (k = 0; k < styleKeys.length; k++) {
					style = styles[styleKeys[k]];
					if (typeof (style) === "string") {
						el.style.setProperty(styleKeys[k], style);
					} else {
						el.style.setProperty(styleKeys[k], style[0], style[1]);
					}
				}
			} else if ((keys[i] === "classes" || keys[i] === "class" || keys[i] === "className") && attr[keys[i]] !== undefined) {
				if (attr[keys[i]].join) {
					el.className = attr[keys[i]].join(" ");
				} else {
					el.className = attr[keys[i]];
				}
			} else {
				el.setAttribute(keys[i], attr[keys[i]]);
			}
		}
	}
}
export function remove(element: Element | Node): Element | Node | null {
	return isNullOrUndefined(element.parentNode) ? null : element.parentNode!.removeChild(element) as Element | Node;
}
export function replace(src: HTMLElement, target: HTMLElement): HTMLElement {
	let result: HTMLElement = target;
	if (src.parentNode) {
		src.parentNode.replaceChild(target, src) as HTMLElement;
	}
	return result;
}
export function clear(element: Element | Node) {
	let i = element.childNodes.length;
	while (i--) {
		element.removeChild(element.childNodes[i]);
	}
}
export function get(id: string): HTMLElement | null {
	let result = DomState._document!.getElementById(id) as HTMLElement;
	if (result === null) {
		switch (id) {
			case "body":
				result = DomState._document!.body;
				break;
			default:
				break;
		}
	}
	return result;
}
export function find(selector: string, root?: Element): Element | null {
	return (root || DomState._document)!.querySelector(selector) as Element | null;
}
function toArray<T>(arr: ArrayLike<T>): T[] {
	return Array.prototype.slice.call(arr);
}
export function findAll(selector: string, root?: HTMLElement): Element[] {
	return toArray((root || DomState._document!).querySelectorAll(selector));
}
export function children(root: Element, selector?: string): Element[] {
	const children = toArray((root || DomState._document).children);
	return selector === undefined ? children : children.filter((el) => is(selector, el));
}
export function findParent(root: Element, selector: string): HTMLElement | null {
	let result = root.parentElement;
	while (result) {
		if (is(selector, result)) {
			break;
		}
		result = result.parentElement;
	}
	return result;
}
export function position(el: HTMLElement, x: number, y: number): void {
	el.style.top = `${y}px`;
	el.style.left = `${x}px`;
}
export function is(selector: string, element: Element): boolean {
	let result = false;
	if (element.matches) {
		result = element.matches(selector);
	} else if ((element as any).msMatchesSelector) {
		result = ((element as any).msMatchesSelector)(selector);
	} else if (element.webkitMatchesSelector) {
		result = element.webkitMatchesSelector(selector);
	} else {
		if (element.parentElement === null) {
			throw new Error("Element has no parent");
		}
		if (element.id !== "") {
			result = element.parentElement!.querySelector("#" + element.id) !== null;
		} else {
			result = toArray(element.parentElement!.querySelectorAll(selector)).indexOf(element) !== -1;
		}
	}
	return result;
}
export function setStylesExplicitly(element: HTMLElement, ...styles: string[]) {
	const comp = DomState._window.getComputedStyle(element);
	for (const style of styles) {
		(element.style as any)[style] = (comp as any)[style];
	}
}
