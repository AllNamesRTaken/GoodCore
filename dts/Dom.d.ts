export enum Sides {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
}
export function init(win: Window): void;
export function toArray<T>(a: ArrayLike<T>): T[];
export function create<T extends HTMLElement>(html: string, attr?: any): T;
export function outerHTML(el: HTMLElement): string;
export function setAttr(_el: HTMLElement | Node | String, attr: any): void;
export function remove(element: Element | Node): Element | Node | null;
export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
export function clear(element: Element | Node): void;
export function get<T extends HTMLElement>(id: string): HTMLElement | null;
export function byId<T extends HTMLElement>(id: string): HTMLElement | null;
export function find<T extends HTMLElement>(selector: string, root?: Element): HTMLElement | null;
export function findAll<T extends HTMLElement>(selector: string, root?: HTMLElement): HTMLElement[];
export function children(root: HTMLElement, selector?: string): Element[];
export function findParent<T extends HTMLElement>(root: Element, selector: string): T | null;
export function position(el: HTMLElement, x: number, y: number): void;
export function is(selector: string, element: Element): boolean;
export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
