/// <reference path="../base.d.ts" />

export function Initable<T extends { new(...args: any[]): {} }>(_constructor: T): T & Constructor<IInitable<T>>
