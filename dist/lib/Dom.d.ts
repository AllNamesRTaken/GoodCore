export declare enum Sides {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3,
}
export declare class _Dom {
    Sides: typeof Sides;
    private _window;
    private _document;
    private _el;
    constructor();
    init(win: Window): void;
    toArray<T>(a: ArrayLike<T>): T[];
    create(html: string, attr?: any): HTMLElement;
    outerHTML(el: HTMLElement): string;
    setAttr(_el: HTMLElement | String, attr: any): void;
    remove(element: Element): HTMLElement;
    replace(src: HTMLElement, target: HTMLElement): HTMLElement;
    clear(element: Element): void;
    get(id: string): HTMLElement;
    find(selector: string): HTMLElement;
    findAll(selector: string, root?: HTMLElement): Element[];
    children(root: HTMLElement, selector?: string): Element[];
    position(el: HTMLElement, x: number, y: number): void;
    is(selector: string, element: HTMLElement): boolean;
    setStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
}
export declare let Dom: _Dom;
