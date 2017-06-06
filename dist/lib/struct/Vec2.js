import { Calc } from "../Calc";
var Vec2 = (function () {
    function Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.angle = this.horizontalAngle;
        this.direction = this.horizontalAngle;
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vec2.prototype, "isZero", {
        get: function () {
            return this.x === 0 && this.y === 0;
        },
        enumerable: true,
        configurable: true
    });
    Vec2.prototype.set = function (src) {
        this.x = src.x;
        this.y = src.y;
        return this;
    };
    Vec2.prototype.clone = function (out) {
        var result = out ? out.set(this) : new Vec2(this.x, this.y);
        return result;
    };
    Vec2.prototype.toInt = function () {
        this.x |= 0;
        this.y |= 0;
        return this;
    };
    Vec2.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vec2.prototype.toDecimal = function () {
        this.x += Vec2.EPSILON;
        this.y += Vec2.EPSILON;
        return this;
    };
    Vec2.prototype.lengthSq = function () { return (this.x * this.x + this.y * this.y); };
    Vec2.prototype.length = function () { return Math.sqrt(this.lengthSq()); };
    Vec2.prototype.horizontalAngle = function () { return Math.atan2(this.y, this.x); };
    Vec2.prototype.rotate = function (angle) {
        var rot = Calc.rotationRad(angle);
        var nx = (this.x * rot[0]) - (this.y * rot[1]);
        var ny = (this.x * rot[1]) + (this.y * rot[0]);
        this.x = nx;
        this.y = ny;
        return this;
    };
    Vec2.prototype.rotateAround = function (center, angle) {
        return this.subtract(center).rotate(angle).add(center);
    };
    Vec2.prototype.normalize = function () {
        var len = this.length();
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
    Vec2.prototype.scale = function (vectorB) {
        this.x = this.x * vectorB.x;
        this.y = this.y * vectorB.y;
        return this;
    };
    Vec2.prototype.relate = function (vectorB) {
        this.x = this.x / vectorB.x;
        this.y = this.y / vectorB.y;
        return this;
    };
    Vec2.prototype.multiply = function (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    };
    Vec2.prototype.add = function (vectorB) {
        this.x = this.x + vectorB.x;
        this.y = this.y + vectorB.y;
        return this;
    };
    Vec2.prototype.subtract = function (vectorB) {
        this.x = this.x - vectorB.x;
        this.y = this.y - vectorB.y;
        return this;
    };
    Vec2.prototype.invert = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vec2.prototype.equals = function (target) {
        return this.x === target.x && this.y === target.y;
    };
    Vec2.prototype.almostEquals = function (target) {
        return Math.abs(this.x - target.x) < Vec2.EPSILON && Math.abs(this.y - target.y) < Vec2.EPSILON;
    };
    Vec2.prototype.getNormal = function (isNormalized) {
        var result = this.clone();
        if (!isNormalized) {
            result.set(this).normalize();
        }
        var temp = result.x;
        result.x = result.y;
        result.y = -temp;
        return result;
    };
    Vec2.prototype.dot = function (vectorB) { return (this.x * vectorB.x + this.y * vectorB.y); };
    Vec2.prototype.cross = function (vectorB) { return ((this.x * vectorB.y) - (this.y * vectorB.x)); };
    Vec2.prototype.projectOnto = function (vectorB) {
        var coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
        this.x = coeff * vectorB.x;
        this.y = coeff * vectorB.y;
        return this;
    };
    Vec2.prototype.verticalAngle = function () { return Math.atan2(this.x, this.y); };
    Vec2.prototype.rotateBy = function (rotation) {
        var angle = -this.horizontalAngle() + rotation;
        return this.rotate(angle);
    };
    Vec2.prototype.max = function (v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    };
    Vec2.prototype.min = function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    };
    Vec2.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    return Vec2;
}());
export { Vec2 };
Vec2.EPSILON = 1e-8;
Vec2.IDENTITY = new Vec2(1, 1);
Vec2.X_DIM = new Vec2(1, 0);
Vec2.Y_DIM = new Vec2(0, 1);
//# sourceMappingURL=Vec2.js.map