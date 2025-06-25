import { Global } from "./Global";

export function hasWindow(): boolean {
  return Global.window !== null;
}

export class Env {
  public static useNative?: boolean = undefined;
  private static _isNode: boolean;
  public static isNode(): boolean {
    this._isNode =
      this._isNode ??
      (!hasWindow() ||
        (typeof module !== "undefined" && module.exports !== undefined));
    return this._isNode;
  }
  private static _isOpera: boolean;
  public static isOpera(): boolean {
    this._isOpera =
      this._isOpera ??
      (hasWindow() &&
        Global.window!.navigator.userAgent.toLowerCase().match(
          /(?:^opera.+?version|opr)\/(\d+)/,
        ) !== null);
    return this._isOpera;
  }
  private static _isFirefox: boolean;
  public static isFirefox(): boolean {
    this._isFirefox =
      this._isFirefox ??
      (hasWindow() &&
        Global.window!.navigator.userAgent.toLowerCase().match(
          /(?:firefox|fxios)\/(\d+)/,
        ) !== null);
    return this._isFirefox;
  }
  private static _isSafari: boolean;
  public static isSafari(): boolean {
    this._isSafari =
      this._isSafari ??
      (hasWindow() &&
        Global.window!.navigator.userAgent.toLowerCase().match(
          /version\/(\d+).+?safari/,
        ) !== null);
    return this._isSafari;
  }
  private static _isIE: boolean;
  public static isIE(): boolean {
    this._isIE =
      this._isIE ??
      (hasWindow() &&
        Global.window!.navigator.userAgent.toLowerCase().match(
          /(?:msie |trident.+?; rv:)(\d+)/,
        ) !== null);
    return this._isIE;
  }
  private static _isEdge: boolean;
  public static isEdge(): boolean {
    this._isEdge =
      this._isEdge ||
      (hasWindow() &&
        Global.window!.navigator.userAgent.toLowerCase().match(
          /edge\/(\d+)/,
        ) !== null);
    return this._isEdge;
  }
  private static _isChrome: boolean;
  public static isChrome(): boolean {
    this._isChrome =
      this._isChrome ??
      (hasWindow() &&
        (/google inc/.test(Global.window!.navigator.vendor.toLowerCase())
          ? Global.window!.navigator.userAgent.toLowerCase().match(
              /(?:chrome|crios)\/(\d+)/,
            )
          : null) !== null &&
        !this.isOpera());
    return this._isChrome;
  }
  private static _isBlink: boolean;
  public static isBlink(): boolean {
    this._isBlink =
      this._isBlink ??
      (hasWindow() &&
        (this.isChrome() || this.isOpera()) &&
        !!(Global.window as any).CSS);
    return this._isBlink;
  }
}

export function hasConsole(): boolean {
  return (
    (Global.global as any).console !== undefined ||
    typeof console === "function"
  );
}
export function isObject(it: any): boolean {
  return it !== null && typeof it === "object";
}
export function isArray(it: any): boolean {
  return Array.isArray
    ? Array.isArray(it)
    : Object.prototype.toString.call(it) === "[object Array]";
}
export function isElement(target: any): boolean {
  return target !== undefined &&
    target !== null &&
    (target as Element).nodeType === 1
    ? true
    : false;
}
export function isFunction(it: any): boolean {
  return Object.prototype.toString.call(it) === "[object Function]";
}
export function isNumber(x: any): boolean {
  return x === +(x as number);
}
export function isInt(x: any): boolean {
  return isNumber(x) && (x as number) === ((x as number) | 0);
}
export function isString(x: any): boolean {
  return isNotNullOrUndefined(x) && (x as string).constructor === String;
}
export function areNullOrUndefined(...args: any[]): boolean {
  const len = args.length;
  let i = -1;
  let a: any;
  let result = false;
  while (!result && ++i < len) {
    a = args[i];
    result = a === undefined || a === null;
  }
  return result;
}
export function areNotNullOrUndefined(...args: any[]): boolean {
  return !areNullOrUndefined.apply(
    this,
    Array.prototype.slice.apply(arguments),
  );
}
export function isNull(arg: any): boolean {
  return arg === null;
}
export function isNotNull(arg: any): boolean {
  return arg !== null;
}
export function isNullOrUndefined(arg: any): boolean {
  return arg === undefined || arg === null;
}
export function isNotNullOrUndefined(arg: any): boolean {
  return !isNullOrUndefined(arg);
}
export function areUndefined(...args: any[]): boolean {
  const len = args.length;
  let i = -1;
  let a: any;
  let result = false;
  while (!result && ++i < len) {
    a = args[i];
    result = a === undefined;
  }
  return result;
}
export function areNotUndefined(...args: any[]): boolean {
  return !areUndefined.apply(this, Array.prototype.slice.apply(arguments));
}
export function isUndefined(arg: any): boolean {
  return arg === undefined;
}
export function isNotUndefined(arg: any): boolean {
  return !isUndefined(arg);
}
