/// <reference path="base.d.ts" />
import { Vec2 } from "./Vec2";

export class Range2 implements IRange2 {
    pos: Vec2;
    size: Vec2;
    readonly isZero: boolean;
    constructor(x?: number, y?: number, w?: number, h?: number);
    protected create(x?: number, y?: number, w?: number, h?: number): Range2;
    set(src: IRange2): Range2;
    clone(out?: Range2): Range2;
    fromRect(rect: IRect): Range2
    scale(factor: IVec2, keepCenter?: boolean): Range2;
    translate(system: IVec2): Range2;
    move(system: IVec2): Range2;
    toInt(): Range2;
    toDecimal(): Range2;
    contains(target: Range2): boolean;
    intersect(target: Range2): boolean;
    containsPoint(vec: IVec2): boolean;
    first(fn: (p: Vec2) => boolean): Vec2 | null;
    forEach(fn: (p: Vec2) => boolean, start?: Vec2 | null): void;
    equals(range: IRange2): boolean;
    zero(): Range2;
}
