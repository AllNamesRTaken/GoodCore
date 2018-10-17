export function before(decoration) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            decoration.apply(this, [orgFn.name].concat(args));
            var result = orgFn.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
export function after(decoration) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = orgFn.apply(this, args);
            decoration.apply(this, [orgFn.name].concat(args));
            return result;
        };
        return descriptor;
    };
}
export function around(decoration) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result;
            var callback = function () {
                return result = orgFn.apply(_this, args);
            };
            decoration.apply(this, [callback, orgFn.name].concat(args));
            return result;
        };
        return descriptor;
    };
}
export function provided(condition) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result;
            if (condition.apply(this, [orgFn.name].concat(args))) {
                result = orgFn.apply(this, args);
            }
            return result;
        };
        return descriptor;
    };
}
//# sourceMappingURL=Combinators.js.map