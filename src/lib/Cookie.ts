import { getDate, assert } from './Util.js'
import { clone, mixin, transform } from './Obj.js'

function findCookie(key: string) {
  return document.cookie.split(';')
		.map((cookie) => cookie.trim())
		.find((cookie) => cookie.indexOf(`${key}=`) === 0);
}
export function getCookie(key: string) {
  let cookie = findCookie(key)
  return cookie ? cookie.trim().split('=')[1] : undefined
}
export function setCookie(
  key: string,
  value: string,
  expires: Date,
  path?: string | null,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax',
  requireSSL: boolean = false
) {
  document.cookie = `${key}=${value}; expires=${expires.toUTCString()}${
    path ? '; path=' + path : ''
  };SameSite=${sameSite ?? 'Lax'};{${
    requireSSL || sameSite === 'None' ? 'secure;' : ''
  }`
}
export function removeCookie(
  key: string,
  path?: string | null,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax',
  requireSSL: boolean = false
) {
  document.cookie = `${key}=${'null'}; expires=${new Date(0).toUTCString()}${
    path ? '; path=' + path : ''
  };SameSite=${sameSite ?? 'Lax'};{${
    requireSSL || sameSite === 'None' ? 'secure;' : ''
  }`
}
export function parseAllCookies(): Indexable<string> {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .reduce((p, c, i) => {
      let [key, value] = c.split('=')
      p[key] = value
      return p
    }, {} as Indexable<string>)
}
export function getMonster<T extends object>(
  options: Partial<ICookieMonsterOptions<T>>
): ICookieMonster<T> {
  return new CookieMonster(options)
}
interface ICookieMonsterOptions<T extends Indexable<any>> {
  name: string
  defaults: T
  retainTime: string
  path: string
  localStorage: boolean
  session: boolean
  sameSite: 'Strict' | 'Lax' | 'None'
  requireSSL: boolean
}
interface ICookieMonster<
  T extends Indexable<any>,
  K extends keyof T = keyof T,
> {
  setCookie<S extends K>(key: S, value: T[S]): void
  getCookie<S extends K>(key: S): T[S]
  eatCookie(key: K): void
  removeCookies(): void
}
type InternalCookie<T> = T & {}
class CookieMonster<T extends Indexable<any>, K extends keyof T = keyof T>
  implements ICookieMonster<T, K>
{
  private _defaultOptions: ICookieMonsterOptions<T> = {
    name: '',
    defaults: {} as T,
    retainTime: '7d',
    path: '',
    localStorage: false,
    session: false,
    sameSite: 'Lax',
    requireSSL: false,
  }
  private _defaultsKeyIndexes: Indexable<number> = {}
  private _options: ICookieMonsterOptions<T> = this._defaultOptions
  private _cookies: Partial<InternalCookie<T>> = {}
  constructor(options?: Partial<ICookieMonsterOptions<T>>) {
    this._options = { ...this._defaultOptions, ...options }
    assert(this._options.name !== '', 'The Cookie Monster must have a name')
    assert(
      Object.keys(this._options.defaults).length > 0,
      'Empty defaults object makes no sense'
    )
    this._defaultsKeyIndexes = Object.keys(this._options.defaults).reduce(
      (p, c, i) => ((p[c] = i), p),
      {} as Indexable<number>
    )
    this._cookies = clone(this._options.defaults)
    this.openJar()
  }
  public setCookie<S extends K>(key: S, value: T[S]): void {
    if (typeof this._cookies[key] !== typeof value) {
      throw new Error(
        `Type mismatch. Expected ${typeof this._cookies[
          key
        ]} but got ${typeof value}`
      )
    }
    this._cookies[key] = value
    this.saveCookies()
  }
  public getCookie<S extends K>(key: S): T[S] {
    return this._cookies[key]!
  }
  public eatCookie(key: K): void {
    this._cookies[key] = this._options.defaults[key]
    this.saveCookies()
  }
  public removeCookies() {
    if (this._options.localStorage) {
      if (this._options.session) {
        sessionStorage.removeItem(this._options.name)
      } else {
        localStorage.removeItem(this._options.name)
      }
    } else {
      removeCookie(
        this._options.name,
        this._options.path,
        this._options.sameSite,
        this._options.requireSSL
      )
    }
  }
  private saveCookies() {
    if (this._options.localStorage) {
      if (this._options.session) {
        sessionStorage.setItem(
          this._options.name,
          this.makeRecipe(this._cookies)
        )
      } else {
        localStorage.setItem(this._options.name, this.makeRecipe(this._cookies))
      }
    } else {
      let expires: Date = getDate(this._options.retainTime)
      setCookie(
        this._options.name,
        this.makeRecipe(this._cookies),
        expires,
        this._options.path,
        this._options.sameSite,
        this._options.requireSSL
      )
    }
  }
  private makeRecipe(cookie: Partial<InternalCookie<T>>): string {
    let essentials = transform<Partial<T>>(
      cookie,
      (acc, value, key) => {
        if (value !== this._options.defaults[key]) {
          ;(acc as Indexable<any>)[key] = value
        }
      },
      {}
    )
    let recipe = this.deflateNames(essentials)
    return this.escape(JSON.stringify(recipe))
  }
  private deflateNames(essentials: Partial<T>) {
    let recipe = transform<Indexable<any>>(
      essentials,
      (acc, value, key) => {
        if (key in this._defaultsKeyIndexes) {
          acc[this._defaultsKeyIndexes[key].toString()] = value
        }
      },
      {}
    )
    return recipe
  }
  private inflateNames(recipe: Indexable<any>) {
    let keyLookup = Object.keys(this._options.defaults)
    let essentials = transform<Indexable<any>, Partial<InternalCookie<T>>>(
      recipe,
      (acc, value, key) => {
        let index = parseInt(key as string, 10)
        let isIndex = !isNaN(index) && index.toString() === key
        if (isIndex) {
          ;(acc as Indexable<any>)[keyLookup[index]] = value
        }
      },
      {} as Partial<InternalCookie<T>>
    )
    return essentials
  }
  private bakeCookies(recipe: string): Partial<InternalCookie<T>> {
    return {
      ...this._options.defaults,
      ...this.inflateNames(JSON.parse(this.unescape(recipe)) as Indexable<any>),
    } as T
  }
  private escape(str: string): string {
    return str.replace(/;/g, '¤s').replace(/=/g, '¤e')
  }
  private unescape(str: string): string {
    return str.replace(/¤s/g, ';').replace(/¤e/g, '=')
  }
  private openJar() {
    let local_recipe = localStorage.getItem(this._options.name)
    let session_recipe = sessionStorage.getItem(this._options.name)
    let cookie_recipe = getCookie(this._options.name)
    let recipe = this._options.localStorage
      ? this._options.session
        ? session_recipe
        : local_recipe
      : cookie_recipe
    this.vacuum()
    if (recipe) {
      let cookies = this.bakeCookies(recipe)
      this._cookies = mixin(clone(this._cookies), null, cookies)
      this.saveCookies()
    }
  }

  private vacuum() {
    if (!(this._options.localStorage && !this._options.session))
      localStorage.removeItem(this._options.name)
    if (!(this._options.localStorage && this._options.session))
      sessionStorage.removeItem(this._options.name)
    if (this._options.localStorage && findCookie(this._options.name)) {
      removeCookie(
        this._options.name,
        this._options.path,
        this._options.sameSite,
        this._options.requireSSL
      )
    }
  }
}
