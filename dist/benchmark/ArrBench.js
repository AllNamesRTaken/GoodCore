"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
const lib_1 = require("../lib");
const MocData_1 = require("../lib/MocData");
const _ = require("lodash");
const chalk_1 = require("chalk");
const SIZE = 10000;
let intArray10k = lib_1.MocData.numericArray(SIZE, MocData_1.MocDataType.RandomInt, 0, 100000);
let intArray100 = lib_1.MocData.numericArray(100, MocData_1.MocDataType.RandomInt, 0, 100000);
intArray10k[SIZE / 2 - 1] = -1;
let workset;
function complete(suite) {
    console.log(chalk_1.default.green('Fastest is ' + suite.filter('fastest').map('name') + "\n"));
}
function cycle(event) {
    console.log(chalk_1.default.grey("\t" + String(event.target)));
}
let dump;
exports.suites = [
    new Benchmark.Suite()
        .add('Array::indexOf', function () {
        dump = intArray10k.indexOf(-1);
    })
        .add('Arr.indexOfElement', function () {
        dump = lib_1.Arr.indexOfElement(intArray10k, -1);
    })
        .add('Arr.indexOfElement (no native)', function () {
        lib_1.Test.Env.forceNotNative = true;
        dump = lib_1.Arr.indexOfElement(intArray10k, -1);
        lib_1.Test.Env.forceNotNative = false;
    })
        .add('_.indexOf', function () {
        dump = _.indexOf(intArray10k, -1);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::slice', function () {
        dump = intArray10k.slice();
    })
        .add('Arr.slice', function () {
        dump = lib_1.Arr.slice(intArray10k);
    })
        .add('Arr.shallowCopy', function () {
        dump = lib_1.Arr.shallowCopy(intArray10k);
    })
        .add('Arr.slice (no native)', function () {
        lib_1.Test.Env.forceNotNative = true;
        dump = lib_1.Arr.slice(intArray10k);
        lib_1.Test.Env.forceNotNative = false;
    })
        .add('Arr.shallowCopy (no native)', function () {
        lib_1.Test.Env.forceNotNative = true;
        dump = lib_1.Arr.shallowCopy(intArray10k);
        lib_1.Test.Env.forceNotNative = false;
    })
        .add('_.slice', function () {
        dump = _.slice(intArray10k);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::reverse', function () {
        dump = intArray10k.reverse();
    })
        .add('Arr.reverse', function () {
        dump = lib_1.Arr.reverse(intArray10k);
    })
        .add('_.reverse', function () {
        dump = _.reverse(intArray10k);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::filter', function () {
        dump = intArray10k.filter((el, i) => el > 50000);
    })
        .add('Arr.filter', function () {
        dump = lib_1.Arr.filter(intArray10k, (el, i) => el > 50000);
    })
        .add('_.filter', function () {
        dump = _.filter(intArray10k, (el, i) => el > 50000);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::forEach', function () {
        dump = intArray10k.forEach((el, i) => void (0));
    })
        .add('Arr.forEach', function () {
        dump = lib_1.Arr.forEach(intArray10k, (el, i) => void (0));
    })
        .add('_.forEach', function () {
        dump = _.forEach(intArray10k, (el, i) => void (0));
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::map', function () {
        dump = intArray10k.map((el, i) => el + 1);
    })
        .add('Arr.map', function () {
        dump = lib_1.Arr.map(intArray10k, (el, i) => el + 1);
    })
        .add('_.map', function () {
        dump = _.map(intArray10k, (el, i) => el + 1);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::reduce', function () {
        dump = intArray10k.reduce((agg, cur) => agg + cur, 0);
    })
        .add('Arr.reduce', function () {
        dump = lib_1.Arr.reduce(intArray10k, (agg, cur) => agg + cur, 0);
    })
        .add('_.reduce', function () {
        dump = _.reduce(intArray10k, (agg, cur) => agg + cur, 0);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
    new Benchmark.Suite()
        .add('Array::splice', function () {
        workset.splice(SIZE / 2, 100, ...intArray100);
    })
        .add('Arr.splice', function () {
        lib_1.Arr.splice(workset, SIZE / 2, 100, intArray100);
    })
        .add('Arr.splice (no native)', function () {
        lib_1.Test.Env.forceNotNative = true;
        lib_1.Arr.splice(workset, SIZE / 2, 100, intArray100);
        lib_1.Test.Env.forceNotNative = false;
    })
        .on('start', function (event) {
        workset = intArray10k.slice();
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
        if (workset.length !== SIZE) {
            console.log(workset.length);
        }
    }),
    new Benchmark.Suite()
        .add('Array::splice(1)', function () {
        workset.splice(SIZE / 2, 1);
        workset.push(1);
    })
        .add('Arr.removeAt', function () {
        lib_1.Arr.removeAt(workset, SIZE / 2);
        workset.push(1);
    })
        .add('Arr.removeAt (no native)', function () {
        lib_1.Test.Env.forceNotNative = true;
        lib_1.Arr.removeAt(workset, SIZE / 2);
        workset.push(1);
        lib_1.Test.Env.forceNotNative = false;
    })
        .on('start', function (event) {
        workset = intArray10k.slice();
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
        if (workset.length !== SIZE) {
            console.log(workset.length);
        }
    }),
    new Benchmark.Suite()
        .add('Array::find', function () {
        dump = intArray10k.find((el) => el === -1);
    })
        .add('Arr.find', function () {
        dump = lib_1.Arr.find(intArray10k, (el) => el === -1);
    })
        .add('_.find', function () {
        dump = _.find(intArray10k, (el) => el === -1);
    })
        .on('cycle', function (event) {
        cycle(event);
    })
        .on('complete', function () {
        complete(this);
    }),
];
//# sourceMappingURL=ArrBench.js.map