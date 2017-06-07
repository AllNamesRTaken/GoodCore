export declare class CalcConst {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
}
export declare class Calc {
    static sign(x: number): number;
    static rotationDeg(rotation: number): number[];
    static rotationRad(rotation: number): number[];
    static closestRadianRotation(rotation: number): number;
}
