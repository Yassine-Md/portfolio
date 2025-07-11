import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    render: [
      '@astrojs/markdown-remark',
      {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    ],
  },
});
