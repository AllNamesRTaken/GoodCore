import { Arr } from "./Arr";
import { Calc } from "./Calc";
import { Dom } from "./Dom";
import { Global } from "./Global";
import { MocData } from "./MocData";
import { Obj } from "./Obj";
import { Initable } from "./standard/mixins/Initable";
import { Poolable } from "./standard/mixins/Poolable";
import { Pool } from "./standard/Pool";
import { Dictionary } from "./struct/Dictionary";
import { IRange2 } from "./struct/IRange2";
import { IRect } from "./struct/IRect";
import { IVec2 } from "./struct/IVec2";
import { KeyValuePair } from "./struct/KeyValuePair";
import { List } from "./struct/List";
import { Range2 } from "./struct/Range2";
import { Rect } from "./struct/Rect";
import { Stack } from "./struct/Stack";
import { Tree } from "./struct/Tree";
import { Vec2 } from "./struct/Vec2";
import { Test } from "./Test";
import { Timer } from "./Timer";
import { Uri } from "./Uri";
import { Util } from "./Util";
export function integrate(alias?: string | object) {
	let stringAlias = false;
	let objectAlias = false;
	let list = [
		{name: "Arr", object: Arr},
		{name: "Calc", object: Calc},
		{name: "Dom", object: Dom},
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
		{name: "Vec2", object: Vec2},
		{name: "Test", object: Test},
		{name: "Timer", object: Timer},
		{name: "Uri", object: Uri},
		{name: "Util", object: Util},
	];
	if (typeof(alias) === "string") {
		(Global.window as any)[alias] = {};
		stringAlias = true;
	}
	for (const stuff of list) {
		if (stringAlias) {
			(Global.window as any)[alias as string][stuff.name] = stuff.object;
		} else if (objectAlias) {
			(alias as any)[stuff.name] = stuff.object;
		} else {
			(Global.window as any)[stuff.name] = stuff.object;
		}
	}
}
