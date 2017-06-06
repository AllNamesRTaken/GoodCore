import { Global } from "./Global";

export enum Sides {
	Top,
	Bottom,
	Left,
	Right
}
export class _Dom {
	public Sides = Sides;

	private _window: Window;
	private _document: Document;
	private _el: Element;

	constructor() {
		if ( Global.window !== null) {
			this._window = Global.window;
			this._document = this._window.document;
			this._el = this._document.createElement("div");
		}
	}
	public init(win: Window) {
		Global.window = win;
		this._window = Global.window;
		this._document = this._window.document;
		this._el = this._document.createElement("div");
	}
	public toArray<T>(a: ArrayLike<T>): T[] {
		return Array.prototype.slice.call(a);
	}
	public create(html: string, attr?: any): HTMLElement {
		// tslint:disable-next-line:prefer-const
		let result: HTMLElement, keys: string[], i: number, k: number, styles: any, styleKeys: string[];
		this._el.innerHTML = html;
		result = this._el.children[0] as HTMLElement;
		this.setAttr(result, attr);
		this.clear(this._el);
		//unsafe cast
		return result;
	}
	public outerHTML(el: HTMLElement): string {
		this._el.appendChild(el);
		const result = this._el.innerHTML;
		this.clear(this._el);
		return result;
	}
	public setAttr(_el: HTMLElement | String, attr: any) {
		let el: HTMLElement;
		if (typeof (_el) === "string") {
			el = this.get(_el);
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
	public remove(element: Element): HTMLElement {
		return element.parentNode === undefined ? null : element.parentNode.removeChild(element) as HTMLElement;
	}
	public replace(src: HTMLElement, target: HTMLElement): HTMLElement {
		let result: HTMLElement;
		if (src.parentNode) {
			src.parentNode.replaceChild(target, src) as HTMLElement;
		}
		return result;
	}
	public clear(element: Element) {
		let i = element.children.length;
		while (i--) {
			element.removeChild(element.children[i]);
		}
	}
	public get(id: string): HTMLElement {
		let result = this._document.getElementById(id) as HTMLElement;
		if (result === null) {
			switch (id) {
				case "body":
					result = this._document.body;
					break;
			}
		}
		return result;
	}
	public find(selector: string): HTMLElement {
		return this._document.querySelector(selector) as HTMLElement;
	}
	public findAll(selector: string, root?: HTMLElement) {
		return this.toArray((root || this._document).querySelectorAll(selector));
	}
	public children(root: HTMLElement, selector?: string) {
		const children = this.toArray((root || this._document).children);
		return selector === undefined ? children : children.filter(this.is.bind(this, selector));
	}
	public position(el: HTMLElement, x: number, y: number): void {
		el.style.top = y + "px";
		el.style.left = x + "px";
	}
	public is(selector: string, element: HTMLElement): boolean {
		let result = false;
		if (element.matches) {
			result = element.matches(selector);
		} else if (element.msMatchesSelector) {
			result = element.msMatchesSelector(selector);
		} else if (element.webkitMatchesSelector) {
			result = element.webkitMatchesSelector(selector);
		} else {
			if (element.id !== "") {
				result = element.parentElement.querySelector("#" + element.id) !== null;
			} else {
				result = this.toArray(element.parentElement.querySelectorAll(selector)).indexOf(element) !== -1;
			}
		}
		return result;
	}
	public setStylesExplicitly(element: HTMLElement, ...styles: string[]) {
		const comp = this._window.getComputedStyle(element);
		for (const style of styles) {
			(element.style as any)[style] = (comp as any)[style];
		}
	}
}

export let Dom = new _Dom();
