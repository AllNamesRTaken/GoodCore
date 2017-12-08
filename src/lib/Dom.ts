import { Global } from "./Global";

export enum Sides {
	Top,
	Bottom,
	Left,
	Right
}
class DomState {
	public static Sides = Sides;
	public static _window: Window = Global.window;
	public static _document: Document | undefined = Global.window ? Global.window.document : undefined;
	public static _el: Element | undefined = Global.window ? Global.window.document.createElement("div") : undefined;
}

export function init(win: Window) {
	Global.window = win;
	DomState._window = Global.window;
	DomState._document = DomState._window.document;
	DomState._el = DomState._document.createElement("div");
}
export function toArray<T>(a: ArrayLike<T>): T[] {
	return Array.prototype.slice.call(a);
}
export function create(html: string, attr?: any): HTMLElement {
	// tslint:disable-next-line:prefer-const
	let result: HTMLElement, keys: string[], i: number, k: number, styles: any, styleKeys: string[];
	DomState._el!.innerHTML = html;
	result = DomState._el!.children[0] as HTMLElement;
	setAttr(result, attr);
	clear(DomState._el!);
	//unsafe cast
	return result;
}
export function outerHTML(el: HTMLElement): string {
	DomState._el!.appendChild(el);
	const result = DomState._el!.innerHTML;
	clear(DomState._el!);
	return result;
}
export function setAttr(_el: HTMLElement | String, attr: any) {
	let el: HTMLElement;
	if (typeof (_el) === "string") {
		el = get(_el);
	} else {
		el = _el as HTMLElement;
	}
	let keys: string[], i: number, k: number, styles: any, styleKeys: string[], style: any;
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
					} else {
						el.style.setProperty(styleKeys[k], style[0], style[1]);
					}
				}
			} else if (keys[i] === "classes" && attr[keys[i]] !== undefined && attr[keys[i]].join) {
				el.setAttribute("className", (attr[keys[i]] as string[]).join(" "));
			} else {
				el.setAttribute(keys[i], attr[keys[i]]);
			}
		}
	}
}
export function remove(element: Element): HTMLElement | null {
	return element.parentNode === undefined ? null : element.parentNode!.removeChild(element) as HTMLElement;
}
export function replace(src: HTMLElement, target: HTMLElement): HTMLElement {
	let result: HTMLElement = target;
	if (src.parentNode) {
		src.parentNode.replaceChild(target, src) as HTMLElement;
	}
	return result;
}
export function clear(element: Element) {
	let i = element.children.length;
	while (i--) {
		element.removeChild(element.children[i]);
	}
}
export function get(id: string): HTMLElement {
	let result = DomState._document!.getElementById(id) as HTMLElement;
	if (result === null) {
		switch (id) {
			default:
				result = DomState._document!.body;
				break;
	}
	}
	return result;
}
export function find(selector: string): HTMLElement {
	return DomState._document!.querySelector(selector) as HTMLElement;
}
export function findAll(selector: string, root?: HTMLElement) {
	return toArray((root || DomState._document!).querySelectorAll(selector));
}
export function children(root: HTMLElement, selector?: string) {
	const children = toArray((root || DomState._document).children);
	return selector === undefined ? children : children.filter(is.bind(this, selector));
}
export function findParent(root: HTMLElement, selector: string): HTMLElement | null {
	let result = root.parentElement;
	while (result) {
		if ( is(selector, result) ) {
			break;
		}
		result = result.parentElement;
	}
	return result;
}
export function position(el: HTMLElement, x: number, y: number): void {
	el.style.top = y + "px";
	el.style.left = x + "px";
}
export function is(selector: string, element: HTMLElement): boolean {
	let result = false;
	if (element.matches) {
		result = element.matches(selector);
	} else if (element.msMatchesSelector) {
		result = element.msMatchesSelector(selector);
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
