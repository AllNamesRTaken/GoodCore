export class _Calc {
	public static ROTATION_DEGREE_PRECISION: number = 1;
	public static RADIAN_FACTOR: number = (1 / 360) * (2 * Math.PI);
	public static DEGREE_FACTOR: number = (1 / (2 * Math.PI) * 360);
	public static DEG360 = 360 * _Calc.ROTATION_DEGREE_PRECISION;
	public static ROTATION_LOOKUP: number[][] = (function(): number[][] {
		const lookup: number[][] = [];
		for (let i = 0; i < 360 * _Calc.ROTATION_DEGREE_PRECISION; i++) {
			lookup.push([Math.cos(i * _Calc.RADIAN_FACTOR), Math.sin(i * _Calc.RADIAN_FACTOR)]);
		}
		return lookup;
	})();

	public constructor() {

	}
	public sign(x: number): number {
		return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	}

	public rotationDeg(rotation: number): number[] {
		let rot = (rotation * _Calc.ROTATION_DEGREE_PRECISION) | 0;
		while (rot < 0) {
			rot += _Calc.DEG360;
		}
		while (rot >= _Calc.DEG360) {
			rot -= _Calc.DEG360;
		}
		return _Calc.ROTATION_LOOKUP[rot];
	}
	public rotationRad(rotation: number): number[] {
		const rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
		return this.rotationDeg(rot / _Calc.ROTATION_DEGREE_PRECISION);
	}
	public closestRadianRotation(rotation: number): number {
		let rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
		while (rot < 0) {
			rot += _Calc.DEG360;
		}
		while (rot >= _Calc.DEG360) {
			rot -= _Calc.DEG360;
		}
		return rot * _Calc.RADIAN_FACTOR / _Calc.ROTATION_DEGREE_PRECISION;
	}
}

export let Calc = new _Calc();
