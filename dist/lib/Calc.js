var CalcConst = (function () {
    function CalcConst() {
    }
    CalcConst.ROTATION_DEGREE_PRECISION = 1;
    CalcConst.RADIAN_FACTOR = (1 / 360) * (2 * Math.PI);
    CalcConst.DEGREE_FACTOR = (1 / (2 * Math.PI) * 360);
    CalcConst.DEG360 = 360 * CalcConst.ROTATION_DEGREE_PRECISION;
    CalcConst.ROTATION_LOOKUP = (function () {
        var lookup = [];
        for (var i = 0; i < 360 * CalcConst.ROTATION_DEGREE_PRECISION; i++) {
            lookup.push([Math.cos(i * CalcConst.RADIAN_FACTOR), Math.sin(i * CalcConst.RADIAN_FACTOR)]);
        }
        return lookup;
    })();
    return CalcConst;
}());
export { CalcConst };
export function sign(x) {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}
export function rotationDeg(rotation) {
    var deg = (rotation * CalcConst.ROTATION_DEGREE_PRECISION) | 0;
    while (deg < 0) {
        deg += CalcConst.DEG360;
    }
    while (deg >= CalcConst.DEG360) {
        deg -= CalcConst.DEG360;
    }
    return CalcConst.ROTATION_LOOKUP[deg];
}
export function rotationRad(rotation) {
    var deg = rotation * CalcConst.DEGREE_FACTOR * CalcConst.ROTATION_DEGREE_PRECISION | 0;
    return rotationDeg(deg / CalcConst.ROTATION_DEGREE_PRECISION);
}
export function closestRadianRotation(radian) {
    var deg = radian * CalcConst.DEGREE_FACTOR * CalcConst.ROTATION_DEGREE_PRECISION | 0;
    while (deg < 0) {
        deg += CalcConst.DEG360;
    }
    while (deg >= CalcConst.DEG360) {
        deg -= CalcConst.DEG360;
    }
    return deg * CalcConst.RADIAN_FACTOR / CalcConst.ROTATION_DEGREE_PRECISION;
}
//# sourceMappingURL=Calc.js.map