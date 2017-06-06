var _Timer = (function () {
    function _Timer() {
        this._hasPerformance = typeof (performance) !== "undefined";
        this.start();
    }
    Object.defineProperty(_Timer.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    _Timer.prototype.now = function () {
        if (this._hasPerformance) {
            return performance.now();
        }
        else {
            var hrTime = process.hrtime();
            return hrTime[0] * 1000 + (hrTime[1] / 1e6);
        }
    };
    _Timer.prototype.start = function () {
        var now = this.now();
        this._start = this._last = now;
        return this._time = 0;
    };
    _Timer.prototype.stop = function () {
        var start = this._start;
        var now = this.now();
        this._last = now;
        return this._time = now - start;
    };
    return _Timer;
}());
export { _Timer };
export var Timer = new _Timer();
//# sourceMappingURL=Timer.js.map