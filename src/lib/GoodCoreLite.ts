import {
  all,
  append,
  binarySearch,
  bucket,
  create,
  deepCopy,
  deepCopyInto,
  deserialize,
  distinct,
  forEachAsync,
  forSome,
  indexOf,
  insertAt,
  mapAsync,
  mapInto,
  pivot,
  reverse,
  shallowCopy as scArray,
  split,
  until,
  unzip,
  zip,
} from "./Arr.js";

import {
  clone,
  cloneInto,
  destroy,
  difference,
  equals,
  forEach,
  inherits,
  isClassOf,
  isDifferent,
  isSameClass,
  mixin,
  setNull,
  setProperties,
  shallowCopy,
  transform,
  wipe,
} from "./Obj.js";

import {
  assert,
  count,
  counter,
  debounce,
  deprecate,
  getDate,
  init,
  loop,
  newInt,
  newUUID,
  once,
  throttle,
  toArray,
} from "./Util.js";

import * as Test from "./Test.js";

import { Timer as Timer } from "./Timer.js";

export { Timer as Timer };
export { Test as Test };

export const Arr = {
  all,
  append,
  binarySearch,
  bucket,
  create,
  deepCopy,
  deepCopyInto,
  deserialize,
  distinct,
  forEachAsync,
  forSome,
  indexOf,
  insertAt,
  mapAsync,
  mapInto,
  pivot,
  reverse,
  shallowCopy: scArray,
  split,
  until,
  unzip,
  zip,
};

export const Obj = {
  clone,
  cloneInto,
  destroy,
  difference,
  equals,
  forEach,
  inherits,
  isClassOf,
  isDifferent,
  isSameClass,
  mixin,
  setNull,
  setProperties,
  shallowCopy,
  transform,
  wipe,
};

export const Util = {
  assert,
  count,
  counter,
  debounce,
  deprecate,
  getDate,
  init,
  loop,
  newInt,
  newUUID,
  once,
  throttle,
  toArray,
};

const root =
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
      ? global
      : (() => this)();
export function integrate(alias?: string | object) {
  let stringAlias = typeof alias === "string";
  let objectAlias = typeof alias === "object";
  let list = [
    { name: "Arr", object: Arr },
    { name: "Obj", object: Obj },
    { name: "Test", object: Test },
    { name: "Util", object: Util },
    { name: "Timer", object: Timer },
  ];
  if (stringAlias) {
    (root as any)[alias as string] = (root as any)[alias as string] || {};
  }
  for (let i = 0; i < list.length; i++) {
    let stuff = list[i];
    if (stringAlias) {
      (root as any)[alias as string][stuff.name] = stuff.object;
    } else if (objectAlias) {
      (alias as any)[stuff.name] = stuff.object;
    } else {
      (root as any)[stuff.name] = stuff.object;
    }
  }
}
