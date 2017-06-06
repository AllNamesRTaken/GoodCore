export declare class _Calc {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
    constructor();
    sign(x: number): number;
    rotationDeg(rotation: number): number[];
    rotationRad(rotation: number): number[];
    closestRadianRotation(rotation: number): number;
}
export declare let Calc: _Calc;
