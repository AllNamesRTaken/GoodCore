import * as Arr from "./Arr.js";
import * as Calc from "./Calc.js";
import * as Cookie from "./Cookie.js";
import * as Dom from "./Dom.js";
import { Global } from "./Global.js";
import * as MocData from "./MocData.js";
import * as Obj from "./Obj.js";
import { Initable } from "./mixins/Initable.js";
import { Poolable } from "./mixins/Poolable.js";
import { Pool } from "./standard/Pool.js";
import { Dictionary } from "./struct/Dictionary.js";
import { KeyValuePair } from "./struct/KeyValuePair.js";
import { List } from "./struct/List.js";
import { Range2 } from "./struct/Range2.js";
import { Rect } from "./struct/Rect.js";
import { Stack } from "./struct/Stack.js";
import { Tree } from "./struct/Tree.js";
import { IndexedTree } from "./struct/IndexedTree.js";
import { Vec2 } from "./struct/Vec2.js";
import * as Test from "./Test.js";
import { Timer } from "./Timer.js";
import { Uri } from "./Uri.js";
import * as Util from "./Util.js";
import * as Decorators from "./Decorators.js";

export function integrate(alias?: string | object) {
	let stringAlias = typeof alias === "string";
	let objectAlias = typeof alias === "object";
	let list = [
		{name: "Arr", object: Arr},
		{name: "Calc", object: Calc},
		{name: "Cookie", object: Cookie},
		{name: "Dom", object: Dom},
		{name: "Decorators", object: Decorators},
		{name: "MocData", object: MocData},
		{name: "Obj", object: Obj},
		{name: "Initable", object: Initable},
		{name: "Poolable", object: Poolable},
		{name: "Pool", object: Pool},
		{name: "Dictionary", object: Dictionary},
		{name: "KeyValuePair", object: KeyValuePair},
		{name: "List", object: List},
		{name: "Range2", object: Range2},
		{name: "Rect", object: Rect},
		{name: "Stack", object: Stack},
		{name: "Tree", object: Tree},
		{name: "IndexedTree", object: IndexedTree},
		{name: "Vec2", object: Vec2},
		{name: "Test", object: Test},
		{name: "Timer", object: Timer},
		{name: "Uri", object: Uri},
		{name: "Util", object: Util},
	];
	if (stringAlias) {
		(Global.global as any)[alias as string] = (Global.global as any)[alias as string] || {};
	}
	for (let i = 0; i < list.length; i++) {
		let stuff = list[i];
		if (stringAlias) {
			(Global.global as any)[alias as string][stuff.name] = stuff.object;
		} else if (objectAlias) {
			(alias as any)[stuff.name] = stuff.object;
		} else {
			(Global.global as any)[stuff.name] = stuff.object;
		}
	}
}
