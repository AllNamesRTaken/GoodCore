export function Poolable(constructor) {
    return class extends constructor {
        constructor(...args) {
            super(...args);
        }
        release() {
            this.__pool__.release(this);
        }
        initPool(pool) {
            this.__pool__ = pool;
        }
    };
}
//# sourceMappingURL=Poolable.js.map