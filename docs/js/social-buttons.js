/**
 * NesThai Property - Social Buttons Universal
 * Script universel pour les boutons de réseaux sociaux sur toutes les pages
 * 
 * Fonctionnalités:
 * - Boutons flottants avec apparition au scroll
 * - Tracking des clics (Google Analytics + LocalStorage)
 * - Animations et effets visuels
 * - Bandeau sticky optionnel
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        floatBarSelector: '#socialFloatBar',
        showAfterScroll: 500, // pixels à scroller avant d'afficher
        animationDuration: 400,
        platforms: {
            tiktok: { color: '#00f2ea', url: 'https://tiktok.com/@nesthai_pattaya' },
            instagram: { color: '#E4405F', url: 'https://instagram.com/nesthai_pattaya' },
            youtube: { color: '#FF0000', url: 'https://youtube.com/@nesthaipattaya' },
            facebook: { color: '#1877F2', url: 'https://facebook.com/nesthaipattaya' }
        }
    };

    // Initialisation
    function init() {
        initFloatBar();
        initTracking();
        initAnimations();
        initStickyBanner();
    }

    /**
     * Barre flottante de réseaux sociaux
     */
    function initFloatBar() {
        const floatBar = document.querySelector(config.floatBarSelector);
        if (!floatBar) return;

        let lastScrollY = 0;
        let ticking = false;
        let isVisible = false;

        function updateVisibility() {
            const scrollY = window.scrollY;
            const shouldShow = scrollY > config.showAfterScroll;

            if (shouldShow !== isVisible) {
                isVisible = shouldShow;
                floatBar.style.opacity = shouldShow ? '1' : '0';
                floatBar.style.transform = shouldShow ? 'translateX(0)' : 'translateX(-100px)';
                floatBar.style.pointerEvents = shouldShow ? 'auto' : 'none';
            }

            ticking = false;
        }

        // Throttled scroll handler
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateVisibility);
                ticking = true;
            }
        }, { passive: true });

        // Initial state
        floatBar.style.opacity = '0';
        floatBar.style.transform = 'translateX(-100px)';
        floatBar.style.transition = `all ${config.animationDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    }

    /**
     * Tracking des clics
     */
    function initTracking() {
        // Ajouter les écouteurs sur tous les liens sociaux
        document.querySelectorAll('a[href*="tiktok.com"], a[href*="instagram.com"], a[href*="youtube.com"], a[href*="facebook.com"]').forEach(link => {
            link.addEventListener('click', handleSocialClick);
        });
    }

    function handleSocialClick(e) {
        const link = e.currentTarget;
        const href = link.href;
        let platform = 'unknown';

        // Détecter la plateforme
        if (href.includes('tiktok')) platform = 'tiktok';
        else if (href.includes('instagram')) platform = 'instagram';
        else if (href.includes('youtube')) platform = 'youtube';
        else if (href.includes('facebook')) platform = 'facebook';

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                event_category: 'engagement',
                event_label: platform,
                event_action: 'click',
                transport_type: 'beacon'
            });
        }

        // Google Tag Manager
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: 'social_click',
                platform: platform,
                location: link.closest('footer') ? 'footer' : 
                         link.closest('.social-float-bar') ? 'float_bar' : 
                         link.closest('.social-section') ? 'section' : 'other'
            });
        }

        // Stockage local pour analytics interne
        try {
            const clicks = JSON.parse(localStorage.getItem('nesthai_social_clicks') || '{}');
            const today = new Date().toISOString().split('T')[0];
            
            if (!clicks[platform]) clicks[platform] = {};
            if (!clicks[platform][today]) clicks[platform][today] = 0;
            clicks[platform][today]++;
            clicks['last_click'] = { platform, time: new Date().toISOString() };
            
            localStorage.setItem('nesthai_social_clicks', JSON.stringify(clicks));
        } catch (e) {
            console.warn('LocalStorage non disponible pour le tracking social');
        }

        // Effet de particules
        createParticles(e.currentTarget, config.platforms[platform]?.color || '#C9A962');

        console.log(`[Social] Click sur ${platform}`);
    }

    /**
     * Créer un effet de particules au clic
     */
    function createParticles(element, color) {
        const rect = element.getBoundingClientRect();
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                box-shadow: 0 0 10px ${color};
            `;

            document.body.appendChild(particle);

            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 60 + Math.random() * 40;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 700,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    /**
     * Animations supplémentaires
     */
    function initAnimations() {
        // Animation pulsante pour les badges "Le plus populaire"
        const badges = document.querySelectorAll('.platform-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.classList.add('animate-pulse');
            }, index * 200);
        });

        // Hover 3D sur les cartes
        const cards = document.querySelectorAll('.social-platform-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', handleCard3D);
            card.addEventListener('mouseleave', resetCard3D);
        });
    }

    function handleCard3D(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }

    function resetCard3D(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }

    /**
     * Bandeau sticky optionnel en bas de page
     */
    function initStickyBanner() {
        // Vérifier si la bannière existe déjà
        if (document.querySelector('.social-sticky-bar')) return;

        // Créer la bannière
        const banner = document.createElement('div');
        banner.className = 'social-sticky-bar';
        banner.innerHTML = `
            <div class="container">
                <div class="social-sticky-content">
                    <span class="social-sticky-text">📱 Suivez-nous pour ne rien manquer !</span>
                    <div class="social-sticky-links">
                        <a href="https://tiktok.com/@nesthai_pattaya" target="_blank" rel="noopener" class="social-sticky-link">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                            TikTok
                        </a>
                        <a href="https://instagram.com/nesthai_pattaya" target="_blank" rel="noopener" class="social-sticky-link">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                            Instagram
                        </a>
                        <a href="https://youtube.com/@nesthaipattaya" target="_blank" rel="noopener" class="social-sticky-link">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            YouTube
                        </a>
                    </div>
                    <button class="social-sticky-close" aria-label="Fermer">✕</button>
                </div>
            </div>
        `;

        // Styles inline pour la bannière
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #000000 0%, #E4405F 33%, #FF0000 66%, #1877F2 100%);
            padding: 12px 0;
            z-index: 999;
            transform: translateY(100%);
            transition: transform 0.4s ease;
        `;

        document.body.appendChild(banner);

        // Gestionnaire de fermeture
        const closeBtn = banner.querySelector('.social-sticky-close');
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-left: 20px;
        `;
        closeBtn.addEventListener('click', () => {
            banner.style.transform = 'translateY(100%)';
            localStorage.setItem('social_banner_closed', Date.now().toString());
        });

        // Afficher après avoir scrollé suffisamment
        let shown = false;
        const triggerPoint = window.innerHeight * 2;

        window.addEventListener('scroll', () => {
            if (window.scrollY > triggerPoint && !shown) {
                // Vérifier si l'utilisateur n'a pas fermé la bannière récemment
                const lastClosed = localStorage.getItem('social_banner_closed');
                const hoursSinceClosed = lastClosed ? (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60) : 24;
                
                if (hoursSinceClosed > 24) {
                    banner.style.transform = 'translateY(0)';
                    shown = true;
                }
            }
        }, { passive: true });
    }

    // API publique
    window.NesThaiSocial = {
        track: handleSocialClick,
        createParticles: createParticles,
        config: config
    };

    // Initialiser au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
