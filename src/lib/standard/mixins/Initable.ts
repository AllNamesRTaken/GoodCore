import { Obj } from "../../Obj";

export function Initable<T extends Constructor>(Base: T): T & ICtor<IInitable<T>> {
	return class extends Base implements IInitable<T>{
		public init(obj: Object): any {
			Obj.setProperties(this, obj);
			return this as any;
		}
	};
}
