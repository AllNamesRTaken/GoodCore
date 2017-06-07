class TimerState {
}
TimerState._hasPerformance = typeof (performance) !== "undefined";
export class Timer {
    static get time() {
        return TimerState._time;
    }
    constructor() {
        Timer.start();
    }
    static now() {
        if (TimerState._hasPerformance) {
            return performance.now();
        }
        else {
            const hrTime = process.hrtime();
            return hrTime[0] * 1000 + (hrTime[1] / 1e6);
        }
    }
    static start() {
        const now = Timer.now();
        TimerState._start = TimerState._last = now;
        return TimerState._time = 0;
    }
    static stop() {
        const start = TimerState._start;
        const now = Timer.now();
        TimerState._last = now;
        return TimerState._time = now - start;
    }
}
//# sourceMappingURL=Timer.js.map