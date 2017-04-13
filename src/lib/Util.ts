import { Obj } from "./Obj"
import { Md5 } from "ts-md5/dist/md5";

export interface IZeroEvent extends Event {
    data: string;
}
export type ObjectWithFunctions<T extends Object | void> = {
    [key: string]: (...args: any[]) => T;
};

export class _Util {
    private _window: Window = null;
    private _int: number = 0;
    public _(win?: Window): _Util {
        return new _Util(win);
    }

    public constructor(win?: Window) {
        this.Init(win);
    }
    public Init(win?: Window) {
        if (win === undefined && typeof (window) !== undefined) {
            win = window;
        }
        if (win !== undefined) {
            this._window = win;
        }
        this.Async = (() => {
            var timeouts: Array<Function> = [];
            var messageName = "zero-timeout-message";

            function setZeroTimeout(fn: Function): void {
                timeouts.push(fn);
                this._window.postMessage(messageName, "*");
            }

            function handleMessage(event: IZeroEvent) {
                if ((((<any>event).source) === undefined || ((<any>event).source) === this._window) && event.data == messageName) {
                    event.stopPropagation();
                    if (timeouts.length > (0 | 0)) {
                        var fn = timeouts.shift();
                        fn();
                    }
                }
            }
            if (this.HasWindow) {
                this._window.addEventListener("message", handleMessage, true);
                return setZeroTimeout;
            } else {
                return setTimeout;
            }
        })();
    }

    public get HasWindow(): boolean {
        return this._window !== null;
    }
    public get HasConsole(): boolean {
        return this.HasWindow && this._window.console !== undefined;
    }
    public ToArray<T>(arr: ArrayLike<T>): Array<T> {
        return Array.prototype.slice.call(arr);
    }
    public IsArray(it: any): boolean {
        return it && (it instanceof Array || typeof (it) === <any>"array");
    }
    public IsElement(target: any): boolean {
        return target !== undefined && target.nodeType === 1 ? true : false;
    }
    public IsFunction(it: any): boolean {
        return Object.prototype.toString.call(it) === "[object Function]"
    }
    public GetFunctionName(fn: Function): string {
        let result: string;
        if (fn.hasOwnProperty("name") !== undefined) {
            result = (<any>fn).name;
        } else {
            let fnString = fn.toString();
            result = fnString.substring(9, fnString.indexOf("("));
        }
        return result;
    }
    public GetFunctionCode(fn: Function): string {
        let result: string;
        let fnString = fn.toString();
        result = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
        return result;
    }
    public NewUUID(): string { // Public Domain/MIT
        var d: number = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r: number = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    public NewInt(): number {
        return this._int++;
    }
    public Debugger(): void {
        debugger;
    }
    public PipeOut(
        log: (...args: Array<any>) => void,
        warn: (...args: Array<any>) => void,
        error: (...args: Array<any>) => void
    ) {
        if (this.HasConsole) {
            this.ProxyFn(
                <any>this._window.console,
                "log",
                function (superfn, ...args: any[]) { superfn(...args); log(...args); }
            );
            this.ProxyFn(
                <any>this._window.console,
                "warn",
                function (superfn, ...args: any[]) { superfn(...args); warn(...args); }
            );
            this.ProxyFn(
                <any>this._window.console,
                "error",
                function (superfn, ...args: any[]) { superfn(...args); error(...args); }
            );
        } else {
            console = {
                log: log,
                warn: warn,
                error: error
            };
            if (!this.HasWindow) {
                window = {
                    console: console
                };
                this._window = <any>window;
            } else {
                window.console = console;
            }
        }
    }
    public Assert(assertion: boolean, message: string, isDebug: boolean = false): boolean {
        let result = true;;
        if (!assertion) {
            if (this.HasConsole) {
                result = false;
                this._window.console.error("Assertion failed: " + message);
            }
            if (isDebug) {
                this.Debugger();
                //throw errorMessage;
            }
        }
        return result;
    }
    public ProxyFn<S extends void, V, T extends (...args: any[]) => S | V, U extends ObjectWithFunctions<S>>(
        that: U,
        fnName: string,
        proxyFn: (fn: (...args: any[]) => S | V, ...args: any[]) => void,
        onPrototype: boolean = false
    ): void {
        let fn = that[fnName];
        let _superFn = function (...args: any[]): S {
            if (args.length !== 0) {
                return fn.apply(that, args);
            } else {
                return fn.call(that);
            }
        }
        if (onPrototype && that.prototype && (<any>that.prototype)[fnName]) {
            (<any>that.prototype)[fnName] = proxyFn.bind(_superFn);
        } else {
            that[fnName] = proxyFn.bind(that, _superFn);
        }
    }
    Md5(str: string): string {
        return <string>Md5.hashStr(str);
    }
    //Like SetTimeout but 0
    public Async: (fn: Function) => void;
}
if (typeof (window) === "undefined") {
    var window = <any>null;
    var console = <any>null;
}
export var Util = new _Util();
