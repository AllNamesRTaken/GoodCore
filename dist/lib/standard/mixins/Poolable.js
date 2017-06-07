export function Poolable(Base) {
    return class extends Base {
        release() {
            this.__pool__.release(this);
        }
        initPool(pool) {
            this.__pool__ = pool;
        }
        constructor(...args) {
            super(...args);
        }
    };
}
//# sourceMappingURL=Poolable.js.map