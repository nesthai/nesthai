/**
 * NesThai Property - Social Page Interactions
 * Gestion des animations et interactions pour la page réseaux sociaux
 */

(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initCounters();
        initFloatingBar();
        initScrollAnimations();
        initPlatformCards();
        initStickyBar();
    }

    /**
     * Compteurs animés pour les statistiques
     */
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if (!counters.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 secondes
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fonction d'easing pour une animation plus fluide
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = current.toLocaleString('fr-FR');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('fr-FR');
                // Ajouter une classe pour l'effet de célébration
                element.classList.add('counter-complete');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    /**
     * Barre flottante de réseaux sociaux
     */
    function initFloatingBar() {
        const floatBar = document.getElementById('socialFloatBar');
        if (!floatBar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateFloatBar() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.page-hero-social')?.offsetHeight || 500;

            // Afficher la barre après avoir dépassé le hero
            if (scrollY > heroHeight * 0.5) {
                floatBar.style.opacity = '1';
                floatBar.style.transform = 'translateX(0)';
            } else {
                floatBar.style.opacity = '0';
                floatBar.style.transform = 'translateX(-100px)';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateFloatBar);
                ticking = true;
            }
        }, { passive: true });

        // Animation initiale
        floatBar.style.opacity = '0';
        floatBar.style.transform = 'translateX(-100px)';
        floatBar.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }

    /**
     * Animations au scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.benefit-item, .visual-card, .stat-card, .why-follow-content'
        );

        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            animationObserver.observe(el);
        });
    }

    /**
     * Interactions avec les cartes de plateformes
     */
    function initPlatformCards() {
        const cards = document.querySelectorAll('.social-platform-card');
        
        cards.forEach(card => {
            // Effet 3D au survol
            card.addEventListener('mousemove', handleCardMouseMove);
            card.addEventListener('mouseleave', handleCardMouseLeave);
            
            // Tracking des clics
            const btn = card.querySelector('.platform-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    trackSocialClick(card.dataset.platform);
                });
            }
        });
    }

    function handleCardMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }

    function handleCardMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }

    /**
     * Barre sticky sociale en bas de page
     */
    function initStickyBar() {
        // Créer la barre sticky si elle n'existe pas
        if (document.querySelector('.social-sticky-bar')) return;

        const stickyBar = document.createElement('div');
        stickyBar.className = 'social-sticky-bar';
        stickyBar.innerHTML = `
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
                </div>
            </div>
        `;

        document.body.appendChild(stickyBar);

        // Afficher la barre après avoir scrollé un peu
        let shown = false;
        const triggerPoint = window.innerHeight * 2;

        window.addEventListener('scroll', () => {
            if (window.scrollY > triggerPoint && !shown) {
                stickyBar.classList.add('visible');
                shown = true;
            }
        }, { passive: true });

        // Bouton fermer
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.4)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
        });
        closeBtn.addEventListener('click', () => {
            stickyBar.style.transform = 'translateY(100%)';
            setTimeout(() => stickyBar.remove(), 400);
        });

        stickyBar.querySelector('.container').appendChild(closeBtn);
    }

    /**
     * Tracking des clics sur les réseaux sociaux
     */
    function trackSocialClick(platform) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                event_category: 'Social Media',
                event_label: platform,
                transport_type: 'beacon'
            });
        }

        // Console pour debug
        console.log(`[Social] Click sur ${platform}`);

        // Stockage local pour statistiques
        const clicks = JSON.parse(localStorage.getItem('social_clicks') || '{}');
        clicks[platform] = (clicks[platform] || 0) + 1;
        clicks['last_click'] = new Date().toISOString();
        localStorage.setItem('social_clicks', JSON.stringify(clicks));
    }

    /**
     * Effet de partical sur les boutons
     */
    function createParticles(button, color) {
        const particleCount = 8;
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // Exposer les fonctions globalement pour debug
    window.NesThaiSocial = {
        trackClick: trackSocialClick,
        createParticles: createParticles
    };

})();
