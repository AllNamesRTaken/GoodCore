//import commonjs from 'rollup-plugin-commonjs';
// import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
    {
        input: 'src/lib/index.ts',
        plugins: [
            typescript(/*{ plugin options }*/),
            babel({
                extensions: ['.js', '.ts'],
            }),
            // Es3 garbage
            // babel({
            //     babelrc: false,
            //     plugins: ["@babel/plugin-transform-reserved-words", "@babel/plugin-transform-property-literals", "@babel/plugin-transform-member-expression-literals"],
            //     extensions: ['.js', '.ts'],
            // }),
        ],
        output: {
            file: 'dist/lib/goodcore.bundle.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        }
        // globals: (id) => /goodcorees/.test(id) ? id.replace("goodcorees", "goodcore").replace(/\//g, ".") : id,
    },
    {
        input: 'src/lib/index.ts',
        // external: (id) => /goodcorees/.test(id),
        plugins: [
            typescript(/*{ plugin options }*/),
            babel({
                extensions: ['.js', '.ts'],
            }),
            uglify({mangle: false}),
        ],
        output: {
            file: 'dist/lib/goodcore.bundle.nomangle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        }
    },
    {
        input: 'src/lib/index.ts',
        plugins: [
            typescript(/*{ plugin options }*/),
            babel({
                extensions: ['.js', '.ts'],
            }),
            uglify({mangle: true}),
        ],
        output: {
            file: 'dist/lib/goodcore.bundle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        }
    },
];