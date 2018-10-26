import { setProperties } from "../Obj";

export function Initable<T extends { new(...args: any[]): {} }>(constructor: T): T & Constructor<IInitable<T>> {
	return class extends constructor implements IInitable<T> {
		public init(obj: Partial<T> | any, mapping?: any): this {
			setProperties(this, obj, mapping);
			return this;
		}
	};
}
