import { getCollection } from 'astro:content';
import { categories } from '../../config/categories';

export async function GET() {
  const allEntries = [];

  for (const category of categories) {
    const entries = await getCollection(category);
    for (const entry of entries) {
      allEntries.push({
        title: entry.data.title,
        description: entry.data.description,
        tags: entry.data.tags || [],
        category,
        url: `/blog/${category}/${entry.slug}`,
      });
    }
  }

  return new Response(JSON.stringify(allEntries), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
