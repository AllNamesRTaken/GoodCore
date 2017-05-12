"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calc_1 = require("../Calc");
var Range2_1 = require("./Range2");
var Vec2_1 = require("./Vec2");
var Sign = Calc_1.Calc.Sign;
var Rect = (function () {
    function Rect(x1, y1, x2, y2, endInclusive) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        if (endInclusive === void 0) { endInclusive = false; }
        this.start = new Vec2_1.default(x1, y1);
        this.stop = new Vec2_1.default(x2, y2);
        this.endInclusive = endInclusive;
    }
    Rect.prototype.Set = function (src) {
        this.start.Set(src.start);
        this.stop.Set(src.stop);
        return this;
    };
    Rect.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Rect(this.start.x, this.start.y, this.stop.x, this.stop.y);
        return result;
    };
    Rect.prototype.ToRange2 = function () {
        return new Range2_1.default(this.start.x, this.start.y, this.stop.x + (this.endInclusive ? Calc_1.Calc.Sign(this.stop.x) : 0) - this.start.x, this.stop.y + (this.endInclusive ? Calc_1.Calc.Sign(this.stop.y) : 0) - this.start.y);
    };
    Rect.prototype.Scale = function (factor, keepCenter) {
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
    Rect.prototype.Translate = function (system) {
        this.start.Scale(system);
        this.stop.Scale(system);
        return this;
    };
    Rect.prototype.Equals = function (rect) {
        return this.start.Equals(rect.start) && this.stop.Equals(rect.stop);
    };
    Rect.prototype.ToInt = function () {
        this.start.ToInt();
        this.stop.ToInt();
        return this;
    };
    Rect.prototype.ToDecimal = function () {
        this.start.ToDecimal();
        this.stop.ToDecimal();
        return this;
    };
    Rect.prototype.Area = function () {
        var x = this.stop.x - this.start.x;
        var y = this.stop.y - this.start.y;
        return x * y;
    };
    Rect.prototype.Move = function (vec) {
        this.start.Add(vec);
        this.stop.Add(vec);
        return this;
    };
    return Rect;
}());
exports.default = Rect;
//# sourceMappingURL=Rect.js.map