import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'lib/index.ts',
      name: 'Expest',
      fileName: (format) => `expest.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'node:fs',
        'express',
        'reflect-metadata',
        'class-transformer',
        'class-validator',
      ],
      output: {
        exports: 'named',
      },
    },
    target: ['es2022', 'node18'],
    minify: false,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
})
