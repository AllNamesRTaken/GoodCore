var fs = require("fs");
var UglifyJS = require("uglify-js");
var packageJson = require("./package.json");

var distInFile = "./dist/"+packageJson.name+".umd.js";
var distOutFileUnversioned = "./dist/"+packageJson.name+".umd.min.js";

var result = UglifyJS.minify(distInFile, { mangle: true });
fs.writeFileSync(distOutFileUnversioned, result.code, { encoding: "utf-8" });
