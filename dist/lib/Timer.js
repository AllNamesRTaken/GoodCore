var _Timer = (function () {
    function _Timer() {
        this._hasPerformance = typeof (performance) !== "undefined";
        this.Start();
    }
    _Timer.prototype._ = function () {
        return new _Timer();
    };
    Object.defineProperty(_Timer.prototype, "Time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    _Timer.prototype.Now = function () {
        if (this._hasPerformance) {
            return performance.now();
        }
        else {
            var hrTime = process.hrtime();
            return hrTime[0] * 1000 + (hrTime[1] / 1e6);
        }
    };
    _Timer.prototype.Start = function () {
        var now = this.Now();
        this._start = this._last = now;
        return this._time = 0;
    };
    _Timer.prototype.Stop = function () {
        var start = this._start;
        var now = this.Now();
        this._last = now;
        return this._time = now - start;
    };
    return _Timer;
}());
export { _Timer };
export var Timer = new _Timer();
//# sourceMappingURL=Timer.js.map