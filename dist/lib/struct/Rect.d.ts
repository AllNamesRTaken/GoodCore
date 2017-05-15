import { Range2 } from "./Range2";
import { Vec2 } from "./Vec2";
export declare class Rect {
    start: Vec2;
    stop: Vec2;
    endInclusive: boolean;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, endInclusive?: boolean);
    Set(src: Rect): Rect;
    Clone(out?: Rect): Rect;
    ToRange2(): Range2;
    Scale(factor: Vec2, keepCenter?: boolean): Rect;
    Translate(system: Vec2): Rect;
    Equals(rect: Rect): boolean;
    ToInt(): Rect;
    ToDecimal(): Rect;
    Area(): number;
    Move(vec: Vec2): Rect;
}
