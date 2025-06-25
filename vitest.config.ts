import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Use jsdom for browser-like tests
    coverage: {
      include: ['src/lib/**/*'],
      exclude: ['src/**/wip', 'src/lib/GoodCoreLite.ts', 'src/lib/Integration.ts', 'src/lib/webpackExternals.js'],
      reporter: ['text'], // Optional: Add coverage reports
    },
    include: ['**/__tests__/**/*Test.ts'],
    exclude: ['**/benchmark', '**/wip', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
  },
})