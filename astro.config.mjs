// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'http://rasxcore.ru/',
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },
});
