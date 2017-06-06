export class _Timer {
	private _last: number;
	private _start: number;
	private _time: number;

	private _hasPerformance = typeof(performance) !== "undefined";
	public get time(): number {
		return this._time;
	}
	constructor() {
		this.start();
	}
	public now(): number {
		if (this._hasPerformance) {
			return performance.now();
		} else {
			const hrTime = process.hrtime();
			return hrTime[0] * 1000 + (hrTime[1] / 1e6);
		}
	}
	public start(): number {
		const now = this.now();
		this._start = this._last = now;
		return this._time = 0;
	}
	public stop(): number {
		const start = this._start;
		const now = this.now();
		this._last = now;
		return this._time = now - start;
	}
}

export let Timer = new _Timer();
