export class _Uri {
	public _(win: Window): _Uri {
		return new _Uri(win);
	}
	private _window: Window = null;
	private _a: HTMLAnchorElement = null;
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
			this.origin = (this._a as any).origin;
			this.full = this._a.href;
		}
	}
}

export let Uri = new _Uri(window);
