import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/crossroads",
  server: {
    allowedHosts: ["c7eb6c3216aa.ngrok-free.app"]
  }
})
