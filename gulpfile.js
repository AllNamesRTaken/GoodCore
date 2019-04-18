var gulp = require("gulp");
var fs = require("fs");
var rename = require("gulp-rename");

//var config = require("./build/buildConfig.js");
var package = require("./package.json");
var version = package.version.split(".").map((v) => parseInt(v) || 0);

gulp.task("bump", gulp.parallel(function(cb) {
    version[2]++;
    package.version = version.join(".");
    fs.writeFileSync("./package.json", JSON.stringify(package, null, 2), { encoding: "utf8" });
    cb();
}));
gulp.task("modifyBundle", gulp.parallel(function(cb) {
    var bundle = fs.readFileSync(`./dist/lib/${package.name}.bundle.js`, "utf8");
    var bundle = bundle.replace("window, function()", `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`);
    var bundle = bundle.replace("window,function()", `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`);
    fs.writeFileSync(`./dist/lib/${package.name}.bundle.js`, bundle, { encoding: "utf8" });
    cb();
}));
gulp.task("package", gulp.series("bump", function() {
    return gulp.src(["./package.json", "./README.md"])
        .pipe(gulp.dest("dist/lib"));
}));
gulp.task("copyDTS", gulp.parallel(() => {
    return gulp.src("./dts/**/*.d.ts")
        .pipe(gulp.dest("dist/lib"));
}));
gulp.task("copyWebpackExternalsFn", gulp.parallel(() => {
    return gulp.src("./src/lib/webpackExternals.js")
        .pipe(gulp.dest("dist/lib"));
}));
gulp.task("copyDTSES", gulp.parallel(() => {
    return gulp.src("./dts/**/*.d.ts")
        .pipe(gulp.dest("distES/lib"));
}));
gulp.task("copyReadmeES", gulp.parallel(() => {
    return gulp.src(["./README-ES.md"])
        .pipe(rename("README.md"))
        .pipe(gulp.dest("distES/lib"));
}));
gulp.task("packageES", gulp.parallel(function(cb) {
    package.name += "es";
    package.unpkg = package.main = package.module;
    package.description = "ES2015 version of goodcore";
    fs.writeFileSync("./distES/lib/package.json", JSON.stringify(package, null, 2), { encoding: "utf8" });
    cb();
}));
