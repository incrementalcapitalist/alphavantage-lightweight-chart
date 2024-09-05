/**
 * @file vite.config.ts
 * @description Vite configuration file for a React project using TypeScript.
 * This file sets up the build process, plugins, and other settings for the Vite bundler.
 */

// Import the defineConfig function from Vite
import { defineConfig } from 'vite'

// Import the React plugin for Vite
import react from '@vitejs/plugin-react'

// Import the path module for working with file and directory paths
import path from 'path'

// Export the configuration object using defineConfig
export default defineConfig({
  // Define plugins to be used by Vite
  plugins: [react()], // Use the React plugin for Vite

  // Build configuration
  build: {
    // Specify the output directory for the production build
    outDir: 'dist',

    // Empty the output directory before building
    emptyOutDir: true,
  },

  // Resolve configuration
  resolve: {
    // Set up path aliases for easier imports
    alias: {
      '@': path.resolve(__dirname, './src') // Alias '@' to the 'src' directory
    }
  },

  // CSS configuration
  css: {
    // Specify the PostCSS config file
    postcss: './postcss.config.js',
  },
})