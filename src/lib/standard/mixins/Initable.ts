import { setProperties } from "../../Obj";

export function Initable<T extends Constructor, U>(base: T, inter?: U): T & ICtor<IInitable<T>> {
	return (inter !== undefined) ?
		class extends base implements IInitable<T>{
			public init(obj: U): any {
				setProperties(this, obj);
				return this as any;
			}
		} :
		class extends base implements IInitable<T>{
			public init(obj: Object): any {
				setProperties(this, obj);
				return this as any;
			}
		};
}
