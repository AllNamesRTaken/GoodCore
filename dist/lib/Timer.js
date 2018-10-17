var TimerState = (function () {
    function TimerState() {
    }
    return TimerState;
}());
var Timer = (function () {
    function Timer() {
    }
    Object.defineProperty(Timer, "time", {
        get: function () {
            return TimerState._time;
        },
        enumerable: true,
        configurable: true
    });
    Timer.now = function () {
        if (typeof (performance) !== "undefined") {
            return performance.now();
        }
        else {
            var hrTime = process.hrtime();
            return hrTime[0] * 1000 + (hrTime[1] / 1e6);
        }
    };
    Timer.start = function () {
        var now = Timer.now();
        TimerState._start = TimerState._last = now;
        return TimerState._time = 0;
    };
    Timer.stop = function () {
        var start = TimerState._start;
        var now = Timer.now();
        TimerState._last = now;
        return TimerState._time = now - start;
    };
    return Timer;
}());
export { Timer };
//# sourceMappingURL=Timer.js.map