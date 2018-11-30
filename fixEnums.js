var fs = require('fs');
var package = require('./package.json');
var bundle = fs.readFileSync(`./dist/lib/${package.name}.bundle.js`, "utf8");
var bundle_min = fs.readFileSync(`./dist/lib/${package.name}.bundle.min.js`, "utf8");
var bundle = bundle.replace(/get (\w+?) \(\) \{ return (\w+?); \}/g, "$1: { get: function get() { return $2; }, configurable: true, enumerable: true }");
var bundle_min = bundle_min.replace(/get (\w+?)\(\)\{return (\w+?)\}/g, "$1: { get: function get() { return $2; }, configurable: true, enumerable: true }");
fs.writeFileSync(`./dist/lib/${package.name}.bundle.js`, bundle, { encoding: "utf8" });
fs.writeFileSync(`./dist/lib/${package.name}.bundle.min.js`, bundle_min, { encoding: "utf8" });
