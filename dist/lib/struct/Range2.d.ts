import { IRange2 } from "./IRange2";
import { IVec2 } from "./IVec2";
import { Rect } from "./Rect";
import { Vec2 } from "./Vec2";
export declare class Range2 implements IRange2 {
    pos: Vec2;
    size: Vec2;
    readonly isZero: boolean;
    constructor(x?: number, y?: number, w?: number, h?: number);
    set(src: IRange2): Range2;
    clone(out?: Range2): Range2;
    toRect(endInclusive?: boolean, out?: Rect): Rect;
    scale(factor: IVec2, keepCenter?: boolean): Range2;
    translate(system: IVec2): Range2;
    toInt(): Range2;
    toDecimal(): Range2;
    contains(target: Range2): boolean;
    intersect(target: Range2): boolean;
    containsPoint(vec: IVec2): boolean;
    first(fn: (p: Vec2) => boolean): Vec2;
    forEach(fn: (p: Vec2) => boolean, start?: Vec2): void;
    equals(range: IRange2): boolean;
    zero(): Range2;
}
