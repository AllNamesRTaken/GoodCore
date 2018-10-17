export function before(decoration) {
    return function (target, propertyKey, descriptor) {
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            decoration.apply(this, [orgFn.name].concat(args));
            const result = orgFn.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
export function after(decoration) {
    return function (target, propertyKey, descriptor) {
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            const result = orgFn.apply(this, args);
            decoration.apply(this, [orgFn.name].concat(args));
            return result;
        };
        return descriptor;
    };
}
export function around(decoration) {
    return function (target, propertyKey, descriptor) {
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            let result;
            let callback = () => result = orgFn.apply(this, args);
            decoration.apply(this, [callback, orgFn.name].concat(args));
            return result;
        };
        return descriptor;
    };
}
export function provided(condition) {
    return function (target, propertyKey, descriptor) {
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            let result;
            if (condition.apply(this, [orgFn.name].concat(args))) {
                result = orgFn.apply(this, args);
            }
            return result;
        };
        return descriptor;
    };
}
//# sourceMappingURL=Combinators.js.map