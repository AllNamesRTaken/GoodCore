export declare enum Sides {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
}
export declare class Dom {
    constructor();
    static init(win: Window): void;
    static toArray<T>(a: ArrayLike<T>): T[];
    static create(html: string, attr?: any): HTMLElement;
    static outerHTML(el: HTMLElement): string;
    static setAttr(_el: HTMLElement | String, attr: any): void;
    static remove(element: Element): HTMLElement;
    static replace(src: HTMLElement, target: HTMLElement): HTMLElement;
    static clear(element: Element): void;
    static get(id: string): HTMLElement;
    static find(selector: string): HTMLElement;
    static findAll(selector: string, root?: HTMLElement): Element[];
    static children(root: HTMLElement, selector?: string): Element[];
    static position(el: HTMLElement, x: number, y: number): void;
    static is(selector: string, element: HTMLElement): boolean;
    static setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
}
