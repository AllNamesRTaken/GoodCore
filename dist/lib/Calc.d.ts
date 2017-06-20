export declare class CalcConst {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
}
export declare function sign(x: number): number;
export declare function rotationDeg(rotation: number): number[];
export declare function rotationRad(rotation: number): number[];
export declare function closestRadianRotation(rotation: number): number;
