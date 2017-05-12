import Pool from "../Pool";
export default function Poolable<T extends Constructor>(Base: T): T & ICtor<IPoolable> {
	return class extends Base implements IPoolable {
		public __pool__: Pool<this>;
		public Release() {
			this.__pool__.Release(this);
		}
		public InitPool(pool: Pool<this>): void {
			this.__pool__ = pool;
		}
		constructor(...args: any[]) {
			super(...args);
		}
	};
}
