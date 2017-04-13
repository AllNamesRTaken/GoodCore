export class _Uri {
	public _(win: Window): _Uri {
		return new _Uri(win);
	}
	private _window: Window = window;
	private _a: HTMLAnchorElement = document.createElement("a");

	public hash = "";
	public pathName = "";
	public port = "";
	public hostName = "";
	public protocol = "";
	public origin = "";
	public full = "";
	public args: any = {};

	constructor(win: Window) {
		this.Init(win);
	}

	public Init(win: Window) {
		if (win !== undefined) {
			this._window = win;
			this._a = this._window.document.createElement("a");
			this._a.setAttribute("href", this._window.location.href);
			let args = this.args;
			this._a.search.substring(1).split("&").forEach(arg => {
				let p = arg.split("=");
				args[p[0]] = p[1];
			});
			this.hash = this._a.hash;
			this.pathName = this._a.pathname;
			this.port = this._a.port;
			this.hostName = this._a.hostname;
			this.protocol = this._a.protocol;
			this.origin = (<any>this._a).origin;
			this.full = this._a.href;
		}
	}
}

export var Uri = new _Uri(window);
