import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

const resolvePath = (p: string) => path.resolve(import.meta.dirname, p);

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  source: {
    entry: { index: resolvePath('./src/main.tsx') },
  },
  resolve: {
    alias: { '@': resolvePath('./src') },
  },
  html: {
    template: './index.html',
    title: 'Recipes Explorer',
    meta: { description: 'Browse sample recipes and open their ingredients and method.' },
    tags: [
      { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
      { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap',
        },
      },
      { tag: 'link', attrs: { rel: 'icon', href: '/recipe-placeholder.svg', type: 'image/svg+xml' } },
    ],
  },
  output: {
    distPath: { root: resolvePath('./dist') },
    cleanDistPath: true,
  },
  server: {
    port: 3000,
    // Client-side routes such as /recipes/12 must fall back to index.html.
    historyApiFallback: true,
    open: false,
  },
});
