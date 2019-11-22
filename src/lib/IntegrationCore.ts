import * as Arr from "./Arr";
import { Global } from "./Global";
import * as MocData from "./MocData";
import * as Obj from "./Obj";
import { Initable } from "./mixins/Initable";
import { Poolable } from "./mixins/Poolable";
import { Pool } from "./standard/Pool";
import * as Test from "./Test";
import * as Util from "./Util";
import * as Decorators from "./Decorators";

export function integrate(alias?: string | object) {
	let stringAlias = typeof alias === "string";
	let objectAlias = typeof alias === "object";
	let list = [
		{name: "Arr", object: Arr},
		{name: "Decorators", object: Decorators},
		{name: "MocData", object: MocData},
		{name: "Obj", object: Obj},
		{name: "Initable", object: Initable},
		{name: "Poolable", object: Poolable},
		{name: "Pool", object: Pool},
		{name: "Test", object: Test},
		{name: "Util", object: Util},
	];
	if (stringAlias) {
		(Global.window as any)[alias as string] = (Global.window as any)[alias as string] || {};
	}
	for (let i = 0; i < list.length; i++) {
		let stuff = list[i];
		if (stringAlias) {
			(Global.window as any)[alias as string][stuff.name] = stuff.object;
		} else if (objectAlias) {
			(alias as any)[stuff.name] = stuff.object;
		} else {
			(Global.window as any)[stuff.name] = stuff.object;
		}
	}
}
