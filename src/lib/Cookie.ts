import { find } from "./Arr";
import { getDate, assert } from "./Util";
import { transform } from "./Obj";

export function getCookie(key: string) {
    let cookie = find(document.cookie.split(";").map((cookie) => cookie.trim()), (cookie) => cookie.indexOf(`${key}=`) === 0);
    return cookie ? cookie.trim().split("=")[1] : undefined;
}
export function setCookie(key: string, value: string, expires: Date, path?: string) {
    document.cookie = `${key}=${value}; expires=${expires.toUTCString()}${(path ? "; path=" + path : "")}`;
}
export function removeCookie(key: string, path?: string) {
    document.cookie = `${key}=${"null"}; expires=${(new Date(0)).toUTCString()}${(path ? "; path=" + path : "")}`;
}
export function parseAllCookies(): Indexable<string> {
    return document.cookie.split(";")
        .map((cookie) => cookie.trim())
        .reduce((p, c, i) => {
            let [key, value] = c.split("=");
            p[key] = value;
            return p;
        }, {} as Indexable<string>)
}
export function getMonster<T>(options: Partial<ICookieMonsterOptions<T>>): ICookieMonster<T> {
    return new CookieMonster(options);
}
interface ICookieMonsterOptions<T extends Indexable<any>> {
    name: string,
    defaults: T;
    retainTime: string;
    path: string;
    localStorage: boolean;
}
interface ICookieMonster<T extends Indexable<any>, K extends keyof T = keyof T> {
    setCookie<S extends K>(key: S, value: T[S]): void,
    getCookie<S extends K>(key: S): T[S],
    eatCookie(key: K): void,
    removeCookies(): void,
}
type InternalCookie<T> = T & {
};
class CookieMonster<T extends Indexable<any>, K extends keyof T = keyof T> implements ICookieMonster<T, K> {
    private _defaultOptions: ICookieMonsterOptions<T> = {
        name: "",
        defaults: {} as T,
        retainTime: "7d",
        path: "",
        localStorage: false,
    }
    private _defaultsKeyIndexes: Indexable<number> = {};
    private _options: ICookieMonsterOptions<T> = this._defaultOptions;
    private _cookies: Partial<InternalCookie<T>> = {};
    constructor(options?: Partial<ICookieMonsterOptions<T>>) {
        this._options = {...this._defaultOptions, ... options};
        assert(this._options.name !== "", "The Cookie Monster must have a name");
        assert(Object.keys(this._options.defaults).length > 0, "Empty defaults object makes no sense");
        this._defaultsKeyIndexes = Object.keys(this._options.defaults).reduce((p, c, i) => (p[c] = i, p), {} as Indexable<number>);
        this._cookies = {...this._options.defaults };
        this.openJar();
    }
    public setCookie<S extends K>(key: S, value: T[S]): void {
        this._cookies[key] = value;
        this.saveCookies();
    }
    public getCookie<S extends K>(key: S): T[S] {
        return this._cookies[key]!;
    }
    public eatCookie(key: K): void {
        this._cookies[key] = this._options.defaults[key];
        this.saveCookies()
    }
    public removeCookies() {
        if (this._options.localStorage) {
            localStorage.removeItem(this._options.name);
        } else {
            removeCookie(this._options.name, this._options.path);
        }
    }
    private saveCookies() {
        if (this._options.localStorage) {
            localStorage.setItem(this._options.name, this.makeRecepie(this._cookies))
        } else {
            let expires: Date = getDate(this._options.retainTime);
            setCookie(this._options.name, this.makeRecepie(this._cookies), expires, this._options.path);
        }
    }
    private makeRecepie(cookie: Partial<InternalCookie<T>>): string {
        var essentials = transform<Partial<T>>(cookie, (acc, value, key) => {
            if (value !== this._options.defaults[key]) {
                acc[key] = value;
            }
        }, {});
        var recipe = this.deflateNames(essentials);
        return this.escape(JSON.stringify(recipe));
    }
    private deflateNames(essentials: Partial<T>) {
        var recipe = transform<Indexable<any>>(essentials, (acc, value, key) => {
            if (key in this._defaultsKeyIndexes) {
                acc[this._defaultsKeyIndexes[key].toString()] = value;
            }
        }, {});
        return recipe;
    }
    private inflateNames(recipe: Indexable<any>) {
        let keyLookup = Object.keys(this._options.defaults);
        var essentials = transform<Indexable<any>, Partial<InternalCookie<T>>>(recipe, (acc, value, key) => {
            let index = parseInt(key as string, 10);
            let isIndex = !isNaN(index) && index.toString() === key;
            if (isIndex) {
                acc[keyLookup[index]] = value;
            }
        }, { } as Partial<InternalCookie<T>>);
        return essentials;
    }
    private bakeCookies(recipe: string): Partial<InternalCookie<T>> {
        return {...this._options.defaults, ...this.inflateNames(JSON.parse(this.unescape(recipe)))} as T;
    }
    private escape(str: string): string {
        return str.replace(/;/g, "¤s").replace(/=/, "¤e");
    }
    private unescape(str: string): string {
        return str.replace(/¤s/g, ";").replace(/¤e/, "=");
    }
    private openJar() {
        let local_recipe = localStorage.getItem(this._options.name);
        let cookie_recipe = getCookie(this._options.name);
        let other_recipe = this._options.localStorage ? cookie_recipe : local_recipe;
        let recipe = (this._options.localStorage ? local_recipe : cookie_recipe) || other_recipe;
        if (recipe) {
            let cookies = this.bakeCookies(recipe);
            this._cookies = {...this._cookies, ...cookies};
            this.removeCookies();
            this.saveCookies();
        }
        if (other_recipe) {
            if (this._options.localStorage) {
                let otherCookies = this.bakeCookies(other_recipe);
                otherCookies = {...this._cookies, ...otherCookies};
                removeCookie(this._options.name, this._options.path);
            } else {
                localStorage.removeItem(this._options.name);
            }
        }
    }
}