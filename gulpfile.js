var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var rollup = require("gulp-better-rollup");
var uglify = require("gulp-uglify-es").default;
// var babel= require("gulp-babel");
var filter = require("gulp-filter");
var debug = require("gulp-debug");
var sequence = require("gulp-sequence");

var chalk = require("chalk");

var config = require("./build/buildConfig.js");
// var builtins = require("rollup-plugin-node-builtins");
// var globals = require("rollup-plugin-node-globals");

var tsProject5 = ts.createProject("./tsconfig.json");
var tsProject6 = ts.createProject("./tsconfig.es6.json");

// var babelWithEs2015Modules = config.babelPlugins.slice();
// var babelWithCommonJsModules = config.babelPlugins.slice();
// babelWithCommonJsModules.push("transform-es2015-modules-commonjs");

gulp.task("build-es6", () => {
    return tsProject6.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject6())
        .pipe(gulp.dest("dist"))
        .pipe(filter("**/index.js"))
        .pipe(debug())
        .pipe(rollup({
            treeshake: true,
            plugins: [
            ]
        }, [
            {
                dest: "goodcore.es6.min.js",
                format: "es"
            },
            {
                dest: "goodcore.es6.umd.min.js",
                format: "umd"
            }
        ]))
        // .pipe(babel({plugins: babelWithCommonJsModules, compact: true}))
        .pipe(uglify({ mangle: true, compress: true }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});
gulp.task("build-es5", () => {
    return tsProject5.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject5())
        .pipe(gulp.dest("dist"))
        .pipe(filter("**/index.js"))
        .pipe(debug())
        .pipe(rollup({
            treeshake: true,
            plugins: [
            ]
        }, [
            {
                dest: "goodcore.es5.es2015.min.js",
                format: "es"
            },
            {
                dest: "goodcore.es5.umd.min.js",
                format: "umd"
            },
            {
                dest: "goodcore.es5.iife.min.js",
                format: "iife"
            }
        ]))
        // .pipe(babel({plugins: babelWithEs2015Modules, compact: true}))
        .pipe(uglify({ mangle: true, compress: true }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});
gulp.task("build", (cb) => sequence("build-es6", "build-es5")(cb));