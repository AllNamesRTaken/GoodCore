import { Obj } from "../../Obj";

export function Initable<T extends Constructor>(Base: T): T & ICtor<IInitable<T>> {
	return class extends Base implements IInitable<T>{
		public Init(obj: Object): any {
			Obj.SetProperties(this, obj);
			return this as any;
		}
	};
}
