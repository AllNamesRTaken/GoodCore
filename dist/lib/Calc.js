"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _Calc = (function () {
    function _Calc() {
    }
    _Calc.prototype._ = function () {
        return new _Calc();
    };
    _Calc.prototype.Sign = function (x) {
        return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };
    _Calc.prototype.RotationDeg = function (rotation) {
        var rot = (rotation * _Calc.ROTATION_DEGREE_PRECISION) | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return _Calc.ROTATION_LOOKUP[rot];
    };
    _Calc.prototype.RotationRad = function (rotation) {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        return this.RotationDeg(rot / _Calc.ROTATION_DEGREE_PRECISION);
    };
    _Calc.prototype.ClosestRadianRotation = function (rotation) {
        var rot = rotation * _Calc.DEGREE_FACTOR * _Calc.ROTATION_DEGREE_PRECISION | 0;
        while (rot < 0) {
            rot += _Calc.DEG360;
        }
        while (rot >= _Calc.DEG360) {
            rot -= _Calc.DEG360;
        }
        return rot * _Calc.RADIAN_FACTOR / _Calc.ROTATION_DEGREE_PRECISION;
    };
    return _Calc;
}());
_Calc.ROTATION_DEGREE_PRECISION = 1;
_Calc.RADIAN_FACTOR = (1 / 360) * (2 * Math.PI);
_Calc.DEGREE_FACTOR = (1 / (2 * Math.PI) * 360);
_Calc.DEG360 = 360 * _Calc.ROTATION_DEGREE_PRECISION;
_Calc.ROTATION_LOOKUP = (function () {
    var lookup = [];
    for (var i = 0; i < 360 * _Calc.ROTATION_DEGREE_PRECISION; i++) {
        lookup.push([Math.cos(i * _Calc.RADIAN_FACTOR), Math.sin(i * _Calc.RADIAN_FACTOR)]);
    }
    return lookup;
})();
exports.default = _Calc;
exports.Calc = new _Calc();
//# sourceMappingURL=Calc.js.map