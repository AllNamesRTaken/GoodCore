var packageJson = require("./package.json");

import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/lib/index.ts',
    format: 'umd',
    dest: 'dist/' + packageJson.name + '.umd.js',
    moduleName: packageJson.name,
    external: ['ts-md5/dist/md5'],
    sourceMap: true,
    globals: {
        'ts-md5/dist/md5': 'Md5'
    },
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}
