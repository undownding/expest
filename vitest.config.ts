import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'cobertura'],
      },
      reporters: ['default', 'junit'],
      outputFile: {
        junit: 'junit.xml',
      },
    },
  }),
)
