import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/auth': 'http://backend:5000',
      '/admin': 'http://backend:5000',
      '/user': 'http://backend:5000',
      '/company': 'http://backend:5000',
      '/shareholder': 'http://backend:5000',
      '/shareholders': 'http://backend:5000',
    }
  }
})
