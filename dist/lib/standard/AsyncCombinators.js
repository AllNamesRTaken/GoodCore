export var async = function async(target, propertyKey, descriptor) {
    var orgFn = descriptor.value;
    descriptor.value = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = new Promise(function (resolve, reject) {
            var value;
            try {
                value = orgFn.apply(_this, args);
                resolve(value);
            }
            catch (err) {
                reject(err);
            }
        });
        return result;
    };
    return descriptor;
};
async.before = function (decoration) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = new Promise(function (resolve, reject) {
                var callback = function () {
                    orgFn.apply(_this, args)
                        .then(function (value) {
                        resolve(value);
                    })
                        .catch(function (reason) {
                        reject(reason);
                    });
                };
                decoration.apply(_this, [orgFn.name].concat(args))
                    .then(function (value) {
                    callback();
                })
                    .catch(function (reason) {
                    callback();
                });
            });
            return result;
        };
        return descriptor;
    };
};
async.after = function (decoration) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = new Promise(function (resolve, reject) {
                var callback = function (value, reason) {
                    decoration.apply(_this, [value, reason, orgFn.name].concat(args))
                        .then(function (value) {
                        resolve(value);
                    })
                        .catch(function (reason) {
                        reject(reason);
                    });
                };
                orgFn.apply(_this, args)
                    .then(function (value) {
                    callback(value, undefined);
                })
                    .catch(function (reason) {
                    callback(undefined, reason);
                });
            });
            return result;
        };
        return descriptor;
    };
};
async.provided = function (async_predicate) {
    return function (target, propertyKey, descriptor) {
        var orgFn = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = new Promise(function (resolve, reject) {
                var callback = function () {
                    orgFn.apply(_this, args)
                        .then(function (value) {
                        resolve(value);
                    })
                        .catch(function (reason) {
                        reject(reason);
                    });
                };
                async_predicate.apply(_this, [orgFn.name].concat(args))
                    .then(function (value) {
                    if (value) {
                        callback();
                    }
                    else {
                        reject(false);
                    }
                })
                    .catch(function (reason) {
                    reject(reason);
                });
            });
            return result;
        };
        return descriptor;
    };
};
//# sourceMappingURL=AsyncCombinators.js.map