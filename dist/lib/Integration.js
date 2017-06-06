import { Global } from "./Global";
import * as Good from "./index";
export function integrate(alias) {
    var stringAlias = false;
    var objectAlias = false;
    if (typeof (alias) === "string") {
        Global.window[alias] = {};
        stringAlias = true;
    }
    for (var stuff in Good) {
        if (stringAlias) {
            Global.window[alias][stuff] = Good[stuff];
        }
        else if (objectAlias) {
            alias[stuff] = Good[stuff];
        }
        else {
            Global.window[stuff] = Good[stuff];
        }
    }
}
//# sourceMappingURL=Integration.js.map