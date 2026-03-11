# Guide d'Utilisation - Boutons Réseaux Sociaux Beaulieu Property

Ce guide explique comment utiliser et personnaliser les boutons de réseaux sociaux sur le site Beaulieu Property.

## 📱 Composants Disponibles

### 1. Boutons Flottants (Social Float Bar)

Barre de boutons fixe sur le côté gauche de la page qui apparaît après avoir scrollé.

**Fichiers nécessaires :**
- `css/style.css` (styles inclus)
- `js/social-buttons.js`

**Intégration dans une page HTML :**

```html
<!-- Ajouter avant la fermeture de </body> -->
<div class="social-float-bar" id="socialFloatBar" aria-label="Raccourcis réseaux sociaux">
    <a href="https://tiktok.com/@beaulieu_pattaya" target="_blank" rel="noopener" class="float-btn float-tiktok" aria-label="TikTok">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02..."/>
        </svg>
    </a>
    <!-- ... autres boutons -->
</div>

<!-- Scripts -->
<script src="js/social-buttons.js"></script>
```

**Comportement :**
- Apparaît après avoir scrollé de 500px
- Animations au survol (tooltip + rotation)
- Tracking des clics automatique

### 2. Page Dédiée Réseaux Sociaux

Page complète avec présentation de tous les réseaux sociaux.

**Fichier :** `suivez-nous.html`

**Caractéristiques :**
- 4 cartes de plateformes (TikTok, Instagram, YouTube, Facebook)
- Statistiques animées
- Effet 3D au survol des cartes
- Barre flottante latérale
- Section "Pourquoi nous suivre"

### 3. Widget Latéral Droit

Alternative aux boutons flottants gauche.

**Intégration :**

```html
<div class="social-sidebar-widget" aria-label="Liens réseaux sociaux">
    <a href="https://tiktok.com/@beaulieu_pattaya" class="social-sidebar-tab tiktok">
        <svg>...</svg>
        <span>TikTok</span>
    </a>
    <!-- ... autres onglets -->
</div>
```

### 4. Bandeau Sticky en Bas

Bandeau coloré qui apparaît après avoir bien scrollé.

**Automatique** avec `social-buttons.js` ou **manuel :**

```html
<div class="social-sticky-bar" id="socialStickyBar">
    <div class="container">
        <div class="social-sticky-content">
            <span class="social-sticky-text">📱 Suivez-nous !</span>
            <div class="social-sticky-links">
                <!-- Liens ici -->
            </div>
        </div>
    </div>
</div>
```

### 5. Boutons dans le Footer

Présentation classique dans le pied de page.

```html
<div class="footer-col">
    <h4>Suivez-nous</h4>
    <ul>
        <li><a href="suivez-nous.html">📱 Tous nos réseaux</a></li>
        <li><a href="https://tiktok.com/@beaulieu_pattaya" target="_blank">TikTok</a></li>
        <!-- ... -->
    </ul>
</div>
```

## 🎨 Personnalisation

### Couleurs des Plateformes

```css
:root {
    --tiktok-color: #000000;
    --tiktok-accent: #00f2ea;
    --instagram-color: #E4405F;
    --youtube-color: #FF0000;
    --facebook-color: #1877F2;
}
```

### Position des Boutons Flottants

```css
.social-float-bar {
    left: 20px;    /* Changer pour right: 20px pour droite */
    bottom: 100px; /* Distance depuis le bas */
}
```

### Seuil d'Apparition (Scroll)

Dans `js/social-buttons.js` :

```javascript
const config = {
    showAfterScroll: 500, // pixels à scroller avant affichage
    // ...
};
```

## 📊 Tracking et Analytics

### Google Analytics 4

Les clics sont automatiquement envoyés à GA4 avec l'événement `social_click` :

```javascript
gtag('event', 'social_click', {
    event_category: 'engagement',
    event_label: 'tiktok', // ou 'instagram', 'youtube', 'facebook'
    event_action: 'click'
});
```

### Google Tag Manager

```javascript
dataLayer.push({
    event: 'social_click',
    platform: 'tiktok',
    location: 'float_bar' // ou 'footer', 'section', 'sticky_bar'
});
```

### LocalStorage

Les statistiques sont stockées localement :

```javascript
// Récupérer les stats
const clicks = JSON.parse(localStorage.getItem('beaulieu_social_clicks') || '{}');

// Format :
// {
//     "tiktok": { "2024-01-15": 5, "2024-01-16": 3 },
//     "instagram": { "2024-01-15": 8 },
//     "last_click": { "platform": "tiktok", "time": "2024-01-16T10:30:00Z" }
// }
```

## 🚀 Déploiement sur Toutes les Pages

### Étape 1 : Inclure le CSS

Le CSS est déjà dans `style.css`, aucune action nécessaire.

### Étape 2 : Inclure le HTML des boutons flottants

Copier le bloc `social-float-bar` dans chaque page avant `</body>`.

### Étape 3 : Inclure le JavaScript

Ajouter dans chaque page :

```html
<script src="js/social-buttons.js"></script>
```

### Script Automatique (Optionnel)

Créer `add-social-to-all.js` :

```javascript
const fs = require('fs');
const glob = require('glob');

const socialFloatBar = `
<div class="social-float-bar" id="socialFloatBar" aria-label="Raccourcis réseaux sociaux">
    <!-- ... contenu ... -->
</div>
`;

const socialScript = '<script src="js/social-buttons.js"></script>';

glob('*.html', (err, files) => {
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Ajouter les boutons flottants avant </body>
        if (!content.includes('social-float-bar')) {
            content = content.replace('</body>', socialFloatBar + '\n</body>');
        }
        
        // Ajouter le script
        if (!content.includes('social-buttons.js')) {
            content = content.replace('</body>', socialScript + '\n</body>');
        }
        
        fs.writeFileSync(file, content);
    });
});
```

## 📱 URLs des Réseaux Sociaux

| Plateforme | URL |
|------------|-----|
| TikTok | https://tiktok.com/@beaulieu_pattaya |
| Instagram | https://instagram.com/beaulieu_pattaya |
| YouTube | https://youtube.com/@beaulieupattaya |
| Facebook | https://facebook.com/beaulieupattaya |

## 🔧 Dépannage

### Les boutons n'apparaissent pas

1. Vérifier que `social-buttons.js` est chargé
2. Vérifier la console pour les erreurs
3. S'assurer que le CSS est bien chargé

### Les animations ne fonctionnent pas

1. Vérifier la compatibilité du navigateur
2. S'assurer qu'aucun autre CSS ne surcharge les styles

### Le tracking ne fonctionne pas

1. Vérifier que GA4 est initialisé (`gtag` disponible)
2. Vérifier que `localStorage` est accessible

## 📝 Notes

- Les boutons flottants sont masqués sur mobile (< 768px) avec des tooltips désactivés
- Le bandeau sticky ne s'affiche pas si l'utilisateur l'a fermé dans les dernières 24h
- Les SVG des icônes sont inline pour éviter les requêtes externes
