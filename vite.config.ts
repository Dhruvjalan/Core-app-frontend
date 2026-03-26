import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/core-frontend/",
  server: {
    allowedHosts: ["c7eb6c3216aa.ngrok-free.app"]
  }
})
