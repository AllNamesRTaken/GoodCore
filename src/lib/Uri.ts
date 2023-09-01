import { Global } from "./Global.js";
export class Uri {
	private _attatched = true
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
	public directory = "";
	public get args(): Indexable<string> {
		return this._args;
	}
	public set args(args: Indexable<string>) {
		this._args = args;
		if (this._a) {
			let search = "?" + Object.keys(args).map((key) => `${key}=${args[key]}`).join("&");
			const url = this.page + search;
			if (typeof(history) !== "undefined") {
				history.replaceState({}, "", url);
			}
			this.init(url);
		}
	}

	constructor(url?: string) {
		this._attatched = !url
		this.init(url);
	}

	public init(url?: string) {
		if (Global.window !== null) {
			this._a = !this._a || this._attatched ? Global.window.document.createElement("a") : this._a;
			this._a.setAttribute("href", url ?? Global.window.location.href);
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
			this.directory = page.indexOf(".") === -1 
				? this.pathName 
				: slashPos === -1 ? "" : this.pathName.substring(0, slashPos);
			this.origin = (this._a as HTMLAnchorElement).origin;
			this.full = this._a.href;
		}
	}
}
