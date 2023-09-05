export function getCookie(key: string): string;
export function setCookie(key: string, value: string, expires: Date, path?: string): void;
export function removeCookie(key: string, path?: string): void;
export function parseAllCookies(): Indexable<string>;
export function getMonster<T extends Indexable<any>>(options: Partial<ICookieMonsterOptions<T>>): ICookieMonster<T>;
export interface ICookieMonsterOptions<T extends Indexable<any>> {
    name?: string,
    defaults?: T;
    retainTime?: string;
    path?: string;
    localStorage?: boolean;
    session?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
	requireSSL?: boolean;
}
export interface ICookieMonster<T extends Indexable<any>, K extends keyof T = keyof T> {
    setCookie<S extends K>(key: S, value: T[S]): void,
    getCookie<S extends K>(key: S): T[S],
    eatCookie(key: K): void,
    removeCookies(): void;
}
