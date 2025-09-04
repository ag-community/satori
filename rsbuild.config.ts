import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    meta: {
      description: 'Adrenaline Gamer Rating System',
      'theme-color': '#ffffff',
      'msapplication-TileColor': '#ffffff',
    },
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap',
        },
      },
      { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.json' } },
      { tag: 'meta', attrs: { name: 'darkreader-lock' } },
    ],
  },
  server: {
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000,
  },
});
