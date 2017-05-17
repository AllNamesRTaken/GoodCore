var _Uri = (function () {
    function _Uri(win) {
        this._window = null;
        this._a = null;
        this.hash = "";
        this.pathName = "";
        this.port = "";
        this.hostName = "";
        this.protocol = "";
        this.origin = "";
        this.full = "";
        this.args = {};
        this.Init(win);
    }
    _Uri.prototype._ = function (win) {
        return new _Uri(win);
    };
    _Uri.prototype.Init = function (win) {
        if (win !== undefined) {
            this._window = win;
            this._a = this._window.document.createElement("a");
            this._a.setAttribute("href", this._window.location.href);
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
export var Uri = new _Uri(window);
//# sourceMappingURL=Uri.js.map