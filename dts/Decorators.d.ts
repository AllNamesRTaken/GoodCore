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
