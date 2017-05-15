"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Good = require("./index");
function Integrate(alias, win) {
    if (win === void 0) { win = window; }
    if (alias !== undefined) {
        win[alias] = {};
    }
    for (var stuff in Good) {
        if (Good[stuff]._) {
            if (alias !== undefined) {
                win[alias][stuff] = Good[stuff]._;
            }
            else {
                win[stuff] = Good[stuff]._;
            }
        }
        else {
            if (alias !== undefined) {
                win[alias][stuff] = Good[stuff];
            }
            else {
                win[stuff] = Good[stuff];
            }
        }
    }
}
exports.Integrate = Integrate;
//# sourceMappingURL=Integration.js.map