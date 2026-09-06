import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Adrenaline Gamer Rating',
    meta: {
      description: 'Adrenaline Gamer Rating System',
      'theme-color': '#3e4637',
      'msapplication-TileColor': '#3e4637',
    },
    tags: [
      { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.json' } },
    ],
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    copy: {
      patterns: [
        {
          from: 'src/locales/*.json',
          to: 'locales/[name][ext]',
        },
      ],
    },
  },
  server: {
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 5173,
  },
});
