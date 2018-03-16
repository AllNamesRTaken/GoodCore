/// <reference path="../base.d.ts" />

export class Vec2Const {
    static EPSILON: number;
    static IDENTITY: IVec2;
    static X_DIM: IVec2;
    static Y_DIM: IVec2;
}
export class Vec2 implements IVec2 {
    x: number;
    y: number;
    readonly isZero: boolean;
    constructor(x?: number, y?: number);
    protected create(x?: number, y?: number): Vec2;
    set(src: IVec2): Vec2;
    clone(out?: Vec2): Vec2;
    toInt(): Vec2;
    ceil(): Vec2;
    toDecimal(): Vec2;
    lengthSq(): number;
    length(): number;
    horizontalAngle(): number;
    rotate(angle: number): Vec2;
    rotateAround(center: IVec2, angle: number): Vec2;
    normalize(): Vec2;
    scale(vectorB: IVec2): Vec2;
    relate(vectorB: IVec2): Vec2;
    multiply(scalar: number): Vec2;
    add(vectorB: IVec2): Vec2;
    subtract(vectorB: IVec2): Vec2;
    invert(): this;
    equals(target: IVec2): boolean;
    almostEquals(target: IVec2): boolean;
    getNormal(isNormalized?: boolean): Vec2;
    dot(vectorB: IVec2): number;
    cross(vectorB: IVec2): number;
    projectOnto(vectorB: IVec2): Vec2;
    verticalAngle(): number;
    angle: () => number;
    direction: () => number;
    rotateBy(rotation: number): Vec2;
    max(v: IVec2): Vec2;
    min(v: IVec2): Vec2;
    zero(): Vec2;
}
