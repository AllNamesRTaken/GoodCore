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
    var orgFn = descriptor.value;
    var result;
    var first = true;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
        var orgFn = descriptor.value;
        var localMessage = isNotUndefined(message) ? message.replace("{name}", propertyKey).replace("{instead}", instead || "") :
            "Function {name} is deprecated".replace("{name}", propertyKey) +
                (isNotNullOrUndefined(instead) ? " please use {instead} instead".replace("{instead}", instead) : "");
        var warned = false;
        function warn() {
            if (!warned) {
                console.warn(localMessage);
            }
        }
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            warn();
            return orgFn.apply(this, args);
        };
        return descriptor;
    };
}
//# sourceMappingURL=Decorators.js.map