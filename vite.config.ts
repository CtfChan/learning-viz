import { defineConfig } from 'vite'

export default defineConfig({
  // For GitHub Pages deployment, set base to your repo name
  // e.g., base: '/learning-3d/' if your repo is https://github.com/username/learning-3d
  base: '/learning-3d/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
