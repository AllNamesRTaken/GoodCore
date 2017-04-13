export default class _Calc {
    static ROTATION_DEGREE_PRECISION: number = 1;
    static RADIAN_FACTOR: number = (1 / 360) * (2 * Math.PI);
    static DEGREE_FACTOR: number = (1 / (2 * Math.PI) * 360);
    static DEG360 = 360 * _Calc.ROTATION_DEGREE_PRECISION
    static ROTATION_LOOKUP: Array<Array<number>> = (function (): Array<Array<number>> {
        var lookup: Array<Array<number>> = [];
        for (var i = 0; i < 360 * _Calc.ROTATION_DEGREE_PRECISION; i++) {
            lookup.push([Math.cos(i * _Calc.RADIAN_FACTOR), Math.sin(i * _Calc.RADIAN_FACTOR)]);
        }
        return lookup;
    })();

    public _(): _Calc {
        return new _Calc();
    }

    public constructor() {

    }
    public Sign(x: number): number {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    public RotationDeg(rotation: number): Array<number> {
        var rot = (rotation * _Calc.ROTATION_DEGREE_PRECISION) | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return _Calc.ROTATION_LOOKUP[rot];
    }
    public RotationRad(rotation: number): Array<number> {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        return this.RotationDeg(rot / _Calc.ROTATION_DEGREE_PRECISION);
    }
    public ClosestRadianRotation(rotation: number): number {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return rot * _Calc.RADIAN_FACTOR / _Calc.ROTATION_DEGREE_PRECISION;
    }
}

export var Calc = new _Calc();
