import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' };


export default [
    // {
    //     input: 'src/lib/index.ts',
    //     plugins: [
    //         typescript({tsconfig: "tsconfig.app.json"}),
    //         // babel({
    //         //     extensions: ['.js', '.ts'],
    //         // }),
    //     ],
    //     output: {
    //         file: 'dist/lib/goodcore.bundle.js',
    //         format: 'umd',
    //         name: pkg.name.toLowerCase(),
    //         sourcemap: true,
    //     }
    //     // globals: (id) => /goodcorees/.test(id) ? id.replace("goodcorees", "goodcore").replace(/\//g, ".") : id,
    // },
    // {
    //     input: 'src/lib/index.ts',
    //     // external: (id) => /goodcorees/.test(id),
    //     plugins: [
    //         typescript({tsconfig: "tsconfig.app.json"}),
    //         // babel({
    //         //     extensions: ['.js', '.ts'],
    //         // }),
    //         terser({mangle: false}),
    //     ],
    //     output: {
    //         file: 'dist/lib/goodcore.bundle.nomangle.min.js',
    //         format: 'umd',
    //         name: pkg.name.toLowerCase(),
    //         sourcemap: true,
    //     }
    // },
    {
        input: 'src/lib/index.ts',
        plugins: [
            typescript({tsconfig: "tsconfig.app.json"}),
            // babel({
            //     extensions: ['.js', '.ts'],
            // }),
            terser({mangle: true}),
        ],
        output: {
            file: 'dist/lib/goodcore.bundle.min.js',
            format: 'umd',
            name: pkg.name.toLowerCase(),
            sourcemap: true,
        }
    },
];