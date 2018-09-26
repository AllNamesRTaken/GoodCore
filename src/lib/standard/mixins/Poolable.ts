import { Pool } from "../Pool";

export function Poolable<T extends { new(...args: any[]): {} }>(constructor: T): T & Constructor<IPoolable> {
	return class extends constructor implements IPoolable {
		constructor(...args: any[]) {
			super(...args);
		}
		public __pool__: Pool<this>;
		public release() {
			this.__pool__.release(this);
		}
		public initPool(pool: Pool<this>): void {
			this.__pool__ = pool;
		}
	};
}
