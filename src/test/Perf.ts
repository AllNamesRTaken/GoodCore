import * as Moc from "../lib/MocData";
import { List } from "../lib/struct/List";
import { Comparer, SortedList } from "../lib/struct/SortedList";
import { Timer } from "../lib/Timer";
import { loop, newUUID } from "../lib/Util";

let mocStrArray = Moc.stringArray(1000, 25);
let newStrings = Moc.stringArray(100, 25);
let positions = Moc.numericArray(100, Moc.MocDataType.RandomInt);
let list = new List(mocStrArray);
let sorted = new SortedList(Comparer.StringAsc, mocStrArray);
let indexed = new List<{ id: string; }>();
loop(1000, (i) => indexed.add({id: newUUID()}));
let unindexed = indexed.clone();
indexed.indexer = (el) => el.id;

let time = 0;
let time2 = 0;
let tmp: List<string>;
let tmpsort: SortedList<string>;
let i: number;

//Compare add and sort between unsorted and sorted list
for (i = 0; i < 100; i++) {
	tmp = list.clone();
	Timer.start();
	// tmp.append(newStrings);
	newStrings.forEach((el) => { tmp.add(el); });
	tmp.orderBy(Comparer.StringAsc);
	Timer.stop();
	time += Timer.time;
}
console.log("list: ", time / i);

for (i = 0; i < 100; i++) {
	tmpsort = sorted.clone();
	Timer.start();
	// tmpsort.bulkAdd(newStrings);
	newStrings.forEach((el) => { tmpsort.add(el); });
	Timer.stop();
	time2 += Timer.time;
}
console.log("list: ", time2 / i);
console.log("diff ", time2 / time);

//Compare same between indexed (on UUID) and unindexed list.
let tmp2: List<{id: string}> = new List();
time = 0;
time2 = 0;
for (i = 0; i < 100; i++) {
	tmp2 = unindexed.clone();
	Timer.start();
	tmp2.same(tmp2);
	Timer.stop();
	time += Timer.time;
}
console.log(`list(${tmp2.length}): `, time / i);

for (i = 0; i < 100; i++) {
	tmp2 = indexed.clone();
	Timer.start();
	tmp2.same(tmp2);
	Timer.stop();
	time2 += Timer.time;
}
console.log(`list(${tmp2.length}): `, time2 / i);
console.log("diff ", time2 / time);

//Compare push in array with push in unindexed List.
time = 0;
time2 = 0;
let targetArr: string[] = [];
for (i = 0; i < 100; i++) {
	Timer.start();
	list.forEach((el) => targetArr.push(el));
	Timer.stop();
	time += Timer.time;
}
console.log(`list(${list.length}): `, time / i);

let targetList = new List<string>();
for (i = 0; i < 100; i++) {
	Timer.start();
	list.forEach((el) => targetList.push(el));
	Timer.stop();
	time2 += Timer.time;
}
console.log(`list(${list.length}): `, time2 / i);
console.log("diff ", time2 / time);
