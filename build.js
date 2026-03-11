#!/usr/bin/env node

/**
 * Système de Build Unifié - Nes Thai Business
 * 
 * Génère TOUTES les pages du site à partir de :
 * - data/properties.json → pages d'annonces + pages de listing
 * - data/pages.json     → pages statiques (guides, contact, etc.)
 * - data/site.json      → données globales du site
 * 
 * Usage:
 *   node build.js           # Build complet
 *   node build.js --watch   # Mode développement
 *   node build.js --page=index  # Build une page spécifique
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  templatesDir: './templates',
  partialsDir: './templates/partials',
  pagesTemplatesDir: './templates/pages',
  layoutsDir: './templates/layouts',
  srcPagesDir: './src/pages',
  outputDir: './dist',
  dataDir: './data',
  propertiesFile: './data/properties.json',
  siteFile: './data/site.json',
  pagesFile: './data/pages.json',
  staticDirs: ['css', 'js', 'images', 'icons', 'videos', 'fonts', 'admin']
};

// ═══════════════════════════════════════════════════════════════
// HANDLEBARS HELPERS
// ═══════════════════════════════════════════════════════════════

Handlebars.registerHelper('currentYear', () => new Date().getFullYear());

Handlebars.registerHelper('json', (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

Handlebars.registerHelper('replace', (str, search, replace) => {
  return str ? str.replace(search, replace) : '';
});

Handlebars.registerHelper('formatPrice', (price) => {
  if (!price) return '0';
  return new Intl.NumberFormat('fr-FR').format(price);
});

Handlebars.registerHelper('formatPriceShort', (price) => {
  if (!price) return '0';
  if (price >= 1000000) return (price / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
  return price.toString();
});

Handlebars.registerHelper('capitalize', (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('statusLabel', (status) => {
  const labels = {
    'for-sale': 'À Vendre',
    'for-rent': 'À Louer',
    'sold': 'Vendu',
    'reserved': 'Réservé',
    'off-market': 'Hors marché'
  };
  return labels[status] || status;
});

Handlebars.registerHelper('truncate', (str, len) => {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
});

Handlebars.registerHelper('gt', (a, b) => a > b);
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('or', (a, b) => a || b);

Handlebars.registerHelper('featureIcon', (label) => {
  const icons = {
    'chambres': '🛏️', 'chambre': '🛏️',
    'salles de bain': '🛁', 'salle de bain': '🛁', 'bathroom': '🛁',
    'surface': '📐',
    'piscine': '🏊', 'pool': '🏊',
    'parking': '🅿️',
    'plage': '🏖️', 'beach': '🏖️',
    'vue': '👁️', 'vue mer': '🌊',
    'jardin': '🌿', 'garden': '🌿',
    'terrasse': '☀️',
    'sécurité': '🔒',
    'gym': '💪', 'salle de sport': '💪', 'fitness': '💪',
    'climatisation': '❄️',
    'ascenseur': '🛗',
    'meublé': '🪑',
    'cuisine': '👨‍🍳'
  };
  const key = (label || '').toLowerCase();
  return icons[key] || '🔍';
});

// ═══════════════════════════════════════════════════════════════
// CHARGEMENT DES DONNÉES
// ═══════════════════════════════════════════════════════════════

function loadJSON(filepath) {
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  Fichier non trouvé: ${filepath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function loadSiteData() {
  return loadJSON(CONFIG.siteFile) || {};
}

function loadProperties() {
  const props = loadJSON(CONFIG.propertiesFile);
  if (!props) return [];
  return (Array.isArray(props) ? props : []).filter(p => p.isPublished !== false);
}

function loadPagesData() {
  const data = loadJSON(CONFIG.pagesFile);
  return data ? data.pages || [] : [];
}

// ═══════════════════════════════════════════════════════════════
// CHARGEMENT DES TEMPLATES
// ═══════════════════════════════════════════════════════════════

function loadPartials() {
  const partials = {};
  const dirs = [CONFIG.partialsDir];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.html')) {
        const name = path.basename(file, '.html');
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        partials[name] = content;
        Handlebars.registerPartial(name, content);
        console.log(`  📦 Partial: ${name}`);
      }
    });
  }
  return partials;
}

function compileTemplate(templatePath) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template non trouvé: ${templatePath}`);
  }
  return Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
}

// ═══════════════════════════════════════════════════════════════
// COPIE DES FICHIERS STATIQUES
// ═══════════════════════════════════════════════════════════════

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyStaticAssets() {
  console.log('\n📁 Copie des fichiers statiques...');
  for (const dir of CONFIG.staticDirs) {
    if (fs.existsSync(dir)) {
      copyDirSync(dir, path.join(CONFIG.outputDir, dir));
      console.log(`  📂 ${dir}/`);
    }
  }
  // Copier les fichiers racine importants
  const rootFiles = ['robots.txt', 'sitemap.xml', 'rss.xml', 'manifest.json'];
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(CONFIG.outputDir, file));
      console.log(`  📄 ${file}`);
    }
  }
  // .nojekyll pour GitHub Pages
  fs.writeFileSync(path.join(CONFIG.outputDir, '.nojekyll'), '');
  console.log('  📄 .nojekyll');
}

// ═══════════════════════════════════════════════════════════════
// GÉNÉRATION DES PAGES DE PROPRIÉTÉS
// ═══════════════════════════════════════════════════════════════

function buildPropertyPages(properties, site, layoutTemplate) {
  console.log('\n🏠 Génération des pages d\'annonces...');
  
  const propertyTemplate = compileTemplate(
    path.join(CONFIG.pagesTemplatesDir, 'property.html')
  );
  
  for (const prop of properties) {
    // Enrichir les features avec des icônes
    const features = (prop.features || []).map(f => ({
      ...f,
      icon: Handlebars.helpers.featureIcon(f.label)
    }));
    
    // Préparer la description HTML
    const descriptionHtml = (prop.description || '')
      .replace(/✓/g, '<br>✓')
      .replace(/\n/g, '<br>');
    
    // Construire le structured data
    const structuredData = prop.structuredData || buildPropertyStructuredData(prop, site);
    
    // Rendre le contenu de la page
    const content = propertyTemplate({
      ...prop,
      features,
      descriptionHtml,
      site,
    });
    
    // Déterminer les nav actifs selon le type
    const activeNav = {};
    if (prop.type === 'condo') activeNav.activeCondos = true;
    else if (prop.type === 'maison' || prop.type === 'villa') activeNav.activeMaisons = true;
    else if (prop.type === 'terrain') activeNav.activeTerrains = true;
    else if (prop.type === 'projet') activeNav.activeProjets = true;
    
    // Préparer les meta (fallback si seo.description vide)
    const metaTitle = prop.seo?.title || `${prop.title} | Nes Thai Business`;
    const metaDescription = (prop.seo?.description || prop.description?.substring(0, 160) || '').trim();
    const metaImage = prop.images?.[0] || site.seo?.defaultOgImage;
    
    // Rendre la page complète dans le layout
    const html = layoutTemplate({
      title: metaTitle,
      description: metaDescription,
      canonicalUrl: prop.seo?.canonicalUrl || `${site.url}/${prop.slug}.html`,
      ogType: 'product',
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      ogImage: metaImage,
      twitterTitle: metaTitle,
      twitterDescription: metaDescription,
      twitterImage: metaImage,
      bodyClass: `page-property page-${prop.type}`,
      extraCss: 'gallery.css',
      structuredData: JSON.stringify(structuredData, null, 2),
      content,
      site,
      ...activeNav,
    });
    
    const outputFile = `${prop.slug}.html`;
    fs.writeFileSync(path.join(CONFIG.outputDir, outputFile), html, 'utf8');
    console.log(`  ✅ ${outputFile}`);
  }
}

function buildPropertyStructuredData(prop, site) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": prop.title,
    "description": prop.description?.substring(0, 300),
    "url": `${site.url}/${prop.slug}.html`,
    "datePosted": prop.createdAt ? prop.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    "price": String(prop.price),
    "priceCurrency": prop.currency || "THB",
    "propertyType": prop.type === 'condo' ? 'Condo' : prop.type === 'maison' ? 'House' : prop.type === 'villa' ? 'Villa' : prop.type === 'terrain' ? 'Land' : 'RealEstate',
    "numberOfRooms": String(prop.rooms || prop.bedrooms || 0),
    ...(prop.surface ? {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": String(prop.surface),
        "unitCode": "MTK"
      }
    } : {}),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": prop.location?.city || "Pattaya",
      "addressRegion": "Chonburi",
      "addressCountry": "TH"
    },
    "offers": {
      "@type": "Offer",
      "price": String(prop.price),
      "priceCurrency": prop.currency || "THB",
      "availability": "https://schema.org/InStock",
      "businessFunction": "http://purl.org/goodrelations/v1#Sell"
    },
    "agent": {
      "@type": "RealEstateAgent",
      "name": site.legalName,
      "telephone": site.phone,
      "email": site.email,
      "url": site.url
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// GÉNÉRATION DES PAGES DE LISTING
// ═══════════════════════════════════════════════════════════════

function buildListingPages(properties, site, layoutTemplate) {
  console.log('\n📋 Génération des pages de listing...');
  
  const listingTemplate = compileTemplate(
    path.join(CONFIG.pagesTemplatesDir, 'listing.html')
  );
  
  const listings = [
    {
      output: 'condos.html',
      types: ['condo'],
      title: 'Condos à Vendre et Louer - Pattaya | Nes Thai Business',
      listingTitle: 'Condos à Vendre et Louer',
      description: 'Découvrez nos condos à vendre et à louer à Pattaya. Studios, 1-3 chambres, penthouses.',
      canonicalUrl: `${site.url}/condos.html`,
      bodyClass: 'page-condos',
      activeNav: { activeCondos: true }
    },
    {
      output: 'maisons.html',
      types: ['maison', 'villa'],
      title: 'Maisons et Villas à Vendre - Pattaya | Nes Thai Business',
      listingTitle: 'Maisons & Villas à Vendre',
      description: 'Villas et maisons de luxe à vendre à Pattaya et Jomtien. Piscine privée, vue mer.',
      canonicalUrl: `${site.url}/maisons.html`,
      bodyClass: 'page-maisons',
      activeNav: { activeMaisons: true }
    },
    {
      output: 'terrains.html',
      types: ['terrain'],
      title: 'Terrains à Vendre - Pattaya | Nes Thai Business',
      listingTitle: 'Terrains à Vendre',
      description: 'Terrains à vendre à Pattaya pour construction ou investissement.',
      canonicalUrl: `${site.url}/terrains.html`,
      bodyClass: 'page-terrains',
      activeNav: { activeTerrains: true }
    },
    {
      output: 'projets.html',
      types: ['projet'],
      title: 'Projets Neufs Immobiliers - Pattaya | Nes Thai Business',
      listingTitle: 'Projets Neufs',
      description: 'Développements immobiliers neufs à Pattaya. Condos off-plan, résidences de standing.',
      canonicalUrl: `${site.url}/projets.html`,
      bodyClass: 'page-projets',
      activeNav: { activeProjets: true }
    }
  ];
  
  for (const listing of listings) {
    const filteredProps = properties.filter(p => listing.types.includes(p.type));
    
    // Collecter les localisations uniques
    const locations = [...new Set(
      filteredProps.map(p => p.location?.district).filter(Boolean)
    )].sort();
    
    // Rendre le contenu listing
    const content = listingTemplate({
      listingTitle: listing.listingTitle,
      properties: filteredProps,
      locations,
      site,
    });
    
    // Rendre dans le layout
    const html = layoutTemplate({
      title: listing.title,
      description: listing.description,
      canonicalUrl: listing.canonicalUrl,
      ogType: 'website',
      ogTitle: listing.title,
      ogDescription: listing.description,
      ogImage: site.seo?.defaultOgImage,
      twitterTitle: listing.title,
      twitterDescription: listing.description,
      twitterImage: site.seo?.defaultOgImage || '',
      bodyClass: listing.bodyClass,
      content,
      site,
      ...listing.activeNav,
    });
    
    fs.writeFileSync(path.join(CONFIG.outputDir, listing.output), html, 'utf8');
    console.log(`  ✅ ${listing.output} (${filteredProps.length} propriétés)`);
  }
}

// ═══════════════════════════════════════════════════════════════
// GÉNÉRATION DES PAGES STATIQUES
// ═══════════════════════════════════════════════════════════════

function buildStaticPages(pagesData, site, layoutTemplate) {
  console.log('\n📄 Génération des pages statiques...');
  
  for (const page of pagesData) {
    const contentFile = path.join(CONFIG.srcPagesDir, page.output);
    
    if (!fs.existsSync(contentFile)) {
      console.warn(`  ⚠️  Contenu non trouvé: ${contentFile}`);
      continue;
    }
    
    // Lire le contenu brut de la page
    const content = fs.readFileSync(contentFile, 'utf8');
    
    // Déterminer les nav actifs
    const activeNav = {};
    const slug = page.output.replace('.html', '');
    if (slug === 'index') activeNav.activeAccueil = true;
    else if (slug === 'guides' || slug.startsWith('guide-')) activeNav.activeGuides = true;
    else if (slug === 'contact') activeNav.activeContact = true;
    else if (slug === 'actualites') activeNav.activeActualites = true;
    
    // Construire les structuredData si présentes
    let structuredData = null;
    if (page.data?.structuredData) {
      structuredData = JSON.stringify(page.data.structuredData, null, 2);
    }
    
    // Déterminer le extraCss
    let extraCss = null;
    if (page.data?.extraCss) extraCss = page.data.extraCss;
    
    const html = layoutTemplate({
      title: page.data?.title || 'Nes Thai Business',
      description: page.data?.description || '',
      keywords: page.data?.keywords || '',
      canonicalUrl: page.data?.canonicalUrl || `${site.url}/${page.output}`,
      ogType: page.data?.ogType || 'website',
      ogTitle: page.data?.ogTitle || page.data?.title || '',
      ogDescription: page.data?.ogDescription || page.data?.description || '',
      ogImage: page.data?.ogImage || site.seo?.defaultOgImage,
      twitterTitle: page.data?.twitterTitle || page.data?.title || '',
      twitterDescription: page.data?.twitterDescription || page.data?.description || '',
      twitterImage: page.data?.twitterImage || page.data?.ogImage || '',
      bodyClass: page.data?.bodyClass || `page-${slug}`,
      extraCss,
      structuredData,
      content,
      site,
      ...activeNav,
    });
    
    fs.writeFileSync(path.join(CONFIG.outputDir, page.output), html, 'utf8');
    console.log(`  ✅ ${page.output}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// GÉNÉRATION DU SITEMAP
// ═══════════════════════════════════════════════════════════════

function buildSitemap(properties, pagesData, site) {
  console.log('\n🗺️  Génération du sitemap...');
  
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Page d'accueil
  xml += `  <url>\n    <loc>${site.url}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Pages de listing
  const listingPages = ['condos.html', 'maisons.html', 'terrains.html', 'projets.html'];
  for (const page of listingPages) {
    xml += `  <url>\n    <loc>${site.url}/${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }
  
  // Pages d'annonces
  for (const prop of properties) {
    const lastmod = prop.updatedAt ? prop.updatedAt.split('T')[0] : today;
    xml += `  <url>\n    <loc>${site.url}/${prop.slug}.html</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  
  // Pages statiques
  for (const page of pagesData) {
    if (page.output === 'index.html') continue; // déjà ajouté
    if (listingPages.includes(page.output)) continue; // déjà ajouté
    xml += `  <url>\n    <loc>${site.url}/${page.output}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }
  
  xml += '</urlset>\n';
  
  fs.writeFileSync(path.join(CONFIG.outputDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`  ✅ sitemap.xml (${properties.length + pagesData.length + listingPages.length + 1} URLs)`);
}

// ═══════════════════════════════════════════════════════════════
// BUILD PRINCIPAL
// ═══════════════════════════════════════════════════════════════

function buildAll() {
  console.log('\n🔨 ═══════════════════════════════════════════');
  console.log('   Nes Thai Business - Build Statique Unifié');
  console.log('═══════════════════════════════════════════════\n');
  
  const startTime = Date.now();
  
  // 1. Nettoyer dist/
  if (fs.existsSync(CONFIG.outputDir)) {
    fs.rmSync(CONFIG.outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  
  // 2. Charger les données
  console.log('📊 Chargement des données...');
  const site = loadSiteData();
  const properties = loadProperties();
  const pagesData = loadPagesData();
  console.log(`  📦 ${properties.length} propriétés`);
  console.log(`  📄 ${pagesData.length} pages statiques`);
  console.log(`  🌐 Site: ${site.name}`);
  
  // 3. Charger les partials et le layout
  console.log('\n📂 Chargement des templates...');
  loadPartials();
  const layoutTemplate = compileTemplate(
    path.join(CONFIG.layoutsDir, 'default.html')
  );
  
  // 4. Copier les assets statiques
  copyStaticAssets();
  
  // 5. Générer les pages d'annonces
  buildPropertyPages(properties, site, layoutTemplate);
  
  // 6. Générer les pages de listing
  buildListingPages(properties, site, layoutTemplate);
  
  // 7. Générer les pages statiques
  buildStaticPages(pagesData, site, layoutTemplate);
  
  // 8. Générer le sitemap
  buildSitemap(properties, pagesData, site);
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalPages = properties.length + 4 + pagesData.length; // props + listings + static
  
  console.log('\n═══════════════════════════════════════════════');
  console.log(`✨ Build terminé! ${totalPages} pages générées en ${elapsed}s`);
  console.log(`📂 Sortie: ${path.resolve(CONFIG.outputDir)}`);
  console.log('═══════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════
// MODE WATCH
// ═══════════════════════════════════════════════════════════════

function watchMode() {
  console.log('\n👀 Mode watch activé - Surveillance des fichiers...\n');
  
  const chokidar = require('chokidar');
  
  const watcher = chokidar.watch([
    `${CONFIG.templatesDir}/**/*.html`,
    `${CONFIG.dataDir}/**/*.json`,
    `${CONFIG.srcPagesDir}/**/*.html`
  ], {
    ignored: /node_modules|dist/,
    persistent: true
  });
  
  let debounceTimer;
  watcher.on('change', (filepath) => {
    console.log(`📝 Modifié: ${filepath}`);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('🔄 Rebuild...\n');
      try { buildAll(); } catch (e) { console.error('❌ Erreur build:', e.message); }
    }, 300);
  });
  
  console.log('Appuyez sur Ctrl+C pour arrêter\n');
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Nes Thai Business - Build Statique Unifié

Usage: node build.js [options]

Options:
  --watch, -w       Mode développement avec surveillance des fichiers
  --help, -h        Affiche cette aide

Fichiers de données:
  data/properties.json   Annonces immobilières
  data/site.json         Configuration globale du site
  data/pages.json        Pages statiques (guides, contact, etc.)

Sortie:
  dist/                  Site statique complet
  `);
  process.exit(0);
}

if (args.includes('--watch') || args.includes('-w')) {
  try {
    require.resolve('chokidar');
    buildAll();
    watchMode();
  } catch (e) {
    console.log('📦 Installation de chokidar...');
    const { execSync } = require('child_process');
    execSync('npm install chokidar --save-dev', { stdio: 'inherit' });
    buildAll();
    watchMode();
  }
} else {
  buildAll();
}
