import { IRect } from "./IRect";
import { IVec2 } from "./IVec2";
import { Range2 } from "./Range2";
import { Vec2 } from "./Vec2";
export declare class Rect implements IRect {
    start: Vec2;
    stop: Vec2;
    endInclusive: boolean;
    readonly isZero: boolean;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
    set(src: IRect): Rect;
    clone(out?: Rect): Rect;
    toRange2(out?: Range2): Range2;
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
