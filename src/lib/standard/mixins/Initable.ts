import { Obj } from "../../Obj"

export default function Initable<T extends Constructor>(Base: T): T & ICtor<IInitable<T>> {
    return class extends Base implements IInitable<T>{
        Init(obj: Object): any {
            Obj.SetProperties(this, obj);
            return <any>this;
        }
    }
}
