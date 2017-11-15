var dts = require('dts-bundle');
var conf = require("./dts-bundle.json");
var packageJson = require("./package.json");
conf.name = packageJson.name;
conf.out = "../" + packageJson.name + ".d.ts";

dts.bundle(conf);
conf.out = "../" + packageJson.name + ".flat.d.ts";
conf.outputAsModuleFolder = true;
dts.bundle(conf);
