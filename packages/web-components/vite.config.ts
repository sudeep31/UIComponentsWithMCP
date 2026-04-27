import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    publicDir: false,
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'CLWebComponents',
            formats: ['es'],
            fileName: () => 'custom-elements.js',
        },
        rollupOptions: {
            // Self-contained bundle — React IS included so consumers need no dependencies
            external: [],
            output: {
                // Inline CSS directly into the JS bundle using constructable stylesheets
                // so the custom elements work in any shadow DOM or light DOM context
                assetFileNames: (assetInfo) => {
                    if (assetInfo.names?.some(n => n.endsWith('.css'))) return 'custom-elements.css'
                    return assetInfo.names?.[0] ?? 'assets/[name][extname]'
                },
            },
        },
        sourcemap: true,
        // Use Vite 8 default minifier (Oxc — esbuild is no longer bundled)
        minify: true,
    },
})
