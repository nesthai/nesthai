# 📋 Guide de Migration vers le Système de Templates

Ce guide vous aide à migrer progressivement du système actuel (45 fichiers HTML) vers le nouveau système de templates.

---

## 🎯 Approche recommandée : Migration progressive

Ne migrez pas tout en une fois ! Faites-le page par page pour valider le fonctionnement.

---

## Phase 1 : Préparation (15 min)

### Étape 1.1 : Créer la structure

```bash
# Créer les dossiers
mkdir templates layouts partials
mkdir src data
```

### Étape 1.2 : Extraire les composants communs

**Copier depuis `index.html` vers `templates/partials/head.html`** :
- Lignes 4-98 (tout le `<head>` sauf title/description spécifiques)

**Copier depuis `index.html` vers `templates/partials/header.html`** :
- Lignes du header (après `<body>`)

**Copier depuis `index.html` vers `templates/partials/footer.html`** :
- Lignes du footer (avant `</body>`)

---

## Phase 2 : Première page test (20 min)

### Étape 2.1 : Créer le template de base

Créer `templates/layouts/default.html` :

```html
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    <meta name="keywords" content="{{keywords}}">
    {{> head}}
</head>
<body class="{{bodyClass}}">
    {{> header}}
    
    <main id="main-content" role="main">
        {{{content}}}
    </main>
    
    {{> footer}}
</body>
</html>
```

### Étape 2.2 : Créer les données

Créer `src/data/pages.json` avec UNE SEULE page test :

```json
{
  "pages": [
    {
      "template": "default",
      "output": "test.html",
      "data": {
        "title": "Test | Beaulieu",
        "description": "Page de test du système de templates",
        "keywords": "test, beaulieu",
        "canonicalUrl": "https://www.beaulieu-pattaya.com/test.html",
        "ogTitle": "Test | Beaulieu",
        "ogDescription": "Page de test",
        "ogImage": "https://www.beaulieu-pattaya.com/images/og-image.jpg",
        "bodyClass": "page-test",
        "activeAccueil": true,
        "content": "<h1>Page de test</h1><p>Le système fonctionne !</p>"
      }
    }
  ]
}
```

### Étape 2.3 : Tester

```bash
npm install
npm run build
```

Ouvrir `test.html` dans le navigateur et vérifier que tout s'affiche correctement.

---

## Phase 3 : Migration des pages principales (1h)

### Étape 3.1 : Migrer index.html

1. Copier le contenu de `<main>` dans `pages.json`
2. Remplacer les `"` par `\"` dans le JSON
3. Ajouter `"activeAccueil": true`
4. Build et comparer

### Étape 3.2 : Migrer condos.html

1. Copier le contenu de `<main>` dans `pages.json`
2. Ajouter `"activeCondos": true`
3. Build et comparer

### Étape 3.3 : Continuer avec les autres pages

Pages par ordre de priorité :
1. ✅ index.html (accueil)
2. ✅ condos.html
3. ✅ maisons.html
4. ✅ terrains.html
5. ✅ projets.html
6. ✅ guides.html
7. ✅ contact.html
8. ✅ alertes-prix.html
9. ⏳ Pages de condos individuelles (12 pages)
10. ⏳ Pages de maisons individuelles (4 pages)
11. ⏳ Pages de terrains individuelles (4 pages)
12. ⏳ Pages guides détaillées (8 pages)
13. ⏳ Autres pages

---

## Phase 4 : Optimisation (30 min)

### Étape 4.1 : Créer des layouts spécifiques

Si certaines pages ont une structure différente :

```
templates/
├── layouts/
│   ├── default.html      # Pages standards
│   ├── guide.html        # Pages guides (avec sidebar)
│   ├── property.html     # Pages biens (avec galerie)
│   └── landing.html      # Pages landing (sans header complet)
```

### Étape 4.2 : Créer des partials additionnels

```
templates/partials/
├── head.html
├── header.html
├── footer.html
├── breadcrumbs.html     # Fil d'Ariane
├── sidebar.html         # Barre latérale guides
├── property-card.html   # Carte bien immobilier
├── contact-form.html    # Formulaire de contact
└── whatsapp-button.html # Bouton WhatsApp sticky
```

---

## 🔧 Scripts utilitaires

### Script pour extraire le contenu des pages existantes

Créer `extract-content.js` :

```javascript
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function extractPageContent(filepath) {
  const html = fs.readFileSync(filepath, 'utf8');
  const $ = cheerio.load(html);
  
  // Extraire les meta
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const keywords = $('meta[name="keywords"]').attr('content');
  
  // Extraire le contenu du main
  const content = $('main').html();
  
  return {
    title,
    description,
    keywords,
    content: content.trim()
  };
}

// Utilisation
const pages = [
  'index.html',
  'condos.html',
  'maisons.html'
];

const extractedData = pages.map(page => {
  return {
    output: page,
    data: extractPageContent(page)
  };
});

fs.writeFileSync('extracted-pages.json', JSON.stringify(extractedData, null, 2));
console.log('Extraction terminée !');
```

Usage :
```bash
npm install cheerio
node extract-content.js
```

---

## ⚠️ Pièges à éviter

### 1. Caractères spéciaux dans JSON

**Problème** : Le contenu HTML contient des `"` qui cassent le JSON

**Solution** : Échapper les guillemets
```json
"content": "<div class=\"property-card\">...</div>"
```

Ou utiliser des backticks dans le template pour inclure du HTML brut.

### 2. Chemins relatifs

**Problème** : Les chemins d'images changent selon la profondeur du dossier

**Solution** : Utiliser des chemins absolus
```html
<!-- Mauvais -->
<img src="images/photo.jpg">

<!-- Bon -->
<img src="/images/photo.jpg">
```

### 3. Scripts inline

**Problème** : Certains scripts ont du code spécifique à la page

**Solution** : Utiliser `extraScripts` dans le JSON
```json
{
  "extraScripts": ["alertes-prix.js"]
}
```

### 4. CSS inline

**Problème** : Certaines pages ont du CSS spécifique dans `<style>`

**Solution** : Utiliser `extraHead` ou déplacer dans un fichier CSS séparé
```json
{
  "extraHead": "<style>.page-specific { ... }</style>"
}
```

---

## ✅ Validation

Avant de remplacer les anciens fichiers, vérifier :

### Checklist de validation

- [ ] Le HTML généré est identique à l'original
- [ ] Les meta tags sont présents
- [ ] Le header est identique
- [ ] Le footer est identique
- [ ] Les liens fonctionnent
- [ ] Les images s'affichent
- [ ] Le CSS s'applique correctement
- [ ] Les scripts fonctionnent
- [ ] Responsive OK
- [ ] Pas d'erreur dans la console

### Comparaison visuelle

1. Ouvrir l'ancienne page d'un côté
2. Ouvrir la nouvelle page de l'autre
3. Comparer pixel par pixel
4. Vérifier le code source (Ctrl+U)

---

## 🚀 Déploiement

### Étape 1 : Backup

```bash
# Créer une sauvegarde
cp -r . ../beaulieu-backup-$(date +%Y%m%d)
```

### Étape 2 : Build production

```bash
npm run build
```

### Étape 3 : Test local

```bash
# Lancer un serveur local
npx serve .

# Vérifier plusieurs pages
# http://localhost:3000/index.html
# http://localhost:3000/condos.html
```

### Étape 4 : Déploiement FTP

Uploader uniquement :
- Les fichiers HTML générés
- Le dossier `css/` (si modifié)
- Le dossier `js/` (si modifié)
- Le dossier `images/` (si modifié)

**Ne pas uploader** :
- `node_modules/`
- `templates/`
- `src/`
- `build.js`
- `package.json`
- `package-lock.json`

---

## 📞 Support

En cas de problème lors de la migration :

1. **Conserver les fichiers originaux** jusqu'à validation complète
2. **Migrer page par page** pour isoler les problèmes
3. **Vérifier la console JavaScript** pour les erreurs
4. **Comparer le HTML source** avant/après

---

## 🎉 Résultat final

Après migration complète :

```
Avant :
- 45 fichiers × ~400 lignes = 18 000 lignes de HTML
- Code dupliqué partout
- Maintenance : 4/10

Après :
- 3 templates + 1 JSON = ~500 lignes de code
- Zéro duplication
- Maintenance : 9/10
- Temps de modification : -95%
```

**Le site est maintenant professionnel et maintenable !** 🚀
