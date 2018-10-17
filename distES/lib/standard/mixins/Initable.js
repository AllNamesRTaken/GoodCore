import { setProperties } from "../../Obj";
export function Initable(constructor) {
    return class extends constructor {
        init(obj, mapping) {
            setProperties(this, obj, mapping);
            return this;
        }
    };
}
//# sourceMappingURL=Initable.js.map