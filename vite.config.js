import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from "vite-plugin-wasm";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync('_private.pem'),
      cert: fs.readFileSync('_cert.pem')
    },

  },
  plugins: [wasm(), vue()],
})
