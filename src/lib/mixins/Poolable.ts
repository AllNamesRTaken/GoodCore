import type { ICtor, IPoolable } from "../../@types/index.js";
import { Pool } from "../standard/Pool.js";

export function Poolable<S>(_constructor?: ICtor<S>): ICtor<S & IPoolable> {
  const ctor = _constructor || (Object as any);
  return class extends ctor implements IPoolable {
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
  } as any;
}
