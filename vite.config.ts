import { defineConfig } from 'vite'
import react from '@vitejs.plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path to your GitHub repository name for correct relative asset routing on GitHub Pages
  base: '/BookPartner/', 
  resolve: {
    alias: {
      // Allows clean imports like "@/components/..." instead of relative paths
      '@': path.resolve(__dirname, './src'),
    },
  },
})
