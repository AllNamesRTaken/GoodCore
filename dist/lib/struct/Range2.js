import { Rect } from "./Rect";
import { Vec2 } from "./Vec2";
export class Range2 {
    get isZero() {
        return this.pos.isZero && this.size.isZero;
    }
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(w, h);
    }
    set(src) {
        this.pos.set(src.pos);
        this.size.set(src.size);
        return this;
    }
    clone(out) {
        const result = out ? out.set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    }
    toRect(endInclusive = false, out) {
        let result = out || new Rect();
        result.start.x = this.pos.x,
            result.start.y = this.pos.y,
            result.stop.x = this.pos.x - (endInclusive ? (this.size.x < 0 ? -1 : 1) : 0) + this.size.x,
            result.stop.y = this.pos.y - (endInclusive ? (this.size.y < 0 ? -1 : 1) : 0) + this.size.y,
            result.endInclusive = endInclusive;
        return result;
    }
    scale(factor, keepCenter = true) {
        let org;
        if (keepCenter) {
            org = this.size.clone();
        }
        this.size.scale(factor);
        if (keepCenter) {
            this.pos.add(org.subtract(this.size).multiply(0.5));
        }
        return this;
    }
    translate(system) {
        this.toRect(false).translate(system).toRange2(this);
        return this;
    }
    toInt() {
        this.pos.toInt();
        this.size.toInt();
        return this;
    }
    toDecimal() {
        this.pos.toDecimal();
        this.size.toDecimal();
        return this;
    }
    contains(target) {
        return this.pos.x <= target.pos.x &&
            this.pos.y <= target.pos.y &&
            this.pos.x + this.size.x >= target.pos.x + target.size.x &&
            this.pos.y + this.size.y >= target.pos.y + target.size.y;
    }
    intersect(target) {
        let s = this.toRect();
        let t = target.clone().toRect();
        return s.intersect(t);
    }
    containsPoint(vec) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    }
    first(fn) {
        const p = new Vec2();
        const x = this.pos.x;
        const y = this.pos.y;
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                p.x = i + x, p.y = j + y;
                if (fn(p)) {
                    return p;
                }
            }
        }
        return null;
    }
    forEach(fn, start = null) {
        const pos = new Vec2();
        const begin = this.pos.clone().toInt();
        if (start === null || !this.containsPoint(start)) {
            start = begin;
        }
        const end = this.pos.clone().add(this.size).toInt();
        for (let y = begin.y; y < end.y; y += 1) {
            for (let x = begin.x; x < end.x; x += 1) {
                if (y < start.y || (y === start.y && x < start.x)) {
                    continue;
                }
                pos.x = x;
                pos.y = y;
                const brk = fn(pos);
                if (brk) {
                    return;
                }
            }
        }
    }
    equals(range) {
        return this.pos.equals(range.pos) && this.size.equals(range.size);
    }
    zero() {
        this.pos.zero();
        this.size.zero();
        return this;
    }
}
//# sourceMappingURL=Range2.js.map