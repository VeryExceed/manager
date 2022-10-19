import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias:{
      '@': resolve( __dirname, './src' ),
      'Views': resolve(__dirname, 'src/views')
    }
  },
  server:{
    host: 'localhost',
    port: 9704,
    proxy: {
      '/api': {
        target: "http://192.168.3.124:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [vue()]
})
