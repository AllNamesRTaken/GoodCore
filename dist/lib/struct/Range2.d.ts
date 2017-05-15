import { Rect } from "./Rect";
import { Vec2 } from "./Vec2";
export declare class Range2 {
    pos: Vec2;
    size: Vec2;
    constructor(x?: number, y?: number, w?: number, h?: number);
    Set(src: Range2): Range2;
    Clone(out?: Range2): Range2;
    ToRect(endInclusive?: boolean): Rect;
    Scale(factor: Vec2, keepCenter?: boolean): Range2;
    Translate(system: Vec2): Range2;
    ToInt(): Range2;
    ToDecimal(): Range2;
    Contains(vec: Vec2): boolean;
    First(fn: (p: Vec2) => boolean): Vec2;
    ForEach(fn: (p: Vec2) => boolean, start?: Vec2): void;
    Equals(range: Range2): boolean;
}
