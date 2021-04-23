import { Global } from "./Global";
import { isNullOrUndefined, isString, isElement } from "./Test";
import { assert } from "./Util";
import { reverse, reduce } from "./Arr";

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
export function create<T extends HTMLElement>(html: string, attr?: Indexable<any>): T {
	let result: T;
	result = fromHTML<T>(html)[0];
	setAttr(result!, attr);
	return result;
}
export function fromHTML<T extends HTMLElement>(html: string): T[] {
	let result: T[];
	let usesTemplate = !!(DomState._template && DomState._template!.content);
	let usesParser = !!(DomState._parser);
	html = html.trim();
	if (/^[a-zA-Z]+$/.test(html)) {
		result = [Global.window!.document.createElement(html) as T];
	} else {
		if (usesTemplate) {
			let template = DomState._template!;
			template.innerHTML = html;
			assert(!!template.content.firstChild, "Dom.create was unable to parse html");
			result = toArray(template.content.children!) as T[];
			clear(template.content);
		} else if (usesParser) {
			let parser = DomState._parser!;
			let doc = parser.parseFromString(html, "text/html");
			assert(!!doc.body.firstChild, "Dom.create was unable to parse html");
			result = toArray(doc.body.children!) as T[];
		} else {
			DomState._el!.innerHTML = html;
			assert(!!DomState._el!.firstChild, "Dom.create was unable to parse html");			
			result = toArray(DomState._el!.children!) as T[];
			clear(DomState._el!);
		}
	}
	return result;
}
export function resolve(target: HTMLElement | string, root?: HTMLElement): HTMLElement | null {
	let result = 
		isString(target)?
			(root && root !== (DomState._document as any) && is(target as string, root!) ?
				root :
				find(target as string, root)) :
			target as HTMLElement;
	return result;
}
export function resolveAll(target: HTMLElement | HTMLElement[] | string, root?: HTMLElement): HTMLElement[] {
	let result = 
		isString(target) ?
			(root && root !== (DomState._document as any) && is(target as string, root!) ?
				[root].concat(findAll(target as string, root)) :
				findAll(target as string, root)) :
			(isElement(target) ?
				[target as HTMLElement] :
				target as HTMLElement[]);
	return result;
}
export function contains(target: HTMLElement | HTMLElement[] | string, root?: Node, includeRoot: boolean = false): boolean {
	const rootNode = root || DomState._document!;
	let targets = resolveAll(target, root as HTMLElement);
	const result = reduce(targets, (acc, cur: Node | null) => {
		if (acc && cur) {
			if (!includeRoot) {
				cur = cur.parentNode;
			}
			while (cur !== rootNode && cur !== null) {
				cur = cur.parentNode!;
			}
		}
		return acc && cur === rootNode;
	}, true);
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
		el = byId(_el);
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
						el.style.setProperty(styleKeys[k], style[0], style[1] ?? undefined);
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
// tslint:disable-next-line:no-reserved-keywords
export function get<T extends HTMLElement>(id: string): T | null {
	return byId<T>(id); 
}
export function byId<T extends HTMLElement>(id: string): T | null {
	let result = DomState._document!.getElementById(id);
	if (result === null) {
		switch (id) {
			case "body":
				result = DomState._document!.body;
				break;
			default:
				break;
		}
	}
	return result as T;
}
export function find<T extends HTMLElement>(selector: string, root?: Element): T | null {
	return (root || DomState._document)!.querySelector(selector);
}
function toArray<T>(arr: ArrayLike<T>): T[] {
	return Array.prototype.slice.call(arr);
}
export function findAll<T extends HTMLElement>(selector: string, root?: HTMLElement): T[] {
	return toArray((root || DomState._document!).querySelectorAll(selector));
}
export function children(root: Element, selector?: string): Element[] {
	const children = toArray((root || DomState._document).children);
	return selector === undefined ? children : children.filter((el) => is(selector, el));
}
export function findParent<T extends HTMLElement>(start: Element, parent: string | Element): T | null {
	let result = start.parentElement;
	while (result) {
		if (is(parent, result)) {
			break;
		}
		result = result.parentElement;
	}
	return result as T;
}
export function position(el: HTMLElement, x: number, y: number): void {
	el.style.top = `${y}px`;
	el.style.left = `${x}px`;
}
export function getOffset(el: HTMLElement): {left: number, top: number, right: number, bottom: number} {
	const rect = el.getBoundingClientRect();
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { 
		left: (rect.left + scrollLeft) | 0,
		top: (rect.top + scrollTop) | 0, 
		right: (rect.right + scrollTop) | 0,
		bottom: (rect.bottom + scrollLeft) | 0,
	};
}
export function is(selector: string | Element, element: Element): boolean {
	let result = false;
	if (selector instanceof Element) {
		result = selector === element;
	} else if (element.matches) {
		result = element.matches(selector);
	} else if ((element as any).msMatchesSelector) {
		result = ((element as any).msMatchesSelector)(selector);
	} else if (element.webkitMatchesSelector) {
		result = element.webkitMatchesSelector(selector);
	} else {
		assert(!(isElement(selector) || isString(element)), "Did you mix up the arguments for Dom::is() ?");
		throw new Error("Browser does not support matches");
	}
	return result;
}
export function setStylesExplicitly(element: HTMLElement, ...styles: string[]) {
	const comp = DomState._window.getComputedStyle(element);
	for (let i = 0; i < styles.length; i++) {
		let style = styles[i];
		(element.style as any)[style] = (comp as any)[style];
	}
}
export function findParents(element: HTMLElement): HTMLElement[] {
	let result = [];
	while(element.parentElement) {
		element = element.parentElement;
		result.push(element);
	}
	return result;
}
export function findClosestCommonParent(elements: HTMLElement[], startAtIndex: number = 0): HTMLElement {
	let result = document.body;
	if (elements.length === 1) {
		result = elements[0];
	} else if (elements.length > 1) {
		let parents = elements.map((el) => {
			let parents = findParents(el);
			assert(parents.length >= startAtIndex, "startAtIndex higher than element parent depth");
			if (startAtIndex > 0) {
				while (parents.length > 0  && startAtIndex > 0) {
					parents.pop();
					--startAtIndex;
				}
			}
			let result = reverse(parents);
			result.push(el);
			return result;
		});
		let minDepth = parents.reduce((p, c, i) => Math.min(p, c.length), Infinity);
		if (minDepth > 0) {
			let firstList = parents.shift()!;
			let found = false;
			let i = 0;
			while(!found && i < minDepth) {
				found = !parents.reduce((p, c) => p === true && c[i] === firstList[i], true);
				++i;
			}
			result = !found ? firstList[i - 1] : firstList[i - 2];
		}
	}
	return result;
}
