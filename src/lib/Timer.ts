export class _Timer {
	public _(): _Timer {
		return new _Timer();
	}
	private _last: number;
	private _start: number;
	private _time: number;

	private _hasPerformance = typeof(performance) !== "undefined";
	public get Time(): number {
		return this._time;
	}
	constructor() {
		this.Start();
	}
	public Now(): number {
		if (this._hasPerformance) {
			return performance.now();
		} else {
			const hrTime = process.hrtime();
			return hrTime[0] * 1000 + (hrTime[1] / 1e6);
		}
	}
	public Start(): number {
		const now = this.Now();
		this._start = this._last = now;
		return this._time = 0;
	}
	public Stop(): number {
		const start = this._start;
		const now = this.Now();
		this._last = now;
		return this._time = now - start;
	}
}

export let Timer = new _Timer();
