"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calc_1 = require("../Calc");
var Vec2 = (function () {
    function Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.Angle = this.HorizontalAngle;
        this.Direction = this.HorizontalAngle;
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.Set = function (src) {
        this.x = src.x;
        this.y = src.y;
        return this;
    };
    Vec2.prototype.Clone = function (out) {
        var result = out ? out.Set(this) : new Vec2(this.x, this.y);
        return result;
    };
    Vec2.prototype.ToInt = function () {
        this.x |= 0;
        this.y |= 0;
        return this;
    };
    Vec2.prototype.Ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vec2.prototype.ToDecimal = function () {
        this.x += Vec2.EPSILON;
        this.y += Vec2.EPSILON;
        return this;
    };
    Vec2.prototype.LengthSq = function () { return (this.x * this.x + this.y * this.y); };
    Vec2.prototype.Length = function () { return Math.sqrt(this.LengthSq()); };
    Vec2.prototype.HorizontalAngle = function () { return Math.atan2(this.y, this.x); };
    Vec2.prototype.Rotate = function (angle) {
        var rot = Calc_1.Calc.RotationRad(angle);
        var nx = (this.x * rot[0]) - (this.y * rot[1]);
        var ny = (this.x * rot[1]) + (this.y * rot[0]);
        this.x = nx;
        this.y = ny;
        return this;
    };
    Vec2.prototype.RotateAround = function (center, angle) {
        return this.Subtract(center).Rotate(angle).Add(center);
    };
    Vec2.prototype.Normalize = function () {
        var len = this.Length();
        if (len === 0) {
            this.x = 1;
            this.y = 0;
        }
        else {
            this.x = this.x / len;
            this.y = this.y / len;
        }
        return this;
    };
    Vec2.prototype.Scale = function (vectorB) {
        this.x = this.x * vectorB.x;
        this.y = this.y * vectorB.y;
        return this;
    };
    Vec2.prototype.Relate = function (vectorB) {
        this.x = this.x / vectorB.x;
        this.y = this.y / vectorB.y;
        return this;
    };
    Vec2.prototype.Multiply = function (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    };
    Vec2.prototype.Add = function (vectorB) {
        this.x = this.x + vectorB.x;
        this.y = this.y + vectorB.y;
        return this;
    };
    Vec2.prototype.Subtract = function (vectorB) {
        this.x = this.x - vectorB.x;
        this.y = this.y - vectorB.y;
        return this;
    };
    Vec2.prototype.Invert = function () {
        this.x = -this.x;
        this.y = -this.y;
    };
    Vec2.prototype.Equals = function (target) {
        return this.x === target.x && this.y === target.y;
    };
    Vec2.prototype.AlmostEquals = function (target) {
        return Math.abs(this.x - target.x) < Vec2.EPSILON && Math.abs(this.y - target.y) < Vec2.EPSILON;
    };
    Vec2.prototype.GetNormal = function (isNormalized) {
        var result = this.Clone();
        if (!isNormalized) {
            result.Set(this).Normalize();
        }
        var temp = result.x;
        result.x = result.y;
        result.y = -temp;
        return result;
    };
    Vec2.prototype.Dot = function (vectorB) { return (this.x * vectorB.x + this.y * vectorB.y); };
    Vec2.prototype.Cross = function (vectorB) { return ((this.x * vectorB.y) - (this.y * vectorB.x)); };
    Vec2.prototype.ProjectOnto = function (vectorB) {
        var coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
        this.x = coeff * vectorB.x;
        this.y = coeff * vectorB.y;
        return this;
    };
    Vec2.prototype.VerticalAngle = function () { return Math.atan2(this.x, this.y); };
    Vec2.prototype.RotateBy = function (rotation) {
        var angle = -this.HorizontalAngle() + rotation;
        return this.Rotate(angle);
    };
    return Vec2;
}());
Vec2.EPSILON = 1e-8;
Vec2.IDENTITY = new Vec2(1, 1);
Vec2.X_DIM = new Vec2(1, 0);
Vec2.Y_DIM = new Vec2(0, 1);
exports.Vec2 = Vec2;
//# sourceMappingURL=Vec2.js.map