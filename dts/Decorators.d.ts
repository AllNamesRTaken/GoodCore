interface IDebounceOptions {
    leading: boolean;
}
interface IDebouncedFunction extends Function {
    clear?: () => void;
}
export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
    configurable: boolean;
    enumerable: boolean | undefined;
    get: () => any;
};
