import * as Benchmark from "benchmark";
import { MocData, Arr, Test } from "../lib";
import { MocDataType } from "../lib/MocData";
import * as _ from "lodash";
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
		.add("Array::some", function () {
			dump = intArray10k.some((v, i) => i > 5000);
		})
		.add("Arr.some", function () {
			dump = Arr.some(intArray10k, (v, i) => i > 5000);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::indexOf", function () {
			dump = intArray10k.indexOf(-1);
		})
		.add("Arr.indexOfElement", function () {
			dump = Arr.indexOfElement(intArray10k, -1);
		})
		.add("Arr.indexOfElement (no native)", function () {
			Test.Env.useNative = false;
			dump = Arr.indexOfElement(intArray10k, -1);
			Test.Env.useNative = undefined;
		})
		.add("_.indexOf", function () {
			dump = _.indexOf(intArray10k, -1);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::slice", function () {
			dump = intArray10k.slice();
		})
		.add("Arr.slice", function () {
			dump = Arr.slice(intArray10k);
		})
		.add("Arr.shallowCopy", function () {
			dump = Arr.shallowCopy(intArray10k);
		})
		.add("Arr.slice (no native)", function () {
			Test.Env.useNative = false;
			dump = Arr.slice(intArray10k);
			Test.Env.useNative = undefined;
		})
		.add("Arr.shallowCopy (no native)", function () {
			Test.Env.useNative = false;
			dump = Arr.shallowCopy(intArray10k);
			Test.Env.useNative = undefined;
		})
		.add("_.slice", function () {
			dump = _.slice(intArray10k);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::reverse", function () {
			dump = intArray10k.reverse();
		})
		.add("Arr.reverse", function () {
			dump = Arr.reverse(intArray10k);
		})
		.add("_.reverse", function () {
			dump = _.reverse(intArray10k);
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
		.add("_.filter", function () {
			dump = _.filter(intArray10k, (el, i) => el > 50000);
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
		.add("_.forEach", function () {
			dump = _.forEach(intArray10k, (el, i) => void (0));
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
		.add("_.map", function () {
			dump = _.map(intArray10k, (el, i) => el + 1);
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
		.add("_.reduce", function () {
			dump = _.reduce(intArray10k, (agg, cur) => agg + cur, 0);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),

	new Benchmark.Suite()
		.add("Array::splice", function () {
			workset.splice.bind(workset, SIZE / 2, 100).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice", function () {
			Arr.splice(workset, SIZE / 2, 100, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice (no native)", function () {
			Test.Env.useNative = false;
			Arr.splice(workset, SIZE / 2, 100, intArray100);
			workset.length = SIZE;
			Test.Env.useNative = undefined;
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
		.add("Array::splice", function () {
			workset.splice.bind(workset, SIZE / 2, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice", function () {
			Arr.splice(workset, SIZE / 2, 10, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice (no native)", function () {
			Test.Env.useNative = false;
			Arr.splice(workset, SIZE / 2, 10, intArray100);
			workset.length = SIZE;
			Test.Env.useNative = undefined;
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
		.add("Array::splice", function () {
			workset.splice.bind(workset, SIZE / 2, 200).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice", function () {
			Arr.splice(workset, SIZE / 2, 200, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice (no native)", function () {
			Test.Env.useNative = false;
			Arr.splice(workset, SIZE / 2, 200, intArray100);
			workset.length = SIZE;
			Test.Env.useNative = undefined;
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
		.add("Array::splice", function () {
			workset.splice.bind(workset, SIZE - 10, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice", function () {
			Arr.splice(workset, SIZE - 10, 10, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice (no native)", function () {
			Test.Env.useNative = false;
			Arr.splice(workset, SIZE - 10, 10, intArray100);
			workset.length = SIZE;
			Test.Env.useNative = undefined;
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
		.add("Array::splice", function () {
			workset.splice.bind(workset, 0, 10).apply(workset, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice", function () {
			Arr.splice(workset, 0, 10, intArray100);
			workset.length = SIZE;
		})
		.add("Arr.splice (no native)", function () {
			Test.Env.useNative = false;
			Arr.splice(workset, 0, 10, intArray100);
			workset.length = SIZE;
			Test.Env.useNative = undefined;
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
		.add("Array::splice(1)", function () {
			workset.splice(SIZE / 2, 1);
			workset.push(1);
		})
		.add("Arr.removeAt", function () {
			Arr.removeAt(workset, SIZE / 2);
			workset.push(1);
		})
		.add("Arr.removeAt (no native)", function () {
			Test.Env.useNative = false;
			Arr.removeAt(workset, SIZE / 2);
			workset.push(1);
			Test.Env.useNative = undefined;
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
		.add("_.find", function () {
			dump = _.find(intArray10k, (el) => el === -1);
		})
		// add listeners
		.on("cycle", function (event: any) {
			cycle(event);
		})
		.on("complete", function () {
			complete(this);
		}),
];
