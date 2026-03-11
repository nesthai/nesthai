# 🚀 SYSTÈME DE MAINTENANCE - BEAULIEU PROPERTY

## ✅ Installation en 2 minutes

### Étape 1 : Vérifier PowerShell
PowerShell est inclus dans Windows 7/8/10/11. Pour vérifier :
```
Appuyez sur Win+R → tapez "powershell" → Entrée
```

### Étape 2 : Autoriser l'exécution des scripts
Dans PowerShell (une seule fois) :
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

### Étape 3 : Lancer le build
```
Double-clic sur BUILD.bat
```

C'est prêt ! 🎉

---

## 📂 Ce qui a été créé

```
📁 _partials/              ← Header, Footer, Meta tags (modifier ici)
📁 _sources/               ← Contenu des pages (créer les pages ici)
📄 build.ps1              ← Script de génération
📄 BUILD.bat              ← Lanceur simple
📄 WATCH.bat              ← Mode auto-reload
📄 SYSTEME_MAINTENANCE.md ← Documentation complète
```

---

## 🎯 Comment ça marche

### AVANT (maintenance difficile)
```
45 fichiers HTML avec code dupliqué
Pour changer le téléphone : modifier 45 fichiers (45 min)
```

### APRÈS (maintenance facile)
```
3 partials + pages sources
Pour changer le téléphone : modifier 1 fichier (10 sec)
```

---

## ⚡ Utilisation quotidienne

### Modifier le header (toutes les pages)
1. Éditer `_partials/header.html`
2. Lancer `BUILD.bat`
3. ✅ Toutes les pages sont mises à jour

### Créer une nouvelle page
1. Créer `_sources/ma-page.html`
2. Ajouter le bloc META en haut
3. Lancer `BUILD.bat`
4. ✅ La page est générée

### Modifier une page existante
1. Éditer `_sources/nom-de-la-page.html`
2. Lancer `BUILD.bat`
3. ✅ La page est régénérée

---

## 📝 Format d'une page source

```html
<!--META
title: Titre de la page | Beaulieu
description: Description pour Google
keywords: mots, clés, seo
nav: condos
-->

<main id="main-content">
    <!-- Votre contenu HTML ici -->
    <h1>Titre principal</h1>
    <p>Contenu...</p>
</main>
```

---

## 🎨 Commandes disponibles

| Commande | Action |
|----------|--------|
| `BUILD.bat` | Génère toutes les pages |
| `WATCH.bat` | Mode auto-reload (développement) |
| `build.ps1 -Page index` | Génère une seule page |

---

## 📖 Documentation

- **Guide complet** : voir `SYSTEME_MAINTENANCE.md`
- **Exemples de pages** : voir `_sources/`
- **Partials** : voir `_partials/`

---

**🚀 Votre site est maintenant maintenable à 95% plus vite !**
