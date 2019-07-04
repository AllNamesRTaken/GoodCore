/// <reference path="../base.d.ts" />

export function Poolable<S>(_constructor?: ICtor<S>): ICtor<S & IPoolable>
