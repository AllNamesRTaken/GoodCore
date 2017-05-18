import { Global } from "./Global";
export class _Uri {
	private _a: HTMLAnchorElement = null;
	public hash = "";
	public pathName = "";
	public port = "";
	public hostName = "";
	public protocol = "";
	public origin = "";
	public full = "";
	public args: any = {};

	constructor() {
		this.Init();
	}

	public Init() {
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
		this.origin = (this._a as any).origin;
		this.full = this._a.href;
	}
}

export let Uri = new _Uri();
