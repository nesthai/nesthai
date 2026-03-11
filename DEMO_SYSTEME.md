# 🎯 Démonstration du Système de Templates

## Vue d'ensemble

Ce système transforme 45 fichiers HTML en **3 templates** + **1 fichier de données**.

---

## 📊 Comparaison Avant/Après

### 🔴 AVANT : Maintenance manuelle

```
📁 Site (45 fichiers HTML)
├── index.html          ← header copié ici
├── condos.html         ← header copié ici aussi
├── maisons.html        ← header copié ici aussi
├── terrains.html       ← header copié ici aussi
├── projets.html        ← header copié ici aussi
├── guides.html         ← header copié ici aussi
├── contact.html        ← header copié ici aussi
├── alertes-prix.html   ← header copié ici aussi
└── 37 autres pages...  ← header copié partout !
```

**Problème** : Pour changer un numéro de téléphone dans le header :
- Ouvrir 45 fichiers ❌
- Modifier 45 fois ❌  
- 45 minutes de travail ❌
- Risque d'oublier des pages ❌

---

### 🟢 APRÈS : Système de templates

```
📁 templates/
├── layouts/
│   └── default.html     ← 1 template principal
└── partials/
    ├── head.html        ← Meta tags communs
    ├── header.html      ← Header commun
    └── footer.html      ← Footer commun

📁 src/data/
└── pages.json           ← Données des 45 pages

📄 build.js              ← Script de génération
```

**Avantage** : Pour changer un numéro de téléphone :
- Ouvrir 1 fichier ✅
- Modifier 1 fois ✅
- 2 secondes de travail ✅
- Toutes les pages mises à jour ✅

---

## 🔄 Processus de build

```
┌─────────────────────────────────────────────────────────────┐
│                     DONNÉES (pages.json)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Page: condos.html                                          │
│  ├── title: "Condos à Vendre..."                           │
│  ├── description: "Découvrez nos condos..."                │
│  ├── activeCondos: true                                     │
│  └── ...                                                    │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      TEMPLATES                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  default.html                                               │
│  ├── {{> head}}        → injecte head.html                 │
│  ├── {{> header}}      → injecte header.html               │
│  ├── {{{content}}}     → injecte contenu spécifique        │
│  └── {{> footer}}      → injecte footer.html               │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FICHIER GÉNÉRÉ                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  condos.html                                                │
│  ├── <head>...meta tags...</head>                          │
│  ├── <header>...navigation...</header>                     │
│  ├── <main>...contenu condos...</main>                     │
│  └── <footer>...scripts...</footer>                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Exemple concret

### Données (src/data/pages.json)

```json
{
  "template": "default",
  "output": "condos.html",
  "data": {
    "title": "Condos à Vendre - Pattaya | Beaulieu",
    "description": "Découvrez nos condos à vendre à Pattaya...",
    "canonicalUrl": "https://www.beaulieu-pattaya.com/condos.html",
    "activeCondos": true
  }
}
```

### Template (templates/layouts/default.html)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    {{> head}}
</head>
<body>
    {{> header}}
    
    <main>
        {{{content}}}
    </main>
    
    {{> footer}}
</body>
</html>
```

### Partial Header (templates/partials/header.html)

```html
<header>
    <nav>
        <a href="index.html" {{#if activeAccueil}}class="active"{{/if}}>ACCUEIL</a>
        <a href="condos.html" {{#if activeCondos}}class="active"{{/if}}>CONDOS</a>
        <a href="maisons.html" {{#if activeMaisons}}class="active"{{/if}}>MAISONS</a>
    </nav>
</header>
```

### Résultat généré (condos.html)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Condos à Vendre - Pattaya | Beaulieu</title>
    <meta name="description" content="Découvrez nos condos à vendre à Pattaya...">
    <!-- Meta tags injectés depuis head.html -->
</head>
<body>
    <header>
        <nav>
            <a href="index.html">ACCUEIL</a>
            <a href="condos.html" class="active">CONDOS</a>
            <a href="maisons.html">MAISONS</a>
        </nav>
    </header>
    
    <main>
        <!-- Contenu spécifique condos -->
    </main>
    
    <footer>
        <!-- Footer injecté depuis footer.html -->
    </footer>
</body>
</html>
```

---

## 🎨 Exemple de modification

### Scénario : Changer le numéro de téléphone

**AVANT (45 fichiers)** :
```bash
# Ouvrir index.html
# Modifier ligne 245: +66 92 449 9960 → +66 92 123 4567
# Sauvegarder

# Ouvrir condos.html
# Modifier ligne 238: +66 92 449 9960 → +66 92 123 4567
# Sauvegarder

# Ouvrir maisons.html
# Modifier ligne 241: +66 92 449 9960 → +66 92 123 4567
# Sauvegarder

# ... 42 autres fichiers ...
# Temps total: 45 minutes ⏱️
```

**APRÈS (1 fichier)** :
```bash
# Ouvrir templates/partials/footer.html
# Modifier ligne 12: +66 92 449 9960 → +66 92 123 4567
# Sauvegarder
# Lancer: npm run build
# Temps total: 10 secondes ⚡
```

---

## 📈 Bénéfices quantifiés

| Tâche | Avant | Après | Gain |
|-------|-------|-------|------|
| Modifier header/footer | 45 min | 10 sec | **×270** |
| Ajouter meta tag | 30 min | 5 sec | **×360** |
| Créer nouvelle page | 20 min | 1 min | **×20** |
| Correction bug visuel | 60 min | 15 sec | **×240** |
| Mise à jour SEO | 90 min | 30 sec | **×180** |

**Score maintenance** : 4/10 → **9/10** ⭐

---

## 🚀 Comment utiliser

### 1. Installation (une fois)

```bash
# Installer Node.js
# https://nodejs.org

# Dans le dossier du projet
npm install
```

### 2. Modifier une page

```bash
# Éditer src/data/pages.json
# Modifier les champs title, description, etc.

# Générer
npm run build
```

### 3. Modifier le design

```bash
# Éditer templates/partials/header.html
# ou templates/partials/footer.html

# Générer
npm run build

# ✅ Toutes les pages mises à jour
```

### 4. Mode développement

```bash
npm run watch

# Modifiez n'importe quel fichier
# Les pages se régénèrent automatiquement
```

---

## 🧩 Structure finale

```
beaulieu-website/
│
├── 📁 templates/              # Templates source
│   ├── 📁 layouts/
│   │   └── default.html       # Layout principal
│   └── 📁 partials/
│       ├── head.html          # Meta tags
│       ├── header.html        # Navigation
│       └── footer.html        # Footer + scripts
│
├── 📁 src/
│   └── 📁 data/
│       └── pages.json         # Données des 45 pages
│
├── 📄 build.js                # Script de build
├── 📄 package.json            # Dépendances
│
├── 📁 css/                    # Styles (inchangé)
├── 📁 js/                     # Scripts (inchangé)
├── 📁 images/                 # Images (inchangé)
│
└── 📄 [fichiers HTML générés] # 45 pages générées
    ├── index.html
    ├── condos.html
    ├── maisons.html
    └── ...
```

---

## ✅ Checklist de migration

Pour passer de l'ancien système au nouveau :

- [ ] Créer dossier `templates/layouts/`
- [ ] Créer dossier `templates/partials/`
- [ ] Copier le `<head>` commun dans `partials/head.html`
- [ ] Copier le `<header>` dans `partials/header.html`
- [ ] Copier le `<footer>` dans `partials/footer.html`
- [ ] Créer `src/data/pages.json` avec les données de chaque page
- [ ] Tester avec `npm run build`
- [ ] Vérifier que les fichiers générés sont identiques
- [ ] Supprimer les anciens HTML (backup d'abord !)

---

**Résultat** : Un site professionnel, maintenable, évolutif ! 🎉
