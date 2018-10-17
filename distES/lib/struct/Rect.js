import { Vec2 } from "./Vec2";
export class Rect {
    get isZero() {
        return this.start.isZero && this.stop.isZero;
    }
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, endInclusive = false) {
        this.start = new Vec2(x1, y1);
        this.stop = new Vec2(x2, y2);
        this.endInclusive = endInclusive;
    }
    create(x1 = 0, y1 = 0, x2 = 0, y2 = 0, endInclusive = false) {
        return new (this.constructor)(x1, y1, x2, y2, endInclusive);
    }
    set(src) {
        this.start.set(src.start);
        this.stop.set(src.stop);
        return this;
    }
    clone(out) {
        const result = out ? out.set(this) : this.create(this.start.x, this.start.y, this.stop.x, this.stop.y);
        return result;
    }
    fromRange2(range, endInclusive = false) {
        this.start.x = range.pos.x,
            this.start.y = range.pos.y,
            this.stop.x = range.pos.x - (endInclusive ? (range.size.x < 0 ? -1 : 1) : 0) + range.size.x,
            this.stop.y = range.pos.y - (endInclusive ? (range.size.y < 0 ? -1 : 1) : 0) + range.size.y,
            this.endInclusive = endInclusive;
        return this;
    }
    scale(factor, keepCenter = true) {
        const ow = this.stop.x - this.start.x;
        const oh = this.stop.y - this.start.y;
        let w = ow;
        let h = oh;
        w *= factor.x;
        h *= factor.y;
        if (keepCenter) {
            this.start.x -= (w - ow) / 2;
            this.start.y -= (h - oh) / 2;
        }
        this.stop.x = this.start.x + w;
        this.stop.y = this.start.y + h;
        return this;
    }
    translate(system) {
        this.start.scale(system);
        this.stop.scale(system);
        return this;
    }
    equals(rect) {
        return this.start.equals(rect.start) && this.stop.equals(rect.stop);
    }
    toInt() {
        this.start.toInt();
        this.stop.toInt();
        return this;
    }
    toDecimal() {
        this.start.toDecimal();
        this.stop.toDecimal();
        return this;
    }
    area() {
        const x = this.stop.x - this.start.x;
        const y = this.stop.y - this.start.y;
        return x * y;
    }
    move(vec) {
        this.start.add(vec);
        this.stop.add(vec);
        return this;
    }
    contains(target) {
        return this.start.x <= target.start.x &&
            this.start.y <= target.start.y &&
            this.stop.x >= target.stop.x &&
            this.stop.y >= target.stop.y;
    }
    intersect(target) {
        return this.containsPoint(target.start.x, target.start.y) ||
            this.containsPoint(target.stop.x, target.stop.y) ||
            this.containsPoint(target.start.x, target.stop.y) ||
            this.containsPoint(target.stop.x, target.start.y);
    }
    containsPoint(x, y) {
        return this.start.x <= x && this.stop.x >= x &&
            this.start.y <= y && this.stop.y >= y;
    }
    zero() {
        this.start.zero();
        this.stop.zero();
        return this;
    }
}
//# sourceMappingURL=Rect.js.map