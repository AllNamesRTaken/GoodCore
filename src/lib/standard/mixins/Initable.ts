import { isNotUndefined, setProperties } from "../../Obj";

export function Initable<T>(base: Constructor<T>): Constructor<T> & Constructor<IInitable<T>> {
	return class extends (base as Constructor<{}>) implements IInitable<T>{
			public init<U>(obj: U, mapping?: any) {
				setProperties(this, obj, mapping);
				return this as any;
			}
		} as any;
}
