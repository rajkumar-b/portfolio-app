// vite.config.js

import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'res/*',
          dest: 'res'
        }
      ]
    })
  ]
}