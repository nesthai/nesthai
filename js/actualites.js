/**
 * NesThai Property - Actualités Page
 * Filtres, pagination et interactions du blog
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        articlesPerPage: 6,
        animationDuration: 400,
        selectors: {
            articlesContainer: '#articlesContainer',
            filterButtons: '.filter-btn',
            loadMoreBtn: '#loadMoreBtn',
            paginationNumbers: '#paginationNumbers',
            categoryLinks: '.category-link'
        }
    };

    // État
    let state = {
        currentFilter: 'all',
        currentPage: 1,
        totalPages: 1,
        filteredArticles: [],
        allArticles: []
    };

    // Initialisation
    function init() {
        initArticles();
        initFilters();
        initLoadMore();
        initCategoryLinks();
        initNewsletterForm();
        initScrollAnimations();
    }

    /**
     * Initialiser la liste des articles
     */
    function initArticles() {
        const container = document.querySelector(config.selectors.articlesContainer);
        if (!container) return;

        state.allArticles = Array.from(container.querySelectorAll('.article-card'));
        state.filteredArticles = [...state.allArticles];
        state.totalPages = Math.ceil(state.filteredArticles.length / config.articlesPerPage);

        // Masquer les articles au-delà de la première page
        updateVisibleArticles();
    }

    /**
     * Système de filtres
     */
    function initFilters() {
        const filterButtons = document.querySelectorAll(config.selectors.filterButtons);
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Mettre à jour l'état visuel
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                // Appliquer le filtre
                applyFilter(filter);
            });
        });
    }

    function applyFilter(filter) {
        state.currentFilter = filter;
        state.currentPage = 1;

        // Filtrer les articles
        if (filter === 'all') {
            state.filteredArticles = [...state.allArticles];
        } else {
            state.filteredArticles = state.allArticles.filter(article => {
                return article.dataset.category === filter;
            });
        }

        // Mettre à jour la pagination
        state.totalPages = Math.ceil(state.filteredArticles.length / config.articlesPerPage);

        // Animer la transition
        animateFilterTransition();
    }

    function animateFilterTransition() {
        const container = document.querySelector(config.selectors.articlesContainer);
        
        // Fade out
        state.allArticles.forEach(article => {
            article.style.opacity = '0';
            article.style.transform = 'scale(0.95)';
        });

        setTimeout(() => {
            // Mettre à jour la visibilité
            state.allArticles.forEach(article => {
                if (state.filteredArticles.includes(article)) {
                    article.classList.remove('hidden');
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                } else {
                    article.classList.add('hidden');
                }
            });

            // Mettre à jour l'affichage
            updateVisibleArticles();
            updatePagination();

            // Fade in avec stagger
            const visibleArticles = state.filteredArticles.slice(0, config.articlesPerPage);
            visibleArticles.forEach((article, index) => {
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, config.animationDuration);
    }

    function updateVisibleArticles() {
        const startIndex = 0;
        const endIndex = state.currentPage * config.articlesPerPage;

        state.filteredArticles.forEach((article, index) => {
            if (index >= startIndex && index < endIndex) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        });

        // Afficher/masquer le bouton "Charger plus"
        const loadMoreBtn = document.querySelector(config.selectors.loadMoreBtn);
        if (loadMoreBtn) {
            if (state.currentPage >= state.totalPages) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }

    /**
     * Bouton "Charger plus"
     */
    function initLoadMore() {
        const loadMoreBtn = document.querySelector(config.selectors.loadMoreBtn);
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            loadMoreArticles();
        });
    }

    function loadMoreArticles() {
        const loadMoreBtn = document.querySelector(config.selectors.loadMoreBtn);
        const originalText = loadMoreBtn.innerHTML;
        
        // Animation de chargement
        loadMoreBtn.innerHTML = `
            <span>Chargement...</span>
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.42" stroke-dashoffset="10"/>
            </svg>
        `;
        loadMoreBtn.disabled = true;

        // Simuler un délai de chargement
        setTimeout(() => {
            state.currentPage++;
            
            const startIndex = (state.currentPage - 1) * config.articlesPerPage;
            const endIndex = startIndex + config.articlesPerPage;
            const newArticles = state.filteredArticles.slice(startIndex, endIndex);

            // Animer l'apparition des nouveaux articles
            newArticles.forEach((article, index) => {
                article.classList.remove('hidden');
                article.style.opacity = '0';
                article.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Réinitialiser le bouton
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;

            // Mettre à jour la visibilité du bouton
            if (state.currentPage >= state.totalPages) {
                loadMoreBtn.style.display = 'none';
            }
        }, 600);
    }

    /**
     * Pagination numérotée
     */
    function updatePagination() {
        const paginationContainer = document.querySelector(config.selectors.paginationNumbers);
        if (!paginationContainer) return;

        if (state.totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        
        // Générer les liens de pagination
        let html = '';
        
        for (let i = 1; i <= state.totalPages; i++) {
            if (i === 1 || i === state.totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
                html += `<a href="#" class="pagination-link ${i === state.currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
            } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
                html += '<span class="pagination-dots">...</span>';
            }
        }

        paginationContainer.innerHTML = html;

        // Ajouter les écouteurs d'événements
        paginationContainer.querySelectorAll('.pagination-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                goToPage(page);
            });
        });
    }

    function goToPage(page) {
        state.currentPage = page;
        updateVisibleArticles();
        updatePagination();
        
        // Scroll vers les articles
        const articlesSection = document.querySelector('.articles-grid');
        if (articlesSection) {
            articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Liens de catégories dans la sidebar
     */
    function initCategoryLinks() {
        const categoryLinks = document.querySelectorAll(config.selectors.categoryLinks);
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                
                // Activer le filtre correspondant
                const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
                if (filterBtn) {
                    filterBtn.click();
                    
                    // Scroll vers les filtres
                    const filtersSection = document.querySelector('.categories-filter');
                    if (filtersSection) {
                        filtersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    /**
     * Formulaire newsletter
     */
    function initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Animation de chargement
            submitBtn.disabled = true;
            submitBtn.textContent = 'Inscription...';

            // Simuler l'envoi
            setTimeout(() => {
                // Succès
                submitBtn.textContent = '✓ Inscrit !';
                submitBtn.style.background = '#4CAF50';
                
                // Réinitialiser après 3 secondes
                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);

                // Tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        event_category: 'engagement',
                        event_label: 'actualites_page'
                    });
                }
            }, 1500);
        });
    }

    /**
     * Animations au scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.article-card, .sidebar-widget');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        });
    }

    /**
     * Partage réseaux sociaux
     */
    window.shareArticle = function(platform, url, title) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            
            // Tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: platform,
                    content_type: 'article',
                    item_id: url
                });
            }
        }
    };

    // Initialiser au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
