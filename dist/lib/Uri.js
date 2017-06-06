import { Global } from "./Global";
var _Uri = (function () {
    function _Uri() {
        this._a = null;
        this.hash = "";
        this.pathName = "";
        this.port = "";
        this.hostName = "";
        this.protocol = "";
        this.origin = "";
        this.full = "";
        this.args = {};
        this.init();
    }
    _Uri.prototype.init = function () {
        if (Global.window !== null) {
            this._a = Global.window.document.createElement("a");
            this._a.setAttribute("href", Global.window.location.href);
            var args_1 = this.args;
            this._a.search.substring(1).split("&").forEach(function (arg) {
                var p = arg.split("=");
                args_1[p[0]] = p[1];
            });
            this.hash = this._a.hash;
            this.pathName = this._a.pathname;
            this.port = this._a.port;
            this.hostName = this._a.hostname;
            this.protocol = this._a.protocol;
            this.origin = this._a.origin;
            this.full = this._a.href;
        }
    };
    return _Uri;
}());
export { _Uri };
export var Uri = new _Uri();
//# sourceMappingURL=Uri.js.map