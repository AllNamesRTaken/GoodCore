var fs = require("fs");
var UglifyJS = require("uglify-js");
var packageJson = require("./package.json");

var distInFileUmd = "./dist/"+packageJson.name+".umd.js";
var distOutFileUnversionedUmd = "./dist/"+packageJson.name+".umd.min.js";
var distInFileIife = "./dist/"+packageJson.name+".iife.js";
var distOutFileUnversionedIife = "./dist/"+packageJson.name+".iife.min.js";

var result = UglifyJS.minify(distInFileUmd, { mangle: true });
fs.writeFileSync(distOutFileUnversionedUmd, result.code, { encoding: "utf-8" });
var result = UglifyJS.minify(distInFileIife, { mangle: true });
fs.writeFileSync(distOutFileUnversionedIife, result.code, { encoding: "utf-8" });
