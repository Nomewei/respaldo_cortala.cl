import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Esto es útil para el desarrollo local, para que tu frontend hable con el backend
    proxy: {
      '/create_preference': 'http://127.0.0.1:5000',
      '/webhook': 'http://127.0.0.1:5000',
    }
  }
})
