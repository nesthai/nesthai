# 🏗️ Système de Build - Beaulieu Property

Ce document explique comment utiliser le nouveau système de templates pour maintenir le site web.

---

## 📋 Vue d'ensemble

**Avant** : 45 fichiers HTML avec code dupliqué (header, footer, meta tags)
**Après** : Templates réutilisables + données JSON = Maintenance ×10 plus rapide

---

## 🚀 Démarrage rapide

### 1. Installation

```bash
# Installer Node.js (si pas déjà fait)
# https://nodejs.org

# Installer les dépendances
npm install
```

### 2. Build toutes les pages

```bash
npm run build
```

### 3. Mode développement (auto-reload)

```bash
npm run watch
```

---

## 📁 Structure des dossiers

```
.
├── templates/              # Templates Handlebars
│   ├── layouts/           # Layouts de page
│   │   └── default.html   # Layout principal
│   └── partials/          # Composants réutilisables
│       ├── head.html      # Balises <head> communes
│       ├── header.html    # Header du site
│       └── footer.html    # Footer + scripts
│
├── src/
│   ├── data/
│   │   └── pages.json     # Données de toutes les pages
│   └── pages/
│       └── (contenu spécifique si besoin)
│
├── build.js               # Script de build
├── package.json           # Dépendances npm
│
└── [fichiers HTML générés]  # Index.html, condos.html, etc.
```

---

## 📝 Modifier une page existante

### Exemple : Modifier le titre de la page Condos

1. Ouvrir `src/data/pages.json`
2. Trouver l'objet avec `"output": "condos.html"`
3. Modifier le champ `"title"`
4. Sauvegarder
5. Lancer `npm run build`

```json
{
  "template": "default",
  "output": "condos.html",
  "data": {
    "title": "Nouveau titre ici",  // ← Modifier cette ligne
    "description": "...",
    // ...
  }
}
```

---

## ➕ Ajouter une nouvelle page

### Étape 1 : Ajouter dans pages.json

```json
{
  "template": "default",
  "output": "ma-nouvelle-page.html",
  "data": {
    "title": "Titre de la page | Beaulieu",
    "description": "Description SEO de la page",
    "keywords": "mots-clés, séparés, par, virgules",
    "canonicalUrl": "https://www.beaulieu-pattaya.com/ma-nouvelle-page.html",
    "ogTitle": "Titre pour Facebook",
    "ogDescription": "Description pour Facebook",
    "ogImage": "https://www.beaulieu-pattaya.com/images/ma-page-og.jpg",
    "bodyClass": "page-ma-nouvelle-page",
    "activeSection": true
  }
}
```

### Étape 2 : Build

```bash
npm run build
```

✅ Le fichier `ma-nouvelle-page.html` est créé automatiquement !

---

## 🎨 Modifier le design (Header/Footer)

### Modifier le header

1. Ouvrir `templates/partials/header.html`
2. Faire les modifications
3. Lancer `npm run build`
4. ✅ Toutes les pages sont mises à jour automatiquement

### Modifier le footer

1. Ouvrir `templates/partials/footer.html`
2. Faire les modifications
3. Lancer `npm run build`

---

## 🔧 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run build` | Build toutes les pages |
| `npm run watch` | Mode dev avec auto-reload |
| `npm run build:page=index` | Build une page spécifique |
| `npm run dev` | Alias de `watch` |

---

## 🧩 Les partials (composants)

### head.html
Balises meta, SEO, favicons, liens CSS communs à toutes les pages.

**Variables disponibles :**
- `{{title}}` - Titre de la page
- `{{description}}` - Meta description
- `{{canonicalUrl}}` - URL canonique
- `{{extraCss}}` - CSS additionnel (ex: guides.css)
- etc.

### header.html
Header avec navigation.

**Variables disponibles :**
- `{{#if activeCondos}}` - Active l'état du menu Condos
- `{{#if activeMaisons}}` - Active l'état du menu Maisons
- etc.

### footer.html
Footer avec scripts.

**Variables disponibles :**
- `{{currentYear}}` - Année courante (ex: 2024)
- `{{extraScripts}}` - Scripts JS additionnels

---

## 📊 Schéma de données (pages.json)

### Champs obligatoires

```json
{
  "template": "default",           // Nom du layout à utiliser
  "output": "nom-fichier.html",    // Nom du fichier généré
  "data": {
    "title": "Titre | Beaulieu",   // Titre <title>
    "description": "...",           // Meta description
    "canonicalUrl": "https://..."   // URL canonique
  }
}
```

### Champs optionnels

```json
{
  "data": {
    "keywords": "...",              // Meta keywords
    "ogTitle": "...",               // Titre Open Graph
    "ogDescription": "...",         // Description Open Graph
    "ogImage": "https://...",       // Image Open Graph
    "twitterTitle": "...",          // Titre Twitter
    "twitterDescription": "...",    // Description Twitter
    "twitterImage": "https://...",  // Image Twitter
    "bodyClass": "page-accueil",    // Classe CSS du body
    "extraCss": "guides.css",       // CSS additionnel
    "extraScripts": ["alertes.js"], // Scripts additionnels
    "structuredData": {...},        // Données structurées JSON-LD
    "extraHead": "..."              // HTML additionnel dans <head>
  }
}
```

---

## 🔄 Workflow de développement

### Scénario 1 : Modifier le numéro de téléphone dans le footer

**Avant** : Modifier 45 fichiers HTML ❌
**Après** :
```bash
1. Ouvrir templates/partials/footer.html
2. Modifier le numéro
3. npm run build
4. ✅ 45 pages mises à jour en 2 secondes
```

### Scénario 2 : Ajouter une nouvelle page

```bash
1. Ouvrir src/data/pages.json
2. Copier/coller un bloc existant
3. Modifier les données
4. npm run build
5. ✅ Page créée avec header/footer/meta complets
```

### Scénario 3 : Modifier les meta tags Open Graph

```bash
1. Ouvrir templates/partials/head.html
2. Modifier les balises og:*
3. npm run build
4. ✅ Toutes les pages ont les nouveaux meta tags
```

---

## ⚠️ Bonnes pratiques

1. **Toujours lancer `npm run build` après modification**
   - Les fichiers HTML ne se mettent pas à jour automatiquement (sauf en mode watch)

2. **Vérifier avant de déployer**
   ```bash
   npm run build
   # Tester les fichiers générés en local
   ```

3. **Sauvegarder pages.json**
   - Ce fichier contient toutes les données du site
   - Faire des backups réguliers

4. **Ne pas modifier les fichiers HTML générés**
   - Les modifications seront écrasées au prochain build
   - Modifier toujours les templates ou le JSON

---

## 🆘 Dépannage

### Erreur : "Cannot find module 'handlebars'"

```bash
npm install
```

### Erreur : "Template non trouvé"

Vérifier que le fichier existe dans `templates/layouts/`

### Page générée vide

Vérifier que toutes les variables obligatoires sont présentes dans pages.json

### Modifications non visibles

1. Vérifier que `npm run build` a bien tourné
2. Vider le cache du navigateur (Ctrl+F5)
3. Vérifier que vous modifiez le bon fichier source

---

## 📈 Prochaines améliorations possibles

1. **Hot reload** : Rechargement auto du navigateur
2. **Minification** : Compression CSS/JS automatique
3. **Images** : Génération automatique des versions WebP
4. **Sitemap** : Génération auto du sitemap.xml
5. **RSS** : Génération auto du flux RSS

---

## 📞 Support

En cas de problème avec le build :
1. Vérifier que Node.js est installé : `node --version`
2. Réinstaller les dépendances : `rm -rf node_modules && npm install`
3. Consulter les messages d'erreur dans le terminal

---

**Score maintenance avant** : 4/10 ⚠️
**Score maintenance après** : 9/10 ✅

**Temps pour modifier le header sur 45 pages** :
- Avant : 45 minutes
- Après : 2 secondes
