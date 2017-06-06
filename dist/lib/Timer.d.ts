export declare class _Timer {
    private _last;
    private _start;
    private _time;
    private _hasPerformance;
    readonly time: number;
    constructor();
    now(): number;
    start(): number;
    stop(): number;
}
export declare let Timer: _Timer;
