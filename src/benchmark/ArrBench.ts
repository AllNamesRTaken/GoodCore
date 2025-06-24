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

];
