import type { ICtor, IInitable, ExcludeFunctions } from "../../@types/index.js";
import { setProperties } from "../Obj.js";

export function Initable<S>(_constructor?: ICtor<S>): ICtor<S & IInitable> {
  const ctor = _constructor || (Object as any);
  return class extends ctor implements IInitable {
    public init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this {
      setProperties(this, obj, mapping as any);
      return this;
    }
  } as any;
}
