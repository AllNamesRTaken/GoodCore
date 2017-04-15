var fs = require("fs");
var UglifyJS = require("uglify-js");
var packageJson = require("./package.json");

var distInFile = "./dist/lib/"+packageJson.name+".umd.js";
var distOutFileUnversioned = "./dist/lib/"+packageJson.name+".min.umd.js";

var result = UglifyJS.minify(distInFile, { mangle: true });
fs.writeFileSync(distOutFileUnversioned, result.code, { encoding: "utf-8" });
