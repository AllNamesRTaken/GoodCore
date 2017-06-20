export class CalcConst {
	public static ROTATION_DEGREE_PRECISION: number = 1;
	public static RADIAN_FACTOR: number = (1 / 360) * (2 * Math.PI);
	public static DEGREE_FACTOR: number = (1 / (2 * Math.PI) * 360);
	public static DEG360 = 360 * CalcConst.ROTATION_DEGREE_PRECISION;
	public static ROTATION_LOOKUP: number[][] = (function (): number[][] {
		const lookup: number[][] = [];
		for (let i = 0; i < 360 * CalcConst.ROTATION_DEGREE_PRECISION; i++) {
			lookup.push([Math.cos(i * CalcConst.RADIAN_FACTOR), Math.sin(i * CalcConst.RADIAN_FACTOR)]);
		}
		return lookup;
	})();

}
export function sign(x: number): number {
	return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

export function rotationDeg(rotation: number): number[] {
	let rot = (rotation * CalcConst.ROTATION_DEGREE_PRECISION) | 0;
	while (rot < 0) {
		rot += CalcConst.DEG360;
	}
	while (rot >= CalcConst.DEG360) {
		rot -= CalcConst.DEG360;
	}
	return CalcConst.ROTATION_LOOKUP[rot];
}
export function rotationRad(rotation: number): number[] {
	const rot = rotation * CalcConst.DEGREE_FACTOR * CalcConst.ROTATION_DEGREE_PRECISION | 0;
	return this.rotationDeg(rot / CalcConst.ROTATION_DEGREE_PRECISION);
}
export function closestRadianRotation(rotation: number): number {
	let rot = rotation * CalcConst.DEGREE_FACTOR * CalcConst.ROTATION_DEGREE_PRECISION | 0;
	while (rot < 0) {
		rot += CalcConst.DEG360;
	}
	while (rot >= CalcConst.DEG360) {
		rot -= CalcConst.DEG360;
	}
	return rot * CalcConst.RADIAN_FACTOR / CalcConst.ROTATION_DEGREE_PRECISION;
}
