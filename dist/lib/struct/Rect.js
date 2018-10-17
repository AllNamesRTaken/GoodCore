import { Vec2 } from "./Vec2";
var Rect = (function () {
    function Rect(x1, y1, x2, y2, endInclusive) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        if (endInclusive === void 0) { endInclusive = false; }
        this.start = new Vec2(x1, y1);
        this.stop = new Vec2(x2, y2);
        this.endInclusive = endInclusive;
    }
    Object.defineProperty(Rect.prototype, "isZero", {
        get: function () {
            return this.start.isZero && this.stop.isZero;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.create = function (x1, y1, x2, y2, endInclusive) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        if (endInclusive === void 0) { endInclusive = false; }
        return new (this.constructor)(x1, y1, x2, y2, endInclusive);
    };
    Rect.prototype.set = function (src) {
        this.start.set(src.start);
        this.stop.set(src.stop);
        return this;
    };
    Rect.prototype.clone = function (out) {
        var result = out ? out.set(this) : this.create(this.start.x, this.start.y, this.stop.x, this.stop.y);
        return result;
    };
    Rect.prototype.fromRange2 = function (range, endInclusive) {
        if (endInclusive === void 0) { endInclusive = false; }
        this.start.x = range.pos.x,
            this.start.y = range.pos.y,
            this.stop.x = range.pos.x - (endInclusive ? (range.size.x < 0 ? -1 : 1) : 0) + range.size.x,
            this.stop.y = range.pos.y - (endInclusive ? (range.size.y < 0 ? -1 : 1) : 0) + range.size.y,
            this.endInclusive = endInclusive;
        return this;
    };
    Rect.prototype.scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var ow = this.stop.x - this.start.x;
        var oh = this.stop.y - this.start.y;
        var w = ow;
        var h = oh;
        w *= factor.x;
        h *= factor.y;
        if (keepCenter) {
            this.start.x -= (w - ow) / 2;
            this.start.y -= (h - oh) / 2;
        }
        this.stop.x = this.start.x + w;
        this.stop.y = this.start.y + h;
        return this;
    };
    Rect.prototype.translate = function (system) {
        this.start.scale(system);
        this.stop.scale(system);
        return this;
    };
    Rect.prototype.equals = function (rect) {
        return this.start.equals(rect.start) && this.stop.equals(rect.stop);
    };
    Rect.prototype.toInt = function () {
        this.start.toInt();
        this.stop.toInt();
        return this;
    };
    Rect.prototype.toDecimal = function () {
        this.start.toDecimal();
        this.stop.toDecimal();
        return this;
    };
    Rect.prototype.area = function () {
        var x = this.stop.x - this.start.x;
        var y = this.stop.y - this.start.y;
        return x * y;
    };
    Rect.prototype.move = function (vec) {
        this.start.add(vec);
        this.stop.add(vec);
        return this;
    };
    Rect.prototype.contains = function (target) {
        return this.start.x <= target.start.x &&
            this.start.y <= target.start.y &&
            this.stop.x >= target.stop.x &&
            this.stop.y >= target.stop.y;
    };
    Rect.prototype.intersect = function (target) {
        return this.containsPoint(target.start.x, target.start.y) ||
            this.containsPoint(target.stop.x, target.stop.y) ||
            this.containsPoint(target.start.x, target.stop.y) ||
            this.containsPoint(target.stop.x, target.start.y);
    };
    Rect.prototype.containsPoint = function (x, y) {
        return this.start.x <= x && this.stop.x >= x &&
            this.start.y <= y && this.stop.y >= y;
    };
    Rect.prototype.zero = function () {
        this.start.zero();
        this.stop.zero();
        return this;
    };
    return Rect;
}());
export { Rect };
//# sourceMappingURL=Rect.js.map