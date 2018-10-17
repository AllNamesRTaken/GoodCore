export let async = function async(target, propertyKey, descriptor) {
    const orgFn = descriptor.value;
    descriptor.value = function (...args) {
        let result = new Promise((resolve, reject) => {
            let value;
            try {
                value = orgFn.apply(this, args);
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
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            let result = new Promise((resolve, reject) => {
                const callback = () => {
                    orgFn.apply(this, args)
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((reason) => {
                        reject(reason);
                    });
                };
                decoration.apply(this, [orgFn.name].concat(args))
                    .then((value) => {
                    callback();
                })
                    .catch((reason) => {
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
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            let result = new Promise((resolve, reject) => {
                const callback = (value, reason) => {
                    decoration.apply(this, [value, reason, orgFn.name].concat(args))
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((reason) => {
                        reject(reason);
                    });
                };
                orgFn.apply(this, args)
                    .then((value) => {
                    callback(value, undefined);
                })
                    .catch((reason) => {
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
        const orgFn = descriptor.value;
        descriptor.value = function (...args) {
            let result = new Promise((resolve, reject) => {
                const callback = () => {
                    orgFn.apply(this, args)
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((reason) => {
                        reject(reason);
                    });
                };
                async_predicate.apply(this, [orgFn.name].concat(args))
                    .then((value) => {
                    if (value) {
                        callback();
                    }
                    else {
                        reject(false);
                    }
                })
                    .catch((reason) => {
                    reject(reason);
                });
            });
            return result;
        };
        return descriptor;
    };
};
//# sourceMappingURL=AsyncCombinators.js.map