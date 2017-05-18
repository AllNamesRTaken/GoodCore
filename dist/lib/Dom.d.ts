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
    Init(win: Window): void;
    ToArray<T>(a: ArrayLike<T>): T[];
    Create(html: string, attr?: any): HTMLElement;
    OuterHTML(el: HTMLElement): string;
    SetAttr(_el: HTMLElement | String, attr: any): void;
    Remove(element: Element): HTMLElement;
    Replace(src: HTMLElement, target: HTMLElement): HTMLElement;
    Clear(element: Element): void;
    Get(id: string): HTMLElement;
    Find(selector: string): HTMLElement;
    FindAll(selector: string, root?: HTMLElement): Element[];
    Children(root: HTMLElement, selector?: string): Element[];
    Position(el: HTMLElement, x: number, y: number): void;
    Is(selector: string, element: HTMLElement): boolean;
    SetStylesExplicitly(element: HTMLElement, ...styles: string[]): void;
}
export declare let Dom: _Dom;
