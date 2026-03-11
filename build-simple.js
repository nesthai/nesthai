#!/usr/bin/env node

/**
 * Build System Simplifié - Sans dépendances externes
 * Utilise une logique de template basique avec remplacement de variables
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  partialsDir: './templates/partials',
  layoutsDir: './templates/layouts',
  outputDir: '.',
  dataFile: './src/data/pages.json'
};

/**
 * Charge un fichier
 */
function loadFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    console.error(`❌ Fichier non trouvé: ${filepath}`);
    return null;
  }
}

/**
 * Charge un partial
 */
function loadPartial(name) {
  const filepath = path.join(CONFIG.partialsDir, `${name}.html`);
  return loadFile(filepath);
}

/**
 * Parse une condition simple {{#if variable}}...{{/if}}
 */
function parseConditions(template, data) {
  let result = template;
  
  // Regex pour trouver {{#if variable}}...{{/if}}
  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  result = result.replace(ifRegex, (match, variable, content) => {
    if (data[variable]) {
      // Supprimer les {{/if}} et garder le contenu
      return content;
    }
    return '';
  });
  
  return result;
}

/**
 * Parse une boucle simple {{#each array}}...{{/each}}
 */
function parseLoops(template, data) {
  let result = template;
  
  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  result = result.replace(eachRegex, (match, arrayName, content) => {
    const array = data[arrayName];
    if (!array || !Array.isArray(array)) return '';
    
    return array.map(item => {
      let itemContent = content;
      // Remplacer {{this}} par l'item
      itemContent = itemContent.replace(/\{\{this\}\}/g, item);
      // Remplacer {{variable}} par data.variable
      Object.keys(item).forEach(key => {
        itemContent = itemContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), item[key]);
      });
      return itemContent;
    }).join('');
  });
  
  return result;
}

/**
 * Remplace les variables {{variable}} par leurs valeurs
 */
function replaceVariables(template, data) {
  let result = template;
  
  // Variables simples {{variable}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string' || typeof value === 'number') {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
  });
  
  // Helpers
  result = result.replace(/\{\{currentYear\}\}/g, new Date().getFullYear());
  
  // Supprimer les variables non remplacées
  result = result.replace(/\{\{\w+\}\}/g, '');
  
  return result;
}

/**
 * Remplace les partials {{> partialName}}
 */
function replacePartials(template) {
  let result = template;
  const partialRegex = /\{\{>\s+(\w+)\}\}/g;
  
  let match;
  while ((match = partialRegex.exec(result)) !== null) {
    const partialName = match[1];
    const partialContent = loadPartial(partialName);
    if (partialContent) {
      result = result.replace(match[0], partialContent);
      // Réinitialiser la regex car la chaîne a changé
      partialRegex.lastIndex = 0;
    }
  }
  
  return result;
}

/**
 * Compile un template avec les données
 */
function compileTemplate(template, data) {
  let result = template;
  
  // 1. Injecter les partials
  result = replacePartials(result);
  
  // 2. Parser les conditions
  result = parseConditions(result, data);
  
  // 3. Parser les boucles
  result = parseLoops(result, data);
  
  // 4. Remplacer les variables
  result = replaceVariables(result, data);
  
  return result;
}

/**
 * Build une page
 */
function buildPage(pageConfig) {
  const { template, output, data } = pageConfig;
  
  // Charger le layout
  const layoutPath = path.join(CONFIG.layoutsDir, `${template}.html`);
  const layout = loadFile(layoutPath);
  
  if (!layout) {
    console.error(`❌ Layout non trouvé: ${template}`);
    return false;
  }
  
  // Convertir structuredData en JSON string si présent
  if (data.structuredData) {
    data.structuredData = JSON.stringify(data.structuredData, null, 2);
  }
  
  // Compiler
  const html = compileTemplate(layout, data);
  
  // Écrire le fichier
  const outputPath = path.join(CONFIG.outputDir, output);
  fs.writeFileSync(outputPath, html, 'utf8');
  
  console.log(`  ✅ ${output}`);
  return true;
}

/**
 * Build toutes les pages
 */
function buildAll() {
  console.log('\n🔨 Beaulieu Property - Build System (Simple)\n');
  
  // Vérifier le fichier de données
  if (!fs.existsSync(CONFIG.dataFile)) {
    console.error(`❌ Fichier de données non trouvé: ${CONFIG.dataFile}`);
    process.exit(1);
  }
  
  // Charger les données
  const pagesData = JSON.parse(fs.readFileSync(CONFIG.dataFile, 'utf8'));
  
  console.log(`📄 ${pagesData.pages.length} pages à générer\n`);
  
  let success = 0;
  let failed = 0;
  
  pagesData.pages.forEach(page => {
    if (buildPage(page)) {
      success++;
    } else {
      failed++;
    }
  });
  
  console.log(`\n✨ Terminé: ${success} succès, ${failed} échecs\n`);
}

// Lancer le build
buildAll();
