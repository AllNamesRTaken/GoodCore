var packageJson = require("./package.json");

var rollup = require('rollup');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var typescript = require('rollup-plugin-typescript');
var babili = require('rollup-plugin-babili');
var babel = require('rollup-plugin-babel');

rollup.rollup({
    entry: 'src/lib/index.ts',
    moduleName: packageJson.name,
    // external: ['ts-md5/dist/md5'],
    sourceMap: true,
    globals: {
        // 'ts-md5/dist/md5': 'Md5'
    },
    treeshake: true,
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({ module: true, jsnext: true, main: true, modulesOnly: false }),
        commonjs(),
        babili({
            sourceMap: true
        }),
        babel({})
    ]
}).then(function (bundle) {
    bundle.write({
        format: 'iife',
        moduleName: packageJson.name,
        dest: 'dist/' + packageJson.name + '.iife.min.js'
    });
    bundle.write({
        format: 'umd',
        moduleName: packageJson.name,
        dest: 'dist/' + packageJson.name + '.umd.min.js'
    });
    bundle.write({
        format: 'es',
        dest: 'dist/' + packageJson.name + '.es.min.js'
    });
});
rollup.rollup({
    entry: 'src/lib/index.ts',
    moduleName: packageJson.name,
    sourceMap: true,
    globals: {
    },
    treeshake: true,
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({ module: true, jsnext: true, main: true, modulesOnly: false }),
        commonjs(),
        babili({
            sourceMap: true
        })
    ]
}).then(function (bundle) {
    bundle.write({
        format: 'es',
        dest: 'dist/' + packageJson.name + '.es2015.min.js'
    });
    bundle.write({
        format: 'umd',
        moduleName: packageJson.name,
        dest: 'dist/' + packageJson.name + '.es6.umd.min.js'
    });
});
