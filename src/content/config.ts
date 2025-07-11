import { defineCollection, z } from 'astro:content';
import { categories } from '../config/categories';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const collections = Object.fromEntries(
  categories.map((name) => [name, defineCollection({ type: 'content', schema: articleSchema })])
);
