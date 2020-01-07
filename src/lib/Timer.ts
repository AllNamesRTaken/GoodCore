interface ITimerState {
	_last: number;
	_start: number;
	_time: number;
}
export class Timer {
	private static _staticTimer = new Timer();
	private _state: ITimerState = {_last: 0, _start: 0, _time: 0};
	public static get time(): number {
		return this._staticTimer._state._time;
	}
	public get time(): number {
		return this._state._time;
	}
	public static now(): number {
		return this._staticTimer.now();
	}
	public now(): number {
		if (typeof(performance) !== "undefined") {
			return performance.now();
		} else {
			const hrTime = process.hrtime();
			return hrTime[0] * 1000 + (hrTime[1] / 1e6);
		}
	}
	public static start(): number {
		return this._staticTimer.start();
	}
	public start(): number {
		const now = this.now();
		this._state._start = this._state._last = now;
		this._state._time = 0;
		return now;
	}
	public static stop(): number {
		return this._staticTimer.stop();
	}
	public stop(): number {
		const now = this.now();
		this._state._last = now;
		return this._state._time = now - this._state._start;
	}
}
