var packageJson = require("./package.json");

var rollup = require( 'rollup' );
var resolve = require( 'rollup-plugin-node-resolve' );
var commonjs = require( 'rollup-plugin-commonjs' );
var typescript = require( 'rollup-plugin-typescript' );
var babili = require( 'rollup-plugin-babili' );
// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import typescript from 'rollup-plugin-typescript';
// import babili from 'rollup-plugin-babili';

// used to track the cache for subsequent bundles
var cache;

rollup.rollup({
    // If you have a bundle you want to re-use (e.g., when using a watcher to rebuild as files change),
    // you can tell rollup use a previous bundle as its starting point.
    // This is entirely optional!
    cache: cache,
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
        })
    ]
}).then(function (bundle) {
    // Cache our bundle for later use (optional)
    cache = bundle;

    // Alternatively, let Rollup do it for you
    // (this returns a promise). This is much
    // easier if you're generating a sourcemap
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
    // If you have a bundle you want to re-use (e.g., when using a watcher to rebuild as files change),
    // you can tell rollup use a previous bundle as its starting point.
    // This is entirely optional!
    cache: cache,
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
        commonjs()
    ]
}).then(function (bundle) {
    // Cache our bundle for later use (optional)
    cache = bundle;

    // Alternatively, let Rollup do it for you
    // (this returns a promise). This is much
    // easier if you're generating a sourcemap
    bundle.write({
        format: 'es',
        dest: 'dist/' + packageJson.name + '.es2015.js'
    });
});
