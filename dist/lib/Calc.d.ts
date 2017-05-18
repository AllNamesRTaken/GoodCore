export declare class _Calc {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
    constructor();
    Sign(x: number): number;
    RotationDeg(rotation: number): number[];
    RotationRad(rotation: number): number[];
    ClosestRadianRotation(rotation: number): number;
}
export declare let Calc: _Calc;
