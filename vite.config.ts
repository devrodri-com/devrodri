import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  publicDir: isSsrBuild ? false : 'public',
  plugins: [react()],
}))
