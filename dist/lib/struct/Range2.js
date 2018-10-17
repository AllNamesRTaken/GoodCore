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
    Range2.prototype.create = function (x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        return new (this.constructor)(x, y, w, h);
    };
    Range2.prototype.set = function (src) {
        this.pos.set(src.pos);
        this.size.set(src.size);
        return this;
    };
    Range2.prototype.clone = function (out) {
        var result = out ? out.set(this) : this.create(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    };
    Range2.prototype.fromRect = function (rect) {
        var start = rect.start;
        var stop = rect.stop;
        this.pos.x = start.x;
        this.pos.y = start.y;
        this.size.x = stop.x + (rect.endInclusive ? (stop.x < start.x ? -1 : 1) : 0) - start.x;
        this.size.y = stop.y + (rect.endInclusive ? (stop.y < start.y ? -1 : 1) : 0) - start.y;
        return this;
    };
    Range2.prototype.scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var org = null;
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
        this.pos.scale(system);
        this.size.scale(system);
        return this;
    };
    Range2.prototype.move = function (system) {
        this.pos.add(system);
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
    Range2.prototype.containsPoint = function (vec) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    };
    Range2.prototype.first = function (fn) {
        var p = new Vec2();
        var x = this.pos.x;
        var y = this.pos.y;
        for (var i = 0; i < this.size.x; i++) {
            for (var j = 0; j < this.size.y; j++) {
                p.x = i + x, p.y = j + y;
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