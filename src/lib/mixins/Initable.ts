import type { ICtor, IInitable, ExcludeFunctions } from "../../@types";
import { setProperties } from "../Obj";

export function Initable<S>(_constructor?: ICtor<S>): ICtor<S & IInitable> {
  const ctor = _constructor || (Object as any);
  return class extends ctor implements IInitable {
    public init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this {
      setProperties(this, obj, mapping as any);
      return this;
    }
  } as any;
}
