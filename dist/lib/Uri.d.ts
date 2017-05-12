export declare class _Uri {
    _(win: Window): _Uri;
    private _window;
    private _a;
    hash: string;
    pathName: string;
    port: string;
    hostName: string;
    protocol: string;
    origin: string;
    full: string;
    args: any;
    constructor(win: Window);
    Init(win: Window): void;
}
export declare let Uri: _Uri;
