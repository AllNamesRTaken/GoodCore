const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
const HappyPack = require('happypack');
const path = require("path");
const chalk = require("chalk");
const package = require("./package.json");

const isProd = (arg) => (arg || "").match("^p|prod|production$");
const isWatch = (arg) => (arg || "").match("^w|watch$") !== null;
// const isTest = (arg) => (arg || "").match("^t|test$") !== null;
// const isTestWatch = (arg) => (arg || "").match("^tw|testwatch$") !== null;

var libEntries = {};
libEntries[package.name] = "./src/lib/index.ts";

module.exports = (envOptions) => {
	envOptions = envOptions || {};
	console.log(chalk.green("arguments: " + JSON.stringify(envOptions)));
	console.log(chalk.blueBright("Environment: " + (isProd(envOptions.MODE) ? "production" : "development")));
	console.log(chalk.blueBright("To change mode write --env.MODE=<production|development>"));
	const source = path.resolve(__dirname, ".");
	const destination = path.resolve(__dirname, "dist/lib");
	console.log(chalk.blue(`source: ${source} \tdestination: ${destination}`));

	const config = {
		mode: isProd(envOptions.MODE) ? "production" : "development",
		target: "web",
		externals: [nodeExternals()],
		// context: source,
		entry: libEntries,
		output: {
			path: destination,
			filename: "[name].bundle.js",
			chunkFilename: "[name].chunk.js",
			library: "[name]",
			libraryTarget: "umd"
		},
		resolve: {
			extensions: [".ts", ".js", ".html"],
		},
		node: {
			process: false
		},
		module: {
			rules: [
				{
					test: /\.jsx?|\.tsx?$/,
					use: 'happypack/loader',
				},
				{
					test: /\.html|\.css|\.scss$/,
					loader: "raw-loader"
				},
			]
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
			new HappyPack({
				loaders: [
					{
						loader: 'ts-loader',
						options: {
							configFile: "tsconfig.app.json",
							happyPackMode: true // IMPORTANT! use transpileOnly mode to speed-up compilation
						}
					},
					// {
					// 	loader: 'babel-loader',
					// 	options: {
					// 		presets: ['es2015']
					// 	}
					// }
				]
			})
		]
	};
	if (isProd(envOptions.MODE)) {
		config.module.rules = [
			...config.module.rules,
			...[
			]];
	} else {
		let isWatchMode = isWatch(envOptions.MODE);
		if (isWatchMode) {
			console.log(chalk.blueBright("Listening in watch mode..."));
		}

		config.watch = isWatchMode,
			// config.module.rules.push(
			// 	{
			// 	}
			// );
			// config.plugins.push();
			config.devtool = "#source-map";
	}
	return config;
};
