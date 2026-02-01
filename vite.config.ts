

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This configuration ensures that process.env.API_KEY is replaced with the 
// actual value from your Netlify environment variables during the build process.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
  }
});
