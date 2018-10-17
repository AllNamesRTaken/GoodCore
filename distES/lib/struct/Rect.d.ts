/// <reference path="../base.d.ts" />
import { Vec2 } from "./Vec2";

export class Rect implements IRect {
    start: Vec2;
    stop: Vec2;
    endInclusive: boolean;
    readonly isZero: boolean;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
    protected create(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean): Rect;
    set(src: IRect): Rect;
    clone(out?: Rect): Rect;
    fromRange2(range: IRange2, endInclusive?: boolean): Rect
    scale(factor: IVec2, keepCenter?: boolean): Rect;
    translate(system: IVec2): Rect;
    equals(rect: IRect): boolean;
    toInt(): Rect;
    toDecimal(): Rect;
    area(): number;
    move(vec: IVec2): Rect;
    contains(target: IRect): boolean;
    intersect(target: IRect): boolean;
    containsPoint(x: number, y: number): boolean;
    zero(): Rect;
}
