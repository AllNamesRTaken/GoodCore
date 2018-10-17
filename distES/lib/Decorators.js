import { isNotUndefined, isNotNullOrUndefined } from "./Test";
import { debounce } from "./Util";
export function debounced(duration, options) {
    return function innerDecorator(target, key, descriptor) {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter() {
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: debounce(descriptor.value, duration, options)
                });
                return this[key];
            }
        };
    };
}
export function once(target, propertyKey, descriptor) {
    const orgFn = descriptor.value;
    let result;
    let first = true;
    descriptor.value = function (...args) {
        if (first) {
            result = orgFn.apply(this, args);
            first = false;
        }
        return result;
    };
    return descriptor;
}
export function deprecated(instead, message) {
    return function (target, propertyKey, descriptor) {
        const orgFn = descriptor.value;
        let localMessage = isNotUndefined(message) ? message.replace("{name}", propertyKey).replace("{instead}", instead || "") :
            "Function {name} is deprecated".replace("{name}", propertyKey) +
                (isNotNullOrUndefined(instead) ? " please use {instead} instead".replace("{instead}", instead) : "");
        let warned = false;
        function warn() {
            if (!warned) {
                console.warn(localMessage);
            }
        }
        descriptor.value = function (...args) {
            warn();
            return orgFn.apply(this, args);
        };
        return descriptor;
    };
}
//# sourceMappingURL=Decorators.js.map