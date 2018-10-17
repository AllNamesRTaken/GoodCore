export class CalcConst {
    static ROTATION_DEGREE_PRECISION: number;
    static RADIAN_FACTOR: number;
    static DEGREE_FACTOR: number;
    static DEG360: number;
    static ROTATION_LOOKUP: number[][];
}
export function sign(x: number): number;
export function rotationDeg(rotation: number): number[];
export function rotationRad(rotation: number): number[];
export function closestRadianRotation(radian: number): number;
