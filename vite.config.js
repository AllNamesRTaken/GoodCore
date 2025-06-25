import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({

  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'goodcore',
      formats: ["iife"],
      fileName: (format) => `goodcore.${format}.js`
    }
  }
})