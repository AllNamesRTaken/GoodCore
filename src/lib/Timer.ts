class TimerState {
	public static _last: number;
	public static _start: number;
	public static _time: number;

	public static _hasPerformance = typeof(performance) !== "undefined";

}
export class Timer {
	public static get time(): number {
		return TimerState._time;
	}
	public static now(): number {
		if (TimerState._hasPerformance) {
			return performance.now();
		} else {
			const hrTime = process.hrtime();
			return hrTime[0] * 1000 + (hrTime[1] / 1e6);
		}
	}
	public static start(): number {
		const now = Timer.now();
		TimerState._start = TimerState._last = now;
		return TimerState._time = 0;
	}
	public static stop(): number {
		const start = TimerState._start;
		const now = Timer.now();
		TimerState._last = now;
		return TimerState._time = now - start;
	}
}
