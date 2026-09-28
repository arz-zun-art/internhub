import react from '@vitejs/plugin-react'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: join(tmpdir(), 'internhub-vite'),
})
