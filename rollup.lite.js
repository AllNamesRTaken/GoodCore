import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: 'src/lib/GoodCoreLite.ts',
        plugins: [
            typescript({tsconfig: "tsconfig.lite.json"}),
            nodeResolve(),
            commonjs(),
            // terser(),
            babel({
                extensions: ['.js', '.ts'],
            }),
            uglify({mangle: true}),
        ],
        output: {
            file: 'dist/lib/goodcore-lite.bundle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        },
        context: 'this',
    },
    {
        input: 'src/lib/GoodCoreLite.ts',
        plugins: [
            typescript({tsconfig: "tsconfig.lite.json"}),
            nodeResolve(),
            commonjs(),
            // terser(),
            babel({
                extensions: ['.js', '.ts'],
            }),
        ],
        output: {
            file: 'dist/lib/goodcore-lite.bundle.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        },
        context: 'this',
    },
];