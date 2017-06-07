import { Global } from "./Global";
export class Uri {
    constructor() {
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
    init() {
        if (Global.window !== null) {
            this._a = Global.window.document.createElement("a");
            this._a.setAttribute("href", Global.window.location.href);
            const args = this.args;
            this._a.search.substring(1).split("&").forEach((arg) => {
                const p = arg.split("=");
                args[p[0]] = p[1];
            });
            this.hash = this._a.hash;
            this.pathName = this._a.pathname;
            this.port = this._a.port;
            this.hostName = this._a.hostname;
            this.protocol = this._a.protocol;
            this.origin = this._a.origin;
            this.full = this._a.href;
        }
    }
}
//# sourceMappingURL=Uri.js.map