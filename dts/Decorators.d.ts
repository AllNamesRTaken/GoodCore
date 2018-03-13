interface IDebounceOptions {
    leading: boolean;
}
interface IDebouncedFunction extends Function{
    clear?: () => void;
}
export function debounced<S>(duration: number | undefined, options?: Partial<IDebounceOptions>)
