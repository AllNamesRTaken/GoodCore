/// <reference path="../base.d.ts" />

export function Poolable<T extends { new(...args: any[]): {} }>(constructor: T): T & Constructor<IPoolable>
