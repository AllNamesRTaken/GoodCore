var gulp = require("gulp");
var rollup = require("rollup");
var uglify = require("rollup-plugin-uglify");
var es = require("uglify-es");
var debug = require("gulp-debug");
var sequence = require("gulp-sequence");

var chalk = require("chalk");

var config = require("./build/buildConfig.js");

gulp.task("build-es6", async function () {
    const bundle = await rollup.rollup({
        input: './dist/lib/index.js',
        plugins: [
            uglify({}, es.minify)
        ]
    });
  
    await bundle.write({
        file: './dist/goodcore.es6.min.js',
        format: 'es',
        name: 'goodcore',
        sourcemap: true
    });
    await bundle.write({
        file: './dist/goodcore.es6.umd.min.js',
        format: 'umd',
        name: 'goodcore',
        sourcemap: true
    });
});

gulp.task("build-es5", async function () {
    const bundle = await rollup.rollup({
        input: './dist/lib/index.js',
        plugins: [
            uglify({}, es.minify)
        ]
    });
  
    await bundle.write({
        file: './dist/goodcore.es5.iife.min.js',
        format: 'iife',
        name: 'goodcore',
        sourcemap: true
    });
    await bundle.write({
        file: './dist/goodcore.es5.es2015.min.js',
        format: 'es',
        name: 'goodcore',
        sourcemap: true
    });
    await bundle.write({
        file: './dist/goodcore.es5.umd.min.js',
        format: 'umd',
        name: 'goodcore',
        sourcemap: true
    });
});

gulp.task("copyDTS", () => {
    return gulp.src("./*.d.ts")
        .pipe(gulp.dest("dist"));
});
//This should build both but when I sequence them then they leek code into each other.
gulp.task("default", (cb) => sequence("build-es5", "build-es6")(cb));