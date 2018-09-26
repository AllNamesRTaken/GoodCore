var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import * as Benchmark from "benchmark";
import { MocData, Arr, Test } from "../lib";
import { MocDataType } from "../lib/MocData";
import * as _ from "lodash";
import chalk from "chalk";
var SIZE = 10000;
var intArray10k = MocData.numericArray(SIZE, MocDataType.RandomInt, 0, 100000);
var intArray100 = MocData.numericArray(100, MocDataType.RandomInt, 0, 100000);
intArray10k[SIZE / 2 - 1] = -1;
var workset;
function complete(suite) {
    console.log(chalk.green("Fastest is " + suite.filter("fastest").map("name") + "\n"));
}
function cycle(event) {
    console.log(chalk.grey("\t" + String(event.target)));
}
var dump;
export var suites = [
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
        .on("cycle", function (event) {
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
        .on("cycle", function (event) {
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
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add("Array::filter", function () {
        dump = intArray10k.filter(function (el, i) { return el > 50000; });
    })
        .add("Arr.filter", function () {
        dump = Arr.filter(intArray10k, function (el, i) { return el > 50000; });
    })
        .add("_.filter", function () {
        dump = _.filter(intArray10k, function (el, i) { return el > 50000; });
    })
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add("Array::forEach", function () {
        dump = intArray10k.forEach(function (el, i) { return void (0); });
    })
        .add("Arr.forEach", function () {
        dump = Arr.forEach(intArray10k, function (el, i) { return void (0); });
    })
        .add("_.forEach", function () {
        dump = _.forEach(intArray10k, function (el, i) { return void (0); });
    })
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add("Array::map", function () {
        dump = intArray10k.map(function (el, i) { return el + 1; });
    })
        .add("Arr.map", function () {
        dump = Arr.map(intArray10k, function (el, i) { return el + 1; });
    })
        .add("_.map", function () {
        dump = _.map(intArray10k, function (el, i) { return el + 1; });
    })
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add("Array::reduce", function () {
        dump = intArray10k.reduce(function (agg, cur) { return agg + cur; }, 0);
    })
        .add("Arr.reduce", function () {
        dump = Arr.reduce(intArray10k, function (agg, cur) { return agg + cur; }, 0);
    })
        .add("_.reduce", function () {
        dump = _.reduce(intArray10k, function (agg, cur) { return agg + cur; }, 0);
    })
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add("Array::splice", function () {
        workset.splice.apply(workset, __spread([SIZE / 2, 100], intArray100));
    })
        .add("Arr.splice", function () {
        Arr.splice(workset, SIZE / 2, 100, intArray100);
    })
        .add("Arr.splice (no native)", function () {
        Test.Env.useNative = false;
        Arr.splice(workset, SIZE / 2, 100, intArray100);
        Test.Env.useNative = undefined;
    })
        .on("start", function (event) {
        workset = intArray10k.slice();
    })
        .on("cycle", function (event) {
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
        .on("start", function (event) {
        workset = intArray10k.slice();
    })
        .on("cycle", function (event) {
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
        dump = intArray10k.find(function (el) { return el === -1; });
    })
        .add("Arr.find", function () {
        dump = Arr.find(intArray10k, function (el) { return el === -1; });
    })
        .add("_.find", function () {
        dump = _.find(intArray10k, function (el) { return el === -1; });
    })
        .on("cycle", function (event) {
        cycle(event);
    })
        .on("complete", function () {
        complete(this);
    }),
];
//# sourceMappingURL=ArrBench.js.map