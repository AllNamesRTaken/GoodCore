import Benchmark from "benchmark";
import { MocData, Arr, Test } from "../lib/index.js";
import { MocDataType } from "../lib/MocData.js";
import chalk from "chalk";

const SIZE = 10000;
let intArray10k = MocData.numericArray(SIZE, MocDataType.RandomInt, 0, 100000);
let intArray100 = MocData.numericArray(100, MocDataType.RandomInt, 0, 100000);
intArray10k[SIZE / 2 - 1] = -1;
let workset: number[];

function complete(suite: Benchmark.Suite) {
	// tslint:disable-next-line:prefer-template
	console.log(chalk.green("Fastest is " + ((suite.filter("fastest") as any).map("name") as string) + "\n"));
}
function cycle(event: any) {
	console.log(chalk.grey("\t" + String(event.target)));
}

let dump: any;
export const suites = [

	new Benchmark.Suite()
		.add("Array::reverse", function () {
			dump = intArray10k.reverse();
		})
		.add("Arr.reverse", function () {
			dump = Arr.reverse(intArray10k);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::filter", function () {
			dump = intArray10k.filter((el, i) => el > 50000);
		})
		.add("Arr.filter", function () {
			dump = Arr.filter(intArray10k, (el, i) => el > 50000);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::forEach", function () {
			dump = intArray10k.forEach((el, i) => void (0));
		})
		.add("Arr.forEach", function () {
			dump = Arr.forEach(intArray10k, (el, i) => void (0));
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::map", function () {
			dump = intArray10k.map((el, i) => el + 1);
		})
		.add("Arr.map", function () {
			dump = Arr.map(intArray10k, (el, i) => el + 1);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::reduce", function () {
			dump = intArray10k.reduce((agg, cur) => agg + cur, 0);
		})
		.add("Arr.reduce", function () {
			dump = Arr.reduce(intArray10k, (agg, cur) => agg + cur, 0);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::splice delete half add 100", function () {
			workset.splice.bind(workset, SIZE / 2, 100).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice delete half add 100", function () {
			Arr.splice(workset, SIZE / 2, 100, intArray100);
			workset.length = SIZE;
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),

	new Benchmark.Suite()
		.add("Array::splice delete 10 in the middle and add 100", function () {
			workset.splice.bind(workset, SIZE / 2, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice delete 10 in the middle and add 100", function () {
			Arr.splice(workset, SIZE / 2, 10, intArray100);
			workset.length = SIZE;
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),

	new Benchmark.Suite()
		.add("Array::splice delete 200 in the middle and add 100", function () {
			workset.splice.bind(workset, SIZE / 2, 200).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice delete 200 in the middle and add 100", function () {
			Arr.splice(workset, SIZE / 2, 200, intArray100);
			workset.length = SIZE;
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),
		new Benchmark.Suite()
		.add("Array::splice delete 10 at the end and add 100", function () {
			workset.splice.bind(workset, SIZE - 10, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice delete 10 at the end and add 100", function () {
			Arr.splice(workset, SIZE - 10, 10, intArray100);
			workset.length = SIZE;
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),
		new Benchmark.Suite()
		.add("Array::splice delete 10 at start and add 100", function () {
			workset.splice.bind(workset, 0, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice delete 10 at start and add 100", function () {
			Arr.splice(workset, 0, 10, intArray100);
			workset.length = SIZE;
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),

	new Benchmark.Suite()
		.add("Array::splice(1) delete 1 in the middle", function () {
			workset.splice(SIZE / 2, 1);
			workset.push(1);
		})
		.add("Arr.removeAt delete 1 in the middle", function () {
			Arr.removeAt(workset, SIZE / 2);
			workset.push(1);
		})
		.on("start", function (event: any) {
			workset = intArray10k.slice();
		})
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
			if (workset.length !== SIZE) {
				console.log(workset.length);
			}
		}),

	new Benchmark.Suite()
		.add("Array::find", function () {
			dump = intArray10k.find((el) => el === -1);
		})
		.add("Arr.find", function () {
			dump = Arr.find(intArray10k, (el) => el === -1);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),
];
