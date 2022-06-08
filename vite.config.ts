/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:08:26
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 15:43:06
*/
import { defineConfig } from 'vite'
const path = require('path')
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, './lib/index.ts'),
      name: 'reactRouterMiddlewarePlus',
      fileName: 'index',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          'vue': 'Vue',
          'react-router-dom': 'reactRouterDom',
          'react': 'React'
        }
      }
    }
  }
})
