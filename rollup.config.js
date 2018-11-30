//import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

var plugins = [
    nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        preferBuiltins: false
    }),
    //commonjs({
    //    include: 'node_modules/**',  // Default: undefined
    //    ignoreGlobal: false,  // Default: false
    //}),
    typescript(/*{ plugin options }*/),
    babel({
        //exclude: 'node_modules/**',
        extensions: ['.js', '.ts'],
    }),
    uglify(),
];

export default [
    {
        input: 'src/lib/index.ts',
        // external: (id) => /goodcorees/.test(id),
        plugins,
        output: {
            file: 'dist/lib/goodcore.bundle.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
            // globals: (id) => /goodcorees/.test(id) ? id.replace("goodcorees", "goodcore").replace(/\//g, ".") : id,
        }
    },
];