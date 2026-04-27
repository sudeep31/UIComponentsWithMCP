import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// All peer deps + dev deps should be external (not bundled)
const externals = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
]

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  // Don't copy public/ assets — this is a library, not an app
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CLReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: externals,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Preserve CSS as separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some(n => n.endsWith('.css'))) return 'styles.css'
          return assetInfo.names?.[0] ?? 'assets/[name][extname]'
        },
      },
    },
    sourcemap: true,
    // Don't minify — consumers control this
    minify: false,
  },
})
