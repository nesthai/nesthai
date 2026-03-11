#!/usr/bin/env node
/**
 * Extrait le contenu <main> de chaque page HTML statique
 * et le sauvegarde dans src/pages/ pour le système de build
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src', 'pages');

// Pages property/listing à ne PAS extraire (gérées par templates)
const SKIP_PREFIXES = ['condo-', 'maison-', 'terrain-', 'projet-'];
const SKIP_FILES = ['condos.html', 'maisons.html', 'terrains.html', 'projets.html'];

// Créer le dossier de sortie
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

const htmlFiles = fs.readdirSync(ROOT).filter(f => {
  if (!f.endsWith('.html')) return false;
  if (SKIP_FILES.includes(f)) return false;
  if (SKIP_PREFIXES.some(p => f.startsWith(p))) return false;
  return true;
});

console.log(`📂 Pages statiques trouvées: ${htmlFiles.length}\n`);

const pagesMeta = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  
  // Extraire le contenu principal
  let content = '';
  
  // Essayer <main ...>...</main>
  let match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (match) {
    content = match[1].trim();
  } else {
    // Essayer de trouver le contenu entre header/footer
    match = html.match(/<\/header>[\s\S]*?<\/div>\s*([\s\S]*?)\s*(?:<footer|<!-- FOOTER|<!-- Sticky WhatsApp)/i);
    if (match) content = match[1].trim();
  }
  
  // Extraire les métadonnées SEO
  const title = (html.match(/<title>(.*?)<\/title>/) || ['', ''])[1];
  const description = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || ['', ''])[1];
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/) || ['', ''])[1];
  
  // Extraire le bodyClass
  const bodyClass = (html.match(/<body\s+class="([^"]*)"/) || ['', ''])[1];
  
  // Sauvegarder le contenu
  if (content) {
    fs.writeFileSync(path.join(OUTPUT, file), content, 'utf8');
    console.log(`  ✅ ${file} → src/pages/${file} (${content.length} chars)`);
  } else {
    console.log(`  ⚠️  ${file} → contenu non trouvé`);
  }
  
  // Collecter les métadonnées
  pagesMeta.push({
    output: file,
    contentFile: `src/pages/${file}`,
    data: {
      title: title,
      description: description,
      canonicalUrl: canonical || `https://www.beaulieu-pattaya.com/${file}`,
      bodyClass: bodyClass || `page-${file.replace('.html', '')}`
    }
  });
}

// Sauvegarder les métadonnées des pages
const pagesJsonPath = path.join(ROOT, 'data', 'pages.json');
fs.writeFileSync(pagesJsonPath, JSON.stringify({ pages: pagesMeta }, null, 2), 'utf8');
console.log(`\n📦 Métadonnées → ${pagesJsonPath}`);
console.log(`📦 ${htmlFiles.length} pages de contenu extraites vers src/pages/`);
