export enum Sides {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
}
export function init(win: Window): void;
export function toArray<T>(a: ArrayLike<T>): T[];
export function create(html: string, attr?: any): HTMLElement;
export function outerHTML(el: HTMLElement): string;
export function setAttr(_el: HTMLElement | String, attr: any): void;
export function remove(element: Element): HTMLElement | null;
export function replace(src: HTMLElement, target: HTMLElement): HTMLElement;
export function clear(element: Element): void;
export function get(id: string): HTMLElement;
export function find(selector: string): HTMLElement;
export function findAll(selector: string, root?: HTMLElement): Element[];
export function children(root: HTMLElement, selector?: string): Element[];
export function findParent(root: HTMLElement, selector: string): HTMLElement | null;
export function position(el: HTMLElement, x: number, y: number): void;
export function is(selector: string, element: HTMLElement): boolean;
export function setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
