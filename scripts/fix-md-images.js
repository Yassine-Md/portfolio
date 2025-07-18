import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
}

walk(CONTENT_DIR, (filepath) => {
  if (!filepath.endsWith('.md')) return;

  const fileDir = path.dirname(filepath);
  const rawContent = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(rawContent);

  const matches = [...content.matchAll(/!\[\[([^\]]+)\]\]/g)];
  if (matches.length === 0) return;

  const relativeDir = path.relative(CONTENT_DIR, fileDir); // e.g., reseau/LVM
  const [category, topicSlug] = relativeDir.split(path.sep);

  let updatedContent = content;

  for (const match of matches) {
    const imageName = match[1];
    const srcImagePath = path.join(fileDir, imageName);
    const destDir = path.join(PUBLIC_DIR, category, topicSlug);
    const destImagePath = path.join(destDir, imageName);
    const publicPath = `/${category}/${topicSlug}/${imageName}`;

    // Créer le dossier public/… si nécessaire
    fs.mkdirSync(destDir, { recursive: true });

    // Copier l’image si elle existe
    if (fs.existsSync(srcImagePath)) {
      fs.copyFileSync(srcImagePath, destImagePath);
      console.log(`✅ Image copiée: ${publicPath}`);
    } else {
      console.warn(`❌ Image introuvable: ${srcImagePath}`);
    }

    // Remplacer ![[LVM.png]] par ![LVM](/reseau/LVM/LVM.png)
    updatedContent = updatedContent.replace(match[0], `![${imageName}](${publicPath})`);
  }

  const newRawContent = matter.stringify(updatedContent, data);
  fs.writeFileSync(filepath, newRawContent, 'utf-8');
  console.log(`📄 Fichier mis à jour: ${filepath}`);
});
