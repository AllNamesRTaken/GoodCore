/// <reference path="../base.d.ts" />

export function Initable<S>(_constructor?: ICtor<S>): ICtor<S & IInitable>
