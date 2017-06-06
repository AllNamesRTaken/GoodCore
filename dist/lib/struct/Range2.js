import { Rect } from "./Rect";
import { Vec2 } from "./Vec2";
var Range2 = (function () {
    function Range2(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.pos = new Vec2(x, y);
        this.size = new Vec2(w, h);
    }
    Object.defineProperty(Range2.prototype, "isZero", {
        get: function () {
            return this.pos.isZero && this.size.isZero;
        },
        enumerable: true,
        configurable: true
    });
    Range2.prototype.set = function (src) {
        this.pos.set(src.pos);
        this.size.set(src.size);
        return this;
    };
    Range2.prototype.clone = function (out) {
        var result = out ? out.set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    };
    Range2.prototype.toRect = function (endInclusive, out) {
        if (endInclusive === void 0) { endInclusive = false; }
        var result = out || new Rect();
        result.start.x = this.pos.x,
            result.start.y = this.pos.y,
            result.stop.x = this.pos.x - (endInclusive ? (this.size.x < 0 ? -1 : 1) : 0) + this.size.x,
            result.stop.y = this.pos.y - (endInclusive ? (this.size.y < 0 ? -1 : 1) : 0) + this.size.y,
            result.endInclusive = endInclusive;
        return result;
    };
    Range2.prototype.scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var org;
        if (keepCenter) {
            org = this.size.clone();
        }
        this.size.scale(factor);
        if (keepCenter) {
            this.pos.add(org.subtract(this.size).multiply(0.5));
        }
        return this;
    };
    Range2.prototype.translate = function (system) {
        this.toRect(false).translate(system).toRange2(this);
        return this;
    };
    Range2.prototype.toInt = function () {
        this.pos.toInt();
        this.size.toInt();
        return this;
    };
    Range2.prototype.toDecimal = function () {
        this.pos.toDecimal();
        this.size.toDecimal();
        return this;
    };
    Range2.prototype.contains = function (target) {
        return this.pos.x <= target.pos.x &&
            this.pos.y <= target.pos.y &&
            this.pos.x + this.size.x >= target.pos.x + target.size.x &&
            this.pos.y + this.size.y >= target.pos.y + target.size.y;
    };
    Range2.prototype.intersect = function (target) {
        var s = this.toRect();
        var t = target.clone().toRect();
        return s.intersect(t);
    };
    Range2.prototype.containsPoint = function (vec) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    };
    Range2.prototype.first = function (fn) {
        var p = new Vec2();
        for (var i = this.pos.x; i < this.pos.x + this.size.x; i++) {
            for (var j = this.pos.y; j < this.pos.y + this.size.y; j++) {
                p.x = i, p.y = j;
                if (fn(p)) {
                    return p;
                }
            }
        }
        return null;
    };
    Range2.prototype.forEach = function (fn, start) {
        if (start === void 0) { start = null; }
        var pos = new Vec2();
        var begin = this.pos.clone().toInt();
        if (start === null || !this.containsPoint(start)) {
            start = begin;
        }
        var end = this.pos.clone().add(this.size).toInt();
        for (var y = begin.y; y < end.y; y += 1) {
            for (var x = begin.x; x < end.x; x += 1) {
                if (y < start.y || (y === start.y && x < start.x)) {
                    continue;
                }
                pos.x = x;
                pos.y = y;
                var brk = fn(pos);
                if (brk) {
                    return;
                }
            }
        }
    };
    Range2.prototype.equals = function (range) {
        return this.pos.equals(range.pos) && this.size.equals(range.size);
    };
    Range2.prototype.zero = function () {
        this.pos.zero();
        this.size.zero();
        return this;
    };
    return Range2;
}());
export { Range2 };
//# sourceMappingURL=Range2.js.map