import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/RATP2/', // ← Ajoute ça (remplace "RATP2" par le nom de ton repo)
})
