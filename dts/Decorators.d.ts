interface IDebounceOptions {
    leading: boolean;
}
export interface IDebouncedFunction<T> {
    (...args: any[]): T
    resetTimer?: () => void;
}
export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
    configurable: boolean;
    enumerable: boolean | undefined;
    get: () => any;
};
export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export function deprecated<S>(instead?: string, message?: string):
    (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function asserts<S>(assertFn: Function, result?: any):
    (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function before<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function after<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function provided<S>(condition: (name: string, ...args: any[]) => boolean): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export let async: {
    <S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
    before?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    after?<S>(decoration: (name: string, ...args: any[]) => Promise<any>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    provided?<S>(async_predicate: (...args: any[]) => Promise<boolean>): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
};
