// vite.config.js
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: './index.html', 
        portfolio: './portfolio/index.html', 
      },
      output: {
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'res/*',
          dest: 'res'
        }
      ]
    })
  ],
});