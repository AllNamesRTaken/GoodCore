import * as Moc from "../lib/MocData";
import { List } from "../lib/struct/List";
import { Comparer, SortedList } from "../lib/struct/SortedList";
import { Timer } from "../lib/Timer";

let mocStrArray = Moc.stringArray(1000, 25);
let newStrings = Moc.stringArray(100, 25);
let positions = Moc.numericArray(100, Moc.MocDataType.RandomInt);
let list = new List(mocStrArray);
let sorted = new SortedList(Comparer.StringAsc, mocStrArray);

let time = 0;
let time2 = 0;
let tmp: List<string>;
let tmpsort: SortedList<string>;

let i: number;
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
