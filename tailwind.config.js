/**
 * @file tailwind.config.js
 * @version 1.1.0
 * @description Tailwind CSS configuration file with custom color palette
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  // Specify the files to scan for class names
  // This helps Tailwind identify which classes are actually used in your project
  content: [
    "./public/index.html",        // Scan the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/TS files in src directory and subdirectories
    "./src/css/index.css"         // Scan the main CSS file
  ],
  
  // Define theme customizations
  theme: {
    extend: {
      // Extend the default color palette with custom colors
      // This allows you to use these custom colors in your Tailwind classes
      colors: {
        // Custom purple shades
        // These can be used like 'bg-purple-500' or 'text-purple-700'
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Custom gray shades for dark mode
        // These override Tailwind's default gray palette
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  
  // Add any Tailwind CSS plugins here
  // Plugins can extend Tailwind's functionality
  plugins: [],
};