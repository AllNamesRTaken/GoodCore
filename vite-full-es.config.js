import path from 'path'
import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";

export default defineConfig({
  // plugins: [
  //   dts({
  //     copyDtsFiles: true,
  //     insertTypesEntry: false,
  //     rollupTypes: false,
  //     tsconfigPath: './tsconfig.full.json'
  //   }),
  // ],
  build: {
    outDir: './dist/lib',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'goodcore',
      formats: ["es"],
      fileName: (format) => `goodcore.${format}.bundle.min.js`
    }
  }
})