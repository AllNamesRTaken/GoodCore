import Vec2 from "./Vec2"
import Rect from "./Rect"
import { Calc } from "../Calc"

export default class Range2 {
    public pos: Vec2;
    public size: Vec2;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(w, h);
    }
    public Set(src: Range2): Range2 {
        this.pos.Set(src.pos);
        this.size.Set(src.size);
        return this;
    }
    public Clone(out?: Range2): Range2 {
        let result = out ? out.Set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    }
    public ToRect(endInclusive: boolean = false): Rect {
        return new Rect(
            this.pos.x,
            this.pos.y,
            this.pos.x - (endInclusive ? Calc.Sign(this.size.x) : 0) + this.size.x,
            this.pos.y - (endInclusive ? Calc.Sign(this.size.y) : 0) + this.size.y,
            endInclusive);
    }
    public Scale(factor: Vec2, keepCenter: boolean = true): Range2 {
        let org: Vec2;
        if (keepCenter) {
            org = this.size.Clone();
        }
        this.size.Scale(factor);
        if (keepCenter) {
            this.pos.Add(org.Subtract(this.size).Multiply(0.5));
        }
        return this;
    }
    public Translate(system: Vec2): Range2 {
        this.Set(this.ToRect(false).Translate(system).ToRange2());
        return this;
    }
    public ToInt(): Range2 {
        this.pos.ToInt();
        this.size.ToInt();
        return this;
    }
    public ToDecimal(): Range2 {
        this.pos.ToDecimal();
        this.size.ToDecimal();
        return this;
    }
    public Contains(vec: Vec2) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1 
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    }
    public First(fn: (p: Vec2) => boolean): Vec2 {
        let p: Vec2 = new Vec2();
        for (let i = this.pos.x; i < this.pos.x + this.size.x; i++) {
            for (let j = this.pos.y; j < this.pos.y + this.size.y; j++) {
                p.x = i, p.y = j;
                if (fn(p)) {
                    return p;
                }
            }
        }
        return null;
    }
    public ForEach(fn: (p: Vec2) => boolean, start: Vec2 = null): void {
        let pos: Vec2 = new Vec2();
        let begin = this.pos.Clone().ToInt();
        if(start === null || !this.Contains(start)) {
             start = begin
        }
        let end: Vec2 = this.pos.Clone().Add(this.size).ToInt();
        for (let y = begin.y; y < end.y; y += 1) {
            for (let x = begin.x; x < end.x; x += 1) {
                if(y < start.y || (y === start.y && x < start.x)) {
                    continue;
                } 
                pos.x = x;
                pos.y = y;
                let brk = fn(pos);
                if (brk) {
                    return;
                }
            }
        }
    }
    public Equals(range: Range2): boolean {
        return this.pos.Equals(range.pos) && this.size.Equals(range.size);
    }
}
