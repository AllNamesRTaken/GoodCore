import { setProperties } from "../../Obj";
export function Initable(base, inter) {
    return (inter !== undefined) ?
        class extends base {
            init(obj) {
                setProperties(this, obj);
                return this;
            }
        } :
        class extends base {
            init(obj) {
                setProperties(this, obj);
                return this;
            }
        };
}
//# sourceMappingURL=Initable.js.map