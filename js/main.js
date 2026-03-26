// ============================================
// NES THAI REAL ESTATE - JAVASCRIPT COMPLET
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ---------------- HEADER SCROLL ----------------
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ---------------- MENU MOBILE ----------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animation burger
            const spans = menuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Fermer menu au clic sur lien
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ---------------- ANIMATIONS AU SCROLL ----------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes
    document.querySelectorAll('.property-card, .category-card, .service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('✅ NesThai website loaded successfully');
});

// ================= GALERIE PHOTOS TERRAIN =================

function changePhoto(galleryId, newSrc) {
    console.log('Changing photo to:', newSrc); // Debug
    
    // Change la photo principale
    const mainPhoto = document.getElementById('main-photo-' + galleryId);
    if (mainPhoto) {
        // Effet de fondu
        mainPhoto.style.opacity = '0.5';
        
        setTimeout(() => {
            mainPhoto.src = newSrc;
            mainPhoto.style.opacity = '1';
        }, 200);
    }
    
    // Met à jour la classe active sur les miniatures
    const container = mainPhoto.closest('.terrain-gallery');
    if (container) {
        const thumbnails = container.querySelectorAll('.thumb');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            // Compare les noms de fichiers pour trouver le bon
            if (thumb.getAttribute('onclick').includes(newSrc)) {
                thumb.classList.add('active');
            }
        });
    }
}

// ================= ZOOM PHOTO =================

function openZoom(src) {
    // Crée l'overlay de zoom
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
        <div class="zoom-container">
            <img src="${src}" alt="Zoom">
            <button class="zoom-close" onclick="closeZoom()">✕</button>
        </div>
    `;
    
    // Ferme au clic sur l'overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeZoom();
        }
    });
    
    // Ferme avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeZoom();
        }
    });
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Empêche le scroll
}

function closeZoom() {
    const overlay = document.querySelector('.zoom-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = ''; // Réactive le scroll
    }
}
// ================= SÉLECTEUR DE LANGUE =================

function toggleLang() {
    const selector = document.getElementById('langSelector');
    selector.classList.toggle('active');
    
    // Ferme si on clique ailleurs
    document.addEventListener('click', function closeLang(e) {
        if (!selector.contains(e.target)) {
            selector.classList.remove('active');
            document.removeEventListener('click', closeLang);
        }
    });
}

function changeLang(lang) {
    console.log('Changement de langue:', lang);
    
    // Sauvegarde la langue choisie
    localStorage.setItem('nesthai-lang', lang);
    
    // Met à jour l'affichage du sélecteur desktop
    const selector = document.getElementById('langSelector');
    const currentFlag = selector.querySelector('.lang-flag');
    const currentCode = selector.querySelector('.lang-code');
    const options = selector.querySelectorAll('.lang-option');
    
    // Met à jour le bouton principal
    const langData = {
        'fr': { flag: '🇫🇷', code: 'FR' },
        'en': { flag: '🇬🇧', code: 'EN' },
        'th': { flag: '🇹🇭', code: 'TH' }
    };
    
    currentFlag.textContent = langData[lang].flag;
    currentCode.textContent = langData[lang].code;
    
    // Met à jour les classes active
    options.forEach(opt => opt.classList.remove('active'));
    event.target.closest('.lang-option').classList.add('active');
    
    // Ferme le dropdown
    selector.classList.remove('active');
    
    // Met à jour le sélecteur mobile
    document.querySelectorAll('.mobile-lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.textContent.includes(langData[lang].code)) {
            opt.classList.add('active');
        }
    });
    
    // Redirige vers la version traduite (à implémenter)
    redirectToLangVersion(lang);
}

function redirectToLangVersion(lang) {
    // Récupère l'URL actuelle
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Mapping des pages par langue
    const langPages = {
        'fr': {
            'index.html': 'index.html',
            'condos.html': 'condos.html',
            'maisons.html': 'maisons.html',
            'terrains.html': 'terrains.html',
            'contact.html': 'contact.html',
            'projets.html': 'projets.html'
        },
        'en': {
            'index.html': 'en/index.html',
            'condos.html': 'en/condos.html',
            'maisons.html': 'en/maisons.html',
            'terrains.html': 'en/terrains.html',
            'contact.html': 'en/contact.html',
            'projets.html': 'en/projets.html'
        },
        'th': {
            'index.html': 'th/index.html',
            'condos.html': 'th/condos.html',
            'maisons.html': 'th/maisons.html',
            'terrains.html': 'th/terrains.html',
            'contact.html': 'th/contact.html',
            'projets.html': 'th/projets.html'
        }
    };
    
    // Pour l'instant, affiche une alerte
    if (lang !== 'fr') {
        alert('Version ' + (lang === 'en' ? 'English' : 'ภาษาไทย') + ' en cours de développement.\n\nThe ' + (lang === 'en' ? 'English' : 'Thai') + ' version is under development.');
    }
    
    // Quand vous aurez créé les dossiers en/ et th/, décommentez:
    // const newPage = langPages[lang][currentPage];
    // if (newPage && newPage !== currentPage) {
    //     window.location.href = newPage;
    // }
}

// Restaure la langue au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('nesthai-lang') || 'fr';
    // Met à jour l'UI sans rediriger
    const langData = {
        'fr': { flag: '🇫🇷', code: 'FR' },
        'en': { flag: '🇬🇧', code: 'EN' },
        'th': { flag: '🇹🇭', code: 'TH' }
    };
    
    const selector = document.getElementById('langSelector');
    if (selector && langData[savedLang]) {
        selector.querySelector('.lang-flag').textContent = langData[savedLang].flag;
        selector.querySelector('.lang-code').textContent = langData[savedLang].code;
    }
});
// ============================================
// NesThai Property MANAGEMENT - MAIN JS
// ============================================

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Fermer le menu en cliquant sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
});

// ============================================
// FONCTION DE RECHERCHE GLOBALE
// ============================================

function openSearch(query = '') {
    // Rediriger vers la page de recherche avec le terme
    const searchUrl = `recherche.html${query ? '?q=' + encodeURIComponent(query) : ''}`;
    window.location.href = searchUrl;
}

// Initialiser la recherche depuis le header
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.btn-search');
    
    if (searchBtn) {
        // Si on est déjà sur la page recherche, ne rien faire de spécial
        if (window.location.pathname.includes('recherche.html')) {
            return;
        }
        
        // Sinon, au clic ouvrir la page recherche
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearch();
        });
    }
    
    // Créer une barre de recherche rapide si on clique sur la loupe
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('quick-search')) {
        const quickSearch = document.createElement('div');
        quickSearch.id = 'quick-search';
        quickSearch.innerHTML = `
            <div class="quick-search-overlay" onclick="closeQuickSearch()"></div>
            <div class="quick-search-box">
                <input type="text" id="quick-search-input" placeholder="Rechercher un bien..." autocomplete="off">
                <button onclick="submitQuickSearch()">🔍</button>
                <span class="close-search" onclick="closeQuickSearch()">✕</span>
            </div>
        `;
        quickSearch.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: none;
            align-items: flex-start;
            justify-content: center;
            padding-top: 100px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .quick-search-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
            }
            .quick-search-box {
                position: relative;
                background: white;
                padding: 30px;
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                display: flex;
                gap: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .quick-search-box input {
                flex: 1;
                padding: 15px 20px;
                border: 2px solid #c9a962;
                border-radius: 30px;
                font-size: 1.1rem;
                outline: none;
            }
            .quick-search-box button {
                background: #c9a962;
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
            }
            .close-search {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            #quick-search.active {
                display: flex;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(quickSearch);
        
        // Modifier le comportement du bouton recherche
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                quickSearch.classList.add('active');
                document.getElementById('quick-search-input').focus();
            });
        }
        
        // Écouter Entrée
        document.getElementById('quick-search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') submitQuickSearch();
        });
    }
});

function closeQuickSearch() {
    document.getElementById('quick-search').classList.remove('active');
}

function submitQuickSearch() {
    const query = document.getElementById('quick-search-input').value.trim();
    if (query) {
        window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
    }
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// AUTO-CHARGEMENT CONVERTISSEUR THB → EUR
// ============================================
(function() {
    if (window._currencyConverterLoaded) return;
    window._currencyConverterLoaded = true;
    // Déduire le chemin de base depuis l'URL de main.js
    var base = '';
    if (document.currentScript && document.currentScript.src) {
        base = document.currentScript.src.replace(/js\/main\.js.*$/i, '');
    }
    var s = document.createElement('script');
    s.src = base + 'js/currency-converter.js';
    document.head.appendChild(s);
})();