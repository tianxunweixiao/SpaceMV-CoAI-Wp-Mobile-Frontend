import path from 'path'
import react from '@vitejs/plugin-react-swc'
// @ts-ignore
import cssnano from 'cssnano'
// @ts-ignore
import postcssAspectRatioMini from 'postcss-aspect-ratio-mini'
// @ts-ignore
import postcssPresetEnv from 'postcss-preset-env'
// @ts-ignore
import postcssPxToViewport from 'postcss-px-to-viewport'
// @ts-ignore
import postcssViewportUnits from 'postcss-viewport-units'
// @ts-ignore
import postcssWriteSvg from 'postcss-write-svg'
// @ts-ignore
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        postcssAspectRatioMini(),
        postcssPxToViewport({
          viewportWidth: 750,
          viewportHeight: 1334,
          unitPrecision: 3,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: false
        }),
        postcssWriteSvg(),
        postcssPresetEnv({
          stage: 3
        }),
        postcssViewportUnits(),
        cssnano({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        })
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/upload/': {
        target: 'http://example.com/',
        changeOrigin: true
      },
      '/dev-api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      },
      '/prod-api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx']
    }
  }
})
