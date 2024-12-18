export enum Sides {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
}
export function init(win: Window): void;
export function create<T extends HTMLElement>(html: string, attr?: any): T;
export function resolve(target: HTMLElement | string, root?: HTMLElement): HTMLElement | null;
export function resolveAll(target: HTMLElement | HTMLElement[] | string, root?: HTMLElement): HTMLElement[];
export function contains(target: HTMLElement | HTMLElement[] | string, root?: Node, includeRoot?: boolean): boolean;
export function outerHTML(el: HTMLElement): string;
export function setAttr(_el: HTMLElement | Node | String, attr: any): void;
export function remove(element: Element | Node): Element | Node | null;
export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
export function clear(element: Element | Node): void;
export function get<T extends HTMLElement>(id: string): T | null;
export function byId<T extends HTMLElement>(id: string): T | null;
export function find<T extends HTMLElement>(selector: string, root?: Element): T | null;
export function findAll<T extends HTMLElement>(selector: string, root?: HTMLElement): T[];
export function children(root: HTMLElement, selector?: string): Element[];
export function findParent<T extends HTMLElement>(root: Element, selector: string): T | null;
export function position(el: HTMLElement, x: number, y: number): void;
export function getOffset(el: HTMLElement): {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export function is(selector: string, element: Element): boolean;
export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
export function findParents(element: HTMLElement): HTMLElement[];
export function findClosestCommonParent(elements: HTMLElement[], startAtIndex?: number): HTMLElement;

