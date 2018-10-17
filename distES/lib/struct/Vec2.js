import { rotationRad } from "../Calc";
export class Vec2Const {
}
Vec2Const.EPSILON = 1e-8;
Vec2Const.IDENTITY = { x: 1, y: 1 };
Vec2Const.X_DIM = { x: 1, y: 0 };
Vec2Const.Y_DIM = { x: 0, y: 1 };
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.angle = this.horizontalAngle;
        this.direction = this.horizontalAngle;
        this.x = x;
        this.y = y;
    }
    get isZero() {
        return this.x === 0 && this.y === 0;
    }
    create(x = 0, y = 0) {
        return new (this.constructor)(x, y);
    }
    set(src) {
        this.x = src.x;
        this.y = src.y;
        return this;
    }
    clone(out) {
        const result = out ? out.set(this) : this.create(this.x, this.y);
        return result;
    }
    toInt() {
        this.x |= 0;
        this.y |= 0;
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    toDecimal() {
        this.x += Vec2Const.EPSILON;
        this.y += Vec2Const.EPSILON;
        return this;
    }
    lengthSq() { return (this.x * this.x + this.y * this.y); }
    length() { return Math.sqrt(this.lengthSq()); }
    horizontalAngle() { return Math.atan2(this.y, this.x); }
    rotate(angle) {
        const rot = rotationRad(angle);
        const nx = (this.x * rot[0]) - (this.y * rot[1]);
        const ny = (this.x * rot[1]) + (this.y * rot[0]);
        this.x = nx;
        this.y = ny;
        return this;
    }
    rotateAround(center, angle) {
        return this.subtract(center).rotate(angle).add(center);
    }
    normalize() {
        const len = this.length();
        if (len === 0) {
            this.x = 1;
            this.y = 0;
        }
        else {
            this.x = this.x / len;
            this.y = this.y / len;
        }
        return this;
    }
    scale(vectorB) {
        this.x = this.x * vectorB.x;
        this.y = this.y * vectorB.y;
        return this;
    }
    relate(vectorB) {
        this.x = this.x / vectorB.x;
        this.y = this.y / vectorB.y;
        return this;
    }
    multiply(scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    }
    add(vectorB) {
        this.x = this.x + vectorB.x;
        this.y = this.y + vectorB.y;
        return this;
    }
    subtract(vectorB) {
        this.x = this.x - vectorB.x;
        this.y = this.y - vectorB.y;
        return this;
    }
    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    equals(target) {
        return this.x === target.x && this.y === target.y;
    }
    almostEquals(target) {
        return Math.abs(this.x - target.x) < Vec2Const.EPSILON && Math.abs(this.y - target.y) < Vec2Const.EPSILON;
    }
    getNormal(isNormalized) {
        const result = this.clone();
        if (!isNormalized) {
            result.set(this).normalize();
        }
        const temp = result.x;
        result.x = result.y;
        result.y = -temp;
        return result;
    }
    dot(vectorB) { return (this.x * vectorB.x + this.y * vectorB.y); }
    cross(vectorB) { return ((this.x * vectorB.y) - (this.y * vectorB.x)); }
    projectOnto(vectorB) {
        const coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
        this.x = coeff * vectorB.x;
        this.y = coeff * vectorB.y;
        return this;
    }
    verticalAngle() { return Math.atan2(this.x, this.y); }
    rotateBy(rotation) {
        const angle = -this.horizontalAngle() + rotation;
        return this.rotate(angle);
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }
}
//# sourceMappingURL=Vec2.js.map