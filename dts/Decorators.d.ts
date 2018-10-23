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
