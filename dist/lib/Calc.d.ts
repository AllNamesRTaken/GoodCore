export default class _Calc {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: Array<Array<number>>;
    _(): _Calc;
    constructor();
    Sign(x: number): number;
    RotationDeg(rotation: number): Array<number>;
    RotationRad(rotation: number): Array<number>;
    ClosestRadianRotation(rotation: number): number;
}
export declare var Calc: _Calc;
