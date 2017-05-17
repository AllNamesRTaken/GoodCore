import { Calc } from "../Calc";
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
    Range2.prototype.Set = function (src) {
        this.pos.Set(src.pos);
        this.size.Set(src.size);
        return this;
    };
    Range2.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
        return result;
    };
    Range2.prototype.ToRect = function (endInclusive) {
        if (endInclusive === void 0) { endInclusive = false; }
        return new Rect(this.pos.x, this.pos.y, this.pos.x - (endInclusive ? Calc.Sign(this.size.x) : 0) + this.size.x, this.pos.y - (endInclusive ? Calc.Sign(this.size.y) : 0) + this.size.y, endInclusive);
    };
    Range2.prototype.Scale = function (factor, keepCenter) {
        if (keepCenter === void 0) { keepCenter = true; }
        var org;
        if (keepCenter) {
            org = this.size.Clone();
        }
        this.size.Scale(factor);
        if (keepCenter) {
            this.pos.Add(org.Subtract(this.size).Multiply(0.5));
        }
        return this;
    };
    Range2.prototype.Translate = function (system) {
        this.Set(this.ToRect(false).Translate(system).ToRange2());
        return this;
    };
    Range2.prototype.ToInt = function () {
        this.pos.ToInt();
        this.size.ToInt();
        return this;
    };
    Range2.prototype.ToDecimal = function () {
        this.pos.ToDecimal();
        this.size.ToDecimal();
        return this;
    };
    Range2.prototype.Contains = function (vec) {
        return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
            && vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
    };
    Range2.prototype.First = function (fn) {
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
    Range2.prototype.ForEach = function (fn, start) {
        if (start === void 0) { start = null; }
        var pos = new Vec2();
        var begin = this.pos.Clone().ToInt();
        if (start === null || !this.Contains(start)) {
            start = begin;
        }
        var end = this.pos.Clone().Add(this.size).ToInt();
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
    Range2.prototype.Equals = function (range) {
        return this.pos.Equals(range.pos) && this.size.Equals(range.size);
    };
    return Range2;
}());
export { Range2 };
//# sourceMappingURL=Range2.js.map