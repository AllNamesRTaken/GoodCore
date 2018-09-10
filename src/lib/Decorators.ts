import { isNotUndefined } from "./Test";
import { IDebounceOptions, debounce } from "./Util";

export function debounced<S>(duration?: number, options?: Partial<IDebounceOptions>): <S>(target: S, key: string, descriptor: PropertyDescriptor) => {
    configurable: boolean;
    enumerable: boolean | undefined;
    get: () => any;
} {
    return function innerDecorator<S>(target: S, key: string, descriptor: PropertyDescriptor) {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter() {
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: debounce(descriptor.value, duration, options)
                })

                return this[key]
            }
        }
    }
}
export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
	const orgFn = descriptor.value;
	let result: any;
	let first = true;
	descriptor.value = function(...args: any[]) {
		if (first) {
			result = orgFn.apply(this, args);
			first = false;
		}
		return result;
	};
	return descriptor;
}