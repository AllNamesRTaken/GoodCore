import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' };

export default [
    {
        input: 'src/lib/GoodCoreLite.ts',
        plugins: [
            typescript({tsconfig: "tsconfig.lite.json"}),
            nodeResolve(),
            commonjs(),
            terser(),
        ],
        output: {
            file: 'dist/lib/goodcore-lite.bundle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        },
        context: 'this',
    },
    // {
    //     input: 'src/lib/GoodCoreLite.ts',
    //     plugins: [
    //         typescript({tsconfig: "tsconfig.lite.json"}),
    //         nodeResolve(),
    //         commonjs(),
    //     ],
    //     output: {
    //         file: 'dist/lib/goodcore-lite.bundle.js',
    //         format: 'umd',
    //         name: pkg.name.toLowerCase(),
    //         sourcemap: true,
    //     },
    //     context: 'this',
    // },
    // {
    //     input: 'src/lib/GoodCoreLite.ts',
    //     plugins: [
    //         typescript({tsconfig: "tsconfig.lite.json"}),
    //         nodeResolve(),
    //         commonjs(),
    //         terser({mangle: false}),
    //     ],
    //     output: {
    //         file: 'dist/lib/goodcore-lite.bundle.nomangle.min.js',
    //         format: 'umd',
    //         name: pkg.name.toLowerCase(),
    //         sourcemap: true,
    //     },
    //     context: 'this',
    // },
];