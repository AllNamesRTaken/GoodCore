export function hasWindow(): boolean;
export class Env {
	public static useNative?: boolean;
	public static isOpera(): boolean;
	public static isFirefox(): boolean;
	public static isSafari(): boolean;
	public static isIE(): boolean;
	public static isEdge(): boolean;
	public static isChrome(): boolean;
	public static isBlink(): boolean;
    public static hasFastNativeArrays(): boolean;
}
export function hasConsole(): boolean;
export function isObject(it: any): boolean;
export function isArray(it: any): boolean;
export function isElement(target: any): boolean;
export function isFunction(it: any): boolean;
export function isNumber(x: any): boolean;
export function isInt(x: any): boolean;
export function isString(x: any): boolean;
export function areNullOrUndefined(...args: any[]): boolean;
export function areNotNullOrUndefined(...args: any[]): boolean;
export function isNullOrUndefined(arg: any): boolean;
export function isNotNullOrUndefined(arg: any): boolean;
export function areUndefined(...args: any[]): boolean;
export function areNotUndefined(...args: any[]): boolean;
export function isNull(arg: any): boolean;
export function isNotNull(arg: any): boolean;
export function isUndefined(arg: any): boolean;
export function isNotUndefined(arg: any): boolean;

