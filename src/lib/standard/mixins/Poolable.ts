import { Pool } from "../Pool";
export function Poolable<T extends Constructor>(Base: T): T & ICtor<IPoolable> {
	return class extends Base implements IPoolable {
		public __pool__: Pool<this>;
		public release() {
			this.__pool__.release(this);
		}
		public initPool(pool: Pool<this>): void {
			this.__pool__ = pool;
		}
		constructor(...args: any[]) {
			super(...args);
		}
	};
}
