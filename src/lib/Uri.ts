import { Global } from "./Global";
export class Uri {
	private _a: HTMLAnchorElement | null = null;
	private _args: Indexable<string> = {};
	public hash = "";
	public pathName = "";
	public page = "";
	public port = "";
	public hostName = "";
	public protocol = "";
	public origin = "";
	public full = "";
	public get args(): Indexable<string> {
		return this._args;
	}
	public set args(args: Indexable<string>) {
		this._args = args;
		if (this._a) {
			let search = "?" + Object.keys(args).map((key) => `${key}=${args[key]}`).join("&");
			if (typeof(history) !== "undefined") {
				history.replaceState({}, "", this.page + search);
				this.init();
			}
		}
	}

	constructor() {
		this.init();
	}

	public init() {
		if (Global.window !== null) {
			this._a = Global.window.document.createElement("a");
			this._a.setAttribute("href", Global.window.location.href);
			const args = this.args;
			let search = this._a.search.trim();
			if (search.length > 1) {
				search
				.substring(1)
				.split("&")
				.forEach((arg) => {
					const p = arg.split("=");
					args[p[0]] = p[1];
				});
			}
			this.hash = this._a.hash;
			this.pathName = this._a.pathname;
			this.port = this._a.port;
			this.hostName = this._a.hostname;
			this.protocol = this._a.protocol;
			let slashPos = this.pathName.lastIndexOf("/");
			let page = slashPos === -1 ? "" : this.pathName.substring(slashPos + 1);
			this.page = page.indexOf(".") !== -1 ? page : "";
			this.origin = (this._a as HTMLAnchorElement).origin;
			this.full = this._a.href;
		}
	}
}
