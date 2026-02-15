import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/RATP2/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  base: '/RATP2/', // ← Ajoute ça (remplace "RATP2" par le nom de ton repo)
})
