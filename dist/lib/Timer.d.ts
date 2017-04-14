export declare class _Timer {
    _(): _Timer;
    private _last;
    private _start;
    private _time;
    private _hasPerformance;
    readonly Time: number;
    constructor();
    Now(): number;
    Start(): number;
    Stop(): number;
}
export declare var Timer: _Timer;
