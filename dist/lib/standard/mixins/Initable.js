import { Obj } from "../../Obj";
export function Initable(Base) {
    return class extends Base {
        init(obj) {
            Obj.setProperties(this, obj);
            return this;
        }
    };
}
//# sourceMappingURL=Initable.js.map