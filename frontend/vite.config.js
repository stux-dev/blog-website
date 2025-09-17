import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    // Add this configuration
    hmr: {
      host: '500fd69d30f4.ngrok-free.app', 
      protocol: 'wss',
    },
    // And this one
    allowedHosts: [
        '500fd69d30f4.ngrok-free.app'
    ],
  },
})
