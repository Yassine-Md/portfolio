import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  markdown: {
    render: [
      '@astrojs/markdown-remark', 
      {
        remarkPlugins: [],
        rehypePlugins: [],
      }
    ]
  }
  
});
