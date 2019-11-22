//import commonjs from 'rollup-plugin-commonjs';
// import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
    {
        input: 'src/lib/index-core.ts',
        plugins: [
            typescript(/*{ plugin options }*/),
            babel({
                extensions: ['.js', '.ts'],
            }),
            uglify({mangle: true}),
        ],
        output: {
            file: 'dist/lib/goodcore.core.bundle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        }
    },
];