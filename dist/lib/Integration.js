import { Global } from "./Global";
import * as Good from "./index";
export function Integrate(alias) {
    if (alias !== undefined) {
        Global.window[alias] = {};
    }
    for (var stuff in Good) {
        if (alias !== undefined) {
            Global.window[alias][stuff] = Good[stuff];
        }
        else {
            Global.window[stuff] = Good[stuff];
        }
    }
}
//# sourceMappingURL=Integration.js.map