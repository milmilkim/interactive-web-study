import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import config from './config.ts';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? config.APP_ROOT : '/',
  plugins: [react()],
});
