import { defineCollection, z } from 'astro:content';

// Définir le schéma pour tous vos articles
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Définir vos collections
const reseau = defineCollection({
  type: 'content',
  schema: articleSchema,
});

const web = defineCollection({
  type: 'content',
  schema: articleSchema,
});

const systeme = defineCollection({
  type: 'content',
  schema: articleSchema,
});

const logiciel = defineCollection({
  type: 'content',
  schema: articleSchema,
});

// Exporter toutes les collections
export const collections = {
  reseau,
  web,
  systeme,
  logiciel,
};