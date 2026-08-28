import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['hardcopy-unhinge-salutary.ngrok-free.dev', 'confound-unmanaged-vocally.ngrok-free.dev'],
  },
})
