import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  esbuild: false,
  build: {
    lib: {
      entry: 'lib/index.ts',
      name: 'expest',
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
    ...VitePluginNode({
      adapter: 'express',
      appPath: './lib/index.ts',
      tsCompiler: 'swc',
      swcOptions: {
        jsc: {
          target: 'es2024',
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
    }),
  ],
})
