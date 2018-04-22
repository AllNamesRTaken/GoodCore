"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moc = require("../lib/MocData");
const List_1 = require("../lib/struct/List");
const SortedList_1 = require("../lib/struct/SortedList");
const Timer_1 = require("../lib/Timer");
const Util_1 = require("../lib/Util");
let mocStrArray = Moc.stringArray(1000, 25);
let newStrings = Moc.stringArray(100, 25);
let positions = Moc.numericArray(100, Moc.MocDataType.RandomInt);
let list = new List_1.List(mocStrArray);
let sorted = new SortedList_1.SortedList(SortedList_1.Comparer.StringAsc, mocStrArray);
let indexed = new List_1.List();
Util_1.loop(1000, (i) => indexed.add({ id: Util_1.newUUID() }));
let unindexed = indexed.clone();
indexed.indexer = (el) => el.id;
let time = 0;
let time2 = 0;
let tmp;
let tmpsort;
let i;
for (i = 0; i < 100; i++) {
    tmp = list.clone();
    Timer_1.Timer.start();
    newStrings.forEach((el) => { tmp.add(el); });
    tmp.orderBy(SortedList_1.Comparer.StringAsc);
    Timer_1.Timer.stop();
    time += Timer_1.Timer.time;
}
console.log("list: ", time / i);
for (i = 0; i < 100; i++) {
    tmpsort = sorted.clone();
    Timer_1.Timer.start();
    newStrings.forEach((el) => { tmpsort.add(el); });
    Timer_1.Timer.stop();
    time2 += Timer_1.Timer.time;
}
console.log("list: ", time2 / i);
console.log("diff ", time2 / time);
let tmp2 = new List_1.List();
time = 0;
time2 = 0;
for (i = 0; i < 100; i++) {
    tmp2 = unindexed.clone();
    Timer_1.Timer.start();
    tmp2.same(tmp2);
    Timer_1.Timer.stop();
    time += Timer_1.Timer.time;
}
console.log(`list(${tmp2.length}): `, time / i);
for (i = 0; i < 100; i++) {
    tmp2 = indexed.clone();
    Timer_1.Timer.start();
    tmp2.same(tmp2);
    Timer_1.Timer.stop();
    time2 += Timer_1.Timer.time;
}
console.log(`list(${tmp2.length}): `, time2 / i);
console.log("diff ", time2 / time);
time = 0;
time2 = 0;
let targetArr = [];
for (i = 0; i < 100; i++) {
    Timer_1.Timer.start();
    list.forEach((el) => targetArr.push(el));
    Timer_1.Timer.stop();
    time += Timer_1.Timer.time;
}
console.log(`list(${list.length}): `, time / i);
let targetList = new List_1.List();
for (i = 0; i < 100; i++) {
    Timer_1.Timer.start();
    list.forEach((el) => targetList.push(el));
    Timer_1.Timer.stop();
    time2 += Timer_1.Timer.time;
}
console.log(`list(${list.length}): `, time2 / i);
console.log("diff ", time2 / time);
//# sourceMappingURL=Perf.js.map