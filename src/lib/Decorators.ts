import { isNotUndefined } from "./Test";
import { IDebounceOptions, debounce } from "./Util";

export function debounced<S>(duration?: number, options?: Partial<IDebounceOptions>) {
    return function innerDecorator<S>(target: S, key: string, descriptor: PropertyDescriptor) {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter() {
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: debounce(descriptor.value, duration)
                })

                return this[key]
            }
        }
    }
}
