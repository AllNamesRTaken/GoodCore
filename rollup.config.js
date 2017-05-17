var packageJson = require("./package.json");

import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/lib/index.ts',
    format: 'umd',
    targets: [
            { dest: 'dist/' + packageJson.name + '.umd.js', format: 'umd' },
            { dest: 'dist/' + packageJson.name + '.es.js', format: 'es' },
            { dest: 'dist/' + packageJson.name + '.iife.js', format: 'iife' }
    ],
    moduleName: packageJson.name,
    external: ['ts-md5/dist/md5'],
    sourceMap: true,
    globals: {
        'ts-md5/dist/md5': 'Md5'
    },
    treeshake: true,
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}
