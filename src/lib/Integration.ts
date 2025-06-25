import * as Arr from "./Arr";
import * as Calc from "./Calc";
import * as Cookie from "./Cookie";
import * as Dom from "./Dom";
import { Global } from "./Global";
import * as MocData from "./MocData";
import * as Obj from "./Obj";
import { Initable } from "./mixins/Initable";
import { Poolable } from "./mixins/Poolable";
import { Pool } from "./standard/Pool";
import { Dictionary } from "./struct/Dictionary";
import { KeyValuePair } from "./struct/KeyValuePair";
import { List } from "./struct/List";
import { Range2 } from "./struct/Range2";
import { Rect } from "./struct/Rect";
import { Stack } from "./struct/Stack";
import { Tree } from "./struct/Tree";
import { IndexedTree } from "./struct/IndexedTree";
import { Vec2 } from "./struct/Vec2";
import * as Test from "./Test";
import { Timer } from "./Timer";
import { Uri } from "./Uri";
import * as Util from "./Util";
import * as Decorators from "./Decorators";

export function integrate(alias?: string | object) {
  let stringAlias = typeof alias === "string";
  let objectAlias = typeof alias === "object";
  let list = [
    { name: "Arr", object: Arr },
    { name: "Calc", object: Calc },
    { name: "Cookie", object: Cookie },
    { name: "Dom", object: Dom },
    { name: "Decorators", object: Decorators },
    { name: "MocData", object: MocData },
    { name: "Obj", object: Obj },
    { name: "Initable", object: Initable },
    { name: "Poolable", object: Poolable },
    { name: "Pool", object: Pool },
    { name: "Dictionary", object: Dictionary },
    { name: "KeyValuePair", object: KeyValuePair },
    { name: "List", object: List },
    { name: "Range2", object: Range2 },
    { name: "Rect", object: Rect },
    { name: "Stack", object: Stack },
    { name: "Tree", object: Tree },
    { name: "IndexedTree", object: IndexedTree },
    { name: "Vec2", object: Vec2 },
    { name: "Test", object: Test },
    { name: "Timer", object: Timer },
    { name: "Uri", object: Uri },
    { name: "Util", object: Util },
  ];
  if (stringAlias) {
    (Global.global as any)[alias as string] =
      (Global.global as any)[alias as string] || {};
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
