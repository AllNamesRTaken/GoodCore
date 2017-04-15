"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var glob = require("glob");
var mkdirp = require("mkdirp");
var Umd = require("browserify-umdify");

mkdirp.sync("./temp");

var packageJson = require("./package.json");
var distOutFileUnversioned = "./dist/lib/"+packageJson.name+".umd.js";
var distOutUnversioned = fs.createWriteStream(distOutFileUnversioned, { encoding: "utf-8", flags: "w"})

var bundled = browserify({
		extensions: [".js", ".json"],
		debug: true
	})
	.require("./dist/lib/index.js", { expose: "typescript-collections" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(distOutUnversioned);
