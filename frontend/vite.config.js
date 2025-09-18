import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Add this configuration
    hmr: {
      host: '35f217d2a02e.ngrok-free.app', 
      protocol: 'wss',
    },
    // And this one
    allowedHosts: [
        '35f217d2a02e.ngrok-free.app'
    ],
  },
})
