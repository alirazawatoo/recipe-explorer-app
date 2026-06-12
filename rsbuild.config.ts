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
    title: 'Recipes Explorer',
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
