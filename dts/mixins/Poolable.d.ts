/// <reference path="../base.d.ts" />

export function Poolable<T extends { new(...args: any[]): {} }>(_constructor: T): T & Constructor<IPoolable>
